<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="pro-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      @mousedown.self="$emit('close')"
    >
      <!-- Header -->
      <header class="pro-header">
        <div class="left">
          <span class="dot" :data-type="p?.type" />
          <strong class="ttl" id="dialog-title">{{ title }}</strong>
          <small v-if="p?.year" class="muted">· {{ p!.year }}</small>
        </div>
        <div class="right">
          <a v-if="p?.links?.demo" class="btn ghost" :href="p.links.demo" target="_blank" rel="noopener">{{ t('ui.demo') || 'Demo' }}</a>
          <a v-if="p?.links?.code" class="btn ghost" :href="p.links.code" target="_blank" rel="noopener">{{ t('ui.code') || 'Code' }}</a>
          <button class="btn" ref="closeBtn" @click="$emit('close')" aria-label="Close">✕</button>
        </div>
      </header>

      <!-- Main -->
      <main class="pro-main">
        <!-- Viewer column -->
        <section class="viewer">
          <div class="stage">
            <button class="arrow left" @click="prevMedia" aria-label="Previous">‹</button>

            <div class="viewport" ref="viewport" @wheel.prevent="onWheel">
              <div class="device" :class="[deviceClass, fit, orientation]" :style="{ '--frame-w': frame + 'px' }">
                <div v-if="deviceClass==='phone' || deviceClass==='tablet'" class="trim"></div>
                <div v-if="deviceClass==='browser'" class="chrome">
                  <span class="c-dot red"></span><span class="c-dot yellow"></span><span class="c-dot green"></span>
                  <span class="urlbar"></span>
                </div>

                <template v-if="currentMedia?.type==='video'">
                  <video class="screen" :poster="(currentMedia as any).poster" controls autoplay muted loop playsinline>
                    <source :src="assetUrl(currentMedia?.src || '')" type="video/mp4" />
                  </video>
                </template>
                <template v-else>
                  <img
                    class="screen"
                    :class="{ zoomed: zoom>1 }"
                    :src="assetUrl(currentMedia?.src || '')"
                    :alt="title"
                    loading="lazy"
                    decoding="async"
                    :style="{ transform: zoomTransform }"
                    @dblclick="toggleZoom"
                    @pointerdown="onPanStart"
                  />
                </template>
              </div>
            </div>

            <button class="arrow right" @click="nextMedia" aria-label="Next">›</button>
          </div>

          <div class="meta">
            <span v-if="caption" class="caption">{{ caption }}</span>
            <span class="counter">{{ mIndex + 1 }} / {{ p!.media!.length }}</span>
          </div>

          <div class="filmstrip" v-if="(p?.media?.length || 0) > 1" ref="thumbsEl">
            <button
              v-for="(m, i) in p!.media!"
              :key="assetUrl(m?.src || '')"
              class="thumb"
              :class="{ active: i===mIndex }"
              @click="goMedia(i)"
              :aria-label="`Open media ${i+1}`"
            >
              <template v-if="m.type==='video'">🎬</template>
              <img v-else :src="assetUrl(m?.src || '')" :alt="title" loading="lazy" decoding="async" />
            </button>
          </div>
        </section>

        <!-- Info column -->
        <aside class="info">
          <p class="muted" v-if="p?.period">{{ l10n(p!.period) }}</p>

          <div class="chips">
            <span class="chip">{{ typeLabel }}</span>
            <span v-if="p?.year" class="chip">{{ p!.year }}</span>
            <span v-for="tch in p?.stack || []" :key="tch" class="chip" @click="$emit('chip', tch)">{{ tch }}</span>
          </div>

          <div v-if="p?.desc" class="blk">
            <h3>{{ t('ui.overview') || 'Overview' }}</h3>
            <p class="muted">{{ l10n(p!.desc) }}</p>
          </div>

          <div v-if="(p?.highlights?.length || 0) > 0" class="blk">
            <h3>{{ t('ui.highlights') || 'Highlights' }}</h3>
            <ul class="list"><li v-for="(h, i) in (p!.highlights as any)!" :key="i">{{ l10n(h) }}</li></ul>
          </div>

          <!-- NEW: Roles -->
          <div v-if="rolesList.length" class="blk">
            <h3>{{ t('ui.roles') || 'Roles' }}</h3>
            <ul class="list"><li v-for="(r, i) in rolesList" :key="i">{{ r }}</li></ul>
          </div>

          <!-- NEW: Team -->
          <div v-if="teamList.length" class="blk">
            <h3>{{ t('ui.team') || 'Team' }}</h3>
            <ul class="list"><li v-for="(m, i) in teamList" :key="i">{{ m }}</li></ul>
          </div>

          <!-- NEW: Achievements -->
          <div v-if="achievementsList.length" class="blk">
            <h3>{{ t('ui.achievements') || 'Achievements' }}</h3>
            <ul class="list"><li v-for="(a, i) in achievementsList" :key="i">{{ a }}</li></ul>
          </div>

          <div class="blk" v-if="(p?.stack?.length || 0) > 0">
            <h4 class="muted">{{ t('ui.stack') || 'Tech stack' }}</h4>
            <div class="chips"><span v-for="tch in p!.stack!" :key="tch" class="chip">{{ tch }}</span></div>
          </div>

          <div v-if="p?.period || p?.year" class="blk">
            <h4 class="muted">{{ t('ui.timeline') || 'Timeline' }}</h4>
            <p class="muted">{{ p?.period ? l10n(p!.period) : p!.year }}</p>
          </div>

          <div v-if="p?.links && (p.links.demo || p.links.code)" class="blk">
            <h4 class="muted">{{ t('ui.links') || 'Links' }}</h4>
            <ul class="links">
              <li v-if="p.links.demo"><a :href="p.links.demo" target="_blank" rel="noopener">{{ t('ui.demo') || 'Demo' }}</a></li>
              <li v-if="p.links.code"><a :href="p.links.code" target="_blank" rel="noopener">{{ t('ui.code') || 'Code' }}</a></li>
            </ul>
          </div>
        </aside>
      </main>

      <button class="pnav prev" @click="$emit('prev')" aria-label="Previous project">‹</button>
      <button class="pnav next" @click="$emit('next')" aria-label="Next project">›</button>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { assetUrl } from '@/utils/asset'
