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
          <a v-if="p?.links?.demo" class="btn ghost" :href="p.links.demo" target="_blank" rel="noopener" aria-label="View Demo">{{ t('ui.demo') || 'Demo' }}</a>
          <a v-if="p?.links?.company" class="btn ghost" :href="p.links.company" target="_blank" rel="noopener" aria-label="View company">{{ t('ui.company') || 'company' }}</a>
          <a v-if="p?.links?.playstore" class="btn ghost" :href="p.links.playstore" target="_blank" rel="noopener" aria-label="View Playstore">{{ t('ui.playstore') || 'Store' }}</a>
          <a v-if="p?.links?.appstore" class="btn ghost" :href="p.links.appstore" target="_blank" rel="noopener" aria-label="View Appstore">{{ t('ui.appstore') || 'Store' }}</a>
          <button class="btn" ref="closeBtn" @click="$emit('close')" aria-label="Close Viewer">✕</button>
        </div>
      </header>

      <!-- Main -->
      <main class="pro-main">
        <!-- Viewer column -->
        <section class="viewer">
          <div class="stage">
            <button class="arrow left" @click="prevMedia" aria-label="Previous Media">‹</button>

            <!-- MEDIA fills the whole stage -->
            <div class="media-box" @pointerdown="onPointerStart">
              <template v-if="currentMedia?.type==='video'">
                <video
                  class="media"
                  :poster="(currentMedia as any).poster"
                  controls
                  autoplay
                  muted
                  loop
                  playsinline
                  draggable="false"
                >
                  <source :src="assetUrl(currentMedia?.src || '')" type="video/mp4" />
                </video>
              </template>
              <template v-else>
                <img
                  class="media"
                  :src="assetUrl(currentMedia?.src || '')"
                  :alt="title"
                  loading="lazy"
                  decoding="async"
                  draggable="false"
                  @load="onImgLoad"
                  @error="onImgError"
                />
                <div v-show="!imgLoaded" class="loader" aria-hidden="true"></div>
              </template>
            </div>

            <button class="arrow right" @click="nextMedia" aria-label="Next Media">›</button>
          </div>

          <div class="meta" aria-live="polite">
            <span v-if="caption" class="caption">{{ caption }}</span>
            <span class="counter">{{ mIndex + 1 }} / {{ p!.media!.length }}</span>
          </div>

          <!-- Filmstrip (drag-scroll) -->
          <div
            class="filmstrip"
            v-if="(p?.media?.length || 0) > 1"
            ref="thumbsEl"
            @pointerdown="onThumbsPointerDown"
            @pointerup="onThumbsPointerUp"
            @pointercancel="onThumbsPointerUp"
            @pointerleave="onThumbsPointerUp"
            @pointermove="onThumbsPointerMove"
          >
            <button
              v-for="(m, i) in p!.media!"
              :key="assetUrl(m?.src || '') + i"
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

          <div v-if="rolesList.length" class="blk">
            <h3>{{ t('ui.roles') || 'Roles' }}</h3>
            <ul class="list"><li v-for="(r, i) in rolesList" :key="i">{{ r }}</li></ul>
          </div>

          <div v-if="teamList.length" class="blk">
            <h3>{{ t('ui.team') || 'Team' }}</h3>
            <ul class="list"><li v-for="(m, i) in teamList" :key="i">{{ m }}</li></ul>
          </div>

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

          <div v-if="p?.links && (p.links.demo || p.links.company)" class="blk">
            <h4 class="muted">{{ t('ui.links') || 'Links' }}</h4>
            <ul class="links">
              <li v-if="p.links.demo"><a :href="p.links.demo" target="_blank" rel="noopener">{{ t('ui.demo') || 'Demo' }}</a></li>
              <li v-if="p.links.company"><a :href="p.links.company" target="_blank" rel="noopener">{{ t('ui.company') || 'Company' }}</a></li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { assetUrl } from '@/utils/asset'
import type { Project, Localized, LocalizedList } from '@/types'

const props = defineProps<{ show: boolean; p: Project|null }>()
const emit  = defineEmits(['close','chip'])

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

const rolesList        = computed(() => l10nList(props.p?.roles as any))
const teamList         = computed(() => l10nList(props.p?.team as any))
const achievementsList = computed(() => l10nList(props.p?.achievements as any))

/* simple image load state */
const imgLoaded = ref(false)
watch(() => currentMedia.value, () => { imgLoaded.value = currentMedia.value?.type==='video' ? true : false })
function onImgLoad(){ imgLoaded.value = true }
function onImgError(){ imgLoaded.value = true }

