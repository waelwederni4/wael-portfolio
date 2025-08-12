<template>
  <section id="contact" class="section">
    <h2>{{ $t('contact.title') }}</h2>
    <div class="grid">
      <!-- Email -->
      <a class="card" :href="'mailto:' + email">
        <div class="card-header">
          <i class="fas fa-envelope"></i> <!-- Email Icon -->
          <strong>{{ $t('contact.email') }}</strong>
        </div>
        <span>{{ email }}</span>
      </a>
      
      <!-- Primary Phone -->
      <a class="card" :href="'tel:' + phone">
        <div class="card-header">
          <i class="fas fa-phone-alt"></i> <!-- Phone Icon -->
          <strong>{{ $t('contact.phone') }}</strong>
        </div>
        <span>{{ phone }}</span>
      </a>
      
      <!-- LinkedIn -->
      <a class="card" :href="links.linkedin" target="_blank" rel="noopener">
        <div class="card-header">
          <i class="fab fa-linkedin"></i> <!-- LinkedIn Icon -->
          <strong>{{ $t('contact.linkedin') }}</strong>
        </div>
        <span>{{ links.linkedin }}</span>
      </a>
      
      <!-- GitHub -->
      <a class="card" :href="links.github" target="_blank" rel="noopener">
        <div class="card-header">
          <i class="fab fa-github"></i> <!-- GitHub Icon -->
          <strong>{{ $t('contact.github') }}</strong>
        </div>
        <span>{{ links.github }}</span>
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
import { profile } from '@/data/profile'
const { email, phone, links } = profile
</script>

<style scoped lang="scss">
/* Contact Section */
#contact {
  padding: 40px 0;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-top: 20px;
}

/* Card Styling */
.card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px;
  border: 1px solid var(--brand-Sec);
  border-radius: 12px;
  color: var(--text);
  text-decoration: none;
  background: var(--panel);
  transition: transform 0.3s, background 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-4px); /* Slight hover effect */
  background-color: var(--surface); /* Slight background color change on hover */
  box-shadow: 0 4px 12px var(--brand-Sec); /* Box shadow on hover */
}

/* Card Header (Icon + Title) */
.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: var(--brand-Sec); /* Brand color for headings */
}

.card-header i {
  font-size: 18px; /* Icon size */
  color: var(--brand-Sec); /* Brand color for icons */
}

.card span {
  color: var(--muted); /* Muted text for links */
  word-break: break-word;
  font-size: 14px;
}

/* Responsive Layout for Small Screens */
@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr; /* Stack cards vertically on small screens */
  }
}
</style>