import type { Project, Localized, LocalizedList } from '@/types'

const props = defineProps<{ show: boolean; p: Project|null }>()
const emit  = defineEmits(['close','next','prev','chip'])

/* i18n safe */
const { locale, t } = ((): any => {
  try { return useI18n() } catch { return { locale: { value: 'en' }, t: (k:string)=>k } }
})()

function l10n(val?: Localized, fallback = ''): string {
  if (!val) return fallback
  if (typeof val === 'string') return val
  const lang = String(locale.value || 'en').slice(0,2)
  return (val as any)[lang] ?? (val as any).en ?? (val as any).fr ?? fallback
}
function l10nList(val?: LocalizedList): string[] {
  if (!val) return []
  if (Array.isArray(val)) return val
  const lang = String(locale.value || 'en').slice(0,2)
  return val[lang] ?? val.en ?? Object.values(val)[0] ?? []
}

const title     = computed(() => props.p ? l10n(props.p.title) : '')
const typeLabel = computed(() => props.p ? (t?.(`types.${props.p.type}`) ?? props.p.type) : '')

/* media */
const hasMedia     = computed(() => (props.p?.media?.length || 0) > 0)
const mIndex       = ref(0)
const currentMedia = computed(() => props.p?.media?.[mIndex.value] || null)
const caption      = computed(() => currentMedia.value ? l10n((currentMedia.value as any).caption) : '')

/* roles/team/achievements */
const rolesList        = computed(() => l10nList(props.p?.roles as any))
const teamList         = computed(() => l10nList(props.p?.team as any))
const achievementsList = computed(() => l10nList(props.p?.achievements as any))

/* device */
type Device = 'phone'|'tablet'|'browser'
const deviceClass = computed<Device>(() => {
  const m = currentMedia.value as any
  const raw = m?.device || props.p?.type
  // normalize "desktop" -> "browser"
  if (raw === 'desktop') return 'browser'
  if (raw === 'mobile')  return 'phone'
  if (raw === 'web')     return 'browser'
  return (raw as Device) || 'browser'
})

/* basic controls */
const orientation = ref<'portrait'|'landscape'>('portrait')
const fit         = ref<'contain'|'cover'>('contain')

/* frame size by device */
const defaultFrame = computed(() =>
  deviceClass.value === 'phone'  ? 360 :
  deviceClass.value === 'tablet' ? 820  : 1040
)
const frame = ref<number>(defaultFrame.value)
watch(deviceClass, () => { frame.value = defaultFrame.value })

