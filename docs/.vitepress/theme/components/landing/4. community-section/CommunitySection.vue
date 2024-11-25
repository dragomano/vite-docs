<script setup lang="ts">
import CommunityCard, { Testimonial } from './CommunityCard.vue'
import placeholderAvatar from '/images/community/placeholder.jpg'

const testimonials: Testimonial[] = [
  {
    name: 'Райан Карниато',
    handle: '@RyanCarniato',
    avatar:
      'https://pbs.twimg.com/profile_images/1810837163447308292/8Piov0f6_400x400.jpg',
    comment: [
      `Мне нравится то, что позволяет делать Vite. Мы обнаружили, что при создании SolidStart это скорее не метафреймворк, а система симбиотических плагинов Vite. Хотя он разработан с учётом SolidJS, он должен масштабироваться от нашего самого простого шаблона до более сложного старта. Мы строим экосистему на базе Vite.`,
    ],
  },
  {
    name: 'Рич Харрис',
    handle: '@Rich_Harris',
    avatar:
      'https://pbs.twimg.com/profile_images/557940120184041473/bFyXy8Pu_400x400.jpeg',
    comment: [
      `Vite на данный момент — это, по сути, Организация Объединённых Наций JavaScript. Я буду там в качестве представителя Svelte-ландии.`,
    ],
  },
  {
    name: 'Дэвид Ист',
    handle: '@_davideast',
    avatar:
      'https://pbs.twimg.com/profile_images/1691627325794725888/voQFcYjY_400x400.jpg',
    comment: [
      'Каждый раз, когда я использую Vite, я испытываю истинное чувство чистой и безудержной радости.',
    ],
  },
  {
    name: 'Марк Далглиш',
    handle: '@markdalgleish',
    avatar:
      'https://pbs.twimg.com/profile_images/754886061872979968/BzaOWhs1_400x400.jpg',
    comment: [
      `Это также отличная платформа для создания фреймворка, так как она предоставляет настраиваемую среду разработки. Сообщество тоже потрясающее.`,
    ],
  },
  {
    name: 'Джейсон Миллер',
    handle: '@_developit',
    avatar:
      'https://pbs.twimg.com/profile_images/1374778373239681025/Sc9ehtAr_400x400.jpg',
    comment: [
      `Каждый раз, когда я подозреваю, что достиг пределов возможностей Vite, я оказываюсь не прав.`,
    ],
  },
  {
    name: 'Дэвид Кремер',
    handle: '@zeeg',
    avatar:
      'https://pbs.twimg.com/profile_images/1706891973553168384/zdAPOznc_400x400.jpg',
    comment: ['Vite стал настоящей революцией для индустрии.'],
  },
  {
    name: 'Дион Алмаер',
    handle: '@dalmaer',
    avatar:
      'https://pbs.twimg.com/profile_images/3380865881/f73b3687ff39b795db05fcaf35972270_400x400.jpeg',
    comment: [
      'Я так рад видеть, как множество отличных фреймворков объединяются на базе Vite. Многие получат от этого пользу. ❤️ Команде Vite.',
    ],
  },
  {
    name: 'Кристоф Наказава',
    handle: '@cpojer',
    avatar:
      'https://pbs.twimg.com/profile_images/1189537722286952449/OrscO0bD_400x400.jpg',
    comment: ['Vite собирается покорить (JavaScript) мир.'],
  },
  {
    name: 'Николай',
    handle: '@lopugit',
    avatar: 'https://avatars.githubusercontent.com/u/13629190?v=4',
    comment: [
      'Вау, вау, вау, вау, вау, вау, Vite — это..... Vite — это.... Вау 🤤🤯🙏',
    ],
  },
]
</script>

<template>
  <section class="community-section">
    <h2>Пользуется любовью сообщества</h2>
    <h3>
      Не верьте нам на слово — почитайте, что пишут участники сообщества Vite.
    </h3>
    <div class="community-grid-container">
      <div class="community-grid">
        <CommunityCard
          :testimonial="testimonial"
          v-for="testimonial in testimonials"
          :key="testimonial.name"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.community-section {
  margin-top: 140px;
  display: none;

  @media (min-width: 768px) {
    display: block;
  }

  h2 {
    background: linear-gradient(0deg, #fff 0%, rgba(255, 255, 255, 0.76) 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0 auto 10px;
    text-align: center;
  }

  h3 {
    width: 455px;
    max-width: 100%;
    margin: 0 auto;
    text-align: center;
  }

  .community-grid-container {
    position: relative;
  }

  .community-grid {
    column-count: 2;
    column-gap: 25px;
    width: calc(100% - 50px);
    margin: 40px auto 0;

    @media (min-width: 1150px) {
      column-count: 3;
      width: 1100px;
    }
  }
}
</style>
