// Basic performance profiling & adaptive quality utilities
// Determines a quality tier and exposes helpers to clamp expensive settings.

const perfProfile = (() => {
  const nav = typeof navigator !== 'undefined' ? navigator : {};
  const hwc = nav.hardwareConcurrency || 4;
  const memoryGB = nav.deviceMemory || 4; // Chrome only; fallback 4
  const ua = (nav.userAgent || '').toLowerCase();
  const isMobile = /mobi|android|iphone|ipad/.test(ua);

  // Quick WebGL capability probe (try/catch safe)
  let maxTextureSize = 4096;
  try {
    const canvas = typeof document !== 'undefined' && document.createElement('canvas');
    const gl = canvas && (canvas.getContext('webgl2') || canvas.getContext('webgl'));
    if (gl) {
      maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) || maxTextureSize;
    }
  } catch(_) {}

  // Score heuristic
  let score = 0;
  score += Math.min(hwc, 16); // 0..16
  score += Math.min(memoryGB, 16); // 0..16
  score += maxTextureSize >= 8192 ? 8 : maxTextureSize >= 4096 ? 4 : 1; // 1..8
  if (isMobile) score -= 4;

  let tier = 'low';
  if (score > 28) tier = 'ultra';
  else if (score > 22) tier = 'high';
  else if (score > 16) tier = 'medium';

  const dprClamp = tier === 'ultra' ? 2.0 : tier === 'high' ? 1.75 : tier === 'medium' ? 1.5 : 1.2;
  const tubeDetailFactor = tier === 'ultra' ? 1 : tier === 'high' ? 0.75 : tier === 'medium' ? 0.55 : 0.4;
  const physicsEnabled = tier !== 'low';
  const enableVideoPanel = tier !== 'low';
  const projectTileRTBase = tier === 'ultra' ? 1536 : tier === 'high' ? 1280 : tier === 'medium' ? 1024 : 768;

  return {
    tier,
    score,
    isMobile,
    clampDPR(dpr) { return Math.min(dpr, dprClamp); },
    tubeDetailFactor,
    physicsEnabled,
    enableVideoPanel,
    projectTileRTBase,
  };
})();

export default perfProfile;
