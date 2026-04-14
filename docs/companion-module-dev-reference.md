# Companion Module Development Reference

> Covers `@companion-module/base ~1.14.0`, Node 22, Companion 4.2+.
> See also: `references/bitfocus-companion-docs/` for the full Companion user guide.

## Key Versions & Constraints

| Item | Value |
|---|---|
| Companion | 4.2+ |
| `@companion-module/base` | `^1.14.0` (must match Companion's `connectionModuleApiVersion`) |
| Node.js | `^22.20` |
| Package manager | npm |
| Module system | ESM (`"type": "module"`) |
| TypeScript module target | `"Node16"` / `"moduleResolution": "Node16"` |
| `runtime.type` in manifest | `"node22"` |
| HTTP client | Native `fetch` (built into Node 22, no extra dep) |
| Import paths | Must use `.js` extensions even for `.ts` source files |

## Project Structure

```
companion-module-bhaktimarga-live/
├── companion/
│   ├── manifest.json      # Module metadata, runtime config
│   └── HELP.md            # User-facing help shown in Companion UI
├── src/
│   ├── main.ts            # Entry point, InstanceBase subclass
│   ├── config.ts          # Config fields + secret definitions
│   ├── actions.ts         # advance_live (short press), end_live (long press)
│   ├── feedbacks.ts       # Action button + status display appearance, pulse animation
│   ├── variables.ts       # live_title, live_state, live_duration
│   ├── presets.ts         # Drag-and-drop button templates
│   ├── upgrades.ts        # Config migration scripts
│   └── api.ts             # API response types
├── docs/                  # This file and dev docs
├── references/            # Ingested Companion user guide (read-only reference)
├── dist/                  # Compiled output (gitignored)
├── package.json
├── tsconfig.json
└── tsconfig.build.json
```

## Module Lifecycle

```
init(config) → configUpdated(config) → destroy()
```

- `init()` — called once when the module loads. Don't await long operations — it blocks the UI.
- `configUpdated()` — called when the user changes settings. Restart polling, reconnect, etc.
- `destroy()` — called when the module unloads. Always clean up timers and connections.

## Config Fields

Defined in `getConfigFields()`, returns `SomeCompanionConfigField[]`.

Field types: `textinput`, `secret-text`, `number`, `checkbox`, `dropdown`, `multidropdown`, `colorpicker`, `static-text`.

Built-in regex: `Regex.IP`, `Regex.HOSTNAME`, `Regex.PORT`, `Regex.URL`.

Our module uses `secret-text` for the API key — Companion stores it in its secrets store, separate from the exported config.

## Actions

Defined via `self.setActionDefinitions({...})`. Each action has:
- `name`: Display name
- `options`: Array of option fields (same types as config fields)
- `callback: async (action) => {...}`: Runs when the button is pressed

```typescript
self.setActionDefinitions({
  my_action: {
    name: 'Do Thing',
    options: [],
    callback: async (action) => {
      await fetch(url, { method: 'POST' })
    },
  },
})
```

Companion catches and logs errors thrown from callbacks automatically.

## Feedbacks

Drive button appearance based on module state. Three types:

| Type | Returns | Use when |
|------|---------|----------|
| `boolean` | `true`/`false` | Toggle a style on/off |
| `advanced` | Style override object | Full control over text, colors |
| `value` | Any primitive | API 1.13+, store in variable |

Trigger re-evaluation: `self.checkFeedbacks('feedback_id')` or `self.checkAllFeedbacks()`.

Our module uses `advanced` feedbacks for both buttons — the action button dynamically computes its label and background color (including the amber→red pulse), and the status button builds multi-line text.

## Variables

```typescript
self.setVariableDefinitions([
  { variableId: 'my_var', name: 'Display Name' },
])

self.setVariableValues({ my_var: 'hello' })
```

Users reference as `$(instance_label:variable_id)`. IDs must match `[a-zA-Z0-9_-]`.

## Presets (Long Press vs Short Press)

Presets are pre-built button configurations users can drag onto their deck. See `references/bitfocus-companion-docs/user-guide/config/buttons/creating.md` for how users interact with presets.

```typescript
presets['my_button'] = {
  type: 'button',
  category: 'Category',
  name: 'Button Name',
  style: { text: 'LABEL', size: 'auto', color: white, bgcolor: black },
  steps: [
    {
      down: [],                    // fires immediately on press
      up: [{ actionId: '...', options: {} }],  // short press (release before duration)
      2000: {                      // long press (2 seconds)
        actions: [{ actionId: '...', options: {} }],
        options: { runWhileHeld: false },  // fires on release after 2s
      },
    },
  ],
  feedbacks: [{ feedbackId: '...', options: {} }],
}
```

- When a `[duration]` group exists, `up` becomes the short-press handler
- `runWhileHeld: true` fires at the threshold even if still held
- `runWhileHeld: false` fires only on release after crossing the threshold
- Multiple duration thresholds can stack (e.g., `500`, `2000`)

## Polling Pattern

```typescript
private pollTimer: ReturnType<typeof setInterval> | null = null

startPolling(): void {
  void this.pollStatus()  // immediate first poll
  this.pollTimer = setInterval(() => void this.pollStatus(), 2000)
}

stopPolling(): void {
  if (this.pollTimer !== null) {
    clearInterval(this.pollTimer)
    this.pollTimer = null
  }
}
```

Always call `stopPolling()` in `destroy()` and before restarting in `configUpdated()`.

## HTTP Requests

Use native `fetch` (Node 22). Use `AbortSignal.timeout(ms)` for timeouts:

```typescript
const res = await fetch(url, {
  method: 'POST',
  headers: { 'x-api-key': apiKey },
  signal: AbortSignal.timeout(5000),
})
```

No need for `node-fetch`, `got`, or `axios`.

## Connection Status

```typescript
this.updateStatus(InstanceStatus.Ok)
this.updateStatus(InstanceStatus.Connecting)
this.updateStatus(InstanceStatus.ConnectionFailure, 'Error message')
this.updateStatus(InstanceStatus.Disconnected)
```

## Logging

```typescript
this.log('debug', 'message')
this.log('info', 'message')
this.log('warn', 'message')
this.log('error', 'message')
```

Users can view logs via **Connections → View Logs** in the Companion UI (see `references/bitfocus-companion-docs/user-guide/config/connections.md`).

## manifest.json

See `companion/manifest.json` for the live version. Required fields:

```json
{
  "id": "bhaktimarga-live",
  "name": "bhaktimarga-live",
  "shortname": "BM Live",
  "version": "0.1.0",
  "runtime": {
    "type": "node22",
    "api": "nodejs-ipc",
    "apiVersion": "0.0.0",
    "entrypoint": "../dist/main.js"
  }
}
```

Version must match `package.json`. The `apiVersion` field is auto-populated by Companion from `@companion-module/base`.

## Compatibility Gotchas

- **API version matching**: `@companion-module/base` must match Companion's `connectionModuleApiVersion` (currently 1.14.0 for Companion 4.2). Using a newer version causes silent crash-loops ("Restart forced").
- **Symlinks don't work for dev modules**: Dev modules path must point to the **real directory**, not a symlink. Companion uses Node.js `--permission` model with `--allow-fs-read={basePath}`, which doesn't follow symlinks.
- **Runtime type**: Must be `node22` in manifest — Companion 4.2 bundles Node 22.22.0.

## Sources

- `references/bitfocus-companion-docs/` — full Companion user guide (local copy)
- [companion-module-template-ts](https://github.com/bitfocus/companion-module-template-ts)
- [@companion-module/base npm](https://www.npmjs.com/package/@companion-module/base)
- [Module Development 101](https://companion.free/for-developers/module-development/module-development-101)
- [companion-module-base Wiki](https://github.com/bitfocus/companion-module-base/wiki/)
- [InstanceBase TypeDoc](https://bitfocus.github.io/companion-module-base/classes/InstanceBase.html)
