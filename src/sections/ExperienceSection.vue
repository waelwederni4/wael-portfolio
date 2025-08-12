<template>
  <section id="exp" class="section">
    <h2 class="section-title">{{ $t('exp.title') }}</h2>

    <ol class="timeline">
      <li v-for="(e, i) in experiences" :key="i" class="timeline-item">
        <div class="head">
          <!-- Role (left) -->
          <strong class="role">{{ l10n(e.role) }}</strong>

          <!-- Company and Period (right) -->
          <span class="meta">
            <template v-if="e.company">{{ l10n(e.company) }}</template>
            <template v-if="e.period">
              <span class="sep">·</span>{{ l10n(e.period) }}
            </template>
          </span>
        </div>

        <!-- Bullets list -->
        <ul class="bullets">
          <li v-for="(b, j) in e.bullets" :key="j">{{ l10n(b) }}</li>
        </ul>

        <!-- Stack (tags) -->
        <div class="stack">
          <span v-for="t in e.stack" :key="t" class="tag">{{ t }}</span>
        </div>
      </li>
    </ol>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { experiences } from '@/data/experience'
import type { Localized } from '@/types'

let localeRef: any
try { localeRef = useI18n().locale } catch { localeRef = { value: 'en' } }

const lang = computed(() => String(localeRef?.value ?? 'en').slice(0, 2))

function l10n(val?: Localized, fallback = ''): string {
  if (!val) return fallback
  if (typeof val === 'string') return val
  return val[lang.value] ?? val.en ?? val.fr ?? fallback
}
</script>

<style scoped lang="scss">
/* Section and Title */
.section { 
  padding: 20px 0; 
}

.section-title {
  font-size: 2rem;
  font-weight: 600;
  color: var(--text);
}

/* Timeline Styling */
.timeline {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 18px;
}

.timeline-item {
  position: relative;
}

.head {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 16px;
  align-items: baseline;
}

.role {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--brand-Sec); /* Primary color */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.meta {
  color: var(--muted); /* Muted text color */
  text-align: right;
  font-size: 0.875rem;
}

.meta .sep {
  margin: 0 6px;
  opacity: 0.5;
}

/* Bullets list */
.bullets {
  margin-top: 8px;
  list-style-type: disc;
  padding-left: 24px;
  margin-bottom: 16px;
}

.bullets li {
  font-size: 0.875rem;
  color: var(--text); /* Dark gray */
}

/* Stack (tags) */
.stack {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
}

.tag {
  font-size: 0.875rem;
  background-color: var(--surface);
  color: var(--muted);
  padding: 4px 12px;
  border-radius: 9999px;
  border: 1px solid var(--border);
}

/* Buttons / Chips / Tags Styling */
.btn {
  border: 1px solid var(--border);
  background: color-mix(in oklab, var(--panel) 95%, transparent);
  color: var(--text);
  border-radius: 12px;
  padding: 10px 14px;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.3s, color 0.3s, box-shadow 0.3s;
}

.btn.ghost { 
  background: transparent; 
}

.btn:hover {
  background-color: var(--brand);
  color: var(--panel);
  box-shadow: 0 4px 10px rgba(33, 150, 243, 0.2);
}

.chip {
  border: 1px solid var(--border-Sec);
  padding: 6px 10px;
  border-radius: 999px;
  color: var(--text);
  transition: background-color 0.3s, box-shadow 0.3s;
}

.chip:hover {
  background-color: var(--surface);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.tag:hover {
  color: var(--brand-Sec);
  border-color: var(--brand-Sec);
}

/* Responsive Design for Smaller Screens */
@media (max-width: 640px) {
  .head {
    grid-template-columns: 1fr;
  }
  .meta {
    text-align: left;
  }
}
</style>
