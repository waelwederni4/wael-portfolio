import fs from 'node:fs'
import path from 'node:path'

const dist = path.resolve('dist')
const jsonPath = path.join(dist, 'projects', 'index.json')

if (!fs.existsSync(jsonPath)) {
  console.error('❌ Missing dist/projects/index.json')
  process.exit(1)
}

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
let missing = 0

for (const p of (data.items || [])) {
  const cover = path.join(dist, p.cover)
  if (!fs.existsSync(cover)) { console.log('Missing cover:', p.cover); missing++ }

  for (const m of (p.media || [])) {
    const f = path.join(dist, m.src)
    if (!fs.existsSync(f)) { console.log('Missing media:', m.src); missing++ }
  }
}

console.log(missing ? `❌ Missing ${missing} file(s)` : '✅ All asset files exist in dist/')
process.exit(missing ? 1 : 0)
