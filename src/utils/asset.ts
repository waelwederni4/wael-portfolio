// src/utils/asset.ts
export function assetUrl(p: string) {
  // Leaves absolute URLs untouched, otherwise prefixes BASE_URL and strips leading slashes
  if (!p) return p
  if (/^https?:\/\//i.test(p)) return p
  const base = import.meta.env.BASE_URL || '/'
  return base + p.replace(/^\/+/, '')
}
