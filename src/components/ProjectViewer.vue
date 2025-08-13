<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="pv-overlay"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="ids.title"
      :aria-describedby="ids.desc"
      @mousedown.self="handleBackdrop"
    >
      <!-- Focus trap sentinels -->
      <button ref="sentinelStart" class="sr-only" @focus="focusLast" aria-hidden="true" />

      <!-- Header -->
      <header class="pv-header">
        <div class="left">
          <span class="dot" :data-type="p?.type" aria-hidden="true" />
          <strong class="title" :id="ids.title">{{ title }}</strong>
          <small v-if="p?.year" class="muted">· {{ p!.year }}</small>
        </div>
        <div class="right">
          <a
            v-if="p?.links?.demo"
            class="btn ghost"
            :href="p.links.demo"
            target="_blank"
            rel="noopener"
            :aria-label="t('ui.demo') || 'Demo'"
          >{{ t('ui.demo') || 'Demo' }}</a>
          <a
            v-if="p?.links?.company"
            class="btn ghost"
            :href="p.links.company"
            target="_blank"
            rel="noopener"
            :aria-label="t('ui.company') || 'Company'"
          >{{ t('ui.company') || 'Company' }}</a>
          <a
            v-if="p?.links?.playstore"
            class="btn ghost"
            :href="p.links.playstore"
            target="_blank"
            rel="noopener"
            :aria-label="t('ui.playstore') || 'Store'"
          >{{ t('ui.playstore') || 'Store' }}</a>
          <a
            v-if="p?.links?.appstore"
            class="btn ghost"
            :href="p.links.appstore"
            target="_blank"
            rel="noopener"
            :aria-label="t('ui.appstore') || 'Store'"
          >{{ t('ui.appstore') || 'Store' }}</a>
          <button
            ref="closeBtn"
            class="btn"
            type="button"
            @click="emit('close')"
            :aria-label="t('ui.close') || 'Close'"
          >
            ✕
          </button>
        </div>
      </header>

      <!-- Main -->
      <main class="pv-main">
        <!-- Viewer column -->
        <section class="viewer" :aria-labelledby="ids.title">
          <div class="stage" ref="stageEl">
            <button class="arrow left" type="button" @click="prevMedia" :disabled="!hasMedia" aria-label="Previous">
              ‹
            </button>

            <!-- Media area -->
            <div class="media-box"
                 ref="mediaBoxEl"
                 @pointerdown="onPointerStart"
                 @wheel.passive="onWheel"
                 :data-zoomed="isZoomed ? 'true' : 'false'">

              <!-- VIDEO -->
              <video
                v-if="isVideo"
                key="vid"
                class="media"
                :poster="(currentMedia as any)?.poster"
                controls
                autoplay
                muted
                loop
                playsinline
                draggable="false"
              >
                <source :src="src" type="video/mp4" />
              </video>

              <!-- IMAGE -->
              <figure v-else key="img" class="media-wrapper">
                <img
                  ref="imgEl"
                  class="media"
                  :src="src"
                  :alt="caption || title"
                  loading="lazy"
                  decoding="async"
                  draggable="false"
                  @load="onImgLoad"
                  @error="onImgError"
                  :style="imgStyle"
                />
                <figcaption v-if="caption" class="caption-text">{{ caption }}</figcaption>
                <div v-show="!imgLoaded" class="loader" aria-hidden="true" />
              </figure>

              <!-- Hint when zoomed -->
              <div v-if="isZoomed" class="hint" role="status">{{ t('ui.dragToPan') || 'Drag to pan · Double‑click to reset' }}</div>
            </div>

            <button class="arrow right" type="button" @click="nextMedia" :disabled="!hasMedia" aria-label="Next">
              ›
            </button>
          </div>

          <div class="meta" aria-live="polite">
            <span v-if="caption" class="caption">{{ caption }}</span>
            <span class="counter">{{ mIndex + 1 }} / {{ p!.media!.length }}</span>
          </div>

          <!-- Filmstrip -->
          <div
            v-if="(p?.media?.length || 0) > 1"
            class="filmstrip"
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
              :aria-label="`${t('ui.openMedia') || 'Open media'} ${i+1}`"
              :aria-pressed="i===mIndex"
              type="button"
            >
              <template v-if="m.type==='video'">🎬</template>
              <img v-else :src="assetUrl(m?.src || '')" :alt="title" loading="lazy" decoding="async" />
            </button>
          </div>
        </section>

        <!-- Info column -->
        <aside class="info" :class="{ visible: isInfoVisible }">
          <p class="muted" v-if="p?.period" :id="ids.desc">{{ l10n(p!.period) }}</p>

          <div class="chips">
            <span class="chip">{{ typeLabel }}</span>
            <span v-if="p?.year" class="chip">{{ p!.year }}</span>
            <span v-for="tch in p?.stack || []" :key="tch" class="chip" @click="emit('chip', tch)">{{ tch }}</span>
          </div>

          <div v-if="p?.desc" class="blk">
            <h3>{{ t('ui.overview') || 'Overview' }}</h3>
            <p class="muted">{{ l10n(p!.desc) }}</p>
          </div>

          <div v-if="(p?.highlights?.length || 0) > 0" class="blk">
            <h3>{{ t('ui.highlights') || 'Highlights' }}</h3>
            <ul class="list">
              <li v-for="(h, i) in (p!.highlights as any)" :key="i">{{ l10n(h as any) }}</li>
            </ul>
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
      <div class="backdrop" :class="{ visible: isInfoVisible }" @click="closeInfo"></div>
      <button v-if="!isInfoVisible" class="show-info-btn" @click="toggleInfo">
        Show Info
      </button>
      <button ref="sentinelEnd" class="sr-only" @focus="focusFirst" aria-hidden="true" />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { assetUrl } from '@/utils/asset'
