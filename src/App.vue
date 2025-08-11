<template>
  <NavBar />
  <main class="container">
    <HeroSection />
    <AboutSection />
    <ExperienceSection />
    <ProjectsSection />
    <ContactSection />
  </main>
</template>

<script setup lang="ts">
import NavBar from './components/NavBar.vue'
import HeroSection from './sections/HeroSection.vue'
import AboutSection from './sections/AboutSection.vue'
import ExperienceSection from './sections/ExperienceSection.vue'
import ProjectsSection from './sections/ProjectsSection.vue'
import ContactSection from './sections/ContactSection.vue'

</script>

<style>
.container{ max-width: 1120px; margin: 0 auto; padding: 0 16px }
</style>
