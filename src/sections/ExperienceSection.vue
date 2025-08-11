<template>
  <section id="exp" class="section">
    <h2>{{ $t('exp.title') }}</h2>

    <ol class="timeline">
      <li v-for="(e, i) in experiences" :key="i">
        <div class="head">
          <strong>{{ l10n(e.role) }}</strong>
          <span class="muted">
            · {{ l10n(e.company) }}
            <template v-if="e.location"> · {{ l10n(e.location) }}</template>
            <template v-if="e.period"> · {{ l10n(e.period) }}</template>
          </span>
        </div>

        <ul class="bullets">
          <li v-for="(b, j) in e.bullets" :key="j">{{ l10n(b) }}</li>
        </ul>

        <div class="stack" v-if="e.stack?.length">
          <span class="tag" v-for="t in e.stack" :key="t">{{ t }}</span>
        </div>
      </li>
    </ol>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { experiences } from '@/data/experience'
import type { Localized } from '@/types'

const { locale } = ((): any => {
  try { return useI18n() } catch { return { locale: { value: 'en' } } }
})()

function l10n(val?: Localized, fallback = ''): string {
  if (!val) return fallback
  if (typeof val === 'string') return val
  const lang = String(locale.value || 'en').slice(0, 2)
  return val[lang] ?? val.en ?? val.fr ?? fallback
}
</script>

<style scoped>
.timeline{ list-style:none; margin:0; padding:0; display:grid; gap:18px }
.bullets{ margin: 8px 0 0 18px }
.stack{ display:flex; flex-wrap:wrap; gap:6px; margin-top:6px }
</style>
