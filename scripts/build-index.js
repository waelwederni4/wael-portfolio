import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

const __dirname   = path.dirname(url.fileURLToPath(import.meta.url))
const root        = path.resolve(__dirname, '..')
const projectsRoot= path.join(root, 'public', 'projects')
const TYPES       = ['mobile', 'web', 'desktop']

function readJSON(p){ return JSON.parse(fs.readFileSync(p, 'utf-8')) }

function build(){
  const all = []
  for (const type of TYPES){
    const typeDir = path.join(projectsRoot, type)
    if (!fs.existsSync(typeDir)) continue
    const slugs = fs.readdirSync(typeDir).filter(d => fs.statSync(path.join(typeDir, d)).isDirectory())

    for (const slug of slugs){
      const projPath = path.join(typeDir, slug, 'project.json')
      if (!fs.existsSync(projPath)) { console.warn(`WARN: missing ${type}/${slug}/project.json`); continue }
      const data = readJSON(projPath)

      const basePath = `projects/${type}/${slug}` // <-- NO leading slash

      all.push({
        title: data.title || slug,
        slug,
        type,
        year: data.year ?? null,
        period: data.period ?? '',
        desc: data.desc || data.description || '',
        stack: data.stack || data.technologies || [],
        highlights: data.highlights || [],
        links: data.links || { demo: data.demoUrl || '', code: data.repoUrl || '' },
        cover: `${basePath}/${data.cover || 'cover.jpg'}`,
        media: (data.media || data.screenshots || []).map(m => {
          const src = typeof m === 'string' ? m : (m.src || '')
          return {
            type: (typeof m === 'string' ? 'img' : (m.type || 'img')),
            src:  `${basePath}/${src}`,           // <-- NO leading slash
            device: typeof m === 'string' ? undefined : m.device,
            caption: typeof m === 'string' ? undefined : m.caption,
            poster: typeof m === 'string' ? undefined : m.poster
          }
        })
      })
    }
  }
  all.sort((a,b) => (b.year||0) - (a.year||0))
  fs.writeFileSync(path.join(projectsRoot, 'index.json'), JSON.stringify({ items: all }, null, 2))
  console.log(`Built projects index with ${all.length} items.`)
}
build()
