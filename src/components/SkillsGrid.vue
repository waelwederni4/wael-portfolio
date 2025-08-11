<template>
  <section>
    <h2>Skills</h2>
    <ul class="chips">
      <li v-for="s in skills" :key="s" class="chip">{{ s }}</li>
    </ul>

    <h2 style="margin-top:18px">Tools</h2>
    <ul class="chips">
      <li v-for="t in tools" :key="t" class="chip">{{ t }}</li>
    </ul>
  </section>
</template>

<script setup lang="ts">
defineProps<{ skills: string[]; tools: string[] }>()
</script>

<style scoped>
.chips{list-style:none;margin:8px 0 0;padding:0;display:flex;gap:8px;flex-wrap:wrap}
.chip{background:var(--panel);border:1px solid var(--border-P);padding:8px 12px;border-radius:999px}
</style>
