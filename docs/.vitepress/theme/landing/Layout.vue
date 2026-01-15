<script setup>
// these components live in @voidzero-dev/vitepress-theme
import Hero from './Hero.vue'
import ViteFeatureGrid1 from './FeatureGrid1.vue'
import ViteFeatureGrid2 from './FeatureGrid2.vue'
import ViteFrameworks from './Frameworks.vue'
import ViteCommunity from './Community.vue'
/* import TrustedBy from '@components/oss/TrustedBy.vue' */
import HeadingSection from '@components/oss/HeadingSection.vue'
/* import Sponsors from '@components/oss/Sponsors.vue' */
import Spacer from '@components/shared/Spacer.vue'
import Footer from '@components/oss/Footer.vue'
/* import { useSponsor } from '../composables/sponsor'

const { data: sponsors } = useSponsor() */
</script>

<template>
  <Hero />
<!--   <TrustedBy
    :logos="['openai', 'shopify', 'stripe', 'linear', 'clickup', 'wiz']"
  /> -->
  <HeadingSection
    heading="Переосмысление опыта разработчиков"
    subheading="Vite снова упрощает веб-разработку"
  />
  <ViteFeatureGrid1 />
  <HeadingSection heading="Общий фундамент, на котором можно строить" />
  <ViteFeatureGrid2 />
  <HeadingSection heading="Обеспечивает работу ваших любимых фреймворков и инструментов" />
  <ViteFrameworks />
  <ViteCommunity />
  <!-- <Sponsors :sponsors="sponsors" /> -->
  <Spacer />
  <Footer
    heading="Начните сборку с Vite"
    subheading="Встречайте среду разработки, которая наконец сможет поспевать за скоростью вашего мышления."
    button-text="Начать"
    button-link="/guide/"
  />
</template>
