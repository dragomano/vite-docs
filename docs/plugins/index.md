# Плагины {#plugins}

:::tip ПРИМЕЧАНИЕ
Vite стремится обеспечить поддержку распространённых паттернов веб-разработки из коробки. Прежде чем искать плагин Vite или совместимый Rollup-плагин, ознакомьтесь с главой [Возможности](../guide/features.md). Многие случаи, когда плагин может понадобиться в проекте Rollup, уже покрываются в Vite.
:::

Ознакомьтесь с информацией об [использовании плагинов](../guide/using-plugins).

## Официальные плагины {#official-plugins}

### [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue)

Обеспечивает поддержку однофайловых компонентов Vue 3.

### [@vitejs/plugin-vue-jsx](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx)

Обеспечивает поддержку Vue 3 JSX через [специальную трансформацию Babel](https://github.com/vuejs/jsx-next)).

### [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react)

Использует [Oxc Transformer](https://oxc.rs/docs/guide/usage/transformer) и [Babel](https://babeljs.io/), обеспечивая быстрый HMR с небольшим размером пакета и гибкостью использования конвейера трансформаций Babel. Без дополнительных плагинов Babel используется только Oxc Transformer.

### [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react-swc)

Заменяет Babel на [SWC](https://swc.rs/) во время разработки. Во время production-сборки при использовании плагинов применяются SWC + Oxc Transformer, в остальных случаях — только Oxc Transformer. Для крупных проектов с кастомными плагинами первоначальный запуск и горячая замена модулей (HMR) могут стать значительно быстрее, если плагин также доступен для SWC.

### [@vitejs/plugin-rsc](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-rsc)

Vite поддерживает [React Server Components (RSC)](https://react.dev/reference/rsc/server-components) через плагин. Он использует [Environment API](/guide/api-environment) для предоставления низкоуровневых примитивов, которые фреймворки React могут использовать для интеграции функций RSC. Вы можете попробовать минимальное автономное приложение RSC с помощью:

```bash
npm create vite@latest -- --template rsc
```

Ознакомьтесь с [документацией плагина](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-rsc), чтобы узнать больше.

### [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy)

Обеспечивает поддержку устаревших браузеров в продакшен-сборке.

## Плагины сообщества {#community-plugins}

Загляните на [awesome-vite](https://github.com/vitejs/awesome-vite#plugins) — там вы также можете отправить PR со списком своих плагинов.

## Rolldown Builtin Plugins {#rolldown-builtin-plugins}

Vite использует [Rolldown](https://rolldown.rs/) под капотом, и он предоставляет несколько встроенных плагинов для типичных сценариев.

Подробности — в разделе [Rolldown Builtin Plugins](https://rolldown.rs/builtin-plugins/).

## Плагины Rollup {#rollup-plugins}

[Плагины Vite](../guide/api-plugin) — это расширение интерфейса плагинов Rollup. Ознакомьтесь с главой [Совместимость плагинов Rollup](../guide/api-plugin#rollup-plugin-compatibility) для получения дополнительной информации.
