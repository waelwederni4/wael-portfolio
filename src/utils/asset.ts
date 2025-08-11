export function assetUrl(p?: string) {
  const base = import.meta.env.BASE_URL || '/';
  if (!p) return base;
  return base + p.replace(/^\/+/, '');
}
