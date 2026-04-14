# Bhakti Marga Live Broadcast Control

Controls live broadcast state transitions via the BM MediaPlatform API Stream Deck endpoints.

## Setup

1. Enter your API base URL (default: `https://media-api.bhaktimarga.org`)
2. Enter your Admin API key (stored securely in Companion's secrets store)
3. Optionally adjust the poll interval (default: 2000ms)

## Presets

Go to **Buttons → Presets** and find the **Live Control** category. Drag these onto your button grid:

- **Advance / End Live** — the action button. Short press advances state, long press (2s hold) ends the live.
- **Live Status Display** — read-only status showing current state, title, and elapsed time.

## Broadcast Workflow

Press the action button to advance through each state:

| State | Action Button | What Short Press Does | Status Button |
|-------|--------------|----------------------|---------------|
| No live selected | NO LIVE | _(nothing)_ | IDLE |
| Draft | PUBLISH | Publishes the live | DRAFT |
| Published | PREVIEW | Starts the preview | PUBLISHED |
| Preview (Starting Soon) | GO LIVE _(pulsing amber→red)_ | Takes the live on air | PREVIEW |
| Live | HOLD TO END | _(ignored — hold 2s to end)_ | LIVE + title + timer |
| VOD In Progress | VOD PROCESSING | _(nothing)_ | Set VOD in Manager |
| VOD Ready | VOD READY | _(nothing)_ | VOD available on Bhakti+ |

**To end a live broadcast**: hold the action button for 2 seconds and release.

## Variables

Use these in button text, triggers, or expressions:

| Variable | Description |
|----------|-------------|
| `$(bmlive:live_title)` | Current live broadcast title |
| `$(bmlive:live_state)` | Current operational state |
| `$(bmlive:live_duration)` | Elapsed time since going live (mm:ss) |

## Troubleshooting

- **Button stuck on "NO LIVE"** — Check that a live is created in the BM Live Manager. The module only controls existing lives.
- **Connection failure** — Verify the API URL and key in connection settings. Check the module log via **Connections → View Logs**.
- **Buttons not updating** — The module polls at the configured interval. Decrease the poll interval for faster updates (minimum 500ms).

## More Info

- [Source & Issues](https://github.com/Bhakti-Marga/companion-module-bhaktimarga-live)
