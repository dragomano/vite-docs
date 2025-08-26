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

Использует esbuild и Babel, что позволяет достичь быстрого HMR при небольшом размере пакета и гибкости использования конвейера преобразований Babel. Без дополнительных плагинов Babel при сборке используется только esbuild.

### [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react-swc)

Заменяет Babel на SWC во время разработки. Во время сборок для продакшена применяются SWC и esbuild при работе с плагинами, а в остальных случаях — только esbuild. Для крупных проектов, не требующих нестандартных расширений React, первоначальный запуск и горячая замена модулей (HMR) могут быть значительно быстрее.

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

## Плагины Rollup {#rollup-plugins}

[Плагины Vite](../guide/api-plugin) — это расширение интерфейса плагинов Rollup. Ознакомьтесь с главой [Совместимость плагинов Rollup](../guide/api-plugin#rollup-plugin-compatibility) для получения дополнительной информации.
