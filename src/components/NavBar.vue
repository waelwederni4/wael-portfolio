<template>
  <div class="nav-progress" :style="{ transform: `scaleX(${progress})` }" />
  <nav class="nav glass" role="navigation" aria-label="Main">
    <div class="container wrap">
      <a class="brand" href="#hero" aria-label="Home" @click="closeMobile">
        <img class="logo" :src="imgLogo" alt="" width="28" height="28" />
        <span class="brand-text">Wael Wederni</span>
      </a>

      <button class="nav-toggle" :aria-expanded="open ? 'true' : 'false'" aria-controls="mobile-menu" @click="open = !open">
        <svg v-if="!open" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>
        <svg v-else width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M18.3 5.71L12 12l6.3 6.29-1.41 1.41L10.59 13.41 4.3 19.7 2.89 18.29 9.18 12 2.89 5.71 4.3 4.3l6.29 6.29 6.29-6.29z"/></svg>
      </button>

      <ul class="links" ref="linksEl">
        <li v-for="item in SECTIONS" :key="item">
          <a class="link" :class="{ active: activeKey === item }" :href="'#' + item" @click="closeMobile">{{ $t('nav.' + labels[item]) }}</a>
        </li>
        <span class="indicator" :style="indicatorStyle" aria-hidden="true"></span>
      </ul>

      <div class="actions">
        <button class="btn icon" @click="toggleTheme" :aria-label="theme === 'dark' ? 'Switch to light' : 'Basculer en sombre'">
          <svg v-if="theme==='dark'" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M21.64 13A9 9 0 1 1 11 2.36 7 7 0 1 0 21.64 13z"/></svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M6.76 4.84l-1.8-1.79L3.54 4.46l1.8 1.79L6.76 4.84M1 13h3v-2H1v2m10 10h2v-3h-2v3m7.24-3.16l1.79 1.8l1.41-1.41l-1.79-1.8l-1.41 1.41M20 13h3v-2h-3v2M11 1h2v3h-2V1m7.46 3.54l-1.79 1.8l1.41 1.41l1.8-1.79l-1.42-1.42M4.84 17.24l-1.8 1.79l1.42 1.41l1.79-1.8l-1.41-1.4Z"/></svg>
        </button>
        <div class="lang">
          <button class="pill" :class="{ on: lang==='en' }" @click="setLang('en')">EN</button>
          <button class="pill" :class="{ on: lang==='fr' }" @click="setLang('fr')">FR</button>
        </div>
      </div>
    </div>

    <div id="mobile-menu" class="mobile-sheet" :class="{ open }" @click.self="open = false">
      <div class="sheet-panel">
        <ul>
          <li v-for="item in SECTIONS" :key="item"><a class="m-link" :href="'#' + item" @click="open=false">{{ $t('nav.' + labels[item]) }}</a></li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, nextTick, computed } from 'vue'
import { setLocale } from '@/i18n'
import { assetUrl } from '@/utils/asset'

type Key = 'hero'|'about'|'exp'|'projects'|'contact'
const SECTIONS: Key[] = ['hero','about','exp','projects','contact']
const labels: Record<Key,string> = { hero: 'home', about: 'about', exp: 'exp', projects: 'projects', contact: 'contact' }
const NAV_HEIGHT = 64

const open = ref(false)
const theme = ref<'dark'|'light'>((localStorage.getItem('theme') as any) || 'dark')
const lang  = ref<'en'|'fr'>((localStorage.getItem('lang') as any) || 'en')
const progress = ref(0)
const activeKey = ref<Key>('hero')

const imgLogo = computed(() =>
    assetUrl(`img/${(document.documentElement.dataset.theme ?? 'dark') === 'dark'
    ? 'logo-dark.png'
    : 'logo-light.png'}`))
function closeMobile(){ open.value = false }
function applyTheme(){ document.documentElement.dataset.theme = theme.value; localStorage.setItem('theme', theme.value) }
function toggleTheme(){ theme.value = theme.value === 'dark' ? 'light' : 'dark'; applyTheme() }
function setLang(val: 'en'|'fr'){ lang.value = val; setLocale(val) }

/* sliding indicator */
const linksEl = ref<HTMLElement|null>(null)
const indicatorStyle = reactive<{ left: string; width: string; opacity: number }>({ left:'0px', width:'0px', opacity:0 })
async function updateIndicator(){
  await nextTick()
  const root = linksEl.value; if (!root) return
  const active = root.querySelector<HTMLElement>(`.link.active`) || root.querySelector<HTMLElement>('.link')
  if (!active) { indicatorStyle.opacity = 0; return }
  const rb = root.getBoundingClientRect(), ab = active.getBoundingClientRect()
  indicatorStyle.left = `${ab.left - rb.left}px`
  indicatorStyle.width = `${ab.width}px`
  indicatorStyle.opacity = 1
}

/* scroll progress + fallback spy */
let ticking = false
function onScroll(){
  if (!ticking) {
    ticking = true
    requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      progress.value = max > 0 ? Math.min(1, window.scrollY / max) : 0
      updateActiveByScroll()
      ticking = false
    })
  }
}

