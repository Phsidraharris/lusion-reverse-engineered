// Utility: observe an element by id; when it enters viewport, invoke callback once.
export function observeOnce(id, cb, options = { root: null, threshold: 0.15 }) {
  if (typeof window === 'undefined') return;
  const el = document.getElementById(id);
  if (!el) {
    // Retry next frame until found (bounded attempts)
    let attempts = 0;
    const tryFind = () => {
      const target = document.getElementById(id);
      if (target) return observeElement(target);
      if (++attempts < 60) requestAnimationFrame(tryFind);
    };
    requestAnimationFrame(tryFind);
    return;
  }
  observeElement(el);

  function observeElement(element) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          try { cb(); } catch(_) {}
          io.disconnect();
        }
      });
    }, options);
    io.observe(element);
  }
}
