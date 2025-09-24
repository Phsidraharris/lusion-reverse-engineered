// Batches scroll events into a single requestAnimationFrame callback.
// Returns an unsubscribe function.

const listeners = new Set();
let scheduled = false;
let lastY = typeof window !== 'undefined' ? window.scrollY : 0;

function emit() {
  scheduled = false;
  const y = window.scrollY;
  if (y === lastY) {
    // still update (some consumers rely on y/time) but we could early-exit if desired
  }
  for (const cb of listeners) {
    try { cb(y); } catch (e) { /* swallow */ }
  }
  lastY = y;
}

function onScroll() {
  if (!scheduled) {
    scheduled = true;
    requestAnimationFrame(emit);
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('scroll', onScroll, { passive: true });
}

export function subscribeScroll(cb) {
  listeners.add(cb);
  // Fire initial
  if (typeof window !== 'undefined') {
    cb(window.scrollY);
  }
  return () => listeners.delete(cb);
}
