<template>
  <li class="card" :data-type="p.type">
    <!-- Cover Section -->
    <div class="coverWrap">
      <div class="cover" @click="$emit('open', p)" :aria-label="title">
        <img
          v-if="p.cover"
          :src="assetUrl(p.cover!)"
          :alt="`${title} cover`"
          loading="lazy"
          decoding="async"
          sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
          @load="onImageLoad"
          class="media"
          :class="{'loaded': imgLoaded}"
        />
      </div>

      <!-- Meta Information Section -->
      <div class="meta">
        <p class="title">{{ title }}</p>
        <div class="sub">{{ subtitle }}</div>

        <!-- Tech Chips (Stack) -->
        <div class="tech">
          <span
            v-for="t in p.stack || []"
            :key="t"
            class="chip"
            @click="$emit('chip', t)"
            role="button"
            tabindex="0"
            aria-label="Filter by technology: {{ t }}"
          >{{ t }}</span>
        </div>
      </div>
    </div>

    <!-- Outlined View Button -->
    <button class="btn view" @click="$emit('open', p)" aria-label="View Project Details">{{ t('ui.view') ?? 'View' }}</button>
  </li>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { assetUrl } from '@/utils/asset'
import type { Project, Localized } from '@/types'

const props = defineProps<{ p: Project }>()
defineEmits(['open', 'chip'])

const { locale, t } = ((): any => {
  try { return useI18n() } catch { return { locale: { value: 'en' }, t: (k:string) => k } }
})()

function l10n(val?: Localized, fallback = ''): string {
  if (!val) return fallback
  if (typeof val === 'string') return val
  const lang = String(locale.value || 'en').slice(0, 2)
  return val[lang] ?? val.en ?? val.fr ?? fallback
}

const title = computed(() => l10n(props.p.title, ''))
const typeLabel = computed(() => t?.(`types.${props.p.type}`) ?? props.p.type)
const subtitle = computed(() => props.p.year ? `${typeLabel.value} · ${props.p.year}` : typeLabel.value)

const imgLoaded = ref(false)

function onImageLoad() {
  imgLoaded.value = true
}
</script>

<style scoped>
.card {
  list-style: none;
  padding: 20px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--panel);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
  cursor: pointer;
}

.coverWrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  background-color: color-mix(in oklab, var(--brand) 12%, var(--panel));
}

.cover {
  position: relative;
  aspect-ratio: 16/10;
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
}

.cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  opacity: 0;
  transition: opacity 0.3s ease, transform 0.2s ease;
}

.cover img.loaded {
  opacity: 1;
}

.meta .title {
  text-align: center;
  font-weight: 600;
  margin: 6px;
  font-size: 1.25rem;
  color: var(--text);
}

.meta .sub {
  color: var(--muted);
  margin-bottom: 10px;
}

.tech {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 0.875rem;
  background: var(--surface);
  color: var(--muted);
  transition: background 0.3s ease, transform 0.2s ease;
  cursor: pointer;
}

.chip:hover {
  background: color-mix(in oklab, var(--brand) 10%, var(--surface));
  transform: scale(1.05);
}

/* Outlined View Button with Subtle Hover Effects */
.btn {
  border: 1px solid var(--border);
  background: var(--brand-Sec);
  color: white;
  border-radius: 5px; /* Rounded button for sleek design */
  padding: 12px 24px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
  font-weight: 600;
  width: 100%;
  text-align: center;
  font-size: 1rem;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}



.view {
  align-self: flex-start;
}

/* Accessibility Improvements */
.meta .title {
  font-size: 1.4rem;
  line-height: 1.4;
}

.tech .chip {
  cursor: pointer;
  outline: none;
}

.tech .chip:focus {
  box-shadow: 0 0 3px 3px rgba(0, 120, 255, 0.4);
}

/* Media Query for Mobile Responsiveness */
@media (max-width: 768px) {
  .card {
    flex-direction: column;
    gap: 16px;
    padding: 16px;
  }

  .cover {
    width: 100%;
    height: auto;
  }

  .meta {
    text-align: center;
  }

  .btn {
    margin-top: 12px;
  }
}
</style>
