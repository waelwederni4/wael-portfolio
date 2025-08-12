<template>
  <section id="about" class="section">
    <h2 class="section-title">{{ $t('about.title') }}</h2>
    <p class="muted">{{ about }}</p>
    <h3 class="mt">{{ $t('about.skills') }}</h3>
    <div class="chips">
      <span class="chip" v-for="s in allSkills" :key="s">{{ s }}</span>
    </div>
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

<style scoped lang="scss">

/* Section Title */
.section-title {
  font-size: 2rem;
  font-weight: 600;
  color: var(--text); /* Main text color */
}

/* Description Text */
.muted {
  color: var(--muted); /* Muted text color */
  font-size: 1rem;
  margin-bottom: 16px;
}

/* Skillset Heading */
.mt {
  margin-top: 22px;
  font-weight: 600;
  color: var(--text); /* Heading color */
}

/* Chips Container (Skills) */
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
}

/* Individual Chip Styling */
.chip {
  padding: 6px 12px;
  border-radius: 9999px;
  background-color: var(--surface);
  color: var(--text);
  border: 1px solid var(--border-P);
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

/* Chip Hover Effect */
.chip:hover {
  background-color: var(--brand-Sec);
  color: var(--panel);
  transform: scale(1.05);
}

/* Responsive Layout for Smaller Screens */
@media (max-width: 640px) {
  .chips {
    gap: 8px;
  }

  .chip {
    font-size: 0.75rem;
  }
}
</style>
