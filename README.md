# companion-module-bhaktimarga-live

Bitfocus Companion module for controlling Bhakti Marga live broadcasts via Stream Deck.

## Features

- One-button broadcast lifecycle control (Publish → Preview → Go Live → End)
- Live status display with title and elapsed time
- Smooth amber-to-red pulse animation on the GO LIVE button
- API key stored in Companion's secrets store
- Dimmed status button colors for clear action/status distinction

## Development

```bash
npm install
npm run dev          # watch mode — rebuilds on changes
```

### Local testing with Companion

1. Install [Bitfocus Companion](https://user.bitfocus.io/download) (v4.2+)
2. In the Companion launcher, enable **Developer Tools** (cog icon, top right)
3. Set the dev modules path to the **parent directory** of this repo (not a symlink — Companion's Node.js permission model doesn't follow symlinks)
4. Restart Companion — the module appears as "Bhakti Marga: Live Broadcast Control (Dev)"
5. Add a connection, configure API URL and key, drag presets onto the button grid

### Building a release

```bash
npm run pack         # builds and creates dist/*.tgz
```

Distribute the `.tgz` file. Operators import it via **Modules > Import module package** in Companion.

### Version bumps

Update version in **both** files before packing:
- `package.json`
- `companion/manifest.json`
