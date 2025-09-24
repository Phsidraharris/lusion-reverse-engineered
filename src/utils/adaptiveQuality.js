// Adaptive Quality Manager: allows runtime override of detected performance tier.
// Persists user override in localStorage under key 'rodiaxQualityOverride'.
import perfProfile from './perfProfile.js';

const LS_KEY = 'rodiaxQualityOverride';

function readOverride() {
  if (typeof localStorage === 'undefined') return null;
  try { return localStorage.getItem(LS_KEY); } catch { return null; }
}

let overrideTier = readOverride();

export function setQualityOverride(tier) {
  overrideTier = tier && tier !== 'auto' ? tier : null;
  try {
    if (typeof localStorage !== 'undefined') {
      if (overrideTier) localStorage.setItem(LS_KEY, overrideTier); else localStorage.removeItem(LS_KEY);
    }
  } catch {}
  // Soft reload to apply (lightweight approach for now)
  if (typeof window !== 'undefined') window.location.reload();
}

export function getTier() {
  return overrideTier || perfProfile.tier;
}

function mapForTier(tier) {
  return {
    tier,
    clampDPR: perfProfile.clampDPR, // DPR clamp already adequate; could vary per override if needed
    tubeDetailFactor: tier === 'ultra' ? 1 : tier === 'high' ? 0.75 : tier === 'medium' ? 0.55 : 0.4,
    physicsEnabled: tier !== 'low',
    enableVideoPanel: tier !== 'low',
    projectTileRTBase: tier === 'ultra' ? 1536 : tier === 'high' ? 1280 : tier === 'medium' ? 1024 : 768,
  };
}

const adaptiveQuality = new Proxy({}, {
  get(_, prop) {
    const tier = getTier();
    const mapped = mapForTier(tier);
    if (prop in mapped) return mapped[prop];
    return perfProfile[prop];
  }
});

export default adaptiveQuality;
