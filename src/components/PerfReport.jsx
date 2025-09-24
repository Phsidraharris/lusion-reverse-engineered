import React, { useEffect, useState } from 'react';

// Simple performance snapshot component. Not auto-mounted.
// Usage: <PerfReport /> somewhere or open console and call window.__enablePerfOverlay()

const PerfReport = () => {
  const [stats, setStats] = useState({
    frameSkips: 0,
    dpr: window.__RODIAX_CURRENT_PR__ || window.devicePixelRatio,
    ua: navigator.userAgent,
    memory: navigator.deviceMemory || 'n/a',
    cores: navigator.hardwareConcurrency || 'n/a'
  });

  useEffect(() => {
    const iv = setInterval(() => {
      setStats(s => ({
        ...s,
        frameSkips: window.__RODIAX_FRAME_SKIPS__ || 0,
        dpr: window.__RODIAX_CURRENT_PR__ || window.devicePixelRatio
      }));
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{
      background: 'rgba(17,25,40,0.55)',
      backdropFilter: 'blur(14px)',
      padding: '1rem',
      borderRadius: '1rem',
      color: 'white',
      fontFamily: 'system-ui, Arial',
      fontSize: 14,
      maxWidth: 360,
      lineHeight: 1.4
    }}>
      <h3 style={{marginTop:0,fontSize:16}}>Performance Report</h3>
      <ul style={{listStyle:'none',padding:0,margin:0}}>
        <li><strong>DPR</strong>: {stats.dpr.toFixed(2)}</li>
        <li><strong>Frame Skips</strong>: {stats.frameSkips}</li>
        <li><strong>Cores</strong>: {stats.cores}</li>
        <li><strong>Memory(GB)</strong>: {stats.memory}</li>
        <li style={{wordBreak:'break-all'}}><strong>User Agent</strong>: {stats.ua}</li>
      </ul>
      <p style={{marginTop:12,opacity:.7}}>Attach in any route to inspect live dynamic resolution & throttling effects.</p>
    </div>
  );
};

export default PerfReport;
