/**
 * DEV-10 — offline support.
 *
 * An app that teaches you to survive a 48-hour power and network outage should
 * work without a network. Precache the shell on install; serve navigations from
 * cache when offline; cache map tiles and audio opportunistically at runtime.
 */

/**
 * Replaced at build time with the build's content hash (see the
 * `service-worker-version` plugin in vite.config.ts). It has to change on every
 * deploy, because everything below keys its caches on it.
 *
 * It did not change for the whole life of the project, and that shipped wrong
 * safety advice to anyone who had already visited: P-WINDOWS was rewritten to
 * say *not* to tape windows and its artwork regenerated to match, both landed
 * on the server — and returning players kept being served the old photograph of
 * taped glass out of this cache, under the new text. Corrected art that cannot
 * reach the people who saw the wrong art is not a correction.
 */
const VERSION = 'hm-ea0ee99c7a86'
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

/** Hashed build output: the filename changes whenever the bytes do. */
function isImmutable(url) {
  return /\/assets\/[^/]+-[A-Za-z0-9_-]{8,}\.[a-z0-9]+$/.test(url.pathname)
}

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

  // Cache first for things whose URL changes when their content does — hashed
  // build output, map tiles, audio.
  if (isTileOrAudio || isImmutable(url)) {
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
    return
  }

  // Everything else same-origin keeps a stable URL across deploys — the
  // situation artwork above all, which is regenerated in place. Serve the cached
  // copy for speed, but always refetch behind it so a correction is one reload
  // away rather than waiting on a version bump reaching this file.
  event.respondWith(
    caches.match(request).then((hit) => {
      const fresh = fetch(request)
        .then((res) => {
          if (res.ok && res.status === 200) {
            const copy = res.clone()
            caches.open(RUNTIME).then((c) => c.put(request, copy))
          }
          return res
        })
        .catch((err) => {
          if (hit) return hit
          throw err
        })
      return hit || fresh
    })
  )
})
