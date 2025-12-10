---
title: Доступен Vite 7.0!
author:
  name: The Vite Team
date: 2025-06-24
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Анонс Vite 7
  - - meta
    - property: og:image
      content: https://vite.dev/og-image-announcing-vite7.webp
  - - meta
    - property: og:url
      content: https://vite.dev/blog/announcing-vite7
  - - meta
    - property: og:description
      content: Анонс выпуска Vite 7
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Доступен Vite 7.0! {#vite-7-0-is-out}

_24 июня 2025_

![Обложка объявления Vite 7](/og-image-announcing-vite7.webp)

Мы рады объявить о выпуске Vite 7! Прошло 5 лет с момента, когда Эван Ю отправил первый коммит в репозиторий Vite, и никто не мог предсказать, насколько сильно изменится экосистема фронтенда с тех пор. Сегодня большинство современных фронтенд-фреймворков и инструментов работают вместе, опираясь на общую инфраструктуру Vite. Это позволяет им внедрять инновации быстрее благодаря высокоуровневому взаимодействию. Vite теперь скачивают 31 миллион раз в неделю, что на 14 миллионов больше за последние семь месяцев с момента предыдущего крупного релиза.

В этом году мы делаем несколько важных шагов. Во-первых, [ViteConf](https://viteconf.org) впервые пройдёт вживую! Экосистема Vite соберётся в Амстердаме 9–10 октября! Конференция организована [JSWorld](https://jsworldconference.com/) в партнёрстве с [Bolt](https://bolt.new), [VoidZero](https://voidzero.dev) и основной командой Vite! Мы провели три замечательных [онлайн-версии ViteConf](https://www.youtube.com/@viteconf/playlists), и теперь с нетерпением ждём встречи в реальной жизни. Ознакомьтесь со списком спикеров и приобретите билет на [сайте ViteConf](https://viteconf.org)!

Компания [VoidZero](https://voidzero.dev/posts/announcing-voidzero-inc) продолжает добиваться значительных успехов в своей миссии по созданию единой открытой инструментальной цепочки для экосистемы JavaScript. В течение последнего года команда VoidZero работала над [Rolldown](https://rolldown.rs/), бандлером нового поколения на базе Rust, как частью более широкой инициативы по модернизации ядра Vite. Вы можете попробовать Vite с поддержкой Rolldown уже сегодня, используя пакет `rolldown-vite` вместо стандартного пакета `vite`. Это замена без дополнительных настроек, так как Rolldown станет бандлером по умолчанию для Vite в будущем. Переход на него должен сократить время сборки, особенно для крупных проектов. Подробности читайте в [блоге об анонсе Rolldown-vite](https://voidzero.dev/posts/announcing-rolldown-vite) и в нашем [руководстве по миграции](/guide/rolldown).

В рамках партнёрства между VoidZero и [NuxtLabs](https://nuxtlabs.com/) Энтони Фу работает над созданием Vite DevTools. Этот инструмент обеспечит более глубокую и информативную отладку и анализ для всех проектов и фреймворков, основанных на Vite. Подробности можно узнать в [посте о сотрудничестве VoidZero и NuxtLabs по Vite DevTools](https://voidzero.dev/posts/voidzero-nuxtlabs-vite-devtools).

Быстрые ссылки:

- [Документация](/)
- Новый перевод: [فارسی](https://fa.vite.dev/)
- Другие переводы: [简体中文](https://cn.vite.dev/), [日本語](https://ja.vite.dev/), [Español](https://es.vite.dev/), [Português](https://pt.vite.dev/), [한국어](https://ko.vite.dev/), [Deutsch](https://de.vite.dev/)
- [Руководство по миграции](/guide/migration)
- [Журнал изменений на GitHub](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md)

Попробуйте Vite 7 онлайн с помощью [vite.new](https://vite.new) или создайте локальное приложение Vite с вашим любимым фреймворком, выполнив команду `pnpm create vite`. Подробности читайте в [Руководстве по началу работы](/guide/).

Мы приглашаем вас помочь улучшить Vite (присоединяйтесь к более чем [1,1 тыс. контрибьюторов Vite Core](https://github.com/vitejs/vite/graphs/contributors)), наши зависимости, плагины или проекты экосистемы. Узнайте больше в [Руководстве по сотрудничеству](https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md). Хороший способ начать — это [разбор задач](https://github.com/vitejs/vite/issues), [проверка PR](https://github.com/vitejs/vite/pulls), отправка тестовых PR на основе открытых задач или поддержка других в [обсуждениях](https://github.com/vitejs/vite/discussions) или на [форуме помощи Vite Land](https://discord.com/channels/804011606160703521/1019670660856942652). Если у вас есть вопросы, присоединяйтесь к нашему [сообществу в Discord](http://chat.vite.dev/) и общайтесь с нами в [канале #contributing](https://discord.com/channels/804011606160703521/804439875226173480).

Оставайтесь в курсе и общайтесь с другими, кто создаёт на базе Vite, подписываясь на нас в [Bluesky](https://bsky.app/profile/vite.dev), [X](https://twitter.com/vite_js) или [Mastodon](https://webtoo.ls/@vite).

## Поддержка Node.js {#node-js-support}

Vite теперь требует Node.js версии 20.19+ или 22.12+. Мы прекратили поддержку Node.js 18, так как её жизненный цикл завершился ([EOL](https://endoflife.date/nodejs)) в конце апреля 2025 года.

Мы перешли на эти новые версии, поскольку они поддерживают `require(esm)` без необходимости использования флага. Это позволяет распространять Vite 7.0 исключительно в формате ESM, не ограничивая использование JavaScript API Vite в модулях CJS. Ознакомьтесь с подробным обзором текущего состояния ESM в экосистеме в статье Энтони Фу [Переход на ESM-only](https://antfu.me/posts/move-on-to-esm-only).

## Изменение целевых браузеров по умолчанию на Baseline Widely Available {#default-browser-target-changed-to-baseline-widely-available}

Новый стандарт [Baseline](https://web-platform-dx.github.io/web-features/) предоставляет чёткую информацию о том, какие функции веб-платформы поддерживаются основным набором браузеров на текущий момент. Статус Baseline Widely Available означает, что функция хорошо зарекомендовала себя и работает на множестве устройств и версий браузеров, будучи доступной во всех браузерах как минимум 30 месяцев.

В Vite 7 целевой браузер по умолчанию изменён с `'modules'` на новый стандарт: `'baseline-widely-available'`. Набор браузеров будет обновляться с каждым крупным релизом, чтобы соответствовать минимальным версиям браузеров, совместимых с функциями Baseline Widely Available. В Vite 7.0 значение по умолчанию для `build.target` изменено следующим образом:

- Chrome: 87 → 107
- Edge: 88 → 107
- Firefox: 78 → 104
- Safari: 14.0 → 16.0

Это изменение добавляет предсказуемость целевым браузерам для будущих релизов.

## Vitest

Для пользователей Vitest поддержка Vite 7.0 реализована начиная с Vitest 3.2. Подробности о том, как команда Vitest продолжает улучшать тестирование с Vite, можно прочитать в [блоге о релизе Vitest 3.2](https://vitest.dev/blog/vitest-3-2.html).

## Environment API {#environment-api}

Vite 6 стал самым значительным крупным релизом со времён Vite 2, добавив новые возможности благодаря [новому экспериментальному Environment API](/blog/announcing-vite6.html#experimental-environment-api). Мы сохраняем новые API в статусе экспериментальных, пока экосистема оценивает их применимость в проектах и предоставляет обратную связь. Если вы разрабатываете на базе Vite, мы рекомендуем протестировать новые API и поделиться впечатлениями в [открытом обсуждении обратной связи](https://github.com/vitejs/vite/discussions/16358).

В Vite 7 мы добавили новый хук `buildApp`, который позволяет плагинам координировать сборку окружений. Подробности читайте в [руководстве по Environment API для фреймворков](/guide/api-environment-frameworks.html#environments-during-build).

Мы благодарим команды, которые тестировали новые API и помогали нам стабилизировать новые функции. Например, команда Cloudflare анонсировала релиз 1.0 своего плагина Cloudflare Vite, а также официальную поддержку React Router v7. Их плагин демонстрирует потенциал Environment API для поставщиков рантайма. Узнайте больше об их подходе и дальнейших шагах в статье [Просто используйте Vite… с рантаймом Workers](https://blog.cloudflare.com/introducing-the-cloudflare-vite-plugin/).

## Переход на Vite 7 {#migrating-to-vite-7}

Обновление с Vite 6 до Vite 7 должно пройти гладко. Мы удаляем уже устаревшие функции, такие как поддержка устаревшего Sass API и плагин `splitVendorChunkPlugin`, что не должно повлиять на ваши проекты. Тем не менее, мы рекомендуем ознакомиться с [подробным руководством по миграции](/guide/migration) перед обновлением.

Полный список изменений доступен в [журнале изменений Vite 7](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md).

## Благодарности {#acknowledgments}

Vite 7 был создан [командой Vite](/team) при поддержке широкого сообщества контрибьюторов, мейнтейнеров зависимостей и авторов плагинов. Особая благодарность [sapphi-red](https://github.com/sapphi-red) за его выдающуюся работу над `rolldown-vite` и этим релизом. Vite представлен [VoidZero](https://voidzero.dev) в партнёрстве с [Bolt](https://bolt.new/) и [Nuxt Labs](https://nuxtlabs.com/). Мы также благодарим наших спонсоров на [GitHub Sponsors Vite](https://github.com/sponsors/vitejs) и [Open Collective Vite](https://opencollective.com/vite).
