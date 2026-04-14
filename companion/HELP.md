# Bhakti Marga Live Broadcast Control

Controls live broadcast state transitions via the BM MediaPlatform API Stream Deck endpoints.

## Setup

1. Enter your API base URL (e.g. `https://api.bhaktiplus.com`)
2. Enter your Admin API key
3. Optionally adjust the poll interval (default: 2000ms)

## Usage

The module provides a single button that cycles through the broadcast lifecycle:

- **Short press** advances through: Publish → Starting Soon → Go Live
- **Long press** (hold 2s) ends the live broadcast
- Button color and label update automatically based on current state

## States

| State | Button | Color |
|-------|--------|-------|
| No live selected | NO LIVE SELECTED | Grey |
| Draft | PUBLISH | Blue |
| Published | STARTING SOON | Green |
| Starting Soon | GO LIVE | Green |
| Live | HOLD TO END | Red |
| VOD In Progress | VOD ENDED | Amber |
