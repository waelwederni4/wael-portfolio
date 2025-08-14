<template>
  <section id="hero" class="section">
    <div class="wrap">
      <div class="text">
        <p class="intro muted">{{ $t('hero.hi') }}</p>
        <h1 class="name">{{ profile.name }}</h1>

        <!-- Titre animé -->
        <p class="headline" aria-live="polite">
          <span>{{ typedTitle }}</span><span class="caret" aria-hidden="true"></span>
        </p>

        <div class="actions">
          <a :href="cvHref" class="btn primary" target="_blank" rel="noopener">{{ $t('hero.download') }}</a>
          <a href="#contact" class="btn secondary">{{ $t('hero.contact') }}</a>
        </div>
      </div>

      <div class="image-wrapper">
        <img class="avatar" :src="portraitUrl" :alt="`Portrait of ${profile.name}`" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { profile } from '@/data/profile'
import { assetUrl } from '@/utils/asset'

const { locale } = useI18n()

// i18n
const titles = computed(() => (locale.value === 'fr' ? profile.titles.fr : profile.titles.en))
const current = computed(() => (locale.value === 'fr' ? profile.currentRoleFr : profile.currentRoleEn))
const portraitUrl = assetUrl('img/portrait.jpg')
const cvHref = computed(() => assetUrl(locale.value === 'fr' ? profile.cv.fr : profile.cv.en))

// --- Typewriter looping over array ---
const typedTitle = ref('')

const TYPE_DELAY   = 40   // vitesse de frappe (ms/char)
const HOLD_DELAY   = 1200 // pause quand le mot/phrase est complet
const DELETE_DELAY = 20   // vitesse d'effacement
const GAP_DELAY    = 300  // petite pause entre deux éléments

let timeouts: number[] = []
let runId = 0

function clearAll() {
  for (const id of timeouts) clearTimeout(id)
  timeouts = []
}

function wait(ms: number) {
  return new Promise<void>(resolve => {
    const id = window.setTimeout(resolve, ms)
    timeouts.push(id)
  })
}

async function startLoop() {
  const myRun = ++runId
  clearAll()

  const reduced = typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  const list = titles.value?.length ? titles.value : []

  if (!list.length) { typedTitle.value = ''; return }

  if (reduced) {
    // Accessibilité : pas d’animation, on affiche tout d’un coup séparé par " · "
    typedTitle.value = list.join(' · ')
    return
  }

  // Boucle tant que runId n’a pas changé (changement de langue, unmount, etc.)
  for (let i = 0; myRun === runId; i = (i + 1) % list.length) {
    const text = list[i]

    // tape
    typedTitle.value = ''
    for (const ch of text) {
      if (myRun !== runId) return
      typedTitle.value += ch
      await wait(TYPE_DELAY)
    }

    // pause d’affichage
    await wait(HOLD_DELAY)
    if (myRun !== runId) return

    // efface
    while (typedTitle.value.length && myRun === runId) {
      typedTitle.value = typedTitle.value.slice(0, -1)
      await wait(DELETE_DELAY)
    }

    await wait(GAP_DELAY)
  }
}

// redémarre si la langue (donc le tableau) change
watch(titles, () => { startLoop() }, { immediate: true })
onBeforeUnmount(() => clearAll())
</script>


<style scoped lang="scss">
/* General layout */
.wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
  animation: fadeIn 1s ease-out;
}

.text {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 45%;
}

/* Professional Typography */
.name {
  font-size: clamp(28px, 6vw, 40px);
  font-weight: 700;
  color: var(--text);
  margin: 0 0 8px;
}

.headline {
  font-weight: 600;
  color: var(--brand-Sec);
  font-size: 1.5rem;
  margin: 12px 0;
  display: inline-flex;
  align-items: baseline;
  white-space: nowrap; /* évite le saut de ligne pendant la frappe */
}

/* Curseur clignotant */
.caret {
  display: inline-block;
  width: 2px;
  height: 1em;
  margin-left: 4px;
  background: currentColor;
  animation: caret-blink 1s step-end infinite;
}

@keyframes caret-blink {
  50% { opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .caret { display: none; }
}

.current { margin: 8px 0; }

/* Buttons */
.actions {
  display: flex;
  gap: 16px;
  margin-top: 16px;
}

.btn {
  text-decoration: none;
  display: inline-block;
  padding: 12px 24px;
  border-radius: 50px;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: background 0.3s ease, transform 0.3s ease;
}

.primary {
  background-color: var(--brand-Sec);
  color: var(--panel);
  border: 1px solid var(--brand-Sec);
}

.primary:hover { transform: scale(1.05); }
.secondary {
  background-color: transparent;
  color: var(--brand-Sec);
  border: 1px solid var(--brand-Sec);
}
.secondary:hover { transform: scale(1.05); }

/* Avatar */
.image-wrapper { position: relative; }
.avatar {
  width: clamp(140px, 28vw, 220px);
  height: auto;
  border-radius: 50%;
  border: 3px solid var(--border);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

/* Text and Avatar Animation */
@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}

/* Muted text color */
.muted { color: var(--muted); }

/* Responsive */
@media (max-width: 920px) {
  .wrap { flex-direction: column-reverse; align-items: flex-start; }
  .text { max-width: 100%; }
  .avatar { width: 160px; }
}
</style>
