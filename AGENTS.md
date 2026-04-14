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

## Agent guidelines

- **Keep docs current**: When you add, remove, or change features, update AGENTS.md, README.md, companion/HELP.md, and docs/ to reflect the change in the same commit. Don't leave docs for a follow-up.
- **Comments explain "why", not "what"**: Don't narrate code (`// increment counter`). Do explain non-obvious decisions, constraints, or gotchas (`// 409 = stale state, next poll will correct`). If the code is clear on its own, no comment needed.
- **Read the reference docs**: When working with Companion concepts (presets, feedbacks, actions, config fields, surfaces, etc.), always read `references/bitfocus-companion-docs/` and `docs/companion-module-dev-reference.md` first. Don't rely on training data or memory.

## Build and distribution

```bash
npm run build        # TypeScript → dist/
npm run dev          # watch mode
npm run pack         # build + npm pack → dist/*.tgz
```

Distribute `.tgz` files to operators for manual import via Companion's Modules page.
