---
title: Доступен Vite 3.0!
author:
  name: The Vite Team
date: 2022-07-23
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Анонс Vite 3
  - - meta
    - property: og:image
      content: https://vite.dev/og-image-announcing-vite3.png
  - - meta
    - property: og:url
      content: https://vite.dev/blog/announcing-vite3
  - - meta
    - property: og:description
      content: Анонс выпуска Vite 3
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Доступен Vite 3.0! {#vite-3-0-is-out}

_23 июля 2022_ - посмотрите [анонс Vite 4.0](./announcing-vite4.md)

В феврале прошлого года [Эван Ю](https://twitter.com/youyuxi) выпустил Vite 2. С тех пор его использование неуклонно растёт, достигая более 1 миллиона загрузок пакета npm в неделю. После релиза быстро сформировалась обширная экосистема. Vite стал движущей силой обновлённой гонки инноваций в веб-фреймворках. [Nuxt 3](https://v3.nuxtjs.org/) использует Vite по умолчанию. [SvelteKit](https://kit.svelte.dev/), [Astro](https://astro.build/), [Hydrogen](https://hydrogen.shopify.dev/) и [SolidStart](https://docs.solidjs.com/quick-start) все построены на Vite. [Laravel теперь решил использовать Vite по умолчанию](https://laravel.com/docs/9.x/vite). [Vite Ruby](https://vite-ruby.netlify.app/) показывает, как Vite может улучшить DX Rails. [Vitest](https://vitest.dev) успешно развивается как Vite-нативная альтернатива Jest. Vite стоит за новыми функциями тестирования компонентов в [Cypress](https://docs.cypress.io/guides/component-testing/writing-your-first-component-test) и [Playwright](https://playwright.dev/docs/test-components), а Storybook имеет [Vite в качестве официального сборщика](https://github.com/storybookjs/builder-vite). И [список продолжается](https://patak.dev/vite/ecosystem.html). Поддерживающие большинство из этих проектов участвуют в улучшении самого ядра Vite, тесно сотрудничая с [командой](/team) Vite и другими участниками.

![Обложка анонса Vite 3](/og-image-announcing-vite3.png)

Сегодня, спустя 16 месяцев с момента запуска v2, мы рады объявить о выпуске Vite 3. Мы решили выпускать новую мажорную версию Vite как минимум раз в год, чтобы соответствовать [EOL Node.js](https://nodejs.org/en/about/releases/) и воспользоваться возможностью регулярно пересматривать API Vite, обеспечивая при этом короткий путь перехода для проектов в экосистеме.

Быстрые ссылки:

- [Документация](/)
- [Руководство по переходу](https://v3.vite.dev/guide/migration.html)
- [Журнал изменений](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#300-2022-07-13)

Если вы новичок в Vite, мы рекомендуем прочитать раздел [Почему Vite](/guide/why.html). Затем ознакомьтесь с разделами [Начало работы](/guide/) и [Возможности](/guide/features), чтобы увидеть, что Vite предлагает из коробки. Как обычно, мы приветствуем ваши вклады на [GitHub](https://github.com/vitejs/vite). Более [600 человек](https://github.com/vitejs/vite/graphs/contributors) уже помогли улучшить Vite. Следите за обновлениями в [Twitter](https://twitter.com/vite_js) или присоединяйтесь к обсуждениям с другими пользователями Vite на нашем [Discord-сервере](http://chat.vite.dev/).

## Новая документация {#new-documentation}

Перейдите на [vite.dev](https://vite.dev), чтобы насладиться новой документацией v3. Vite теперь использует новую [тему по умолчанию VitePress](https://vitepress.vuejs.org), с потрясающим тёмным режимом и другими функциями.

[![Главная страница документации Vite](../images/v3-docs.png)](https://vite.dev)

Несколько проектов в экосистеме уже мигрировали на нее (см. [Vitest](https://vitest.dev), [vite-plugin-pwa](https://vite-plugin-pwa.netlify.app/) и [VitePress](https://vitepress.vuejs.org/)).

Если вам нужно получить доступ к документации Vite 2, она останется доступной по адресу [v2.vite.dev](https://v2.vite.dev). Также есть новый поддомен [main.vite.dev](https://main.vite.dev), где каждый коммит в основную ветку Vite автоматически разворачивается. Это полезно при тестировании бета-версий или внесении вклада в разработку ядра.

Теперь также доступен официальный испанский перевод, который был добавлен к предыдущим переводам на китайский и японский языки:

- [English](https://vite.dev/)
- [简体中文](https://cn.vite.dev/)
- [日本語](https://ja.vite.dev/)
- [Español](https://es.vite.dev/)

## Создание стартовых шаблонов Vite {#create-vite-starter-templates}

Шаблоны [create-vite](/guide/#trying-vite-online) стали отличным инструментом для быстрого тестирования Vite с вашим любимым фреймворком. В Vite 3 все шаблоны получили новую тему в соответствии с новой документацией. Откройте их онлайн и начните экспериментировать с Vite 3 прямо сейчас:

<div class="stackblitz-links">
<a target="_blank" href="https://vite.new"><img width="75" height="75" src="../images/vite.svg" alt="Vite logo"></a>
<a target="_blank" href="https://vite.new/vue"><img width="75" height="75" src="../images/vue.svg" alt="Vue logo"></a>
<a target="_blank" href="https://vite.new/svelte"><img width="60" height="60" src="../images/svelte.svg" alt="Svelte logo"></a>
<a target="_blank" href="https://vite.new/react"><img width="75" height="75" src="../images/react.svg" alt="React logo"></a>
<a target="_blank" href="https://vite.new/preact"><img width="65" height="65" src="../images/preact.svg" alt="Preact logo"></a>
<a target="_blank" href="https://vite.new/lit"><img width="60" height="60" src="../images/lit.svg" alt="Lit logo"></a>
</div>

<style>
.stackblitz-links {
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
}
@media screen and (max-width: 550px) {
  .stackblitz-links {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    width: 100%;
    gap: 2rem;
    padding-left: 3rem;
    padding-right: 3rem;
  }
}
.stackblitz-links > a {
  width: 70px;
  height: 70px;
  display: grid;
  align-items: center;
  justify-items: center;
}
.stackblitz-links > a:hover {
  filter: drop-shadow(0 0 0.5em #646cffaa);
}
</style>

Теперь тема общая для всех шаблонов. Это должно помочь лучше передать суть этих стартовых шаблонов как минимальных решений для начала работы с Vite. Для более полных решений, включая настройку линтинга, тестирования и другие функции, существуют официальные шаблоны на основе Vite для некоторых фреймворков, таких как [create-vue](https://github.com/vuejs/create-vue) и [create-svelte](https://github.com/sveltejs/kit). Существует также список шаблонов, поддерживаемый сообществом, на [Awesome Vite](https://github.com/vitejs/awesome-vite#templates).

## Улучшения для разработчиков {#dev-improvements}

### Vite CLI {#vite-cli}

<pre style="background-color: var(--vp-code-block-bg);padding:2em;border-radius:8px;max-width:100%;overflow-x:auto;">
  <span style="color:lightgreen"><b>VITE</b></span> <span style="color:lightgreen">v3.0.0</span>  <span style="color:gray">ready in <b>320</b> ms</span>

  <span style="color:lightgreen"><b>➜</b></span>  <span style="color:white"><b>Local</b>:</span>   <span style="color:cyan">http://127.0.0.1:5173/</span>
  <span style="color:green"><b>➜</b></span>  <span style="color:gray"><b>Network</b>: use --host to expose</span>
</pre>

Помимо улучшений эстетики интерфейса командной строки, вы заметите, что порт по умолчанию для сервера разработки теперь 5173, а сервер предпросмотра слушает на порту 4173. Это изменение гарантирует, что Vite будет избегать конфликтов с другими инструментами.

### Улучшенная стратегия подключения WebSocket {#improved-websocket-connection-strategy}

Одной из проблем Vite 2 была настройка сервера при работе через прокси. Vite 3 изменяет схему подключения по умолчанию, чтобы она работала из коробки в большинстве сценариев. Все эти настройки теперь тестируются как часть CI экосистемы Vite через [`vite-setup-catalogue`](https://github.com/sapphi-red/vite-setup-catalogue).

### Улучшения первоначального запуска {#cold-start-improvements}

Теперь Vite избегает полной перезагрузки во время первоначального запуска, когда импорты добавляются плагинами во время обхода первоначально статически импортированных модулей ([#8869](https://github.com/vitejs/vite/issues/8869)).

<details>
  <summary><b>Нажмите, чтобы узнать больше</b></summary>

В Vite 2.9 как сканер, так и оптимизатор работали в фоновом режиме. В лучшем случае, когда сканер находил все зависимости, при первоначальном запуске перезагрузка не требовалась. Но если сканер пропускал зависимость, требовалась новая фаза оптимизации, а затем перезагрузка. Vite смог избежать некоторых из этих перезагрузок в v2.9, так как мы определяли, совместимы ли новые оптимизированные чанки с теми, что имел браузер. Но если была общая зависимость, подчанки могли измениться, и перезагрузка была необходима, чтобы избежать дублирования состояния. В Vite 3 оптимизированные зависимости не передаются браузеру до завершения обхода статически импортированных модулей. Быстрая фаза оптимизации запускается, если есть отсутствующая зависимость (например, добавленная плагином), и только после этого отправляются упакованные зависимости. Таким образом, перезагрузка страницы больше не требуется в этих случаях.

</details>

<img style="background-color: var(--vp-code-block-bg);padding:4%;border-radius:8px;" width="100%" height="auto" src="../images/vite-3-cold-start.svg" alt="Два графика, сравнивающих стратегию оптимизации Vite 2.9 и Vite 3">

### import.meta.glob {#import-meta-glob}

Поддержка `import.meta.glob` была переписана. Узнайте о новых функциях в [Руководстве по глобальному импорту](/guide/features.html#glob-import):

[Несколько шаблонов](/guide/features.html#multiple-patterns) можно передавать в виде массива:

```js
import.meta.glob(['./dir/*.js', './another/*.js'])
```

[Шаблоны исключений](/guide/features.html#negative-patterns) теперь поддерживаются (с префиксом `!`), чтобы игнорировать некоторые конкретные файлы:

```js
import.meta.glob(['./dir/*.js', '!**/bar.js'])
```

[Именованные импорты](/guide/features.html#named-imports) могут быть указаны для улучшения «встряхивания дерева» (tree-shaking):

```js
import.meta.glob('./dir/*.js', { import: 'setup' })
```

[Пользовательские запросы](/guide/features.html#custom-queries) могут быть переданы для добавления метаданных:

```js
import.meta.glob('./dir/*.js', { query: { custom: 'data' } })
```

[Импорты с предзагрузкой](/guide/features.html#glob-import) теперь передаются в виде флага:

```js
import.meta.glob('./dir/*.js', { eager: true })
```

### Приведение импорта WASM в соответствие с будущими стандартами {#aligning-wasm-import-with-future-standards}

API импорта WebAssembly было пересмотрено, чтобы избежать конфликтов с будущими стандартами и сделать его более гибким:

```js
import init from './example.wasm?init'

init().then((instance) => {
  instance.exports.test()
})
```

Узнайте больше в [руководстве по WebAssembly](/guide/features.html#webassembly)

## Улучшения сборки {#build-improvements}

### ESM SSR сборка по умолчанию {#esm-ssr-build-by-default}

Большинство SSR-фреймворков в экосистеме уже использовали ESM-сборки. Поэтому Vite 3 делает ESM форматом по умолчанию для SSR-сборок. Это позволяет нам упростить предыдущие [эвристики внешних зависимостей SSR](/guide/ssr.html#ssr-externals), экстернализируя зависимости по умолчанию.

### Улучшенная поддержка относительного пути {#improved-relative-base-support}

Vite 3 теперь правильно поддерживает относительный путь (с использованием `base: ''`), позволяя развёрнутым ресурсам быть размещёнными на разных путях без повторной сборки. Это полезно, когда путь не известен во время сборки, например, при развёртывании в сетях с адресацией по содержимому, таких как [IPFS](https://ipfs.io/).

## Экспериментальные функции {#experimental-features}

### Тонкая настройка путей к собранным ресурсам (экспериментально) {#built-asset-paths-fine-grained-control-experimental}

Существуют и другие сценарии развёртывания, где этого недостаточно. Например, если сгенерированные хэшированные ресурсы необходимо развернуть на другом CDN, отличном от публичных файлов, требуется более тонкая настройка генерации путей во время сборки. Vite 3 предоставляет экспериментальный API для изменения путей к собранным файлам. Ознакомьтесь с [Расширенными параметрами базовой сборки](/guide/build.html#advanced-base-options) для получения дополнительной информации.

### Оптимизация зависимостей Esbuild во время сборки (экспериментально) {#esbuild-deps-optimization-at-build-time-experimental}

Одно из основных различий между временем разработки и временем сборки заключается в том, как Vite обрабатывает зависимости. Во время сборки используется [`@rollup/plugin-commonjs`](https://github.com/rollup/plugins/tree/master/packages/commonjs), чтобы разрешить импорт зависимостей только CJS (например, React). При использовании сервера разработки вместо этого используется esbuild для предварительной сборки и оптимизации зависимостей, и применяется встроенная схема совместимости при преобразовании пользовательского кода, импортирующего зависимости CJS. В процессе разработки Vite 3 мы внедрили изменения, необходимые для того, чтобы также разрешить использование [esbuild для оптимизации зависимостей во время сборки](https://v3.vite.dev/guide/migration.html#using-esbuild-deps-optimization-at-build-time). Это позволяет избежать использования [`@rollup/plugin-commonjs`](https://github.com/rollup/plugins/tree/master/packages/commonjs), обеспечивая единый подход к обработке зависимостей как во время разработки, так и во время сборки.

Учитывая, что Rollup v3 будет выпущен в ближайшие месяцы, и мы собираемся продолжить с другим крупным обновлением Vite, мы решили сделать этот режим опциональным, чтобы уменьшить объём v3 и дать Vite и экосистеме больше времени для решения возможных проблем с новым подходом совместимости CJS во время сборки. Фреймворки могут переключиться на использование оптимизации зависимостей esbuild во время сборки по умолчанию в своем собственном темпе до выхода Vite 4.

### Частичное принятие HMR (экспериментально) {#hmr-partial-accept-experimental}

Поддержка [частичного принятия HMR](https://github.com/vitejs/vite/pull/7324) доступна по желанию. Эта функция может открыть более тонкую настройку HMR для компонентов фреймворка, которые экспортируют несколько привязок в одном модуле. Вы можете узнать больше в [обсуждении этого предложения](https://github.com/vitejs/vite/discussions/7309).

## Снижение размера пакета {#bundle-size-reduction}

Vite уделяет внимание объёму публикуемого пакета и установленного приложения; быстрая установка нового приложения считается важной функцией. Vite упаковывает большинство своих зависимостей и старается использовать современные легковесные альтернативы, где это возможно. Продолжая эту постоянную цель, размер публикуемого пакета Vite 3 на 30% меньше, чем у v2:

|             | Размер пакета | Размер после установки |
| ----------- | :---------------: | :--------------: |
| Vite 2.9.14 |      4.38 МБ      |     19.1 МБ      |
| Vite 3.0.0  |      3.05 МБ      |     17.8 МБ      |
| Сокращение  |       -30%        |       -7%        |

Отчасти это снижение стало возможным благодаря тому, что некоторые зависимости, которые большинству пользователей не были нужны, были сделаны опциональными. Во-первых, [Terser](https://github.com/terser/terser) больше не устанавливается по умолчанию. Эта зависимость больше не была необходима, поскольку мы уже сделали esbuild минимизатором по умолчанию как для JS, так и для CSS в Vite 2. Если вы используете `build.minify: 'terser'`, вам нужно будет установить его вручную (`npm add -D terser`). Мы также переместили [node-forge](https://github.com/digitalbazaar/forge) из монорепозитория, реализовав поддержку автоматической генерации https-сертификатов с помощью нового плагина: [`@vitejs/plugin-basic-ssl`](https://v3.vite.dev/guide/migration.html#automatic-https-certificate-generation). Поскольку эта функция создает только недоверенные сертификаты, которые не добавляются в локальное хранилище, она не оправдывала увеличенный размер.

## Исправление ошибок {#bug-fixing}

Марафон по сортировке задач был возглавлен [@bluwyoo](https://twitter.com/bluwyoo) и [@sapphi_red](https://twitter.com/sapphi_red), которые недавно присоединились к команде Vite. За последние три месяца количество открытых проблем Vite было сокращено с 770 до 400. И это было достигнуто на фоне рекордного числа новых открытых PR. В то же время [@haoqunjiang](https://twitter.com/haoqunjiang) также составил обширный [обзор задач Vite](https://github.com/vitejs/vite/discussions/8232).

[![График открытых задач и запросов на внесение изменений в Vite](../images/v3-open-issues-and-PRs.png)](https://www.repotrends.com/vitejs/vite)

[![График новых задач и запросов на внесение изменений в Vite](../images/v3-new-open-issues-and-PRs.png)](https://www.repotrends.com/vitejs/vite)

## Примечания по совместимости {#compatibility-notes}

- Vite больше не поддерживает Node.js 12 / 13 / 15, которые достигли конца своей поддержки (EOL). Теперь требуется Node.js 14.18+ / 16+.
- Vite теперь публикуется как ESM, с прокси CJS для ESM-версии для обеспечения совместимости.
- Современная базовая поддержка браузеров теперь нацелена на браузеры, которые поддерживают [встроенные ES-модули](https://caniuse.com/es6-module), [встроенный динамический импорт ESM](https://caniuse.com/es6-module-dynamic-import) и [`import.meta`](https://caniuse.com/mdn-javascript_operators_import_meta).
- Расширения файлов JS в режиме SSR и библиотек теперь используют допустимое расширение (`js`, `mjs` или `cjs`) для выходных JS-записей и чанков в зависимости от их формата и типа пакета.

Узнайте больше в [Руководстве по переходу](https://v3.vite.dev/guide/migration.html).

## Улучшения Vite Core {#upgrades-to-vite-core}

Работая над Vite 3, мы также улучшили опыт сотрудничества для разработчиков [Vite Core](https://github.com/vitejs/vite).

- Модульные и E2E тесты были перенесены в [Vitest](https://vitest.dev), что обеспечивает более быстрый и стабильный опыт разработки. Этот шаг также служит примером для важного инфраструктурного проекта в экосистеме.
- Сборка VitePress теперь тестируется как часть CI.
- Vite обновлен до [pnpm 7](https://pnpm.io/), следуя за остальной экосистемой.
- Площадки были перемещены в [`/playgrounds`](https://github.com/vitejs/vite/tree/main/playground) из директории пакетов.
- Пакеты и площадки теперь имеют `"type": "module"`.
- Плагины теперь упаковываются с использованием [unbuild](https://github.com/unjs/unbuild), а [plugin-vue-jsx](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx) и [plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) были переведены на TypeScript.

## Экосистема готова к v3 {#the-ecosystem-is-ready-for-v3}

Мы тесно сотрудничали с проектами в экосистеме, чтобы убедиться, что фреймворки на базе Vite готовы к Vite 3. [vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci) позволяет нам запускать CI от ведущих игроков в экосистеме и получать своевременные отчёты перед введением регрессии. Выпуск сегодня должен вскоре быть совместим с большинством проектов, использующих Vite.

## Благодарности {#acknowledgments}

Vite 3 является результатом совместных усилий членов [команды Vite](/team), работающих вместе с поддерживающими проекты экосистемы и другими участниками разработки ядра Vite.

Мы хотим поблагодарить всех, кто реализовал функции и исправления, предоставил отзывы и принимал участие в разработке Vite 3:

- Члены команды Vite [@youyuxi](https://twitter.com/youyuxi), [@patak_dev](https://twitter.com/patak_dev), [@antfu7](https://twitter.com/antfu7), [@bluwyoo](https://twitter.com/bluwyoo), [@sapphi_red](https://twitter.com/sapphi_red), [@haoqunjiang](https://twitter.com/haoqunjiang), [@poyoho](https://github.com/poyoho), [@Shini_92](https://twitter.com/Shini_92) и [@retropragma](https://twitter.com/retropragma).
- [@benmccann](https://github.com/benmccann), [@danielcroe](https://twitter.com/danielcroe), [@brillout](https://twitter.com/brillout), [@sheremet_va](https://twitter.com/sheremet_va), [@userquin](https://twitter.com/userquin), [@enzoinnocenzi](https://twitter.com/enzoinnocenzi), [@maximomussini](https://twitter.com/maximomussini), [@IanVanSchooten](https://twitter.com/IanVanSchooten), команда [Astro](https://astro.build/) и все другие поддерживающие проекты фреймворков и плагинов в экосистеме, которые помогли сформировать v3.
- [@dominikg](https://github.com/dominikg) за его работу над vite-ecosystem-ci.
- [@ZoltanKochan](https://twitter.com/ZoltanKochan) за его работу над [pnpm](https://pnpm.io/) и за его оперативность, когда нам нужна была поддержка.
- [@rixo](https://github.com/rixo) за поддержку частичного принятия HMR.
- [@KiaKing85](https://twitter.com/KiaKing85) за подготовку темы к выпуску Vite 3 и [@\_brc_dd](https://twitter.com/_brc_dd) за работу над внутренними компонентами VitePress.
- [@CodingWithCego](https://twitter.com/CodingWithCego) за новый испанский перевод, а также [@ShenQingchuan](https://twitter.com/ShenQingchuan), [@hiro-lapis](https://github.com/hiro-lapis) и других из команд переводчиков на китайский и японский языки за поддержание актуальности переведённой документации.

Мы также хотим поблагодарить отдельных лиц и компании, спонсирующие команду Vite, а также компании, инвестирующие в разработку Vite: часть работы [@antfu7](https://twitter.com/antfu7) над Vite и экосистемой является частью его работы в [Nuxt Labs](https://nuxtlabs.com/), а [StackBlitz](https://stackblitz.com/) нанял [@patak_dev](https://twitter.com/patak_dev) для работы над Vite на полную ставку.

## Что дальше {#what-s-next}

В течение следующих месяцев мы будем работать над обеспечением плавного перехода для всех проектов, построенных на Vite. Поэтому первые минорные обновления будут сосредоточены на продолжении наших усилий по сортировке с акцентом на вновь открытые задачи.

Команда Rollup [работает над своей следующей мажорной версией](https://twitter.com/lukastaegert/status/1544186847399743488), которая будет выпущена в ближайшие месяцы. Как только экосистема плагинов Rollup получит время для обновления, мы выпустим новую мажорную версию Vite. Это даст нам ещё одну возможность внести более значительные изменения в этом году, которые мы могли бы использовать для стабилизации некоторых экспериментальных функций, введённых в этом релизе.

Если вы хотите помочь улучшить Vite, лучший способ присоединиться — это помочь с сортировкой задач. Присоединяйтесь к [нашему Discord](https://chat.vite.dev) и ищите канал `#contributing`. Или участвуйте в нашем `#docs`, помогайте другим в `#help` или создавайте плагины.
