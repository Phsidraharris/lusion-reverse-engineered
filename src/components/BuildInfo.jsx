import React, { useState, useEffect } from 'react';

// Small overlay showing build metadata injected by GitHub Actions.
// Auto-hides if variables are missing (e.g., local dev before workflow build).
// Click toggles collapsed state; preference stored in localStorage.
export default function BuildInfo() {
  const commit = import.meta.env.VITE_APP_COMMIT;
  const branch = import.meta.env.VITE_APP_BRANCH;
  const built = import.meta.env.VITE_BUILD_TIME;

  const available = commit && branch && built;
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('buildinfo-collapsed') === '1';
  });

  useEffect(() => {
    localStorage.setItem('buildinfo-collapsed', collapsed ? '1' : '0');
  }, [collapsed]);

  if (!available) return null;

  return (
    <div
      onClick={() => setCollapsed(c => !c)}
      style={{
        position: 'fixed',
        bottom: 8,
        right: 8,
        fontFamily: 'monospace',
        fontSize: 11,
        lineHeight: 1.3,
        background: 'rgba(0,0,0,0.55)',
        color: '#fff',
        padding: collapsed ? '4px 8px' : '8px 12px',
        borderRadius: 6,
        zIndex: 99999,
        cursor: 'pointer',
        backdropFilter: 'blur(4px)',
        maxWidth: 300,
        transition: 'all .25s ease'
      }}
      title="Build metadata (click to toggle)"
    >
      {collapsed ? (
        <span style={{opacity:0.8}}>build info</span>
      ) : (
        <>
          <div><strong>Commit:</strong> {commit.slice(0,7)}</div>
          <div><strong>Branch:</strong> {branch}</div>
            <div><strong>Built:</strong> {built}</div>
        </>
      )}
    </div>
  );
}
