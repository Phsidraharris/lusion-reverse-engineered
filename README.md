## Lusion Reverse Engineered

Reconstructed interactive Three.js + React experience with performance-oriented progressive enhancement.

### Tech Stack
- React 18 + Vite
- Three.js (orthographic camera scene)
- Rapier 3D (physics sandbox)
- Tailwind CSS

### Key Features
- Lazy / staged dynamic imports (`homeScene.js`) to minimize initial bundle
- Deferred HDR environment & decorative modules via `requestIdleCallback` polyfill
- Physics sandbox with lazy intersection-based initialization & cleanup (`dispose`)
- Build metadata overlay (commit, branch, build time)
- Web Vitals instrumentation (LCP, CLS, INP/FID, TTFB) with optional beacon endpoint
- Bundle & gzipped size guards in CI
- Sitemap + robots.txt generation

### Running Locally
```bash
npm ci
npm run dev
```
Open the printed local URL (typically `http://localhost:5173`).

### Physics Sandbox Test Harness
Accessible via `window.__PHYSICS_SANDBOX__` after scene initializes (or earlier for certain methods):

| Method | Purpose |
|--------|---------|
| `getState()` | Returns width/height, body count, fallback usage, initialized flag |
| `forceInit()` | Forces deferred physics init immediately |
| `resize()` | Triggers sandbox layout/physics rebuild |
| `dispose()` | Fully tears down listeners, observers, world, meshes |
| `instance` | Direct reference to underlying `PhysicsSandbox` class instance |

Example:
```js
window.__PHYSICS_SANDBOX__?.getState();
window.__PHYSICS_SANDBOX__?.dispose();
```

### Web Vitals
Metrics are logged to the console with the prefix `[WebVitals]` and stored on `window.__WEB_VITALS__`.

Supported metrics: `LCP`, `CLS`, `INP` (or `FID` fallback), `TTFB`.

#### Optional Beacon Endpoint
Set a GitHub Actions secret named `VITALS_ENDPOINT` (HTTP(S) POST URL). CI injects it as `VITE_VITALS_ENDPOINT` so the client will POST (via `sendBeacon` or `fetch`) JSON payloads shaped:
```json
{ "type": "web-vital", "name": "LCP", "value": 1234.5, "sinceStart": 1234.5, "path": "/", "detail": { ... } }
```

If no endpoint is set, metrics remain local only.

### Performance Strategy
1. Stage 1 loads only renderer, physics (lazy inside), loading overlay.
2. Stage 2 (idle) loads animated tube, video panel shader, project tiles, HDR environment.
3. HDR environment loaded after first paint to avoid blocking.
4. Gzip + raw size thresholds enforced in CI (`MAX_GZIP_KB`, `MAX_BUNDLE_KB` env overrides possible).

### Environment Variables (Injected at Build)
| Variable | Description |
|----------|-------------|
| `VITE_APP_COMMIT` | Commit SHA |
| `VITE_APP_BRANCH` | Branch name |
| `VITE_BUILD_TIME` | UTC build timestamp |
| `VITE_VITALS_ENDPOINT` | Optional metrics beacon endpoint |

### Adding A Vitals Endpoint
1. Create an HTTPS POST receiver (e.g., a lightweight serverless function). Return 200 quickly.
2. Add its URL as a repository secret: `VITALS_ENDPOINT`.
3. Push a commit; deployment workflow will inject `VITE_VITALS_ENDPOINT` automatically.
4. Verify network tab shows beacon POSTs and console contains `[WebVitals]` logs.

### Disposal & Hot Reload Considerations
`PhysicsSandbox.dispose()` cleans observers, timeouts, world, and materials. If using HMR, call `dispose()` before re-instantiating to prevent WebGL resource leaks.

### CI Guards
- Raw largest JS file limit: default 6000 KB (override `MAX_BUNDLE_KB`).
- Gzipped largest JS file limit: default 1500 KB (override `MAX_GZIP_KB`).

### Future Ideas
- Beacon batching & retry
- Code splitting further per route (if routes added)
- GPU timing instrumentation

