---
title: Доступен Vite 8.1!
author:
  name: The Vite Team
date: 2026-06-23
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Анонс Vite 8.1
  - - meta
    - property: og:image
      content: https://vite-docs.ru/og-image-announcing-vite8-1.webp
  - - meta
    - property: og:url
      content: https://vite-docs.ru/blog/announcing-vite8-1
  - - meta
    - property: og:description
      content: Анонс выпуска Vite 8.1
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Релиз Vite 8.1! {#vite-8-1-is-out}

_23 июня 2026 г._

![Обложка объявления Vite 8.1](/og-image-announcing-vite8-1.webp)

Vite 8 [был выпущен](./announcing-vite8.md) в марте с единым универсальным сборщиком на базе [Rolldown](https://rolldown.rs/), открыв путь для дальнейших улучшений. Сейчас он набирает 41,6 миллиона загрузок в неделю, почти достигнув общего числа загрузок Vite 7. Помимо устранения проблем, возникших при обновлении, мы работали над новыми возможностями и рады объявить о выпуске Vite 8.1.

Быстрые ссылки:

- [Документация](/)
- Переводы: [简体中文](https://cn.vite.dev/), [日本語](https://ja.vite.dev/), [Español](https://es.vite.dev/), [Português](https://pt.vite.dev/), [한국어](https://ko.vite.dev/), [Deutsch](https://de.vite.dev/), [فارسی](https://fa.vite.dev/)
- [Журнал изменений на GitHub](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md)

Попробуйте Vite 8.1 онлайн с помощью [vite.new](https://vite.new) или создайте приложение Vite локально с использованием предпочитаемого фреймворка, выполнив `pnpm create vite`. Дополнительную информацию см. в [руководстве по началу работы](/guide/).

Мы приглашаем вас помочь сделать Vite ещё лучше (присоединившись к более чем [1,2 тыс. контрибьюторам ядра Vite](https://github.com/vitejs/vite/graphs/contributors)), а также развивать наши зависимости, плагины и проекты экосистемы. Подробнее об этом можно узнать в нашем [Руководстве по внесению вклада](https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md). Хороший способ начать — помогать с [разбором новых задач](https://github.com/vitejs/vite/issues), [проверкой пулреквестов](https://github.com/vitejs/vite/pulls), отправлять PR с тестами по открытым задачам, а также помогать другим в [Обсуждениях](https://github.com/vitejs/vite/discussions) или на [форуме поддержки](https://discord.com/channels/804011606160703521/1019670660856942652) сообщества Vite Land. Если у вас есть вопросы, присоединяйтесь к нашему [сообществу в Discord](https://chat.vite.dev) и общайтесь с нами в канале [#contributing](https://discord.com/channels/804011606160703521/804439875226173480).

Следите за новостями и общайтесь с другими разработчиками, использующими Vite, подписавшись на нас в [Bluesky](https://bsky.app/profile/vite.dev), [X](https://twitter.com/vite_js) или [Mastodon](https://webtoo.ls/@vite).

## Возможности {#features}

### Экспериментальный режим разработки со сборкой {#experimental-bundled-dev-mode}

Теперь доступна экспериментальная поддержка режима разработки со сборкой (bundled dev mode). Ранее этот режим назывался «Full Bundle Mode» («режим полной сборки»). Он предназначен для повышения производительности крупных приложений, где большое количество модулей становится узким местом.

В наших первых тестах на приложении, загружающем 10 000 React-компонентов, режим разработки со сборкой обеспечил примерно в 15 раз более быстрый запуск и в 10 раз более быструю полную перезагрузку страницы по сравнению с обычным несобранным dev-сервером, при этом HMR («горячая замена модулей») оставалась мгновенной независимо от размера приложения. Первые тесты на реальных проектах показывают аналогичный прирост: команда Linear отметила ускорение холодного запуска до 3 раз, сокращение времени полной перезагрузки примерно на 40% и уменьшение количества сетевых запросов в 10 раз.

::: details Зачем нужен режим разработки со сборкой?

Vite известен своим подходом с несобранным dev-сервером, который стал одной из главных причин его скорости и популярности после появления проекта. Изначально этот подход был экспериментом, целью которого было проверить, насколько далеко можно продвинуться в повышении производительности сервера разработки без традиционной сборки.

Однако по мере роста размера и сложности проектов стало очевидно, что несобранный подход Vite может ухудшать производительность во время разработки. Поскольку каждый модуль загружается отдельно, браузеру приходится обрабатывать большое количество запросов, что увеличивает накладные расходы при запуске и обновлении страницы. Это особенно заметно в крупных приложениях и ещё сильнее проявляется, когда разработчики работают через сетевой прокси, приводя к более медленным обновлениям и ухудшению процесса разработки.

Режим разработки со сборкой позволяет отдавать собранные файлы не только в продакшене, но и во время разработки, объединяя преимущества обоих подходов:

- быстрый запуск даже для крупных приложений;
- снижение сетевых накладных расходов при обновлении страницы;
- сохранение эффективного HMR поверх ESM-вывода.

:::

В настоящее время этот режим ориентирован на браузерную часть, базовые плагины и основные возможности. Если вы используете сторонний плагин, он может не работать в этом режиме. Если вы используете менее распространённую возможность Vite, она также может не поддерживаться. Мы работаем над расширением поддержки и готовим документацию, которая объяснит, какие изменения могут потребоваться со стороны плагинов. Подробнее о планах развития см. в [документе с описанием архитектуры](https://github.com/vitejs/vite/discussions/22746).

Чтобы включить этот режим, передайте флаг `--experimental-bundle` или добавьте `experimental.bundledDev: true` в файл `vite.config.js`:

```ts [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  experimental: {
    bundledDev: true,
  },
})
```

Поделитесь своими отзывами в [обсуждении](https://github.com/vitejs/vite/discussions/22747).

### Экспериментальная карта импорта чанков {#experimental-chunk-import-map}

В итоговой сборке оператор импорта каждого чанка содержит хеш этого чанка. Это необходимо для того, чтобы при изменении содержимого чанка загружалась его новая версия. Однако из-за этого меняется не только хеш изменённого чанка. Изменяются и хеши чанков, которые ссылаются на него. Затем то же самое происходит со всеми чанками выше по цепочке зависимостей.

```dot
digraph chunk_hash_cascade {
  rankdir=TB
  node [shape=box style="rounded,filled" fontname="Arial" fontsize=11 margin="0.25,0.12" fontcolor="${#3c3c43|#ffffff}" color="${#c2c2c4|#3c3f44}"]
  edge [color="${#67676c|#98989f}" fontname="Arial" fontsize=10 fontcolor="${#67676c|#98989f}"]
  bgcolor="transparent"

  utils [label="utils.[e5f6 → 88xx].js\nконтент изменён" fillcolor="${#fcf4dc|#38301a}" color="${#e0a800|#d4a72c}"]
  page  [label="page.[c3d4 → 77yy].js\nперехеширован по цепочке" fillcolor="${#fde8e8|#3a1f22}" color="${#d5393e|#f66f81}"]
  entry [label="entry.[a1b2 → 99zz].js\nперехеширован по цепочке" fillcolor="${#fde8e8|#3a1f22}" color="${#d5393e|#f66f81}"]

  entry -> page  [label="  импортирует (встраивает хеш)\l" color="${#d5393e|#f66f81}" fontcolor="${#d5393e|#f66f81}"]
  page  -> utils [label="  импортирует (встраивает хеш)\l" color="${#d5393e|#f66f81}" fontcolor="${#d5393e|#f66f81}"]
}
```

Экспериментальная функция карты импорта чанков решает эту проблему с помощью import maps и повышает эффективность кэширования. Эта функция построена на базе возможностей [Rolldown](https://rolldown.rs/reference/InputOptions.experimental#chunkimportmap), но добавляет поддержку специфичных для Vite возможностей. Большое спасибо [Taisei Mima](https://github.com/bhbs) за исследование и первоначальную реализацию этой функции!

Обратите внимание, что `experimental.renderBuiltUrl` в настоящее время не работает при включении этой опции.

Подробнее см. в [руководстве](/guide/features#chunk-import-map-optimization) и в [документации опции](/config/build-options#build-chunkimportmap). Поделитесь своим мнением в [обсуждении](https://github.com/vitejs/vite/discussions/22703).

### Поддержка интеграции Wasm ESM {#wasm-esm-integration-support}

Поддержка [предложения об интеграции Wasm ESM](https://github.com/WebAssembly/esm-integration/blob/main/proposals/esm-integration/README.md) теперь доступна в Vite. Теперь вы можете импортировать wasm-файлы и напрямую использовать экспортированные функции:

```ts
import { add } from './add.wasm'

console.log(add(1, 2)) // 3
```

Большое спасибо [Menci](https://github.com/Menci) за создание и поддержку vite-plugin-wasm на ранних этапах существования предложения, а также за внесение реализации в ядро Vite!

Подробнее см. в [руководстве](/guide/features#esm-integration).

### Ещё один шаг к использованию Lightning CSS по умолчанию {#one-step-closer-to-use-lightning-css-by-default}

Мы совместно с командой Lightning CSS добавили возможности, которые ранее поддерживались PostCSS, но отсутствовали в Lightning CSS. В Vite 8.1 появились две новые возможности:

- Разрешение внешних CSS-файлов, импортируемых внутри CSS-файлов ([lightningcss#479](https://github.com/parcel-bundler/lightningcss/issues/479))
- Регистрация файловых зависимостей через плагины ([lightningcss#877](https://github.com/parcel-bundler/lightningcss/issues/877))

Мы рассматриваем возможность перехода на Lightning CSS как CSS-преобразователь по умолчанию в следующем мажорном релизе. Попробуйте его через [`css.transformer: 'lightningcss'`](/config/shared-options#css-transformer) и поделитесь своим мнением в [обсуждении](https://github.com/vitejs/vite/discussions/13835).

### Регистронезависимое сопоставление в `import.meta.glob` {#case-insensitive-matching-for-import-meta-glob}

`import.meta.glob` теперь поддерживает опцию `caseSensitive` для регистронезависимого сопоставления файлов.

```ts
// matches ./dir/Module1.js
const modules = import.meta.glob('./dir/module*.js', {
  caseSensitive: false,
})
```

### Обнаружение ресурсов для пользовательских HTML-элементов и атрибутов {#asset-discovery-for-custom-html-elements-and-attributes}

Ранее Vite обнаруживал ресурсы только для заранее определённых элементов и атрибутов. Теперь можно использовать опцию [`html.additionalAssetSources`](/config/shared-options#html-additionalassetsources), чтобы добавить дополнительные элементы и атрибуты.

```html
<html-import src="./some/other/file.html"></html-import>
<img
  src="/layout-default.png"
  data-src-dark="/layout-dark.png"
  data-src-light="/layout-light.png"
/>
```

```ts [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  html: {
    additionalAssetSources: {
      'html-import': {
        srcAttributes: 'src',
      },
      img: {
        srcAttributes: ['data-src-dark', 'data-src-light'],
      },
    },
  },
})
```

## Другие изменения {#other-changes}

См. [журнал изменений](https://github.com/vitejs/vite/blob/v8.1.0/packages/vite/CHANGELOG.md), чтобы узнать о других возможностях и исправлениях ошибок.

## Благодарности {#acknowledgments}

Vite 8.1 стал возможен благодаря нашему сообществу участников, сопровождающим проектов экосистемы и [команде Vite](/team). Разработка Vite ведётся компанией [VoidZero](https://voidzero.dev) в партнёрстве с [Bolt](https://bolt.new/) и [Nuxt Labs](https://nuxtlabs.com/). Мы также хотим поблагодарить наших спонсоров на [GitHub Sponsors Vite](https://github.com/sponsors/vitejs) и [Open Collective Vite](https://opencollective.com/vite).
