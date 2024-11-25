---
title: Доступен Vite 6.0!
author:
  name: The Vite Team
date: 2024-11-26
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Анонс Vite 6
  - - meta
    - property: og:image
      content: https://vite.dev/og-image-announcing-vite6.png
  - - meta
    - property: og:url
      content: https://vite.dev/blog/announcing-vite6
  - - meta
    - property: og:description
      content: Анонс выпуска Vite 6
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Доступен Vite 6.0! {#vite-6-0-is-out}

_26 ноября 2024_

![Обложка объявления Vite 6](/og-image-announcing-vite6.png)

Прошедший год был насыщен событиями. Принятие Vite продолжает расти, со скачком загрузок npm с 7,5 миллионов до 16 миллионов в неделю с момента выпуска Vite 5 год назад. [Vitest](https://vitest.dev) выбирается не только конечными пользователями, но также начинает формировать собственную экосистему. Например, [Storybook](https://storybook.js.org) получил новые возможности тестирования на базе Vitest. Новые фреймворки присоединились к экосистеме Vite. Среди них: [TanStack Start](https://tanstack.com/start), [One](https://onestack.dev/), [Ember](https://emberjs.com/). Веб-фреймворки развиваются всё более быстрыми темпами. Вы можете ознакомиться с улучшениями, которые делают разработчики в [Astro](https://astro.build/), [Nuxt](https://nuxt.com/), [SvelteKit](https://kit.svelte.dev/), [Solid Start](https://www.solidjs.com/blog/introducing-solidstart), [Qwik City](https://qwik.builder.io/qwikcity/overview/), [RedwoodJS](https://redwoodjs.com/), [Remix](https://remix.run/) и этот список можно продолжать.

## Ускорение экосистемы Vite {#speeding-up-the-vite-ecosystem}

В прошлом месяце сообщество собралось на третьей конференции [ViteConf](https://viteconf.org/24/replay), вновь организованной [StackBlitz](https://stackblitz.com). Это была крупнейшая конференция Vite, с широким представлением разработчиков из экосистемы. Среди других объявлений Эван Ю анонсировал [VoidZero](https://staging.voidzero.dev/posts/announcing-voidzero-inc), компанию, посвящённую созданию открытой, высокопроизводительной и унифицированной цепочки инструментов разработки для экосистемы JavaScript. VoidZero стоит за [Rolldown](https://rolldown.rs) и [Oxc](https://oxc.rs), и их команда делает значительные шаги, быстро подготавливая их к принятию Vite. Посмотрите ключевую речь Эвана, чтобы узнать больше о следующих шагах в будущем Vite на основе Rust.

<YouTubeVideo videoId="EKvvptbTx6k?si=EZ-rFJn4pDW3tUvp" />

[Stackblitz](https://stackblitz.com) представил [bolt.new](https://bolt.new), приложение на Remix, которое сочетает Claude и WebContainers и позволяет вам вводить команды, редактировать, запускать и развёртывать полнофункциональные приложения. Нейт Уайнер анонсировал [One](https://onestack.dev), новый фреймворк React на базе Vite для веба и мобильных устройств. Storybook продемонстрировал свои последние возможности тестирования на базе Vitest [в этом видео](https://youtu.be/8t5wxrFpCQY?si=PYZoWKf-45goQYDt). И это ещё не всё. Мы призываем вас посмотреть [все 43 выступления](https://www.youtube.com/playlist?list=PLqGQbXn_GDmnObDzgjUF4Krsfl6OUKxtp). Спикеры приложили значительные усилия, чтобы поделиться с нами тем, чем занимался каждый проект.

Vite также получил обновлённую целевую страницу и чистый домен. Вам следует обновить ваши URL-адреса, чтобы они указывали на новый домен [vite.dev](https://vite.dev) в будущем. Новый дизайн и реализация были выполнены компанией VoidZero, теми же людьми, которые создали их веб-сайт. Особая благодарность [Висенте Родригесу](https://bento.me/rmoon) и [Саймону Ле Маршанту](https://marchantweb.com/).

## Следующая основная версия Vite здесь {#the-next-vite-major-is-here}

Сегодня мы делаем ещё один большой шаг в истории Vite. [Команда](/team) Vite, [участники](https://github.com/vitejs/vite/graphs/contributors) и партнёры экосистемы рады объявить о выпуске Vite 6.

Быстрые ссылки:

- [Документация](/)
- Переводы: [English](https://vite.dev), [简体中文](https://cn.vite.dev/), [日本語](https://ja.vite.dev/), [Español](https://es.vite.dev/), [Português](https://pt.vite.dev/), [한국어](https://ko.vite.dev/), [Deutsch](https://de.vite.dev/)
- [Руководство по миграции](/guide/migration)
- [Журнал изменений на GitHub](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#500-2024-11-26)

Если вы новичок в Vite, мы рекомендуем сначала прочитать [Руководство по началу работы](/guide/) и [Возможности](/guide/features).

Мы хотим поблагодарить более [1000 участников Vite Core](https://github.com/vitejs/vite/graphs/contributors) и поддерживающих и контрибьюторов плагинов, интеграций, инструментов и переводов Vite, которые помогли нам создать эту новую основную версию. Мы приглашаем вас принять участие и помочь нам улучшить Vite для всей экосистемы. Узнайте больше в нашем [Руководстве по участию](https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md). Чтобы начать, мы рекомендуем помочь [сортировать проблемы](https://github.com/vitejs/vite/issues), [просматривать PR](https://github.com/vitejs/vite/pulls), отправлять PR с неудачными тестами на основе открытых проблем и поддерживать других в [Дискуссиях](https://github.com/vitejs/vite/discussions) и на [форуме помощи Vite Land](https://discord.com/channels/804011606160703521/1019670660856942652). Если вы хотите поговорить с нами, присоединяйтесь к нашему [сообществу в Discord](http://chat.vite.dev/) и поздоровайтесь в канале [#contributing](https://discord.com/channels/804011606160703521/804439875226173480).

Чтобы быть в курсе последних новостей о экосистеме Vite и Vite Core, следите за нами в [X](https://twitter.com/vite_js), [Bluesky](https://bsky.app/profile/vite.dev) или [Mastodon](https://webtoo.ls/@vite).

## Начало работы с Vite 6 {#getting-started-with-vite-6}

Вы можете использовать `pnpm create vite`, чтобы быстро создать приложение Vite с вашим предпочтительным фреймворком или поиграть онлайн с Vite 6, используя [vite.new](https://vite.new). Вы также можете запустить `pnpm create vite-extra`, чтобы получить доступ к шаблонам от других фреймворков и сред выполнения (Solid, Deno, SSR и стартеры библиотек). Шаблоны `create vite-extra` также доступны, когда вы запускаете `create vite` в разделе `Другие`.

Шаблоны стартеров Vite предназначены для использования в качестве площадки для тестирования Vite с различными фреймворками. При создании вашего следующего проекта вам следует обратиться к стартеру, рекомендованному каждым фреймворком. Мы уже предоставляем простой способ перейти к правильному стартеру для некоторых фреймворков при использовании `create vite` (таких как `create-vue`, `Nuxt 3`, `SvelteKit`, `Remix`, `Analog` и `Angular`).

## Поддержка Node.js {#node-js-support}

Vite 6 поддерживает Node.js 18, 20 и 22+. Vite прекращает поддержку Node.js для более старых версий после [окончания их поддержки](https://endoflife.date/nodejs). Завершение поддержки для Node.js 18 наступит в конце апреля 2025 года. Мы выпустим новую основную версию в мае, чтобы обновить требуемую версию Node.

## Экспериментальный Environment API {#experimental-environment-api}

Vite 5 имел два неявных окружения: `client` и `ssr`. В Vite 6 фреймворки и пользователи могут настраивать столько окружений, сколько необходимо, чтобы лучше моделировать все среды выполнения, в которых будет работать приложение. Для поддержки пользовательских окружений и разделения графов модулей по окружениям потребовался обширный внутренний рефакторинг. Тем не менее, обновление до Vite 6 должно пройти без проблем с совместимостью. Новые API являются экспериментальными. Мы будем работать с экосистемой, чтобы изучить, как они используются, и стабилизировать их для следующей основной версии. Вы можете узнать больше в [Руководствах по Environment API](https://main.vite.dev/guide/api-environment).

Помимо документации, Sapphi написал отличное [Введение в Environment API](https://green.sapphi.red/blog/increasing-vites-potential-with-the-environment-api). Это отличное место для начала и понимания того, почему мы пытаемся сделать Vite ещё более гибким.

Мы хотели бы поблагодарить всех, кто участвовал в определении и реализации новых API. Энтони Фу и Пуйя Парса создали vite-node, чтобы улучшить [историю Dev SSR для Nuxt](https://antfu.me/posts/dev-ssr-on-nuxt) с Vite. Затем Энтони использовал vite-node для работы Vitest, а Владимир Шеремет продолжал его улучшать. В начале 2023 года Владимир начал работу по интеграции vite-node в Vite Core, и он был выпущен как Runtime API в Vite 5.1 через год. Обратная связь от партнёров экосистемы (особая благодарность команде Cloudflare) подтолкнула нас к более амбициозной переработке окружений Vite. Вы можете узнать больше об этой истории на [выступлении Патака на ViteConf 24](https://www.youtube.com/watch?v=WImor3HDyqU?si=EZ-rFJn4pDW3tUvp).

Все члены команды Vite участвовали в определении нового API, который был совместно разработан с учётом отзывов от многих проектов в экосистеме. Спасибо всем, кто участвовал! Мы призываем вас принять участие, если вы разрабатываете фреймворк, плагин или инструмент на основе Vite. Если у вас есть вопросы или вы хотите оставить отзыв, вы можете сделать это в [открытой дискуссии на GitHub](https://github.com/vitejs/vite/discussions/16358).

## Основные изменения {#main-changes}

- [Значение по умолчанию для `resolve.conditions`](/guide/migration#default-value-for-resolve-conditions)
- [JSON stringify](/guide/migration#json-stringify)
- [Расширенная поддержка ссылок на ресурсы в HTML-элементах](/guide/migration#extended-support-of-asset-references-in-html-elements)
- [postcss-load-config](/guide/migration#postcss-load-config)
- [Sass теперь по умолчанию использует современный API](/guide/migration#sass-now-uses-modern-api-by-default)
- [Настройка имени выходного файла CSS в режиме библиотеки](/guide/migration#customize-css-output-file-name-in-library-mode)
- [И другие изменения, которые должны затронуть лишь немногих пользователей](/guide/migration#advanced)

## Переход на Vite 6 {#migrating-to-vite-6}

Для большинства проектов обновление до Vite 6 должно быть простым. Но мы рекомендуем ознакомиться с [подробным руководством по миграции](/guide/migration) перед обновлением.

Полный список изменений находится в [Журнале изменений Vite 6](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#500-2024-11-26).

## Благодарности {#acknowledgments}

Vite 6 является результатом долгих часов работы нашего сообщества участников, поддерживающих разработку, авторов плагинов и [Команды Vite](/team). Мы благодарим отдельных лиц и компании, спонсирующие разработку Vite. Vite предоставляется вам [VoidZero](https://voidzero.dev) в партнёрстве с [StackBlitz](https://stackblitz.com/), [Nuxt Labs](https://nuxtlabs.com/) и [Astro](https://astro.build). Особая благодарность спонсорам на [GitHub Sponsors Vite](https://github.com/sponsors/vitejs) и [Open Collective Vite](https://opencollective.com/vite).
