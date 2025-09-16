// Lightweight Web Vitals style logger (LCP, CLS, INP/FID fallback)
// Avoids adding external dependency. Uses PerformanceObserver where available.
(function(){
  const metrics = { LCP: null, CLS: 0, INP: null, FID: null }; // we will pick INP or FID
  const perf = window.performance;
  const now = () => (perf && perf.now ? perf.now() : Date.now());
  const startTime = now();
  const endpoint = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_VITALS_ENDPOINT) ? import.meta.env.VITE_VITALS_ENDPOINT : null;

  function sendBeacon(payload) {
    if (!endpoint) return;
    try {
      const body = JSON.stringify(payload);
      if (navigator.sendBeacon) {
        const blob = new Blob([body], { type: 'application/json' });
        navigator.sendBeacon(endpoint, blob);
      } else {
        fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(()=>{});
      }
    } catch(_) {}
  }

  function logMetric(name, value, detail) {
    const rounded = (value != null) ? (Math.round(value * 1000) / 1000) : value; // keep ms with 3 decimals if needed
    const payload = { name, value: rounded, detail: detail || null, at: Date.now(), sinceStart: now() - startTime, path: location.pathname };
    console.log('[WebVitals]', payload);
    if (!window.__WEB_VITALS__) window.__WEB_VITALS__ = {};
    window.__WEB_VITALS__[name] = payload;
    // fire-and-forget
    sendBeacon({ type: 'web-vital', ...payload });
  }

  // LCP
  try {
    const po = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const last = entries[entries.length - 1];
      if (last) {
        metrics.LCP = last.renderTime || last.loadTime || last.startTime;
        logMetric('LCP', metrics.LCP, { url: last.url, size: last.size });
      }
    });
    po.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch(_) {}

  // CLS
  try {
    let sessionValue = 0;
    let sessionEntries = [];
    const po = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          const first = sessionEntries[0];
          const last = sessionEntries[sessionEntries.length - 1];
          if (sessionValue && entry.startTime - last.startTime < 1000 && entry.startTime - first.startTime < 5000) {
            sessionValue += entry.value;
            sessionEntries.push(entry);
          } else {
            sessionValue = entry.value;
            sessionEntries = [entry];
          }
          metrics.CLS = sessionValue;
          logMetric('CLS', metrics.CLS);
        }
      }
    });
    po.observe({ type: 'layout-shift', buffered: true });
  } catch(_) {}

  // INP (experimental) fallback to FID
  let inpReported = false;
  function reportINP(entry) {
    if (inpReported) return;
    inpReported = true;
    const dur = entry.duration || (entry.processingEnd - entry.startTime);
    metrics.INP = dur;
    logMetric('INP', dur, { interactionId: entry.interactionId });
  }

  try {
    const po = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      // pick longest interaction
      let longest = null;
      for (const e of entries) {
        if (!longest || e.duration > longest.duration) longest = e;
      }
      if (longest) reportINP(longest);
    });
    po.observe({ type: 'event', buffered: true, durationThreshold: 40 });
  } catch(_) {
    // Fallback to FID
    try {
      const po2 = new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          metrics.FID = e.processingStart - e.startTime;
          logMetric('FID', metrics.FID, { name: e.name });
        }
      });
      po2.observe({ type: 'first-input', buffered: true });
    } catch(_) {}
  }

  // Navigation / TTFB
  try {
    const nav = perf.getEntriesByType('navigation')[0];
    if (nav) {
      logMetric('TTFB', nav.responseStart, { url: document.location.href });
    }
  } catch(_) {}
})();
