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
      content: https://vite.dev/og-image-announcing-vite6.webp
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

![Обложка объявления Vite 6](/og-image-announcing-vite6.webp)

Прошедший год был насыщен событиями. Принятие Vite продолжает расти, со скачком загрузок npm с 7,5 миллионов до 17 миллионов в неделю с момента выпуска Vite 5 год назад. [Vitest](https://vitest.dev) выбирается не только конечными пользователями, но также начинает формировать собственную экосистему. Например, [Storybook](https://storybook.js.org) получил новые возможности тестирования на базе Vitest.

Новые фреймворки присоединились к экосистеме Vite. Среди них: [TanStack Start](https://tanstack.com/start), [One](https://onestack.dev/), [Ember](https://emberjs.com/). Веб-фреймворки развиваются всё более быстрыми темпами. Вы можете ознакомиться с улучшениями, которые делают разработчики в [Astro](https://astro.build/), [Nuxt](https://nuxt.com/), [SvelteKit](https://kit.svelte.dev/), [Solid Start](https://www.solidjs.com/blog/introducing-solidstart), [Qwik City](https://qwik.builder.io/qwikcity/overview/), [RedwoodJS](https://redwoodjs.com/), [React Router](https://reactrouter.com/) и этот список можно продолжать.

Vite используется такими компаниями, как OpenAI, Google, Apple, Microsoft, NASA, Shopify, Cloudflare, GitLab, Reddit, Linear и многими другими. Два месяца назад мы начали список [компаний, использующих Vite](https://github.com/vitejs/companies-using-vite). Мы рады видеть, как многие разработчики отправляют нам PR, чтобы добавить свои компании в этот список. Трудно поверить, насколько сильно экосистема, которую мы построили вместе, выросла с тех пор, как Vite сделал свои первые шаги.

![Еженедельные загрузки Vite через npm](../images/vite6-npm-weekly-downloads.webp)

## Ускорение экосистемы Vite {#speeding-up-the-vite-ecosystem}

В прошлом месяце сообщество собралось на третьей конференции [ViteConf](https://viteconf.org/24/replay), вновь организованной [StackBlitz](https://stackblitz.com). Это была крупнейшая конференция Vite, с широким представлением разработчиков из экосистемы. Среди других объявлений Эван Ю анонсировал [VoidZero](https://staging.voidzero.dev/posts/announcing-voidzero-inc), компанию, посвящённую созданию открытой, высокопроизводительной и унифицированной цепочки инструментов разработки для экосистемы JavaScript. VoidZero стоит за [Rolldown](https://rolldown.rs) и [Oxc](https://oxc.rs), и их команда делает значительные шаги, быстро подготавливая их к принятию Vite. Посмотрите ключевую речь Эвана, чтобы узнать больше о следующих шагах в будущем Vite на основе Rust.

<YouTubeVideo videoId="EKvvptbTx6k?si=EZ-rFJn4pDW3tUvp" />

[Stackblitz](https://stackblitz.com) представил [bolt.new](https://bolt.new), приложение на Remix, которое сочетает Claude и WebContainers и позволяет вам вводить команды, редактировать, запускать и развёртывать полнофункциональные приложения. Нейт Уайнер анонсировал [One](https://onestack.dev), новый фреймворк React на базе Vite для веба и мобильных устройств. Storybook продемонстрировал свои последние возможности тестирования на базе Vitest [в этом видео](https://youtu.be/8t5wxrFpCQY?si=PYZoWKf-45goQYDt). И это ещё не всё. Мы призываем вас посмотреть [все 43 выступления](https://www.youtube.com/playlist?list=PLqGQbXn_GDmnObDzgjUF4Krsfl6OUKxtp). Спикеры приложили значительные усилия, чтобы поделиться с нами тем, чем занимался каждый проект.

Vite также получил обновлённую целевую страницу и чистый домен. Вам следует обновить ваши URL-адреса, чтобы они указывали на новый домен [vite.dev](https://vite.dev) в будущем. Новый дизайн и реализация были выполнены компанией VoidZero, теми же людьми, которые создали их веб-сайт. Особая благодарность [Висенте Родригесу](https://bento.me/rmoon) и [Саймону Ле Маршанту](https://marchantweb.com/).

## Следующая основная версия Vite здесь {#the-next-vite-major-is-here}

Vite 6 — это самое значительное крупное обновление с момента выхода Vite 2. Мы стремимся сотрудничать с экосистемой, чтобы продолжать расширять наши общие ресурсы через новые API и, как обычно, предоставлять более отшлифованную базу для разработки.

Быстрые ссылки:

- [Документация](/)
- Переводы: [English](https://vite.dev), [简体中文](https://cn.vite.dev/), [日本語](https://ja.vite.dev/), [Español](https://es.vite.dev/), [Português](https://pt.vite.dev/), [한국어](https://ko.vite.dev/), [Deutsch](https://de.vite.dev/)
- [Руководство по переходу](/guide/migration)
- [Журнал изменений на GitHub](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#600-2024-11-26)

Если вы новичок в Vite, мы рекомендуем сначала прочитать [Руководство по началу работы](/guide/) и [Возможности](/guide/features).

Мы хотим поблагодарить более [1000 участников Vite Core](https://github.com/vitejs/vite/graphs/contributors) и разработчиков, и контрибьюторов плагинов, интеграций, инструментов и переводов Vite, которые помогли нам создать эту новую основную версию. Мы приглашаем вас принять участие и помочь нам улучшить Vite для всей экосистемы. Узнайте больше в нашем [Руководстве по участию](https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md). Чтобы начать, мы рекомендуем помочь [сортировать проблемы](https://github.com/vitejs/vite/issues), [просматривать PR](https://github.com/vitejs/vite/pulls), отправлять PR с неудачными тестами на основе открытых проблем и поддерживать других в [Дискуссиях](https://github.com/vitejs/vite/discussions) и на [форуме помощи Vite Land](https://discord.com/channels/804011606160703521/1019670660856942652). Если вы хотите поговорить с нами, присоединяйтесь к нашему [сообществу в Discord](http://chat.vite.dev/) и поздоровайтесь в канале [#contributing](https://discord.com/channels/804011606160703521/804439875226173480).

Чтобы быть в курсе последних новостей о экосистеме Vite и Vite Core, следите за нами в [Bluesky](https://bsky.app/profile/vite.dev), [X](https://twitter.com/vite_js) или [Mastodon](https://webtoo.ls/@vite).

## Начало работы с Vite 6 {#getting-started-with-vite-6}

Вы можете использовать `pnpm create vite`, чтобы быстро создать приложение Vite с предпочитаемым фреймворком или поиграть онлайн с Vite 6, используя [vite.new](https://vite.new). Вы также можете запустить `pnpm create vite-extra`, чтобы получить доступ к шаблонам от других фреймворков и сред выполнения (Solid, Deno, SSR и стартеры библиотек). Шаблоны `create vite-extra` также доступны, когда вы запускаете `create vite` в разделе `Others`.

Шаблоны стартеров Vite предназначены для использования в качестве площадки для тестирования Vite с различными фреймворками. При создании вашего следующего проекта вам следует обратиться к стартеру, рекомендованному каждым фреймворком. `create vite` также предоставляет ярлык для настройки правильных стартеров в некоторых фреймворках, таких как `create-vue`, `Nuxt 3`, `SvelteKit`, `Remix`, `Analog` и `Angular`.

## Поддержка Node.js {#node-js-support}

Vite 6 поддерживает Node.js 18, 20 и 22+, аналогично Vite 5. Поддержка Node.js 21 была прекращена. Vite прекращает поддержку Node.js для более старых версий после [окончания их поддержки](https://endoflife.date/nodejs). Завершение поддержки для Node.js 18 наступает в конце апреля 2025 года, после чего мы можем выпустить новое крупное обновление, чтобы повысить требуемую версию Node.js.

## Экспериментальный Environment API {#experimental-environment-api}

Vite становится более гибким с новым Environment API. Эти новые API позволят авторам фреймворков предложить опыт разработки, более близкий к продакшен-окружению, а экосистеме делиться новыми строительными блоками. Ничего не меняется, если вы создаёте одностраничное приложение (SPA); при использовании Vite с единственным клиентским окружением всё работает как и прежде. И даже для пользовательских приложений с серверным рендерингом (SSR) Vite 6 обратно совместим. Основная целевая аудитория для Environment API — авторы фреймворков.

Для конечных пользователей, которым интересно, [Sapphi](https://github.com/sapphi-red) написал отличное [Введение в Environment API](https://green.sapphi.red/blog/increasing-vites-potential-with-the-environment-api). Это отличное место для начала и понимания того, почему мы пытаемся сделать Vite ещё более гибким.

Если вы автор фреймворка или поддерживаете плагины Vite и хотели бы использовать новые API, вы можете узнать больше в [Руководствах по Environment API](https://main.vite.dev/guide/api-environment).

Мы хотим поблагодарить всех, кто участвовал в определении и реализации новых API. История начинается с того, что Vite 2 принял схему разработки SSR без сборки, разработанную [Ричем Харрисом](https://github.com/Rich-Harris) и командой [SvelteKit](https://svelte.dev/docs/kit). Затем трансформация SSR в Vite открыла возможности для [Энтони Фу](https://github.com/antfu/) и [Поои Парсы](https://github.com/pi0) создать vite-node и улучшить [историю Dev SSR в Nuxt](https://antfu.me/posts/dev-ssr-on-nuxt). Энтони использовал vite-node для работы с [Vitest](https://vitest.dev), а [Владимир Шеремет](https://github.com/sheremet-va) продолжал его улучшать в рамках своей работы по поддержке Vitest. В начале 2023 года Владимир начал работу по интеграции vite-node в Vite Core, и мы выпустили его как Runtime API в Vite 5.1 год спустя. Обратная связь от партнёров экосистемы (особая благодарность команде Cloudflare) подтолкнула нас к более амбициозной переработке окружений Vite. Вы можете узнать больше об этой истории из [выступления Патака на ViteConf 24](https://www.youtube.com/watch?v=WImor3HDyqU?si=EZ-rFJn4pDW3tUvp).

Все члены команды Vite участвовали в определении нового API, который был совместно разработан с учётом отзывов от многих проектов в экосистеме. Спасибо всем, кто участвовал! Мы призываем вас принять участие, если вы разрабатываете фреймворк, плагин или инструмент на основе Vite. Новые API являются экспериментальными. Мы будем работать с экосистемой, чтобы оценить, как будут использоваться новые API-интерфейсы, и стабилизировать их для следующей основной версии. Если у вас есть вопросы или вы хотите оставить отзыв, вы можете участвовать в [открытой дискуссии на GitHub здесь](https://github.com/vitejs/vite/discussions/16358).

## Основные изменения {#main-changes}

- [Значение по умолчанию для `resolve.conditions`](/guide/migration#default-value-for-resolve-conditions)
- [JSON stringify](/guide/migration#json-stringify)
- [Расширенная поддержка ссылок на ресурсы в HTML-элементах](/guide/migration#extended-support-of-asset-references-in-html-elements)
- [postcss-load-config](/guide/migration#postcss-load-config)
- [Sass теперь по умолчанию использует современный API](/guide/migration#sass-now-uses-modern-api-by-default)
- [Настройка имени выходного файла CSS в режиме библиотеки](/guide/migration#customize-css-output-file-name-in-library-mode)
- [И другие изменения, которые должны затронуть лишь немногих пользователей](/guide/migration#advanced)

Также есть новая страница [Критические изменения](/changes/), на которой перечислены все запланированные, рассматриваемые и прошлые изменения в Vite.

## Переход на Vite 6 {#migrating-to-vite-6}

Для большинства проектов обновление до Vite 6 должно быть простым, но мы рекомендуем ознакомиться с подробным [руководством по переходу](/guide/migration) перед обновлением.

Полный список изменений находится в [Журнале изменений Vite 6](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#600-2024-11-26).

## Благодарности {#acknowledgments}

Vite 6 является результатом долгих часов работы нашего сообщества участников, разработчиков, авторов плагинов и [Команды Vite](/team). Мы благодарим отдельных лиц и компании, спонсирующие разработку Vite. Vite предоставляется вам [VoidZero](https://voidzero.dev) в партнёрстве с [StackBlitz](https://stackblitz.com/), [Nuxt Labs](https://nuxtlabs.com/) и [Astro](https://astro.build). Особая благодарность спонсорам на [GitHub Sponsors Vite](https://github.com/sponsors/vitejs) и [Open Collective Vite](https://opencollective.com/vite).
