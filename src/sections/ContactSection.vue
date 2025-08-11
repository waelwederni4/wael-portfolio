<template>
  <section id="contact" class="section">
    <h2>{{ $t('contact.title') }}</h2>
    <div class="grid">
      <a class="card" :href="'mailto:' + email"><strong>{{ $t('contact.email') }}</strong><span>{{ email }}</span></a>
      <a class="card" :href="'tel:' + phone1"><strong>{{ $t('contact.phone') }}</strong><span>{{ phone1 }}</span></a>
      <a class="card" :href="'tel:' + phone2"><strong>{{ $t('contact.phone') }}</strong><span>{{ phone2 }}</span></a>
      <a class="card" :href="links.linkedin" target="_blank" rel="noopener"><strong>{{ $t('contact.linkedin') }}</strong><span>{{ links.linkedin }}</span></a>
      <a class="card" :href="links.github" target="_blank" rel="noopener"><strong>{{ $t('contact.github') }}</strong><span>{{ links.github }}</span></a>
    </div>
  </section>
</template>

<script setup lang="ts">
import { profile } from '@/data/profile'
const { email, phone1,phone2, links } = profile
</script>

<style scoped>
.grid{ display:grid; grid-template-columns: repeat(auto-fit, minmax(220px,1fr)); gap:12px; margin-top: 10px }
.card{ display:flex; flex-direction:column; gap:4px; padding:12px; border:1px solid var(--border-P); border-radius:12px; color: var(--text); text-decoration: none; background: var(--panel) }
.card:hover{ transform: translateY(-2px) }
.card span{ color: var(--muted); word-break: break-all }
</style>