import type { Project, Localized, LocalizedList } from '@/types'
import { info } from 'console';


const props = defineProps<{ show: boolean; p: Project | null }>()
const emit = defineEmits<{ (e:'close'): void; (e:'chip', v:string): void }>() 
const isInfoVisible = ref(true);

/* i18n safe */
const { locale, t } = ((): any => { try { return useI18n() } catch { return { locale: { value: 'en' }, t: (k:string)=>k } } })()

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
  return (val as any)[lang] ?? (val as any).en ?? Object.values(val as any)[0] ?? []
}
function toggleInfo() {
  isInfoVisible.value = true;
}
function closeInfo() {
  isInfoVisible.value = false
}

/* IDs for ARIA association */
const ids = {
  title: `pv-title-${Math.random().toString(36).slice(2)}`,
  desc:  `pv-desc-${Math.random().toString(36).slice(2)}`
}

/* Derived labels */
const title = computed(() => props.p ? l10n(props.p.title) : '')
const typeLabel = computed(() => props.p ? (t?.(`types.${props.p.type}`) ?? props.p.type) : '')

/* Media state */
const hasMedia = computed(() => (props.p?.media?.length || 0) > 0)
const mIndex = ref(0)
const currentMedia = computed(() => props.p?.media?.[mIndex.value] || null)
const isVideo = computed(() => currentMedia.value?.type === 'video')
const caption = computed(() => currentMedia.value ? l10n((currentMedia.value as any).caption) : '')
const src = computed(() => currentMedia.value ? assetUrl(currentMedia.value.src || '') : '')

/* Lists */
const rolesList = computed(() => l10nList(props.p?.roles as any))
const teamList = computed(() => l10nList(props.p?.team as any))
const achievementsList = computed(() => l10nList(props.p?.achievements as any))

/* Image loading and preloading */
const imgLoaded = ref(false)
const preloadNext = ref<HTMLImageElement | null>(null)
const preloadPrev = ref<HTMLImageElement | null>(null)

watch(currentMedia, () => {
  imgLoaded.value = isVideo.value ? true : false
  // Preload neighbours (images only)
  if (!props.p) return
  const n = props.p.media?.length || 0
  if (!n) return
  const nextI = (mIndex.value + 1) % n
  const prevI = (mIndex.value - 1 + n) % n
  const nextM = props.p.media?.[nextI]
  const prevM = props.p.media?.[prevI]
  if (nextM && nextM.type !== 'video') {
    preloadNext.value = new Image();
    preloadNext.value.src = assetUrl(nextM.src || '')
  }
  if (prevM && prevM.type !== 'video') {
    preloadPrev.value = new Image();
    preloadPrev.value.src = assetUrl(prevM.src || '')
  }
})
function onImgLoad(){ imgLoaded.value = true }
function onImgError(){ imgLoaded.value = true }

/* Zoom & pan (images only) */
const mediaBoxEl = ref<HTMLElement | null>(null)
const imgEl = ref<HTMLImageElement | null>(null)
const isZoomed = ref(false)
const scale = ref(1)
const tx = ref(0)
const ty = ref(0)

