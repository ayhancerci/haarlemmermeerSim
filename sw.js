/**
 * DEV-10 — offline support.
 *
 * An app that teaches you to survive a 48-hour power and network outage should
 * work without a network. Precache the shell on install; serve navigations from
 * cache when offline; cache map tiles and audio opportunistically at runtime.
 */
const VERSION = 'hm-v1'
const SHELL = `${VERSION}-shell`
const RUNTIME = `${VERSION}-runtime`

const SHELL_URLS = ['./', './index.html', './manifest.webmanifest', './favicon.svg']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL).then((c) => c.addAll(SHELL_URLS)).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  // Navigations: network first so updates land, cache as the offline fallback.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone()
          caches.open(SHELL).then((c) => c.put('./index.html', copy))
          return res
        })
        .catch(() => caches.match('./index.html').then((r) => r || Response.error()))
    )
    return
  }

  const url = new URL(request.url)
  const isAsset = url.origin === self.location.origin
  const isTileOrAudio =
    /tile\.openstreetmap\.org/.test(url.hostname) || /\.(mp3|ogg|wav)$/.test(url.pathname)

  if (!isAsset && !isTileOrAudio) return

  // Cache first — hashed assets and tiles are effectively immutable.
  event.respondWith(
    caches.match(request).then(
      (hit) =>
        hit ||
        fetch(request).then((res) => {
          if (res.ok && res.status === 200) {
            const copy = res.clone()
            caches.open(RUNTIME).then((c) => c.put(request, copy))
          }
          return res
        })
    )
  )
})
