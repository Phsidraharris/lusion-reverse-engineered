// Utility to derive a brand color from the Rodiax logo and set CSS variable --brand-color
// Fallback color defined in index.css :root

const LOGO_PATHS = [
  '/src/assets/RODIAX_logo_161x161.png',
  '/src/assets/RODIAX logo.png'
];

let pendingPromise = null;
let applied = false;
let resolvedColors = {
  brand: null,
  text: null
};

function pickExistingPath() {
  // Return first candidate; build tooling will inline/copy asset.
  return LOGO_PATHS[0];
}

export function getResolvedBrandColors() {
  return { ...resolvedColors };
}

export async function applyBrandColor({ timeoutMs = 3000 } = {}) {
  if (applied) return resolvedColors;
  if (pendingPromise) return pendingPromise;

  const logoPath = pickExistingPath();
  if (!logoPath) return resolvedColors;

  pendingPromise = (async () => {
    try {
      const img = await loadImageWithTimeout(logoPath, timeoutMs);
      const avg = averageColor(img);
      if (avg) {
        const { r, g, b } = avg;
        const hex = rgbToHex(r, g, b);
        const text = pickContrastingTextColor(r, g, b);
        document.documentElement.style.setProperty('--brand-color', hex);
        document.documentElement.style.setProperty('--brand-text-color', text);
        resolvedColors.brand = hex;
        resolvedColors.text = text;
        applied = true;
      }
    } catch (err) {
      // Silent fallback; keep initial CSS variables.
      console.warn('[brandColor] Using fallback brand color.', err);
    } finally {
      pendingPromise = null;
    }
    return resolvedColors;
  })();

  return pendingPromise;
}

function loadImageWithTimeout(src, timeoutMs) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    let done = false;
    const timer = setTimeout(() => {
      if (done) return;
      done = true;
      reject(new Error('Image load timeout'));
    }, timeoutMs);
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      resolve(img);
    };
    img.onerror = (e) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      reject(e || new Error('Image load error'));
    };
    img.src = src;
  });
}

function averageColor(img) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  // Sample a reduced size for performance
  const sampleSize = 32;
  canvas.width = sampleSize;
  canvas.height = sampleSize;
  ctx.drawImage(img, 0, 0, sampleSize, sampleSize);
  const data = ctx.getImageData(0, 0, sampleSize, sampleSize).data;
  let r = 0, g = 0, b = 0, count = 0;
  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3];
    if (alpha < 32) continue; // skip mostly transparent
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    count++;
  }
  if (!count) return null;
  return { r: Math.round(r / count), g: Math.round(g / count), b: Math.round(b / count) };
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

function pickContrastingTextColor(r, g, b) {
  // Relative luminance (sRGB) with gamma correction for better accuracy
  const srgb = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  const L = 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
  const contrastWhite = (1.05) / (L + 0.05);
  const contrastBlack = (L + 0.05) / 0.05;
  // Prefer the color with higher contrast ratio
  return contrastWhite >= contrastBlack ? '#ffffff' : '#111111';
}
