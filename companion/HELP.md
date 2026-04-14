# Bhakti Marga Live Broadcast Control

Controls live broadcast state transitions via the BM MediaPlatform API Stream Deck endpoints.

## Setup

1. Enter your API base URL (default: `https://media-api.bhaktimarga.org`)
2. Enter your Admin API key (stored securely in Companion's secrets store)
3. Optionally adjust the poll interval (default: 2000ms)

## Presets

Drag these from the Presets panel onto your button grid:

- **Advance / End Live** — the action button. Short press advances state, long press (2s hold) ends the live.
- **Live Status Display** — read-only status showing current state, title, and elapsed time.

## States

| State | Action Button | Status Button | Color |
|-------|--------------|---------------|-------|
| No live selected | NO LIVE | IDLE | Grey |
| Draft | PUBLISH | DRAFT | Blue |
| Published | PREVIEW | PUBLISHED | Green |
| Preview (Starting Soon) | GO LIVE (pulsing) | PREVIEW | Amber→Red |
| Live | HOLD TO END | LIVE + title + timer | Red |
| VOD In Progress | VOD PROCESSING | Set VOD in Manager | Grey |
| VOD Ready | VOD READY | VOD available on Bhakti+ | Grey |
