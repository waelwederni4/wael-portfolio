export function assetUrl(p: string) {
  const base = import.meta.env.BASE_URL || '/';
  return base + p.replace(/^\/+/, ''); // strip leading slashes
}