function resetZoom(){ scale.value = 1; tx.value = 0; ty.value = 0; isZoomed.value = false }
function clampPan(nx:number, ny:number){
  const img = imgEl.value
  const box = mediaBoxEl.value
  if (!img || !box) return { x: nx, y: ny }
  const bw = box.clientWidth, bh = box.clientHeight
  const iw = img.naturalWidth * scale.value
  const ih = img.naturalHeight * scale.value
  const maxX = Math.max(0, (iw - bw) / 2)
  const maxY = Math.max(0, (ih - bh) / 2)
  return { x: Math.max(-maxX, Math.min(maxX, nx)), y: Math.max(-maxY, Math.min(maxY, ny)) }
}
const imgStyle = computed(() => ({ transform: `translate3d(${tx.value}px, ${ty.value}px, 0) scale(${scale.value})` }))

function onWheel(e: WheelEvent){
  if (!imgEl.value || isVideo.value) return
  const delta = Math.sign(e.deltaY)
  const prev = scale.value
  const next = Math.max(1, Math.min(3, prev * (delta > 0 ? 0.92 : 1.08)))
  if (next === prev) return
  scale.value = next
  isZoomed.value = scale.value > 1
}

/* Pointer interactions: swipe for nav; drag to pan when zoomed; double click to toggle zoom */
interface P { x:number; y:number; id:number }
const pointers = new Map<number, P>()
let swipeDX = 0, swipeDY = 0
let panStart = { x:0, y:0 }

function onPointerStart(e: PointerEvent){
  const box = e.currentTarget as HTMLElement
  box.setPointerCapture?.(e.pointerId)
  pointers.set(e.pointerId, { id:e.pointerId, x:e.clientX, y:e.clientY })
  swipeDX = 0; swipeDY = 0
  panStart = { x: tx.value, y: ty.value }

  const move = (ev: PointerEvent)=>{ 
    const prev = pointers.get(ev.pointerId)
    pointers.set(ev.pointerId, { id:ev.pointerId, x:ev.clientX, y:ev.clientY })
    const dx = ev.clientX - (prev?.x ?? ev.clientX)
    const dy = ev.clientY - (prev?.y ?? ev.clientY)
    swipeDX += dx; swipeDY += dy
    if (!isVideo.value && isZoomed.value) {
      const clamped = clampPan(panStart.x + swipeDX, panStart.y + swipeDY)
      tx.value = clamped.x; ty.value = clamped.y
    }
  }
  const up = (ev: PointerEvent)=>{
    pointers.delete(e.pointerId)
    box.releasePointerCapture?.(e.pointerId)
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', up)

    if (!isVideo.value && !isZoomed.value) {
      if (Math.abs(swipeDX) > 60 && Math.abs(swipeDX) > Math.abs(swipeDY)) {
        swipeDX < 0 ? nextMedia() : prevMedia()
      }
    }
  }
  window.addEventListener('pointermove', move, { passive:true })
  window.addEventListener('pointerup', up,   { passive:true })
}

function onDblClick(){
  if (isVideo.value) return
  if (isZoomed.value) { resetZoom() } else { scale.value = 2; isZoomed.value = true }
}

/* Media navigation */
function nextMedia(){ if (!hasMedia.value || !props.p) return; mIndex.value = (mIndex.value + 1) % props.p.media!.length; thumbIntoView(); resetZoom() }
function prevMedia(){ if (!hasMedia.value || !props.p) return; mIndex.value = (mIndex.value - 1 + props.p.media!.length) % props.p.media!.length; thumbIntoView(); resetZoom() }
function goMedia(i:number){ if (!hasMedia.value) return; mIndex.value = i; thumbIntoView(); resetZoom() }

/* Filmstrip drag-scroll with momentum */
const thumbsEl = ref<HTMLElement|null>(null)
async function thumbIntoView(){
  await nextTick()
  const el = thumbsEl.value?.querySelectorAll<HTMLElement>('.thumb')?.[mIndex.value]
  el?.scrollIntoView({ behavior:'smooth', inline:'center', block:'nearest' })
}
let ts = { active:false, x:0, scroll:0, vx:0, raf:0 as number|0 }
function onThumbsPointerDown(e: PointerEvent){
  const el = thumbsEl.value; if (!el) return
  ts.active = true; ts.x = e.clientX; ts.scroll = el.scrollLeft; ts.vx = 0
  ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
  cancelAnimationFrame(ts.raf as number)
}
function onThumbsPointerMove(e: PointerEvent){ if (!ts.active) return; const el = thumbsEl.value; if (!el) return; const dx = e.clientX - ts.x; el.scrollLeft = ts.scroll - dx; ts.vx = dx }
function onThumbsPointerUp(){ if (!ts.active) return; ts.active = false; const el = thumbsEl.value; if (!el) return; let v = -ts.vx; const step=()=>{ if (Math.abs(v) < 0.3 || !el) return; el.scrollLeft += v; v *= 0.92; ts.raf = requestAnimationFrame(step) }; ts.raf = requestAnimationFrame(step) }

