<template>
  <section id="hero" class="section">
    <div class="wrap">
      <div class="text">
        <p class="intro muted">{{ $t('hero.hi') }}</p>
        <h1 class="name">{{ profile.name }}</h1>
        <p class="headline">{{ title }}</p>
        <p class="current muted">{{ current }}</p>
        <div class="actions">
          <a :href="cvHref" class="btn primary" target="_blank" rel="noopener">{{ $t('hero.download') }}</a>
          <a href="#contact" class="btn secondary">{{ $t('hero.contact') }}</a>
        </div>
      </div>
      <div class="image-wrapper">
        <img class="avatar" :src="portraitUrl" alt="Portrait of {{ profile.name }}" />
      </div>
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

<style scoped lang="scss">
/* General layout */
.wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
  animation: fadeIn 1s ease-out;
}

.text {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 45%; /* Ensures the text doesn't take up too much space */
}

/* Professional Typography */
.name {
  font-size: clamp(28px, 6vw, 40px);
  font-weight: 700;
  color: var(--text);
  margin: 0 0 8px;
}

.headline {
  font-weight: 600;
  color: var(--brand-Sec);
  font-size: 1.5rem;
  margin: 12px 0;
}

.current {
  margin: 8px 0;
}

/* Buttons */
.actions {
  display: flex;
  gap: 16px;
  margin-top: 16px;
}

.btn {
  text-decoration: none;
  display: inline-block;
  padding: 12px 24px;
  border-radius: 50px;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: background 0.3s ease, transform 0.3s ease;
}

.primary {
  background-color: var(--brand-Sec);
  color: var(--panel);
  border: 1px solid var(--brand-Sec);
}

.primary:hover {
  background-color: var(--brand-Sec);
  transform: scale(1.05);
}

.secondary {
  background-color: transparent;
  color: var(--brand-Sec);
  border: 1px solid var(--brand-Sec);
}

.secondary:hover {
  background-color: var(--surface);
  transform: scale(1.05);
}

/* Avatar */
.image-wrapper {
  position: relative;
}

.avatar {
  width: clamp(140px, 28vw, 220px);
  height: auto;
  border-radius: 50%;
  border: 3px solid var(--border);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.avatar:hover {
  transform: scale(1.05); /* Slight zoom effect on hover */
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

/* Text and Avatar Animation */
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Muted text color */
.muted {
  color: var(--muted);
}

/* Responsive Design */
@media (max-width: 920px) {
  .wrap {
    flex-direction: column-reverse;
    align-items: flex-start;
  }

  .text {
    max-width: 100%;
  }

  .avatar {
    width: 160px;
  }
}
</style>
  