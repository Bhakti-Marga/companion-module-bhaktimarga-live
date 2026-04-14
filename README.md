# companion-module-bhaktimarga-live

[Bitfocus Companion](https://bitfocus.io/companion) module for controlling Bhakti Marga live broadcasts via Stream Deck.

## Features

- One-button broadcast lifecycle control (Publish → Preview → Go Live → End)
- Short press advances state, long press (2s hold) ends the live
- Live status display with title and elapsed time
- Smooth amber-to-red pulse animation on the GO LIVE button
- API key stored in Companion's secrets store
- Dimmed status button colors for clear action/status distinction

## Installation

### Prerequisites

- [Bitfocus Companion](https://user.bitfocus.io/download) **v4.2+** (stable or beta)
- A Stream Deck or other [supported surface](https://bitfocus.io/companion), or the built-in emulator
- An Admin API key for the BM MediaPlatform

### Installing the module

1. Download the latest `.tgz` release from [Releases](https://github.com/Bhakti-Marga/companion-module-bhaktimarga-live/releases)
2. Open the Companion web UI (default: `http://127.0.0.1:8000`)
3. Go to **Modules** in the left sidebar
4. Click **Import module package** and select the `.tgz` file

### Adding a connection

1. Go to **Connections** in the left sidebar
2. Search for "Bhakti Marga" and select **BM Live**
3. Configure the connection:
   - **API Base URL** — default: `https://media-api.bhaktimarga.org`
   - **Admin API Key** — your API key (stored securely in Companion's secrets store)
   - **Poll Interval** — how often to check status (default: 2000ms)
4. Click **Save**

## Usage

### Setting up buttons

1. Go to **Buttons** in the left sidebar
2. Open the **Presets** tab on the right side
3. Find "BM Live" and expand the **Live Control** category
4. Drag these preset buttons onto your button grid:

| Preset | Purpose |
|--------|---------|
| **Advance / End Live** | Action button — short press advances state, long press (2s) ends the live |
| **Live Status Display** | Read-only status showing current state, title, and elapsed time |

### Broadcast workflow

Press the action button to advance through the broadcast lifecycle:

| Current State | Action Button | Short Press Does | Status Display |
|---------------|--------------|------------------|----------------|
| No live selected | NO LIVE | _(nothing)_ | IDLE |
| Draft | PUBLISH | Publishes the live | DRAFT |
| Published | PREVIEW | Starts the preview | PUBLISHED |
| Preview | GO LIVE _(pulsing)_ | Takes the live on air | PREVIEW |
| Live | HOLD TO END | _(short press ignored)_ | LIVE + title + timer |
| VOD Processing | VOD PROCESSING | _(nothing)_ | Set VOD in Manager |
| VOD Ready | VOD READY | _(nothing)_ | VOD available on Bhakti+ |

To end a live broadcast, **hold the action button for 2 seconds** and release.

### Variables

These variables are available for use in button text or triggers:

| Variable | Description |
|----------|-------------|
| `$(bmlive:live_title)` | Current live broadcast title |
| `$(bmlive:live_state)` | Current operational state |
| `$(bmlive:live_duration)` | Elapsed time since going live (mm:ss) |

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

Distribute the `.tgz` file. Operators import it via **Modules → Import module package** in Companion.

### Version bumps

Update version in **both** files before packing:
- `package.json`
- `companion/manifest.json`

## References

- [Bitfocus Companion](https://bitfocus.io/companion) — the platform this module runs on
- [Companion Downloads](https://user.bitfocus.io/download) — install Companion
- [Companion User Guide](https://companion.free/user-guide) — full documentation
- [Module Development 101](https://companion.free/for-developers/module-development/module-development-101) — how Companion modules work
- [@companion-module/base](https://www.npmjs.com/package/@companion-module/base) — the module SDK
- [companion-module-base Wiki](https://github.com/bitfocus/companion-module-base/wiki/) — SDK reference
- [Module Template (TypeScript)](https://github.com/bitfocus/companion-module-template-ts) — starter template

## License

MIT