/* Page scroll lock + keys + focus trap */
let savedY = 0
function lockPage(){ savedY = window.scrollY || 0; document.documentElement.classList.add('has-overlay'); document.body.classList.add('has-overlay'); document.body.style.top = `-${savedY}px` }
function unlockPage(){ document.documentElement.classList.remove('has-overlay'); document.body.classList.remove('has-overlay'); document.body.style.top = ''; window.scrollTo(0, savedY) }

function onKey(e: KeyboardEvent){
  if (!props.show) return
  if (e.key === 'Escape') emit('close')
  if (e.key === 'ArrowRight') nextMedia()
  if (e.key === 'ArrowLeft')  prevMedia()
  if (e.key === 'Home') goMedia(0)
  if (e.key === 'End' && props.p?.media?.length) goMedia(props.p.media.length - 1)
  if (e.key === 'Enter' && !isVideo.value) onDblClick()
}

function handleBackdrop(){ emit('close') }

const closeBtn = ref<HTMLButtonElement|null>(null)
const sentinelStart = ref<HTMLButtonElement|null>(null)
const sentinelEnd = ref<HTMLButtonElement|null>(null)
function focusFirst(){ closeBtn.value?.focus() }
function focusLast(){ sentinelEnd.value?.focus() }

watch(() => props.show, async (v) => {
  if (v) {
    lockPage(); mIndex.value = 0; await nextTick(); closeBtn.value?.focus(); window.addEventListener('keydown', onKey)
  } else {
    unlockPage(); window.removeEventListener('keydown', onKey); resetZoom()
  }
})
watch(() => props.p, () => { mIndex.value = 0; resetZoom() })

/* Ensure double-click toggles zoom only on images */
const stageEl = ref<HTMLElement | null>(null)

onMounted(() => {
  if (props.show) lockPage()
  mediaBoxEl.value?.addEventListener('dblclick', onDblClick)
})

onBeforeUnmount(() => {
  
  unlockPage();
  window.removeEventListener('keydown', onKey);
  mediaBoxEl.value?.removeEventListener('dblclick', onDblClick);
})
</script>

<style scoped>
/* Screen-reader only */
.sr-only {
  position: absolute !important;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.pv-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  color: var(--text);
  height: 100vh; /* Ensure full height */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: radial-gradient(1200px 60% at 80% -10%, color-mix(in oklab, var(--brand) 8%, transparent), transparent 60%),
              linear-gradient(180deg, color-mix(in oklab, var(--panel) 92%, transparent) 0%, color-mix(in oklab, var(--panel) 96%, transparent) 12%, color-mix(in oklab, var(--panel) 98%, transparent) 100%);
}


@supports not (height: 100svh) {
  .pv-overlay {
    height: 100vh;
    min-height: 100vh;
  }
}


/* Header */
.pv-header {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  height: var(--nav-h, 64px);
  padding-left: calc(16px + env(safe-area-inset-left));
  padding-right: calc(16px + env(safe-area-inset-right));
  background: color-mix(in oklab, var(--panel) 98%, transparent);
  border-bottom: 1px solid var(--border);
  backdrop-filter: saturate(1.4) blur(8px);
}

.pv-header .left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.title {
  font-size: 16px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 58vw;
}

.muted {
  color: var(--muted);
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #666;
  display: inline-block;
}

.dot[data-type="mobile"] {
  background: #00bcd4;
}

.dot[data-type="web"] {
  background: #4caf50;
}

.dot[data-type="desktop"] {
  background: #ffc107;
}

.pv-header .right {
  display: flex;
  gap: 8px;
  align-items: center;
}

/* Layout */
.pv-main {
  display: grid;
  grid-template-columns: 1fr minmax(320px, 400px); /* Viewer takes remaining space, aside takes a minimum of 320px */
  height: 100vh;
  overflow: hidden;  /* Prevents page scrolling */
}

/* Modify the .info section to act as a bottom panel on mobile */
@media (max-width: 980px) {
  .pv-main {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr 50px; /* Add space for the toggle button */
    height: 100vh;
  }

  .info {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60vh;
    background: var(--panel);
    border-top: 1px solid var(--border);
    padding: 16px;
    overflow-y: auto;
    transform: translateY(100%); /* Initially hidden */
    transition: transform 0.3s ease;
    z-index: 10;
  }

  .info.visible {
    transform: translateY(0); /* Show info */
  }

  .backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--backdrop);
    z-index: 9; /* Behind the info panel */
    display: none; /* Hidden by default */
  }

  .backdrop.visible {
    display: block; 
  }

  .show-info-btn {
    position: fixed;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    padding: 8px 4px;
    cursor: pointer;
    font-size: 14px;
    border: 1px solid var(--border);
    background: var(--brand-Sec);
    color: white;
    border-radius: 5px; /* Rounded button for sleek design */
    transition: background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
    font-weight: 600;
    width: 80%;
    text-align: center;
    letter-spacing: 0.5px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
}

