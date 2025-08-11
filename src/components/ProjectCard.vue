<template>
  <li class="card" :data-type="p.type">
    <div class="cover" @click="$emit('open', p)" :aria-label="title">
      <div class="skel" aria-hidden="true"></div>
      <img
        :src="assetUrl(p.cover!)"
        :alt="`${title} cover`"
        loading="lazy"
        decoding="async"
        sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
        @load="($event.target as HTMLElement)?.previousElementSibling?.remove()"
      />
    </div>

    <div class="meta">
      <p class="title">{{ title }}</p>
      <div class="sub">{{ subtitle }}</div>

      <div class="tech">
        <span
          v-for="t in p.stack || []"
          :key="t"
          class="chip"
          @click="$emit('chip', t)"
        >{{ t }}</span>
      </div>
    </div>

    <button class="btn view" @click="$emit('open', p)">{{ $t?.('ui.view') ?? 'View' }}</button>
  </li>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { assetUrl } from '@/utils/asset'
import type { Project, Localized } from '@/types'

const props = defineProps<{ p: Project }>()
defineEmits(['open','chip'])

const { locale, t } = ((): any => {
  try { return useI18n() } catch { return { locale: { value: 'en' }, t: (k:string)=>k } }
})()

function l10n(val?: Localized, fallback = ''): string {
  if (!val) return fallback
  if (typeof val === 'string') return val
  const lang = String(locale.value || 'en').slice(0,2)
  return val[lang] ?? val.en ?? val.fr ?? fallback
}

const title = computed(() => l10n(props.p.title, ''))
const typeLabel = computed(() => t?.(`types.${props.p.type}`) ?? props.p.type)
const subtitle = computed(() => props.p.year ? `${typeLabel.value} · ${props.p.year}` : typeLabel.value)
</script>

<style scoped>
.card{
  list-style:none; padding:8px; border:1px solid var(--border);
  border-radius:12px; background: var(--panel);
  display:flex; flex-direction:column; gap:8px
}
.cover{ position:relative; aspect-ratio: 16/10; overflow:hidden; border-radius:8px; cursor:pointer }
.skel{ position:absolute; inset:0; background:#1a2231; animation:pulse 1.2s infinite alternate }
@keyframes pulse{ from{opacity:.5} to{opacity:.9} }
.cover img{ width:100%; height:100%; object-fit:cover; display:block }
.meta .title{ font-weight:600; margin-bottom:4px }
.meta .sub{ color:var(--muted); margin-bottom:6px }
.tech{ display:flex; flex-wrap:wrap; gap:6px }
.chip{
  border:1px solid var(--border); border-radius:999px; padding:4px 8px; font-size:.85rem;
  background: color-mix(in oklab, var(--panel) 90%, transparent); cursor:pointer
}
.btn{
  border:1px solid var(--border); background: color-mix(in oklab, var(--brand) 14%, transparent);
  color:var(--text); border-radius:10px; padding:8px 12px; cursor:pointer;
  transition:background .2s,border-color .2s
}
.btn:hover{ background: color-mix(in oklab, var(--brand) 22%, transparent) }
.view{ align-self:flex-start }
</style>
