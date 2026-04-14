# AGENTS.md

## Project overview

Bitfocus Companion module for Bhakti Marga live broadcast control. Operators use Stream Deck buttons to advance broadcasts through states: Draft → Published → Preview → Live → VOD.

## Architecture

- **Runtime**: Node.js module loaded by Companion via `@companion-module/base`
- **API**: Polls `GET /streamdeck/status` for state, sends `POST /streamdeck/{action}` for transitions
- **Config**: `apiUrl` and `pollInterval` in config, `apiKey` in Companion's secrets store
- **Entry point**: `src/main.ts` → `dist/main.js` (compiled), loaded via `companion/manifest.json`

## Key files

- `src/main.ts` — module lifecycle (init, polling, API calls, state refresh)
- `src/config.ts` — config and secrets type definitions, field definitions
- `src/actions.ts` — advance_live (short press) and end_live (long press) actions
- `src/feedbacks.ts` — action button and status display appearance, pulse animation colors
- `src/presets.ts` — drag-and-drop button templates for Companion
- `src/variables.ts` — live_title, live_state, live_duration variable definitions
- `src/api.ts` — API response type definitions
- `companion/manifest.json` — module metadata for Companion (version must match package.json)

## References

- `references/bitfocus-companion-docs/` — full Bitfocus Companion user guide, ingested from source. **Always read these docs first** when dealing with Companion concepts (buttons, presets, connections, modules, surfaces, etc.) rather than relying on memory.
- `docs/companion-module-dev-reference.md` — module SDK reference (actions, feedbacks, presets, config fields, lifecycle).

## Companion compatibility

- Requires Companion **4.2+**
- `@companion-module/base` must match Companion's `connectionModuleApiVersion` (currently 1.14.0 for Companion 4.2). Using a newer version causes silent crash-loops ("Restart forced").
- Dev modules path must point to the **real directory**, not a symlink. Companion uses Node.js `--permission` model with `--allow-fs-read={basePath}`, which doesn't follow symlinks.
- Runtime type `node22` in manifest — Companion 4.2 bundles Node 22.22.0.

## Build and distribution

```bash
npm run build        # TypeScript → dist/
npm run dev          # watch mode
npm run pack         # build + npm pack → dist/*.tgz
```

Distribute `.tgz` files to operators for manual import via Companion's Modules page.
