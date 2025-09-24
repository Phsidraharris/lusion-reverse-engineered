// Dynamic resolution scaler adjusts renderer pixelRatio based on frame time budget.
// Usage: const dr = createDynamicResolution(renderer, { min:1, max:target, decay:0.92 }); call dr.update(dt, frameMs)

export function createDynamicResolution(renderer, opts = {}) {
  const targetMs = opts.targetMs || 16.7; // 60fps
  const upscaleThreshold = opts.upscaleThreshold || 14; // if sustained faster than this, upscale
  const downscaleThreshold = opts.downscaleThreshold || 22; // if slower than this, downscale
  const min = opts.min || 0.75;
  const max = opts.max || 1.5;
  const stepDown = opts.stepDown || 0.08;
  const stepUp = opts.stepUp || 0.04;
  const smoothing = opts.smoothing || 0.15; // EMA factor

  let ema = targetMs;
  let current = Math.min(max, renderer.getPixelRatio() || max);
  let lastAdjustT = 0;
  const adjustCooldown = 0.5; // seconds

  function setRatio(r) {
    r = Math.max(min, Math.min(max, r));
    if (Math.abs(r - current) > 0.001) {
      current = r;
      renderer.setPixelRatio(r);
      window.__RODIAX_CURRENT_PR__ = r;
    }
  }

  function update(dt, frameMs) {
    if (!frameMs || !isFinite(frameMs)) return;
    ema = ema + (frameMs - ema) * smoothing;
    const now = performance.now() / 1000;
    if (now - lastAdjustT < adjustCooldown) return;
    if (ema > downscaleThreshold && current > min) {
      setRatio(current - stepDown);
      lastAdjustT = now;
    } else if (ema < upscaleThreshold && current < max) {
      setRatio(current + stepUp);
      lastAdjustT = now;
    }
  }

  return { update, get pixelRatio() { return current; }, get ema() { return ema; } };
}
