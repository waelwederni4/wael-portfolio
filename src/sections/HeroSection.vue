<template>
  <section id="hero" class="section">
    <div class="wrap">
      <div class="text">
        <p class="muted">{{ $t('hero.hi') }}</p>
        <h1 class="name">{{ profile.name }}</h1>
        <p class="headline">{{ title }}</p>
        <p class="muted">{{ current }}</p>
        <div class="actions">
          <a :href="cvHref" class="btn" target="_blank" rel="noopener">{{ $t('hero.download') }}</a>
          <a href="#contact" class="btn ghost">{{ $t('hero.contact') }}</a>
        </div>
      </div>
      <img class="avatar" :src="portraitUrl" alt="Portrait of Wael Wederni" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { profile } from '@/data/profile'
import { assetUrl } from '@/utils/asset'
const { locale } = useI18n()
const title = computed(() => locale.value === 'fr' ? profile.titleFr : profile.titleEn)
const current = computed(() => locale.value === 'fr' ? profile.currentRoleFr : profile.currentRoleEn)
const portraitUrl = assetUrl('img/portrait.jpg')
const cvHref = computed(() => assetUrl(locale.value === 'fr' ? profile.cv.fr : profile.cv.en))

</script>

<style scoped>
.wrap{ display:flex; align-items:center; justify-content:space-between; gap:24px }
.name{ font-size: clamp(28px, 6vw, 40px); margin: 0 0 8px }
.headline{ font-weight: 600 }
.actions{ display:flex; gap:10px; margin-top: 12px }
.avatar{ width: clamp(140px, 28vw, 220px); border-radius: 16px; border:1px solid var(--border) }
@media (max-width: 920px){ .wrap{ flex-direction:column-reverse; align-items:flex-start } .avatar{ width: 160px } }
</style>
