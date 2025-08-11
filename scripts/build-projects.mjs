import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname    = path.dirname(fileURLToPath(import.meta.url));
const repoRoot     = path.resolve(__dirname, '..');
const publicRoot   = path.join(repoRoot, 'public');
const projectsRoot = path.join(publicRoot, 'projects');

const VIDEO_EXTS = new Set(['.mp4', '.webm', '.mov', '.m4v']);
const toPosix = (p) => p.replace(/\\/g, '/');
const exists  = (p) => fs.existsSync(p);

const listDirs = (root) =>
  exists(root) ? fs.readdirSync(root).filter(d => fs.statSync(path.join(root, d)).isDirectory()) : [];

const readJSON = (p, fb = {}) => {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); }
  catch { return fb; }
};

const inferType = (src) => VIDEO_EXTS.has(path.extname(String(src||'')).toLowerCase()) ? 'video' : 'img';

/** join a file that might be '', './cover.jpg', 'cover.jpg', or already absolute */
function joinUnder(folder, maybeRelative) {
  if (!maybeRelative) return null;
  const s = String(maybeRelative).replace(/^\.?\//, '');
  if (s.startsWith('projects/')) return toPosix(s);
  return toPosix(path.join(folder, s));
}

function build() {
  if (!exists(projectsRoot)) {
    console.error('❌ public/projects not found');
    process.exit(1);
  }

  const types = listDirs(projectsRoot); // e.g. ['mobile','web','desktop']
  const items = [];
  let warns = 0;

  for (const type of types) {
    const typeDir = path.join(projectsRoot, type);
    for (const slug of listDirs(typeDir)) {
      const dir       = path.join(typeDir, slug);
      const jsonPath  = path.join(dir, 'project.json');
      const data      = readJSON(jsonPath, {});
      const folderRel = toPosix(path.join('projects', type, slug));       // posix path used in JSON
      const folderAbs = path.join(publicRoot, 'projects', type, slug);    // real fs path

      // cover (fallback to various common names)
      const coverCandidate = data.cover || 'cover.jpg';
      const cover = joinUnder(folderRel, coverCandidate);
      const coverAbs = path.join(publicRoot, cover);
      if (!exists(coverAbs)) { console.warn(`WARN: missing cover -> ${cover}`); warns++; }

      // media
      const media = Array.isArray(data.media) ? data.media : [];
      const normMedia = media.map((m) => {
        const item = (typeof m === 'string') ? { src: m } : { ...m };
        item.type = item.type || inferType(item.src);
        item.src  = joinUnder(folderRel, item.src);
        if (item.poster) item.poster = joinUnder(folderRel, item.poster);

        // sanity check
        if (item.src && !exists(path.join(publicRoot, item.src))) {
          console.warn(`WARN: missing media -> ${item.src}`);
          warns++;
        }
        if (item.poster && !exists(path.join(publicRoot, item.poster))) {
          console.warn(`WARN: missing poster -> ${item.poster}`);
          warns++;
        }
        return item;
      });

      items.push({
        title: data.title || slug,
        slug,
        type,
        year: data.year ?? null,
        period: data.period ?? '',
        desc: data.desc ?? data.description ?? '',
        stack: Array.isArray(data.stack) ? data.stack : (data.technologies || []),
        highlights: Array.isArray(data.highlights) ? data.highlights : [],
        links: data.links || { demo: data.demoUrl || '', code: data.repoUrl || '' },
        cover,
        media: normMedia
      });
    }
  }

  // sort newest first
  items.sort((a,b) => (b.year||0) - (a.year||0) || String(
    typeof a.title === 'string' ? a.title : (a.title?.en || a.title?.fr || a.slug)
  ).localeCompare(
    typeof b.title === 'string' ? b.title : (b.title?.en || b.title?.fr || b.slug)
  ));

  const outPath = path.join(projectsRoot, 'index.json');
  fs.writeFileSync(outPath, JSON.stringify({ items }, null, 2), 'utf8');

  console.log(`✅ Built projects index with ${items.length} item(s)`);
  if (warns) console.log(`⚠️  ${warns} warning(s)`);
}

build();