/* zoom + pan */
const viewport      = ref<HTMLElement|null>(null)
const zoom          = ref(1)
const zoomTransform = computed(() => `scale(${zoom.value})`)
function resetZoom(){ zoom.value = 1; resetPan() }
function toggleZoom(){ zoom.value = zoom.value > 1 ? 1 : 1.8; resetPan() }
function onWheel(e: WheelEvent){
  if (currentMedia.value?.type !== 'img') return
  const delta = Math.sign(e.deltaY)
  const next = +(zoom.value - delta * 0.12).toFixed(2)
  zoom.value = Math.min(3, Math.max(1, next))
  if (zoom.value === 1) resetPan()
}
let pan = { active:false, x:0, y:0, sx:0, sy:0 }
function onPanStart(e: PointerEvent){
  if (currentMedia.value?.type !== 'img' || zoom.value <= 1) return
  const img = e.currentTarget as HTMLElement
  pan.active = true; pan.sx = e.clientX - pan.x; pan.sy = e.clientY - pan.y
  const move = (ev: PointerEvent)=>{ if(!pan.active) return; pan.x = ev.clientX - pan.sx; pan.y = ev.clientY - pan.sy; applyPan() }
  const up   = ()=>{ pan.active=false; img.releasePointerCapture?.(e.pointerId); window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up) }
  img.setPointerCapture?.(e.pointerId)
  window.addEventListener('pointermove', move, { passive:true })
  window.addEventListener('pointerup', up, { passive:true })
}
function applyPan(){
  const el = viewport.value?.querySelector('.screen') as HTMLElement | null
  if (!el) return
  const k = zoom.value
  el.style.transform = `scale(${k}) translate(${pan.x/k}px, ${pan.y/k}px)`
}
function resetPan(){
  pan = { active:false, x:0, y:0, sx:0, sy:0 }
  const el = viewport.value?.querySelector('.screen') as HTMLElement | null
  if (el) el.style.transform = `scale(${zoom.value})`
}

/* thumbs */
const thumbsEl = ref<HTMLElement|null>(null)
async function thumbIntoView(){
  await nextTick()
  const el = thumbsEl.value?.querySelectorAll<HTMLElement>('.thumb')?.[mIndex.value]
  el?.scrollIntoView({ behavior:'smooth', inline:'center', block:'nearest' })
}

/* media nav */
function nextMedia(){
  if (!hasMedia.value || !props.p) return
  zoom.value = 1; resetPan()
  mIndex.value = (mIndex.value + 1) % props.p.media!.length
  thumbIntoView()
}
function prevMedia(){
  if (!hasMedia.value || !props.p) return
  zoom.value = 1; resetPan()
  mIndex.value = (mIndex.value - 1 + props.p.media!.length) % props.p.media!.length
  thumbIntoView()
}
function goMedia(i:number){ if (!hasMedia.value) return; zoom.value=1; resetPan(); mIndex.value = i; thumbIntoView() }

/* page scroll lock (iOS-safe) */
let savedY = 0
function lockPage(){
  savedY = window.scrollY || 0
  document.documentElement.classList.add('has-overlay')
  document.body.classList.add('has-overlay')
  document.body.style.top = `-${savedY}px`
}
function unlockPage(){
  document.documentElement.classList.remove('has-overlay')
  document.body.classList.remove('has-overlay')
  document.body.style.top = ''
  window.scrollTo(0, savedY)
}

/* lifecycle + keys */
const closeBtn = ref<HTMLButtonElement|null>(null)
watch(() => props.show, async (v) => {
  if (v) {
    lockPage()
    mIndex.value = 0; zoom.value = 1; resetPan()
    await nextTick(); closeBtn.value?.focus()
    window.addEventListener('keydown', onKey)
  } else {
    unlockPage()
    window.removeEventListener('keydown', onKey)
  }
})
watch(() => props.p, () => { mIndex.value = 0; zoom.value=1; resetPan() })
function onKey(e: KeyboardEvent){
  if (!props.show) return
  if (e.key === 'Escape') emit('close')
  if (e.key === 'ArrowRight' || e.key === ']') nextMedia()
  if (e.key === 'ArrowLeft'  || e.key === '[') prevMedia()
  if (e.key === '+' || e.key === '=') { zoom.value = Math.min(3, +(zoom.value + 0.15).toFixed(2)) }
  if (e.key === '-') { zoom.value = Math.max(1, +(zoom.value - 0.15).toFixed(2)) }
  if (e.key === '0') resetZoom()
}

onMounted(() => { if (props.show) lockPage() })
onBeforeUnmount(() => { unlockPage(); window.removeEventListener('keydown', onKey) })
</script>

