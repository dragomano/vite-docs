---
layout: home

title: Vite
titleTemplate: Инструментарий для фронтенда нового поколения

hero:
  name: Vite
  text: Инструментарий для фронтенда нового поколения
  tagline: Приготовьтесь к тому, что среда разработки наконец-то сможет догнать вас.
  image:
    src: /logo-with-shadow.png
    alt: Vite
  actions:
    - theme: brand
      text: Первые шаги
      link: /guide/
    - theme: alt
      text: Почему Vite?
      link: /guide/why
    - theme: alt
      text: Посмотреть на GitHub
      link: https://github.com/vitejs/vite
    - theme: brand
      text: ⚡ ViteConf 24!
      link: https://viteconf.org/?utm=vite-homepage

features:
  - icon: 💡
    title: Мгновенный запуск сервера
    details: Обслуживание файлов по требованию через собственный ESM, не требующий подключения!
  - icon: ⚡️
    title: Молниеносный HMR
    details: Горячая замена модулей (HMR), которая остаётся быстрой независимо от размера приложения.
  - icon: 🛠️
    title: Богатые возможности
    details: Встроенная поддержка TypeScript, JSX, CSS и других языков.
  - icon: 📦
    title: Оптимизированная сборка
    details: Предварительно настроенная сборка Rollup с поддержкой многостраничного режима и режима библиотеки.
  - icon: 🔩
    title: Универсальные плагины
    details: Интерфейс плагина Rollup-superset, разделяемый между dev и build.
  - icon: 🔑
    title: Полностью типизированные API
    details: Гибкие программные API с полной типизацией TypeScript.
---

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get('uwu') != null) {
    const img = document.querySelector('.VPHero .VPImage.image-src')
    img.src = '/logo-uwu.png'
    img.alt = 'Vite Kawaii Logo by @icarusgkx'
  }
})
</script>
