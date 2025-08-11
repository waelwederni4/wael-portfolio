<template>
  <section id="about" class="section">
    <h2>{{ $t('about.title') }}</h2>
    <p class="muted">{{ about }}</p>
    <h3 class="mt">{{ $t('about.skills') }}</h3>
    <div class="chips"><span class="chip" v-for="s in allSkills" :key="s">{{ s }}</span></div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { profile } from '@/data/profile'
import { skills } from '@/data/skills'
const { locale } = useI18n()
const about = computed(() => locale.value === 'fr' ? profile.aboutFr : profile.aboutEn)
const allSkills = computed(() => [...skills.languages, ...skills.technologies, ...skills.tools])
</script>

<style scoped>
.mt{ margin-top: 22px }
.chips{ display:flex; flex-wrap:wrap; gap:8px; margin-top: 8px }
</style>
