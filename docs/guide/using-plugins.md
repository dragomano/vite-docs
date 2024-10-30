# Использование плагинов {#using-plugins}

Vite можно расширять с помощью плагинов, которые основаны на хорошо разработанном интерфейсе плагинов Rollup с несколькими дополнительными параметрами, специфичными для Vite. Это означает, что пользователи Vite могут полагаться на зрелую экосистему плагинов Rollup, а также иметь возможность расширять функциональность dev-сервера и SSR по мере необходимости.

## Добавление плагина {#adding-a-plugin}

Чтобы использовать плагин, его необходимо добавить в `devDependencies` проекта и включить в массив `plugins` в файле конфигурации `vite.config.js`. Например, для обеспечения поддержки устаревших браузеров можно использовать официальный [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy):

```
$ npm add -D @vitejs/plugin-legacy
```

```js twoslash
// vite.config.js
import legacy from '@vitejs/plugin-legacy'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
})
```

`plugins` также принимает пресеты, включающие несколько плагинов в качестве одного элемента. Это полезно для сложных функций (например, интеграции с фреймворками), которые реализуются с помощью нескольких плагинов. Массив будет внутренне уплощен.

Ложные плагины будут игнорироваться, что можно использовать для простого включения или отключения плагинов.

## Поиск плагинов {#finding-plugins}

:::tip ПРИМЕЧАНИЕ
Vite стремится предоставить поддержку распространённых паттернов веб-разработки из коробки. Прежде чем искать плагин для Vite или совместимый плагин Rollup, ознакомьтесь с [Руководством по возможностям](../guide/features.md). Многие случаи, когда в проекте Rollup может потребоваться плагин, уже охвачены в Vite.
:::

Ознакомьтесь с главой [Плагины](../plugins/) для получения информации об официальных плагинах. Плагины сообщества перечислены в репозитории [awesome-vite](https://github.com/vitejs/awesome-vite#plugins).

Вы также можете найти плагины, которые следуют [рекомендуемым соглашениям](./api-plugin.md#conventions), используя поиск npm [для плагинов Vite](https://www.npmjs.com/search?q=vite-plugin&ranking=popularity) или [для плагинов Rollup](https://www.npmjs.com/search?q=rollup-plugin&ranking=popularity).

## Принудительное упорядочивание плагинов {#enforcing-plugin-ordering}

Для совместимости с некоторыми плагинами Rollup может потребоваться принудительно установить порядок вызова плагина или применять его только во время сборки. Это должно быть деталью реализации для плагинов Vite. Вы можете установить очерёдность плагина с помощью модификатора `enforce`:

- `pre`: вызывать плагин перед основными плагинами Vite
- default: вызывать плагин после основных плагинов Vite
- `post`: вызывать плагин после плагинов сборки Vite

```js twoslash
// vite.config.js
import image from '@rollup/plugin-image'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    {
      ...image(),
      enforce: 'pre',
    },
  ],
})
```

Ознакомьтесь с [Руководством по Plugin API](./api-plugin.md#plugin-ordering) для получения подробной информации.

## Условное применение {#conditional-application}

По умолчанию плагины вызываются как для режима просмотра, так и для сборки. В случаях, когда плагин необходимо применять условно только во время режима просмотра или сборки, используйте свойство `apply`, чтобы вызывать их только во время `'build'` или `'serve'`:

```js twoslash
// vite.config.js
import typescript2 from 'rollup-plugin-typescript2'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    {
      ...typescript2(),
      apply: 'build',
    },
  ],
})
```

## Создание плагинов {#building-plugins}

Посмотрите [Руководство по Plugin API](./api-plugin.md) для получения информации о создании плагинов.