/* swipe to change media (no zoom/pan now) */
type P = { x:number, y:number }
const pointers = new Map<number, P>()
let swipeDX = 0, swipeDY = 0
function onPointerStart(e: PointerEvent){
  const box = e.currentTarget as HTMLElement
  box.setPointerCapture?.(e.pointerId)
  pointers.set(e.pointerId, {x:e.clientX, y:e.clientY})
  swipeDX = 0; swipeDY = 0
  const move = (ev: PointerEvent)=>{ 
    const prev = pointers.get(ev.pointerId)
    pointers.set(ev.pointerId, {x:ev.clientX, y:ev.clientY})
    swipeDX += ev.clientX - (prev?.x ?? ev.clientX)
    swipeDY += ev.clientY - (prev?.y ?? ev.clientY)
  }
  const up = ()=>{ 
    pointers.delete(e.pointerId)
    box.releasePointerCapture?.(e.pointerId)
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', up)
    if (Math.abs(swipeDX) > 60 && Math.abs(swipeDX) > Math.abs(swipeDY)){
      swipeDX < 0 ? nextMedia() : prevMedia()
    }
  }
  window.addEventListener('pointermove', move, { passive:true })
  window.addEventListener('pointerup', up,   { passive:true })
}

/* thumbs */
const thumbsEl = ref<HTMLElement|null>(null)
async function thumbIntoView(){
  await nextTick()
  const el = thumbsEl.value?.querySelectorAll<HTMLElement>('.thumb')?.[mIndex.value]
  el?.scrollIntoView({ behavior:'smooth', inline:'center', block:'nearest' })
}

/* drag-scroll state for filmstrip (momentum) */
let ts = { active:false, x:0, scroll:0, vx:0, raf:0 as number|0 }
function onThumbsPointerDown(e: PointerEvent){
  const el = thumbsEl.value
  if (!el) return
  ts.active = true
  ts.x = e.clientX
  ts.scroll = el.scrollLeft
  ts.vx = 0
  ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
  cancelAnimationFrame(ts.raf as number)
}
function onThumbsPointerMove(e: PointerEvent){
  if (!ts.active) return
  const el = thumbsEl.value
  if (!el) return
  const dx = e.clientX - ts.x
  el.scrollLeft = ts.scroll - dx
  ts.vx = dx
}
function onThumbsPointerUp(){
  if (!ts.active) return
  ts.active = false
  const el = thumbsEl.value
  if (!el) return
  let v = -ts.vx
  function step(){
    if (Math.abs(v) < 0.3 || !el) return

    el.scrollLeft += v
    v *= 0.92
    ts.raf = requestAnimationFrame(step)
  }
  ts.raf = requestAnimationFrame(step)
}

/* media nav */
function nextMedia(){
  if (!hasMedia.value || !props.p) return
  mIndex.value = (mIndex.value + 1) % props.p.media!.length
  thumbIntoView()
}
function prevMedia(){
  if (!hasMedia.value || !props.p) return
  mIndex.value = (mIndex.value - 1 + props.p.media!.length) % props.p.media!.length
  thumbIntoView()
}
function goMedia(i:number){ if (!hasMedia.value) return; mIndex.value = i; thumbIntoView() }

/* page scroll lock + keys */
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

const closeBtn = ref<HTMLButtonElement|null>(null)
watch(() => props.show, async (v) => {
  if (v) {
    lockPage()
    mIndex.value = 0
    await nextTick()
    closeBtn.value?.focus()
    window.addEventListener('keydown', onKey)
  } else {
    unlockPage()
    window.removeEventListener('keydown', onKey)
  }
})
watch(() => props.p, () => { mIndex.value = 0 })

function onKey(e: KeyboardEvent){
  if (!props.show) return
  if (e.key === 'Escape') emit('close')
  if (e.key === 'ArrowRight') nextMedia()
  if (e.key === 'ArrowLeft')  prevMedia()
}

onMounted(() => { if (props.show) lockPage() })
onBeforeUnmount(() => { unlockPage(); window.removeEventListener('keydown', onKey) })
</script>

<style scoped>
/* Overlay */
.pro-overlay{
  position: fixed; inset: 0; z-index: 1000; color: var(--text);
  height: 100svh; min-height: 100svh;
  display: flex; flex-direction: column;
  background:
    radial-gradient(1200px 60% at 80% -10%, color-mix(in oklab, var(--brand) 8%, transparent), transparent 60%),
    linear-gradient(180deg,
      color-mix(in oklab, var(--panel) 92%, transparent) 0%,
      color-mix(in oklab, var(--panel) 96%, transparent) 12%,
      color-mix(in oklab, var(--panel) 98%, transparent) 100%);
  contain: layout paint;
  overscroll-behavior: contain;
}
@supports not (height: 100svh){
  .pro-overlay{ height: calc(var(--app-vh, 1vh) * 100); min-height: calc(var(--app-vh, 1vh) * 100) }
}

