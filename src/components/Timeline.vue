<template>
  <section class="timeline">
    <h2>{{ title }}</h2>
    <ul class="list">
      <li v-for="(item, i) in items" :key="i">
        <div class="head">
          <strong>{{ 'role' in item ? item.role : item.degree }}</strong>
          <span class="muted"> · {{ item.period }}</span>
        </div>
        <div class="sub">
          {{ 'company' in item ? item.company : item.school }}
          <span v-if="'location' in item && item.location" class="muted"> — {{ item.location }}</span>
        </div>
        <ul v-if="'bullets' in item && item.bullets?.length" class="bullets">
          <li v-for="b in item.bullets" :key="b">{{ b }}</li>
        </ul>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
defineProps<{ title: string; items: any[] }>()
</script>

<style scoped>
.timeline{margin-top:10px}
.list{list-style:none;margin:0;padding:0;display:grid;gap:14px}
.head{font-size:16px}
.sub{color:var(--muted)}
.bullets{margin:6px 0 0 16px}
.muted{color:var(--muted)}
</style>
