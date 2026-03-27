# Haarlemmermeer Emergency Preparedness — Serious Game

An interactive emergency preparedness simulation for citizens of Haarlemmermeer, Netherlands. Learn what to do before, during, and after a crisis through realistic scenario-based gameplay.

## Live Demo

[Play the game](https://YOUR_USERNAME.github.io/haarlemmermeer-emergency-game/)

## Features

- **4 Emergency Scenarios**: Flooding, Chemical Fire, Extreme Storm, Power Grid Failure
- **3-Phase Gameplay**: Preparation → Emergency → Recovery
- **Interactive Map**: CesiumJS-powered map of Haarlemmermeer with real POI locations
- **5 Languages**: Dutch, English, Turkish, Arabic (RTL), Ukrainian
- **Decision-Based Learning**: 11 critical decisions per scenario with real-world feedback
- **Emergency Kit Game**: Pack a 72-hour survival kit under weight/budget constraints
- **Knowledge Quiz**: 7 questions per scenario testing emergency knowledge
- **Mobile Responsive**: Works on phones (portrait & landscape) and desktops
- **Real Emergency Data**: Based on official Dutch emergency protocols (Denk Vooruit, VRK, RIVM)

## Emergency Scenarios

| Scenario | Description |
|----------|-------------|
| Flooding | Ringvaart dike breach — rising water in the polder |
| Industrial Accident | Chemical fire at Schiphol Trade Park — toxic cloud |
| Extreme Weather | KNMI Code Red storm — 120 km/h winds, possible tornado |
| Infrastructure Failure | Liander substation cascade — 48-hour blackout |

## Based On

- [Denk Vooruit](https://www.denkvooruit.nl/) — Dutch government 72-hour self-sufficiency campaign
- Veiligheidsregio Kennemerland (VRK) emergency protocols
- RIVM health guidelines
- GGD Kennemerland community health services

## Tech Stack

- React 19 + TypeScript
- CesiumJS (3D globe with OpenStreetMap)
- Zustand (state management)
- react-i18next (internationalization)
- Vite (build tool)

## Deployment

This is a fully static site — no server required. Upload to any web host:

### GitHub Pages
1. Fork this repo
2. Go to Settings → Pages → Source: Deploy from branch → `main` / `/ (root)`
3. Your site will be live at `https://YOUR_USERNAME.github.io/haarlemmermeer-emergency-game/`

### Any Web Server
Upload all files to your web server's document root. No configuration needed.

## License

Educational project for Haarlemmermeer municipality emergency preparedness.

## Credits

Built with CesiumJS, OpenStreetMap data, and Google Photorealistic 3D Tiles.
Emergency content based on official Dutch government guidelines.