/* Header */
.pro-header{
  position: sticky; top: 0; z-index: 2;
  display:flex; align-items:center; justify-content:space-between; gap: 10px;
  height: var(--nav-h, 64px);
  padding-left: calc(16px + env(safe-area-inset-left));
  padding-right: calc(16px + env(safe-area-inset-right));
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

/* Layout */
.pro-main{
  display:grid;
  grid-template-columns: minmax(0, 1.9fr) minmax(320px, 1fr);
  gap: 18px;
  height: calc(100% - var(--nav-h, 64px));
  padding-left: calc(16px + env(safe-area-inset-left));
  padding-right: calc(16px + env(safe-area-inset-right));
  overflow: hidden;
  min-height: 0; /* allow children to define height distribution */
}
@media (max-width: 980px){
  .pro-main{ grid-template-columns: 1fr; grid-template-rows: 1fr auto }
}

/* Buttons */
.btn{
  border:1px solid var(--border);
  border-radius: 12px;
  padding: 8px 12px;
  background: color-mix(in oklab, var(--brand) 14%, transparent);
  color: var(--text);
  cursor: pointer;
  transition: background .2s;
}
.btn:hover{ background: color-mix(in oklab, var(--brand) 22%, transparent) }
.btn.ghost{ background: transparent }

/* Viewer */
.viewer{
  display:grid;
  grid-template-rows: 1fr auto auto;
  min-height: 0; /* critical: let the first row shrink instead of overflowing */
}

/* Stage */
.stage{
  position: relative;
  display:grid;
  grid-template-columns: minmax(0, auto) minmax(0, 1fr) minmax(0, auto);
  align-items:center;
  gap: 12px;
  min-height: 220px;      /* floor so it never collapses (prevents 0px cases around ~520px widths) */
  height: 100%;           /* fill available grid row */
  background: var(--surface, #10141e);
  border:1px solid var(--border);
  border-radius: 16px;
  padding: clamp(10px, 2vmin, 16px);
  box-shadow: 0 10px 30px rgba(0,0,0,.30);
  min-width: 0;
}

/* Media box: flexible, can’t collapse, centers content */
.media-box{
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 0;           /* keep it from forcing overflow in grid */
  border-radius: 12px;
  overflow: hidden;
  background: #000;        /* letterbox background */
}

/* Image & video: keep aspect, scale within box, no overflow */
.media{
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;      /* keep scale */
  object-position: center;
  display: block;
  -webkit-user-drag: none;
  user-select: none;
  pointer-events: auto;     /* video controls usable */
}

/* Loader */
.loader{
  position:absolute; inset:0; display:grid; place-items:center; pointer-events:none;
}
.loader::before{
  content:""; width:72%; height:72%; border-radius:12px;
  background: linear-gradient(90deg, rgba(255,255,255,.06), rgba(255,255,255,.12), rgba(255,255,255,.06));
  background-size:200% 100%; animation: shimmer 1.1s linear infinite;
}
@keyframes shimmer{ 0%{ background-position:0% 0 } 100%{ background-position:200% 0 } }

/* Arrows */
.arrow{
  border:1px solid var(--border);
  background: color-mix(in oklab, var(--panel) 72%, transparent);
  color: var(--text);
  border-radius: 12px;
  padding: 10px 12px;
  cursor:pointer;
  min-height:44px;
  transition: transform .15s;
}
.arrow:active{ transform: scale(.98) }

/* Meta + thumbs */
.meta{
  display:flex; align-items:center; justify-content:space-between; gap:10px;
  color: var(--muted); padding: 8px 2px; flex-wrap: wrap;
}
.caption{ flex:1; text-align:left }
.counter{ border:1px dashed var(--border); border-radius: 6px; padding: 2px 6px }

/* Filmstrip: drag-scroll + snap */
.filmstrip{
  --thumb-w: clamp(72px, 7.4vw, 120px);
  --thumb-h: calc(var(--thumb-w) * 0.66);
  display:flex; gap:10px; overflow-x:auto; -webkit-overflow-scrolling: touch; padding: 8px 2px 12px;
  overscroll-behavior-x: contain; scroll-snap-type: x mandatory; cursor: grab;
}
.filmstrip:active{ cursor: grabbing }
.thumb{
  flex: 0 0 var(--thumb-w) !important; width: var(--thumb-w) !important; height: var(--thumb-h) !important;
  border:1px solid var(--border); border-radius: 10px; background: color-mix(in oklab, var(--panel) 70%, transparent);
  display:grid; place-items:center; cursor:pointer; opacity:.96; transition: border-color .2s, box-shadow .2s, opacity .2s; overflow: hidden; scroll-snap-align: center;
}
.thumb:hover{ opacity: 1 }
.thumb.active{ border-color: color-mix(in oklab, var(--brand) 55%, var(--border)); box-shadow: 0 0 0 3px var(--ring) inset }
.thumb img{ width:100% !important; height:100% !important; object-fit: cover !important; display:block !important; max-width:none !important; max-height:none !important }

/* Info column */
.info{
  border-left: 1px solid var(--border);
  padding-left: 16px;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
@media (max-width: 980px){
  .info{
    border-left: none;
    border-top: 1px solid var(--border);
    padding-top: 14px;
    max-height: 42vh; /* keep room for the stage on mobile */
  }
}

/* Chips, blocks, lists */
.chips{ display:flex; gap:8px; flex-wrap:wrap; margin: 8px 0 }
.chip{ border:1px solid var(--border); padding:6px 10px; border-radius:999px }
.blk{ margin: 12px 0 }
.list{ padding-left: 1.25rem }
.links{ display:grid; gap:6px; padding-left: 1rem }
</style>
