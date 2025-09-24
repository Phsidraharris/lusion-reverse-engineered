// Lightweight performance & quality debug overlay.
import adaptiveQuality, { setQualityOverride, getTier } from './adaptiveQuality.js';

let started = false;
export function initDebugOverlay() {
  if (started || typeof document === 'undefined') return;
  started = true;
  const c = document.createElement('div');
  c.id = 'perf-debug-overlay';
  c.style.cssText = [
    'position:fixed','bottom:12px','right:12px','z-index:9999','font:12px/1.4 system-ui,Arial,sans-serif',
    'background:rgba(17,25,40,0.55)','backdrop-filter:blur(12px)','padding:10px 12px','border-radius:12px',
    'color:#fff','box-shadow:0 4px 24px -4px rgba(0,0,0,0.4)','border:1px solid rgba(255,255,255,0.15)'
  ].join(';');
  c.innerHTML = `
    <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
      <strong style="font-size:12px;letter-spacing:.5px;">PERF</strong>
      <span id="perf-tier" style="opacity:.8;">${getTier()}</span>
      <select id="perf-tier-select" style="background:rgba(255,255,255,0.08);color:#fff;border:1px solid rgba(255,255,255,0.15);border-radius:6px;padding:2px 4px;font-size:11px;">
        <option value="auto">auto</option>
        <option value="low">low</option>
        <option value="medium">medium</option>
        <option value="high">high</option>
        <option value="ultra">ultra</option>
      </select>
    </div>
    <div style="display:grid;grid-template-columns:auto auto;gap:2px 8px;">
      <span>FPS:</span><span id="perf-fps">-</span>
      <span>Frame(ms):</span><span id="perf-frame">-</span>
      <span>Budget skips:</span><span id="perf-skips">0</span>
      <span>DPR:</span><span id="perf-dpr">-</span>
    </div>`;
  document.body.appendChild(c);

  const select = c.querySelector('#perf-tier-select');
  select.value = localStorage.getItem('rodiaxQualityOverride') || 'auto';
  select.addEventListener('change', () => setQualityOverride(select.value));

  // Live metrics
  let last = performance.now();
  let frames = 0; let fps = 0; let accum = 0;
  function loop() {
    const now = performance.now();
    const dt = now - last; last = now; accum += dt; frames++;
    if (accum >= 1000) { fps = frames; frames = 0; accum = 0; }
    const budgetStat = window.__RODIAX_FRAME_SKIPS__ || 0;
    c.querySelector('#perf-fps').textContent = String(fps);
    c.querySelector('#perf-frame').textContent = dt.toFixed(1);
    c.querySelector('#perf-skips').textContent = budgetStat;
    c.querySelector('#perf-tier').textContent = getTier();
    c.querySelector('#perf-dpr').textContent = (window.__RODIAX_CURRENT_PR__ || window.devicePixelRatio).toFixed(2);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

// Auto-init if ?debugPerf=1 present
if (typeof window !== 'undefined') {
  if (location.search.includes('debugPerf=1') || localStorage.getItem('rodiaxDebugPerf') === '1') {
    requestAnimationFrame(() => initDebugOverlay());
  }
  window.__enablePerfOverlay = () => { localStorage.setItem('rodiaxDebugPerf','1'); initDebugOverlay(); };
  window.__disablePerfOverlay = () => { localStorage.removeItem('rodiaxDebugPerf'); const el=document.getElementById('perf-debug-overlay'); el && el.remove(); };
}
