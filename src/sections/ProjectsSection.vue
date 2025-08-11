<template>
  <section id="projects" class="section">
    <h2>{{ $t('projects.title') }}</h2>

    <div class="toolbar">
      <input v-model="q" type="search" class="search" :placeholder="$t('projects.search') as string" aria-label="Search" />
      <ul class="filters" role="tablist" aria-label="Filter by type">
        <li><button class="filter" :aria-pressed="type==='all'"     @click="type='all'">{{ $t('projects.filters.all') }}</button></li>
        <li><button class="filter" :aria-pressed="type==='mobile'"  @click="type='mobile'">{{ $t('projects.filters.mobile') }}</button></li>
        <li><button class="filter" :aria-pressed="type==='web'"     @click="type='web'">{{ $t('projects.filters.web') }}</button></li>
        <li><button class="filter" :aria-pressed="type==='desktop'" @click="type='desktop'">{{ $t('projects.filters.desktop') }}</button></li>
      </ul>
      <div class="sortWrap">
        <select id="sort" v-model="sort" class="select">
          <option value="newest">{{ $t('projects.newest') }}</option>
          <option value="oldest">{{ $t('projects.oldest') }}</option>
          <option value="az">{{ $t('projects.az') }}</option>
          <option value="za">{{ $t('projects.za') }}</option>
        </select>
      </div>
    </div>

    <div v-if="!loading && filtered.length===0" class="empty">{{ $t('projects.empty') }}</div>

    <ul v-else class="grid" aria-label="Projects">
      <ProjectCard v-for="p in filtered" :key="p.slug + p.type" :p="p" @open="open(p)" @chip="applyChip" />
    </ul>

    <ProjectViewer :show="show" :p="current" @close="close" @next="next" @prev="prev" @chip="applyChip" />
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProjects } from '@/composables/useProjects'
import ProjectCard from '@/components/ProjectCard.vue'
import ProjectViewer from '@/components/ProjectViewer.vue'
import type { Project } from '@/types'

const { state, loadAll } = useProjects()
const loading = computed(() => state.value.loading)
const items   = computed(() => state.value.items)

const q     = ref('')
const type  = ref<'all'|'mobile'|'web'|'desktop'>('all')
const sort  = ref<'newest'|'oldest'|'az'|'za'>('newest')

const show         = ref(false)
const current      = ref<Project|null>(null)
const currentIndex = ref(-1)

const filtered = computed(() => {
  let list = items.value.slice()
  const byYearDesc = (a: Project, b: Project) => (b.year || 0) - (a.year || 0)
  const byYearAsc  = (a: Project, b: Project) => (a.year || 0) - (b.year || 0)
  const titleStr = (t: Project['title']) =>
    typeof t === 'string'
      ? t
      : (t && typeof t === 'object' && 'en' in t && typeof (t as any).en === 'string'
          ? (t as any).en
          : Object.values(t as Record<string, string>)[0] || '')
  const byAZ = (a: Project, b: Project) => titleStr(a.title).localeCompare(titleStr(b.title))
  const byZA = (a: Project, b: Project) => titleStr(b.title).localeCompare(titleStr(a.title))
  const sortFn = { newest: byYearDesc, oldest: byYearAsc, az: byAZ, za: byZA }[sort.value] || byYearDesc
  list.sort(sortFn)
  if (type.value !== 'all') list = list.filter(p => p.type === type.value)
  const s = q.value.trim().toLowerCase()
  if (s) {
    list = list.filter(p =>
      [
        titleStr(p.title),
        (typeof p.desc === 'string' ? p.desc : ((p.desc && typeof p.desc === 'object' && 'en' in p.desc) ? (p.desc as { en?: string }).en || '' : '')),
        (p.stack || []).join(',')
      ].join(' ').toLowerCase().includes(s)
    )
  }
  return list
})

function open(p: Project){
  const idx = filtered.value.findIndex(x => x.slug === p.slug && x.type === p.type)
  if (idx === -1) return
  currentIndex.value = idx
  current.value = filtered.value[idx]
  show.value = true
}
function close(){ show.value = false }
function next(){ const i = Math.min(filtered.value.length - 1, currentIndex.value + 1); currentIndex.value = i; current.value = filtered.value[i] }
function prev(){ const i = Math.max(0, currentIndex.value - 1); currentIndex.value = i; current.value = filtered.value[i] }
function applyChip(t:string){ q.value = t; close() }

onMounted(loadAll)
</script>

<style scoped>
.toolbar{
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 12px; align-items: center; margin: 10px 0 18px;
}
@media (max-width: 860px){ .toolbar{ grid-template-columns: 1fr } }

.search{
  width: 100%; padding: 12px 14px; border-radius: 12px;
  border: 1px solid var(--border); background: var(--surface); color: var(--text); outline: none;
}
.search::placeholder{ color: color-mix(in oklab, var(--muted) 75%, transparent) }
.search:focus{ border-color: var(--brand); box-shadow: 0 0 0 3px var(--ring) }

.filters, .filters li{ list-style: none; margin: 0; padding: 0 }
.filters{ display:flex; gap:4px; align-items:center; flex-wrap:wrap }
.filter{
  border: 1px solid var(--border); background: transparent; color: var(--text);
  border-radius: 999px; padding: 6px 12px; cursor: pointer; transition: box-shadow .15s ease, border-color .15s ease, background .15s ease
}
.filter:hover{ border-color: var(--brand); background: color-mix(in oklab, var(--brand) 10%, transparent) }
.filter[aria-pressed="true"]{ border-color: var(--brand); background: color-mix(in oklab, var(--brand) 18%, transparent); box-shadow: inset 0 0 0 3px var(--ring) }

.sortLbl{ color: var(--muted) }
.select{
  appearance: none; padding: 10px 34px 10px 12px; border-radius: 12px;
  border: 1px solid var(--border);
  background:
    linear-gradient(to bottom, transparent, transparent) padding-box,
    url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23aab2bf' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")
    no-repeat right 10px center / 16px 16px,
    var(--surface);
  color: var(--text); outline: none; min-width: 128px
}
.select:focus{ border-color: var(--brand); box-shadow: 0 0 0 3px var(--ring) }

.grid{ display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px }
.empty{ color: var(--muted); padding: 10px 0 }
</style>
