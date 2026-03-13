<script setup>
import Hero from './Hero.vue'
import Timer from './Timer.vue'
import TimeoutSwitcher from './TimeoutSwitcher.vue'
import VideoIframe from './VideoIframe.vue'
import Events from './Events.vue'
import Footer from '@components/oss/Footer.vue'
</script>

<template>
  <TimeoutSwitcher at="2026-03-19T15:00:00.000Z">
    <template #default>
      <Hero />
      <Timer at="2026-03-19T15:00:00.000Z" />
    </template>
    <template #timeout>
      <VideoIframe />
    </template>
  </TimeoutSwitcher>
  <Events />
  <Footer
    heading="Начни разработку с Vite"
    subheading="Подготовься к среде разработки, которая наконец-то поспевает за скоростью твоих мыслей."
    button-text="Начать"
    button-link="/guide/"
  />
</template>
