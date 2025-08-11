import fs from 'node:fs';
import path from 'node:path';

const distRoot = path.resolve('dist');
const jsonPath = path.join(distRoot, 'projects', 'index.json');

if (!fs.existsSync(jsonPath)) {
  console.error('❌ Missing dist/projects/index.json — run the build first.');
  process.exit(1);
}

let missing = 0;
const data  = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const items = Array.isArray(data.items) ? data.items : [];

function exists(p) { return fs.existsSync(p); }
function abs(p) { return path.join(distRoot, p); }

/** Try to resolve a poster if the JSON left it as a bare filename */
function resolvePoster(p, m) {
  if (!m?.poster) return null;
  if (m.poster.includes('/')) return abs(m.poster);

  // poster like "cover.jpg": try alongside media src, then alongside cover
  if (m.src && m.src.includes('/')) {
    const dir = path.dirname(m.src);
    const guess = abs(path.join(dir, m.poster));
    if (exists(guess)) return guess;
  }
  if (p.cover && p.cover.includes('/')) {
    const dir = path.dirname(p.cover);
    const guess = abs(path.join(dir, m.poster));
    if (exists(guess)) return guess;
  }
  // final fallback (won't exist, used only for error message)
  return abs(m.poster);
}

for (const p of items) {
  if (p.cover) {
    const coverFull = abs(p.cover);
    if (!exists(coverFull)) { console.log(`Missing cover: ${p.slug} → ${p.cover}`); missing++; }
  }
  const media = Array.isArray(p.media) ? p.media : [];
  for (const m of media) {
    if (m.src) {
      const srcFull = abs(m.src);
      if (!exists(srcFull)) { console.log(`Missing media: ${p.slug} → ${m.src}`); missing++; }
    }
    if (m.poster) {
      const posterFull = m.poster.includes('/') ? abs(m.poster) : resolvePoster(p, m);
      if (!exists(posterFull)) {
        console.log(`Missing poster: ${p.slug} → ${m.poster}`);
        missing++;
      }
    }
  }
}

if (missing) {
  console.error(`❌ Missing ${missing} file(s) in dist/. Fix paths or ensure assets are in /public exactly as referenced.`);
  process.exit(1);
} else {
  console.log('✅ All referenced project assets exist in dist/.');
}