let observer: IntersectionObserver | null = null
const ratios = new Map<Key, number>()
function setupSpy(){
  observer?.disconnect(); ratios.clear()
  observer = new IntersectionObserver(onIO, {
    root: null, rootMargin: `-${NAV_HEIGHT + 6}px 0px -60% 0px`, threshold: [0, .25, .5, .75, 1]
  })
  SECTIONS.forEach(id => { const el = document.getElementById(id); if (el) observer!.observe(el) })
}
function onIO(entries: IntersectionObserverEntry[]){
  let changed = false
  for (const e of entries){ const id = (e.target as HTMLElement).id as Key; ratios.set(id, e.intersectionRatio); changed = true }
  if (!changed) return
  let best: Key = activeKey.value, bestRatio = -1
  for (const id of SECTIONS){ const r = ratios.get(id) ?? 0; if (r > bestRatio){ bestRatio = r; best = id } }
  if (bestRatio > 0){ if (activeKey.value !== best){ activeKey.value = best; updateIndicator() } }
  else { updateActiveByScroll() }
}
function updateActiveByScroll(){
  const y = window.scrollY + NAV_HEIGHT + 12
  let current: Key = 'hero'
  for (const id of SECTIONS){
    const el = document.getElementById(id); if (!el) continue
    if (y >= el.offsetTop) current = id
  }
  if (activeKey.value !== current){ activeKey.value = current; updateIndicator() }
}

onMounted(() => {
  applyTheme(); setLocale(lang.value); setupSpy(); updateIndicator()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', updateIndicator)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', updateIndicator)
  observer?.disconnect()
})
</script>

<style scoped>
.nav-progress{ position: fixed; top:0; left:0; height:3px; width:100%; background: linear-gradient(90deg, var(--brand), #7cc6ff); transform-origin: 0 0; transform: scaleX(0); z-index: 50 }
.nav{ position: fixed; top:0; left:0; right:0; z-index:40; backdrop-filter: saturate(1.6) blur(10px); background: color-mix(in oklab, var(--panel) 80%, transparent); border-bottom:1px solid var(--border) }
.wrap{ display:flex; align-items:center; justify-content:space-between; height: var(--nav-h) }
.brand{ display:flex; align-items:center; gap:10px; font-weight:700; text-decoration:none; color: var(--text) }
.logo{ border-radius: 8px } .brand-text{ white-space: nowrap }
.links, .links li { list-style: none; margin: 0; padding: 0 }
.links li::marker { content: '' }
.links{ position: relative; display:flex; gap:8px; align-items:center; background: color-mix(in oklab, var(--panel) 85%, transparent); border:1px solid var(--border); border-radius:999px; padding:6px }
.link{ position:relative; padding:8px 12px; border-radius:999px; color: var(--muted); text-decoration: none; transition: color .2s ease }
.link:hover{ color: var(--text) } .link.active{ color: var(--text) }
.indicator{ position:absolute; top:4px; height:calc(100% - 8px); border-radius:999px; background: color-mix(in oklab, var(--brand) 18%, transparent); box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--brand) 55%, var(--border)); transition: left .25s cubic-bezier(.2,.8,.2,1), width .25s cubic-bezier(.2,.8,.2,1), opacity .2s; pointer-events:none }
.actions{ display:flex; align-items:center; gap:10px }
.btn{ border:1px solid var(--border); background: color-mix(in oklab, var(--panel) 90%, transparent); color: var(--text); border-radius: 12px; padding: 8px 12px; cursor: pointer }
.btn.icon{ display:grid; place-items:center; padding: 6px 8px }
.lang{ display:flex; gap:6px }
.pill{ border:1px solid var(--border); background: transparent; color: var(--muted); border-radius:999px; padding: 6px 10px; cursor: pointer }
.pill.on{ color: var(--text); background: color-mix(in oklab, var(--brand) 18%, transparent) }
.nav-toggle{ display:none; border:none; background:transparent; color: var(--text) }
@media (max-width: 920px){ .links{ display:none } .nav-toggle{ display:block } }
.mobile-sheet{ position: fixed; inset: var(--nav-h) 0 auto 0; display: grid; place-items: start center; z-index: 39; visibility: hidden; pointer-events: none }
.mobile-sheet.open{ visibility: visible; pointer-events: auto }
.sheet-panel{ width:min(560px,100%); margin-top:6px; background: color-mix(in oklab, var(--panel) 96%, transparent); border: 1px solid var(--border); border-radius:16px; padding: 12px; transform: translateY(-12px); opacity:0; transition:.22s ease }
.mobile-sheet.open .sheet-panel{ transform: translateY(0); opacity: 1 }
.sheet-panel ul{ list-style:none; padding:8px; margin:0; display:flex; flex-direction:column; gap:6px }
.m-link{ display:block; padding:12px; border-radius:10px; color: var(--text); text-decoration:none }
.m-link:hover{ background: color-mix(in oklab, var(--brand) 14%, transparent) }
</style>
