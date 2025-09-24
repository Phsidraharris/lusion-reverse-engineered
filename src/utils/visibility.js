// Simple visibility gating using IntersectionObserver.
// register(id, threshold) returns accessor function returning latest visibility.

const state = new Map();

export function registerVisibility(id, options = { threshold: 0.1 }) {
  if (typeof window === 'undefined') return () => true;
  if (state.has(id)) return state.get(id).getter;
  let visible = false;
  const getter = () => visible;
  state.set(id, { visible: false, getter });
  const el = document.getElementById(id);
  if (!el) {
    // Retry until element appears (bounded attempts)
    let attempts = 0;
    const find = () => {
      const ref = document.getElementById(id);
      if (ref) observe(ref); else if (++attempts < 120) requestAnimationFrame(find);
    };
    requestAnimationFrame(find);
  } else observe(el);

  function observe(element) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.target === element) visible = e.isIntersecting; });
    }, options);
    io.observe(element);
  }
  return getter;
}
