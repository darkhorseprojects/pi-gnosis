import { relative, normalize } from 'node:path';

const PROTECTED_PATTERNS = [
  /^notes\//,
  /profile\.md$/,
  /final\.(mp4|mov|webm)$/,
  /script\.py$/,
  /package\.json$/,
  /pi\.json$/,
  /^config\//,
  /^skills\//,
  /^graphs\//,
];

function cleanPath(p) {
  return normalize(String(p || '')).replace(/\\/g, '/').replace(/^\.\//, '');
}

export function classifyArtifact(path, options = {}) {
  const p = cleanPath(path);
  const tempRoot = cleanPath(options.tempRoot || '/tmp/pi-gnosis');
  const manimRoot = cleanPath(options.manimRoot || '/tmp/pi-gnosis/manim');
  if (!p || p.includes('..')) return { path: p, category: 'unknown', protected: true, reason: 'empty or parent traversal' };
  if (PROTECTED_PATTERNS.some((re) => re.test(p))) return { path: p, category: 'protected', protected: true, reason: 'protected artifact type' };
  if (p === tempRoot || p.startsWith(`${tempRoot}/`)) return { path: p, category: 'temporary', protected: false, reason: 'inside configured temporary root' };
  if (p.startsWith(`${manimRoot}/`) && p.includes('/media/')) return { path: p, category: 'generated-media', protected: false, reason: 'Manim media cache' };
  return { path: p, category: 'unknown', protected: true, reason: 'not in a safe cleanup root' };
}

export function planCleanup(paths, options = {}) {
  if (!Array.isArray(paths)) throw new TypeError('paths must be an array');
  const apply = Boolean(options.applyCleanup);
  const allowMedia = Boolean(options.allowGeneratedMediaCleanup);
  return paths.map((path) => {
    const c = classifyArtifact(path, options);
    const allowedNow = !c.protected && apply && (c.category === 'temporary' || (c.category === 'generated-media' && allowMedia));
    return { ...c, allowed_now: allowedNow };
  });
}