<style scoped>
/* Fullscreen overlay with modern svh + guarded fallback */
.pro-overlay{
  position: fixed; inset: 0; z-index: 1000; color: var(--text);
  height: 100svh; min-height: 100svh;
  display: flex; flex-direction: column;
  background:
    radial-gradient(1200px 60% at 80% -10%, color-mix(in oklab, var(--brand) 8%, transparent), transparent 60%),
    linear-gradient(180deg,
      color-mix(in oklab, var(--panel) 86%, transparent) 0%,
      color-mix(in oklab, var(--panel) 92%, transparent) 12%,
      color-mix(in oklab, var(--panel) 98%, transparent) 100%);
  contain: layout paint;
  overscroll-behavior: contain;
}
@supports not (height: 100svh){
  .pro-overlay{
    height: calc(var(--app-vh, 1vh) * 100);
    min-height: calc(var(--app-vh, 1vh) * 100);
  }
}

/* safe areas */
.pro-header{ padding-left: calc(14px + env(safe-area-inset-left)); padding-right: calc(14px + env(safe-area-inset-right)); }
.pro-main{  padding-left: calc(14px + env(safe-area-inset-left)); padding-right: calc(14px + env(safe-area-inset-right)); }

/* header */
.pro-header{
  position: sticky; top: 0; z-index: 2;
  display:flex; align-items:center; justify-content:space-between; gap: 10px;
  height: var(--nav-h, 64px);
  background: color-mix(in oklab, var(--panel) 98%, transparent);
  border-bottom: 1px solid var(--border);
  backdrop-filter: saturate(1.4) blur(8px);
}
.pro-header .left{ display:flex; align-items:center; gap:10px; min-width:0 }
.ttl{ font-size: 16px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 58vw }
.muted{ color: var(--muted) }
.dot{ width:10px; height:10px; border-radius:50%; background:#666; display:inline-block }
.dot[data-type="mobile"]{ background:#00bcd4 } .dot[data-type="web"]{ background:#4caf50 } .dot[data-type="desktop"]{ background:#ffc107 }
.pro-header .right{ display:flex; gap:8px; align-items:center }

/* layout */
.pro-main{
  display:grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(280px, .9fr);
  gap: 16px;
  height: calc(100% - var(--nav-h, 64px));
  overflow: hidden;       /* columns scroll independently */
}
@media (max-width: 980px){
  .pro-main{
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto; /* viewer grows, info gets its own scroll area */
  }
}

/* buttons */
.btn{
  border:1px solid var(--border); border-radius: 10px; padding: 8px 12px;
  background: color-mix(in oklab, var(--brand) 14%, transparent); color: var(--text);
  cursor: pointer; transition: background .2s
}
.btn:hover{ background: color-mix(in oklab, var(--brand) 22%, transparent) }
.btn.ghost{ background: transparent }

/* viewer 3-row grid: stage (1fr) + meta (auto) + filmstrip (auto) */
.viewer{
  display:grid;
  grid-template-rows: 1fr auto auto;
  min-height: 0;
}
.stage{
  position: relative;
  display:grid;
  grid-template-columns: auto 1fr auto;
  align-items:center;
  gap: 10px;
  min-height: 0;
}
.viewport{
  height: 100%;
  min-height: 0;
  background: var(--surface, #141824);
  border:1px solid var(--border);
  border-radius: 14px;
  padding: 10px;
  overflow: hidden;
  display:grid;
  place-items:center;
  touch-action: pan-x pan-y;
  -webkit-overflow-scrolling: touch;
}
.arrow{
  border:1px solid var(--border);
  background: color-mix(in oklab, var(--panel) 70%, transparent);
  color: var(--text);
  border-radius: 12px;
  padding: 10px 12px;
  cursor:pointer; min-height:44px
}

/* device frames */
.device{ position: relative; width: min(100%, var(--frame-w, 1040px)); max-width: 100%; display:grid; place-items:center }
.device .screen{ width:100%; height:100%; transition: transform .16s ease; will-change: transform; background:#000 }
.device.contain .screen{ object-fit: contain }
.device.cover   .screen{ object-fit: cover }

/* phone */
.device.phone{ aspect-ratio: 9/19.5; padding: 14px; border-radius: 28px; background: color-mix(in oklab, var(--panel) 92%, transparent); box-shadow: 0 18px 40px rgba(0,0,0,.35), 0 0 0 2px color-mix(in oklab, var(--border) 70%, transparent) }
:root[data-theme="light"] .device.phone{ box-shadow: 0 12px 30px rgba(0,0,0,.08), 0 0 0 1px color-mix(in oklab, var(--border) 70%, transparent) }
.device.phone .trim{ position:absolute; inset:0; border-radius:28px; box-shadow: inset 0 0 0 10px color-mix(in oklab, var(--surface, #0b0f15) 96%, transparent) }
.device.phone .screen{ border-radius: 22px }
.device.phone.landscape{ aspect-ratio: 19.5/9 }
.device.phone.landscape .screen{ border-radius: 20px }

/* tablet */
.device.tablet{ aspect-ratio: 10/13.3; padding: 12px; border-radius: 22px; background: color-mix(in oklab, var(--panel) 92%, transparent); box-shadow: 0 18px 40px rgba(0,0,0,.35), 0 0 0 2px color-mix(in oklab, var(--border) 70%, transparent) }
:root[data-theme="light"] .device.tablet{ box-shadow: 0 12px 30px rgba(0,0,0,.08), 0 0 0 1px color-mix(in oklab, var(--border) 70%, transparent) }
.device.tablet .screen{ border-radius: 16px }
.device.tablet.landscape{ aspect-ratio: 13.3/10 }

/* browser */
.device.browser{ aspect-ratio: 16/10; background: color-mix(in oklab, var(--panel) 92%, transparent); border-radius: 14px; box-shadow: 0 18px 40px rgba(0,0,0,.35) }
:root[data-theme="light"] .device.browser{ box-shadow: 0 12px 30px rgba(0,0,0,.08) }
.device.browser .chrome{ position:absolute; top:0; left:0; right:0; height:34px; background: color-mix(in oklab, var(--panel) 90%, transparent); border-bottom:1px solid var(--border); border-top-left-radius:14px; border-top-right-radius:14px; display:flex; align-items:center; gap:8px; padding: 0 10px }
.device.browser .c-dot{ width:10px; height:10px; border-radius:50% }
.device.browser .c-dot.red{ background:#ff5f56 } .device.browser .c-dot.yellow{ background:#ffbd2e } .device.browser .c-dot.green{ background:#27c93f }
.device.browser .urlbar{ flex:1; height:16px; border-radius:8px; background: color-mix(in oklab, var(--panel) 70%, transparent); margin-left:6px }
.device.browser .screen{ border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; margin-top: 34px }

/* meta + thumbs */
.meta{ display:flex; align-items:center; justify-content:space-between; gap:10px; color: var(--muted); padding: 8px 2px; flex-wrap: wrap }
.caption{ flex:1; text-align:left }
.counter{ border:1px dashed var(--border); border-radius: 6px; padding: 2px 6px }

/* tiny thumbs */
.filmstrip{ --thumb-w: 72px; --thumb-h: 48px; display:flex; gap:8px; overflow-x:auto; -webkit-overflow-scrolling: touch; padding: 6px 2px 10px; overscroll-behavior-x: contain }
.thumb{
  flex: 0 0 var(--thumb-w) !important;
  width: var(--thumb-w) !important;
  height: var(--thumb-h) !important;
  border:1px solid var(--border); border-radius: 8px;
  background: color-mix(in oklab, var(--panel) 70%, transparent);
  display:grid; place-items:center; cursor:pointer; opacity:.95;
  transition: border-color .2s, box-shadow .2s, opacity .2s; overflow: hidden;
}
.thumb:hover{ opacity: 1 }
.thumb.active{ border-color: color-mix(in oklab, var(--brand) 55%, var(--border)); box-shadow: 0 0 0 3px var(--ring) inset }
.thumb img{
  width:100% !important; height:100% !important; object-fit: cover !important; display:block !important;
  max-width:none !important; max-height:none !important;
}

/* info column scrolls independently */
.info{
  border-left: 1px solid var(--border);
  padding-left: 14px;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
@media (max-width: 980px){
  .info{
    border-left: none; border-top: 1px solid var(--border); padding-top: 14px;
    max-height: 42vh;   /* viewer stays visible; details scroll */
  }
}
.chips{ display:flex; gap:8px; flex-wrap:wrap; margin: 8px 0 }
.chip{ border:1px solid var(--border); padding:6px 10px; border-radius:999px }
.blk{ margin: 12px 0 }
.list{ padding-left: 1.25rem }

/* project-to-project nav */
.pnav{ position: fixed; top: 50%; transform: translateY(-50%); background: transparent; border: none; color: var(--text); font-size: 30px; opacity: .6; cursor: pointer; z-index: 1001 }
.pnav:hover{ opacity: .9 }
.pnav.prev{ left: 8px } .pnav.next{ right: 8px }
</style>
