---
title: Доступен Vite 5.0!
author:
  name: The Vite Team
date: 2023-11-16
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Анонс Vite 5
  - - meta
    - property: og:image
      content: https://vite.dev/og-image-announcing-vite5.png
  - - meta
    - property: og:url
      content: https://vite.dev/blog/announcing-vite5
  - - meta
    - property: og:description
      content: Анонс выпуска Vite 5
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Доступен Vite 5.0! {#vite-5-0-is-out}

_16 ноября 2023_

![Обложка объявления Vite 5](/og-image-announcing-vite5.png)

Vite 4 [был выпущен](./announcing-vite4.md) почти год назад и стал надёжной основой для экосистемы. Загрузки через npm за неделю увеличились с 2,5 миллиона до 7,5 миллиона, поскольку проекты продолжают строиться на общей инфраструктуре. Фреймворки продолжали развиваться, и на основе [Astro](https://astro.build/), [Nuxt](https://nuxt.com/), [SvelteKit](https://kit.svelte.dev/), [Solid Start](https://www.solidjs.com/blog/introducing-solidstart), [Qwik City](https://qwik.builder.io/qwikcity/overview/) и других мы увидели новые фреймворки, присоединяющиеся и укрепляющие экосистему. Переход [RedwoodJS](https://redwoodjs.com/) и [Remix](https://remix.run/) на Vite открывает путь для дальнейшего принятия в экосистеме React. [Vitest](https://vitest.dev) продолжал расти ещё более быстрыми темпами, чем Vite. Его команда усердно работала и скоро [выпустит Vitest 1.0](https://github.com/vitest-dev/vitest/issues/3596). История Vite при использовании с другими инструментами, такими как [Storybook](https://storybook.js.org), [Nx](https://nx.dev) и [Playwright](https://playwright.dev), продолжала улучшаться, и то же самое касается окружений, с Vite dev, работающим как в [Deno](https://deno.com), так и в [Bun](https://bun.sh).

У нас был второй вариант [ViteConf](https://viteconf.org/23/replay) месяц назад, организованная [StackBlitz](https://stackblitz.com). Как и в прошлом году, большинство проектов в экосистеме собрались, чтобы поделиться идеями и связаться друг с другом для дальнейшего расширения общего дела. Мы также видим новые инструменты, дополняющие набор мета-фреймворков, такие как [Volar](https://volarjs.dev/) и [Nitro](https://nitro.unjs.io/). Команда Rollup выпустила [Rollup 4](https://rollupjs.org) в тот же день, что стало традицией, которую начал Лукаc в прошлом году.

Шесть месяцев назад [был выпущен](./announcing-vite4.md) Vite 4.3. Этот релиз значительно улучшил производительность dev-сервера. Однако всё ещё есть много возможностей для улучшения. На ViteConf [Эван Ю представил долгосрочный план Vite по работе над Rolldown](https://www.youtube.com/watch?v=hrdwQHoAp0M) — портом Rollup на Rust с совместимыми API. Как только он будет готов, мы намерены использовать его в Vite Core, чтобы взять на себя задачи как Rollup, так и esbuild. Это приведет к увеличению производительности сборки (а позже и к улучшению производительности разработки, поскольку мы перенесем чувствительные к производительности части Vite на Rust) и значительному сокращению несоответствий между разработкой и сборкой. Rolldown в настоящее время находится на ранних стадиях, и команда готовится открыть исходный код до конца года. Следите за новостями!

Сегодня мы отмечаем ещё одну важную веху на пути Vite. Команда Vite, [участники](https://github.com/vitejs/vite/graphs/contributors) и партнёры экосистемы рады объявить о выпуске Vite 5. Vite теперь использует [Rollup 4](https://github.com/vitejs/vite/pull/14508), что уже представляет собой значительное увеличение производительности сборки. Также появились новые опции для улучшения профиля производительности вашего dev-сервера.

Vite 5 сосредоточен на очистке API (удаление устаревших функций) и упрощает несколько функций, закрывая давние проблемы, например, переключение `define` на использование правильных замен AST вместо регулярных выражений. Мы также продолжаем предпринимать шаги для обеспечения будущего Vite (теперь требуется Node.js 18+, и [CJS Node API был объявлен устаревшим](/guide/migration#deprecate-cjs-node-api)).

Быстрые ссылки:

- [Документация](/)
- [Руководство по переходу](/guide/migration)
- [Журнал изменений](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#500-2023-11-16)

Документация на других языках:

- [English](https://vite.dev)
- [简体中文](https://cn.vite.dev/)
- [日本語](https://ja.vite.dev/)
- [Español](https://es.vite.dev/)
- [Português](https://pt.vite.dev/)
- [한국어](https://ko.vite.dev/)
- [Deutsch](https://de.vite.dev/) (новый перевод!)

Если вы новичок в Vite, мы рекомендуем сначала прочитать руководства [Начало работы](/guide/) и [Возможности](/guide/features).

Мы благодарны более чем [850 участникам Vite Core](https://github.com/vitejs/vite/graphs/contributors), а также разработчикам и контрибьюторам плагинов Vite, интеграций, инструментов и переводов, которые помогли нам достичь этого. Мы призываем вас участвовать и продолжать улучшать Vite вместе с нами. Вы можете узнать больше в нашем [Руководстве по внесению вклада](https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md). Чтобы начать, мы рекомендуем [разобрать задачи](https://github.com/vitejs/vite/issues), [просмотреть пулреквесты](https://github.com/vitejs/vite/pulls), отправить пулреквесты с неудачными тестами на основе открытых задач и помогать другим в [Обсуждениях](https://github.com/vitejs/vite/discussions) и на [форуме помощи Vite Land](https://discord.com/channels/804011606160703521/1019670660856942652). Вы многому научитесь на этом пути и получите плавный путь к дальнейшему вкладу в проект. Если у вас есть сомнения, присоединяйтесь к нам в нашем [сообществе Discord](http://chat.vite.dev/) и поздоровайтесь в [канале #contributing](https://discord.com/channels/804011606160703521/804439875226173480).

Чтобы быть в курсе событий, следите за нами в [X](https://twitter.com/vite_js) или [Mastodon](https://webtoo.ls/@vite).

## Быстрый старт с Vite 5 {#quick-start-with-vite-5}

Используйте `pnpm create vite`, чтобы создать проект Vite с вашим предпочтительным фреймворком, или откройте стартовый шаблон онлайн, чтобы поиграть с Vite 5, используя [vite.new](https://vite.new). Вы также можете запустить `pnpm create vite-extra`, чтобы получить доступ к шаблонам от других фреймворков и сред выполнения (Solid, Deno, SSR и стартеры библиотек). Шаблоны `create vite-extra` также доступны, когда вы запускаете `create vite` в разделе `Others`.

Обратите внимание, что стартовые шаблоны Vite предназначены для использования в качестве площадки для тестирования Vite с различными фреймворками. При создании вашего следующего проекта мы рекомендуем обращаться к стартерам, рекомендованным каждым фреймворком. Некоторые фреймворки теперь также перенаправляют в `create vite` на свои стартеры (`create-vue` и `Nuxt 3` для Vue, и `SvelteKit` для Svelte).

## Поддержка Node.js {#node-js-support}

Vite больше не поддерживает Node.js 14 / 16 / 17 / 19, которые достигли конца своего жизненного цикла (EOL). Теперь требуется Node.js 18 / 20+.

## Производительность {#performance}

Помимо улучшений производительности сборки Rollup 4, есть [новое руководство](/guide/performance), которое поможет вам выявить и исправить распространённые проблемы с производительностью.

Vite 5 также вводит [`server.warmup`](/guide/performance.html#warm-up-frequently-used-files) — новую функцию для улучшения времени запуска. Она позволяет вам определить список модулей, которые должны быть предварительно преобразованы сразу после запуска сервера. При использовании [`--open` или `server.open`](/config/server-options.html#server-open) Vite также автоматически разогреет точку входа вашего приложения или предоставленный URL для открытия.

## Основные изменения {#main-changes}

- [Vite теперь работает на Rollup 4](/guide/migration#rollup-4)
- [CJS Node API был признан устаревшим](/guide/migration#deprecate-cjs-node-api)
- [Переработана стратегия замены `define` и `import.meta.env.*`](/guide/migration#rework-define-and-import-meta-env-replacement-strategy)
- [Значение внешних модулей SSR теперь соответствует продакшен-версии](/guide/migration#ssr-externalized-modules-value-now-matches-production)
- [`worker.plugins` теперь является функцией](/guide/migration#worker-plugins-is-now-a-function)
- [Разрешены пути, содержащие `.`, для возврата к index.html](/guide/migration#allow-path-containing-to-fallback-to-index-html)
- [Согласование поведения при разработке и предварительном просмотре HTML-кода](/guide/migration#align-dev-and-preview-html-serving-behaviour)
- [Файлы манифеста теперь по умолчанию генерируются в директории `.vite`](/guide/migration#manifest-files-are-now-generated-in-vite-directory-by-default)
- [Сочетания клавиш CLI требуют дополнительного нажатия `Enter`](/guide/migration#cli-shortcuts-require-an-additional-enter-press)
- [Обновлено поведение `experimentalDecorators` и `useDefineForClassFields` в TypeScript](/guide/migration#update-experimentaldecorators-and-usedefineforclassfields-typescript-behaviour)
- [Удалён флаг `--https` и `https: true`](/guide/migration#remove-https-flag-and-https-true)
- [Удалены API `resolvePackageEntry` и `resolvePackageData`](/guide/migration#remove-resolvepackageentry-and-resolvepackagedata-apis)
- [Удалены ранее устаревшие API](/guide/migration#removed-deprecated-apis)
- [Узнайте больше о продвинутых изменениях, влияющих на авторов плагинов и инструментов](/guide/migration#advanced)

## Переход на Vite 5 {#migrating-to-vite-5}

Мы работали с партнёрами экосистемы, чтобы обеспечить плавную миграцию на эту новую основную версию. В очередной раз, [vite-ecosystem-ci](https://www.youtube.com/watch?v=7L4I4lDzO48) сыграл ключевую роль в том, чтобы помочь нам внести более смелые изменения, избегая регрессий. Мы рады видеть, что другие экосистемы принимают аналогичные схемы для улучшения сотрудничества между своими проектами и разработчиками.

Для большинства проектов обновление до Vite 5 должно быть простым. Но мы рекомендуем ознакомиться с подробным [Руководством по переходу](/guide/migration) перед обновлением.

Подробный список изменений в ядре Vite можно найти в [Журнале изменений Vite 5](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#500-2023-11-16).

## Благодарности {#acknowledgments}

Vite 5 — это результат долгих часов работы нашего сообщества участников, разработчиков, авторов плагинов и [команды Vite](/team). Огромная благодарность [Бьорну Лу](https://twitter.com/bluwyoo) за руководство процессом выпуска этой важной версии.

Мы также благодарны отдельным лицам и компаниям, которые спонсируют разработку Vite. [StackBlitz](https://stackblitz.com/), [Nuxt Labs](https://nuxtlabs.com/) и [Astro](https://astro.build) продолжают инвестировать в Vite, нанимая членов команды Vite. Особая благодарность спонсорам на [GitHub Sponsors Vite](https://github.com/sponsors/vitejs), [Open Collective Vite](https://opencollective.com/vite) и [GitHub Sponsors Эвана Ю](https://github.com/sponsors/yyx990803). Особое упоминание [Remix](https://remix.run/) за то, что стал золотым спонсором и вернулся к поддержке после перехода на Vite.