/* Buttons */
.btn {
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 8px 12px;
  background: color-mix(in oklab, var(--brand) 14%, transparent);
  color: var(--text);
  cursor: pointer;
  transition: background 0.2s;
}

.btn:hover {
  background: color-mix(in oklab, var(--brand) 22%, transparent);
}

.btn.ghost {
  background: transparent;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Viewer */
.viewer {
  display: flex;
  flex-direction: column;
    height: 100%;

  padding: 16px;
  overflow-y: auto;
}

@media (max-width: 980px) {
  .viewer {
    flex-direction: column;
    height: auto;
    overflow: auto;
  }
}

.stage {
  display: grid;
  grid-template-columns: minmax(0, auto) minmax(0, 2fr) minmax(0, auto);
  align-items: center;
  gap: 12px;
  height: 80%;
  background: var(--surface, #0c1018);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: clamp(10px, 2vmin, 16px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.30);
  min-width: 0;
}

.media-box {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80%;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
  touch-action: pan-y;
}

.media-box[data-zoomed="true"] {
  cursor: grab;
}

.media-box[data-zoomed="true"]:active {
  cursor: grabbing;
}

.media {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  object-position: center;
  display: block;
  -webkit-user-drag: none;
  user-select: none;
  pointer-events: auto;
  will-change: transform;
}

.media-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.caption-text {
  margin-top: 8px;
  font-size: 0.85rem;
  color: var(--muted);
  text-align: center;
}

.loader {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  pointer-events: none;
}

.loader::before {
  content: "";
  width: 72%;
  height: 72%;
  border-radius: 12px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.06));
  background-size: 200% 100%;
  animation: shimmer 1.1s linear infinite;
}

@keyframes shimmer {
  0% {
    background-position: 0% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.hint {
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.4);
  color: #fff;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 0.75rem;
}

.arrow {
  border: 1px solid var(--border);
  background: color-mix(in oklab, var(--panel) 72%, transparent);
  color: var(--text);
  border-radius: 12px;
  padding: 10px 12px;
  cursor: pointer;
  min-height: 44px;
  transition: transform 0.15s;
}

.arrow:active {
  transform: scale(0.98);
}

.meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  color: var(--muted);
  padding: 8px 2px;
  flex-wrap: wrap;
}

.caption {
  flex: 1;
  text-align: left;
}

.counter {
  border: 1px dashed var(--border);
  border-radius: 6px;
  padding: 2px 6px;
}

.filmstrip {
  --thumb-w: clamp(72px, 4.4vw, 60px);
  --thumb-h: calc(var(--thumb-w) * 0.66);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  overflow: hidden;
  -webkit-overflow-scrolling: touch;
  padding: 8px 2px 12px;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  cursor: grab;
}

.filmstrip:active {
  cursor: grabbing;
}

.thumb {
  flex: 0 0 var(--thumb-w) !important;
  width: var(--thumb-w) !important;
  height: var(--thumb-h) !important;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: color-mix(in oklab, var(--panel) 70%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  place-items: center;
  cursor: pointer;
  opacity: 0.96;
  transition: border-color 0.2s, box-shadow 0.2s, opacity 0.2s;
  overflow: hidden;
  scroll-snap-align: center;
}

.thumb:hover {
  opacity: 1;
}

.thumb.active {
  border-color: color-mix(in oklab, var(--brand) 55%, var(--border));
  box-shadow: 0 0 0 3px var(--ring) inset;
}

.thumb img {
  width: 50% !important;
  height: 50% !important;
  object-fit: scale-down !important;
  display: block !important;
  max-width: none !important;
  max-height: none !important;
}

.info {
  display: flex;
  flex: 1;
  flex-direction: column;
  border-left: 1px solid var(--border);
  padding: 16px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 8px 0;
}

.chip {
  border: 1px solid var(--border);
  padding: 6px 10px;
  border-radius: 999px;
}

.blk {
  margin: 12px 0;
}

.list {
  padding-left: 1.25rem;
}

.links {
  display: grid;
  gap: 6px;
  padding-left: 1rem;
}

.filmstrip::-webkit-scrollbar {
  height: 6px;
}

.filmstrip::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 6px;
}
</style>
