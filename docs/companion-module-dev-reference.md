# Companion Module Development Reference

> Researched April 2026. Covers `@companion-module/base ~1.14.1`, Node 22, Companion 4.2+.

## Key Versions & Constraints

| Item | Value |
|---|---|
| `@companion-module/base` | `~1.14.1` |
| Node.js | `^22.20` |
| Package manager | Yarn 4 |
| Module system | ESM (`"type": "module"`) |
| TypeScript module target | `"Node16"` / `"moduleResolution": "Node16"` |
| `runtime.type` in manifest | `"node22"` |
| HTTP client | Native `fetch` (built into Node 22, no extra dep) |
| Import paths | Must use `.js` extensions even for `.ts` source files |

## Project Structure

```
companion-module-<vendor>-<product>/
├── companion/
│   ├── manifest.json      # Module metadata, runtime config
│   └── HELP.md            # User-facing help shown in Companion UI
├── src/
│   ├── main.ts            # Entry point, InstanceBase subclass
│   ├── config.ts          # Config fields + interface
│   ├── actions.ts         # Button press handlers
│   ├── feedbacks.ts       # Button appearance driven by state
│   ├── variables.ts       # Live data variables
│   ├── presets.ts         # Pre-built button layouts
│   ├── upgrades.ts        # Config migration scripts
│   └── api.ts             # API types (optional)
├── dist/                  # Compiled output (gitignored)
├── package.json
├── tsconfig.json
└── tsconfig.build.json
```

## Module Lifecycle

```
init(config) → configUpdated(config) → destroy()
```

- `init()` is called once when the module is loaded. **Do not await long operations here** — it blocks the UI.
- `configUpdated()` is called when the user changes settings. Restart polling, reconnect, etc.
- `destroy()` is called when the module is unloaded. **Always clean up timers and connections.**

## Config Fields

Defined in `getConfigFields()`, returns `SomeCompanionConfigField[]`.

Field types: `textinput`, `number`, `checkbox`, `dropdown`, `multidropdown`, `colorpicker`, `static-text`.

Built-in regex: `Regex.IP`, `Regex.HOSTNAME`, `Regex.PORT`, `Regex.URL`.

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

## Variables

```typescript
self.setVariableDefinitions([
  { variableId: 'my_var', name: 'Display Name' },
])

self.setVariableValues({ my_var: 'hello' })
```

Users reference as `$(instance_label:variable_id)`. IDs must match `[a-zA-Z0-9_-]`.

## Presets (Long Press vs Short Press)

Presets are pre-built button configurations users can drag onto their deck.

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

## manifest.json Required Fields

```json
{
  "id": "vendor-product",
  "name": "vendor-product",
  "shortname": "Product",
  "description": "...",
  "version": "0.0.0",
  "license": "MIT",
  "repository": "...",
  "bugs": "...",
  "maintainers": [{ "name": "...", "email": "..." }],
  "runtime": {
    "type": "node22",
    "api": "nodejs-ipc",
    "apiVersion": "0.0.0",
    "entrypoint": "../dist/main.js"
  },
  "manufacturer": "...",
  "products": ["..."]
}
```

## Compatibility Gotchas

- **API version matching**: `@companion-module/base` must match Companion's `connectionModuleApiVersion` (currently 1.14.0 for Companion 4.2). Using a newer version causes silent crash-loops ("Restart forced").
- **Symlinks don't work for dev modules**: Dev modules path must point to the **real directory**, not a symlink. Companion uses Node.js `--permission` model with `--allow-fs-read={basePath}`, which doesn't follow symlinks.
- **Runtime type**: Must be `node22` in manifest — Companion 4.2 bundles Node 22.22.0.

## Sources

- [companion-module-template-ts](https://github.com/bitfocus/companion-module-template-ts)
- [@companion-module/base npm](https://www.npmjs.com/package/@companion-module/base)
- [Module Development 101](https://companion.free/for-developers/module-development/module-development-101)
- [companion-module-base Wiki](https://github.com/bitfocus/companion-module-base/wiki/)
- [InstanceBase TypeDoc](https://bitfocus.github.io/companion-module-base/classes/InstanceBase.html)
