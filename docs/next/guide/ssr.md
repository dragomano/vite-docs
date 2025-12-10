# Серверный рендеринг (SSR) {#server-side-rendering}

:::tip Примечание
SSR конкретно относится к фронтенд-фреймворкам (например, React, Preact, Vue и Svelte), которые поддерживают запуск одного и того же приложения в Node.js, предварительно рендеря его в HTML, а затем гидратируя его на клиенте. Если вы ищете интеграцию с традиционными серверными фреймворками, вместо этого ознакомьтесь с [руководством по интеграции с бэкендом](./backend-integration).

Следующее руководство также предполагает наличие предварительного опыта работы с SSR в выбранном вами фреймворке и будет сосредоточено только на деталях интеграции, специфичных для Vite.
:::

:::warning Низкоуровневый API
Это низкоуровневый API, предназначенный для авторов библиотек и фреймворков. Если ваша цель — создать приложение, обязательно ознакомьтесь с более высокоуровневыми плагинами и инструментами SSR в разделе [Awesome Vite SSR](https://github.com/vitejs/awesome-vite#ssr). Тем не менее, многие приложения успешно создаются непосредственно на основе нативного низкоуровневого API Vite.

В настоящее время Vite работает над улучшенным API SSR с [Environment API](https://github.com/vitejs/vite/discussions/16358). Перейдите по ссылке для получения дополнительной информации.
:::

## Примеры проектов {#example-projects}

Vite предоставляет встроенную поддержку рендеринга на стороне сервера (SSR). [`create-vite-extra`](https://github.com/bluwy/create-vite-extra) содержит примеры настроек SSR, которые вы можете использовать в качестве справочных материалов:

- [Vanilla](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-vanilla)
- [Vue](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-vue)
- [React](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-react)
- [Preact](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-preact)
- [Svelte](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-svelte)
- [Solid](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-solid)

Вы также можете создать эти проекты локально, [запустив `create-vite`](./index.md#scaffolding-your-first-vite-project) и выбрав `Others > create-vite-extra` в опции фреймворка.

## Структура исходных файлов {#source-structure}

Типичное приложение SSR будет иметь следующую структуру исходных файлов:

```
- index.html
- server.js # main application server
- src/
  - main.js          # экспортирует код приложения, независимый от окружения (универсальный)
  - entry-client.js  # монтирует приложение к элементу DOM
  - entry-server.js  # рендерит приложение, используя API SSR фреймворка
```

Файл `index.html` должен ссылаться на `entry-client.js` и включать заглушку, куда будет вставлена разметка, отрендеренная на сервере:

```html
<div id="app"><!--ssr-outlet--></div>
<script type="module" src="/src/entry-client.js"></script>
```

Вы можете использовать любую заглушку по вашему выбору вместо `<!--ssr-outlet-->`, при условии, что её можно точно заменить.

## Условная логика {#conditional-logic}

Если вам нужно выполнить условную логику в зависимости от SSR или клиента, вы можете использовать

```js twoslash
import 'vite/client'
// ---cut---
if (import.meta.env.SSR) {
  // ... логика только для сервера
}
```

Это статически заменяется во время сборки, что позволяет выполнять tree-shaking («встряхивание дерева») неиспользуемого кода.

## Настройка dev-сервера {#setting-up-the-dev-server}

При создании приложения SSR вы, вероятно, захотите иметь полный контроль над вашим основным сервером и отделить Vite от продакшен-среды. Поэтому рекомендуется использовать Vite в режиме мидлвара. Вот пример с [express](https://expressjs.com/):

```js{15-18} twoslash [server.js]
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import { createServer as createViteServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function createServer() {
  const app = express()

  // Создаём сервер Vite в режиме мидлвара и настраиваем тип приложения как
  // 'custom', отключая собственную логику обслуживания HTML Vite, чтобы родительский сервер
  // мог взять на себя управление
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  })

  // Используем экземпляр Connect от Vite в качестве мидлвара. Если вы используете свой собственный
  // маршрутизатор express (express.Router()), вам следует использовать router.use.
  // Когда сервер перезапускается (например, после того, как пользователь изменяет
  // vite.config.js), `vite.middlewares` всё равно будет той же
  // ссылкой (с новым внутренним стеком Vite и мидлварами,
  // внедрёнными плагинами). Следующее будет действительным даже после перезапусков.
  app.use(vite.middlewares)

  app.use('*all', async (req, res) => {
    // Обслуживаем index.html - мы займемся этим далее
  })

  app.listen(5173)
}

createServer()
```

Здесь `vite` — это экземпляр [ViteDevServer](./api-javascript#vitedevserver). `vite.middlewares` — это экземпляр [Connect](https://github.com/senchalabs/connect), который можно использовать в качестве мидлвара в любом совместимом с Connect фреймворке Node.js.

Следующий шаг — реализовать обработчик `*`, чтобы обслуживать HTML, рендеренный на сервере:

```js twoslash [server.js]
// @noErrors
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/** @type {import('express').Express} */
var app
/** @type {import('vite').ViteDevServer}  */
var vite

// ---cut---
app.use('*all', async (req, res, next) => {
  const url = req.originalUrl

  try {
    // 1. Читаем index.html
    let template = fs.readFileSync(
      path.resolve(__dirname, 'index.html'),
      'utf-8',
    )

    // 2. Применяем трансформации HTML от Vite. Это внедряет клиент HMR Vite,
    //    а также применяет трансформации HTML от плагинов Vite, например,
    //    глобальные преамбулы от @vitejs/plugin-react
    template = await vite.transformIndexHtml(url, template)

    // 3. Загружаем серверный модуль. ssrLoadModule автоматически преобразует
    //    исходный код ESM для использования в Node.js! Не требуется сборка,
    //    и обеспечивается эффективная инвалидация, аналогичная HMR.
    const { render } = await vite.ssrLoadModule('/src/entry-server.js')

    // 4. Рендерим HTML приложения. Это предполагает, что экспортированная
    //    функция `render` из entry-server.js вызывает соответствующие API SSR фреймворка,
    //    например, ReactDOMServer.renderToString()
    const appHtml = await render(url)

    // 5. Внедряем HTML, рендеренный приложением, в шаблон.
    const html = template.replace(`<!--ssr-outlet-->`, appHtml)

    // 6. Отправляем рендеренный HTML обратно.
    res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
  } catch (e) {
    // При возникновении ошибки позволяем Vite исправить стек вызовов, чтобы он соответствовал
    // вашему фактическому исходному коду.
    vite.ssrFixStacktrace(e)
    next(e)
  }
})
```

Скрипт `dev` в `package.json` также следует изменить, чтобы использовать серверный скрипт:

```diff [package.json]
  "scripts": {
-   "dev": "vite"
+   "dev": "node server"
  }
```

## Продакшен-сборка {#building-for-production}

Чтобы подготовить проект SSR для продакшена, нам нужно:

1. Создать клиентскую сборку как обычно;
2. Создать сборку SSR, которую можно загружать напрямую через `import()`, чтобы нам не пришлось использовать `ssrLoadModule` от Vite;

Наши скрипты в `package.json` будут выглядеть так:

```json [package.json]
{
  "scripts": {
    "dev": "node server",
    "build:client": "vite build --outDir dist/client",
    "build:server": "vite build --outDir dist/server --ssr src/entry-server.js"
  }
}
```

Обратите внимание на флаг `--ssr`, который указывает, что это сборка SSR. Он также должен указывать на точку входа SSR.

Затем в `server.js` нам нужно добавить некоторую логику, специфичную для продакшен-режима, проверяя `process.env.NODE_ENV`:

- Вместо чтения корневого `index.html` используйте `dist/client/index.html` в качестве шаблона, так как он содержит правильные ссылки на ресурсы клиентской сборки.

- Вместо `await vite.ssrLoadModule('/src/entry-server.js')` используйте `import('./dist/server/entry-server.js')` (этот файл является результатом сборки SSR).

- Переместите создание и всё использование dev-сервера `vite` за условные ветви, предназначенные только для разработки, затем добавьте мидлвара для обслуживания статических файлов из `dist/client`.

Обратитесь к [примерам проектов](#example-projects) для продакшен-настройки.

## Генерация директив предварительной загрузки {#generating-preload-directives}

`vite build` поддерживает флаг `--ssrManifest`, который будет генерировать `.vite/ssr-manifest.json` в каталоге вывода сборки:

```diff
- "build:client": "vite build --outDir dist/client",
+ "build:client": "vite build --outDir dist/client --ssrManifest",
```

Указанный выше скрипт теперь будет генерировать `dist/client/.vite/ssr-manifest.json` для клиентской сборки (да, манифест SSR генерируется из клиентской сборки, потому что мы хотим сопоставить идентификаторы модулей с клиентскими файлами). Манифест содержит сопоставления идентификаторов модулей с их связанными чанками и файлами ресурсов.

Чтобы использовать манифест, фреймворки должны предоставить способ собирать идентификаторы модулей компонентов, которые использовались во время вызова рендеринга на сервере.

`@vitejs/plugin-vue` поддерживает это из коробки и автоматически регистрирует используемые идентификаторы модулей компонентов в соответствующем контексте Vue SSR:

```js [src/entry-server.js]
const ctx = {}
const html = await vueServerRenderer.renderToString(app, ctx)
// ctx.modules теперь является множеством идентификаторов модулей, которые были использованы во время рендеринга
```

В продакшен-ветке `server.js` нам нужно прочитать и передать манифест в функцию `render`, экспортируемую из `src/entry-server.js`. Это предоставит нам достаточно информации для рендеринга директив предварительной загрузки для файлов, используемых асинхронными маршрутами! См. [исходный код демки](https://github.com/vitejs/vite-plugin-vue/blob/main/playground/ssr-vue/src/entry-server.js) для полного примера.

## Предварительный рендеринг / SSG {#pre-rendering-ssg}

Если маршруты и данные, необходимые для определённых маршрутов, известны заранее, мы можем предварительно рендерить эти маршруты в статический HTML, используя ту же логику, что и для продакшен SSR. Это также можно рассматривать как форму генерации статических сайтов (SSG). См. [скрипт предварительного рендеринга демки](https://github.com/vitejs/vite-plugin-vue/blob/main/playground/ssr-vue/prerender.js) для рабочего примера.

## Внешние зависимости SSR {#ssr-externals}

Зависимости по умолчанию «внешние» для системы трансформации модулей SSR Vite при запуске SSR. Это ускоряет как разработку, так и сборку.

Если зависимость нуждается в трансформации через конвейер Vite, например, потому что в ней используются функции Vite без транспиляции, их можно добавить в [`ssr.noExternal`](../config/ssr-options.md#ssr-noexternal).

Для связанных зависимостей они по умолчанию не являются внешними, чтобы воспользоваться HMR Vite. Если это нежелательно, например, для тестирования зависимостей так, как будто они не связаны, вы можете добавить их в [`ssr.external`](../config/ssr-options.md#ssr-external).

:::warning Работа с псевдонимами
Если вы настроили псевдонимы, которые перенаправляют один пакет на другой, вы можете захотеть использовать псевдонимы для фактических пакетов из `node_modules`, чтобы это работало для внешних зависимостей SSR. Как [Yarn](https://classic.yarnpkg.com/en/docs/cli/add/#toc-yarn-add-alias), так и [pnpm](https://pnpm.io/aliases/) поддерживают создание псевдонимов с помощью префикса `npm:`.
:::

## Логика плагинов, специфичная для SSR {#ssr-specific-plugin-logic}

Некоторые фреймворки, такие как Vue или Svelte, компилируют компоненты в разные форматы в зависимости от клиента и SSR. Чтобы поддерживать условные трансформации, Vite передает дополнительное свойство `ssr` в объекте `options` следующих хуков плагинов:

- `resolveId`
- `load`
- `transform`

**Пример:**

```js twoslash
/** @type {() => import('vite').Plugin} */
// ---cut---
export function mySSRPlugin() {
  return {
    name: 'my-ssr',
    transform(code, id, options) {
      if (options?.ssr) {
        // выполняем трансформацию, специфичную для SSR...
      }
    },
  }
}
```

Объект options в `load` и `transform` является необязательным, Rollup в настоящее время не использует этот объект, но может расширить эти хуки дополнительными метаданными в будущем.

:::tip Примечание
До Vite 2.7 это передавалось хукам плагинов с помощью позиционного параметра `ssr` вместо использования объекта `options`. Все основные фреймворки и плагины обновлены, но вы можете встретить устаревшие сообщения, использующие предыдущий API.
:::

## Цель SSR {#ssr-target}

Целевая платформа для сборки SSR по умолчанию — это среда Node, но вы также можете запустить сервер в веб-воркере. Разрешение входных пакетов различается для каждой платформы. Вы можете задать в качестве цели веб-воркер, установив `ssr.target` в `'webworker'`.

## Сборка SSR {#ssr-bundle}

В некоторых случаях, таких как среды выполнения `webworker`, вы можете захотеть собрать вашу сборку SSR в один файл JavaScript. Вы можете включить это поведение, установив `ssr.noExternal` в `true`. Это приведет к двум действиям:

- Рассматривать все зависимости как `noExternal`
- Выдавать ошибку, если будут импортированы какие-либо встроенные модули Node.js

## Условия разрешения SSR {#ssr-resolve-conditions}

По умолчанию разрешение входных пакетов будет использовать условия, установленные в [`resolve.conditions`](../config/shared-options.md#resolve-conditions) для сборки SSR. Вы можете использовать [`ssr.resolve.conditions`](../config/ssr-options.md#ssr-resolve-conditions) и [`ssr.resolve.externalConditions`](../config/ssr-options.md#ssr-resolve-externalconditions), чтобы настроить это поведение.

## Vite CLI {#vite-cli}

Команды CLI `$ vite dev` и `$ vite preview` также могут использоваться для приложений SSR. Вы можете добавить свои мидлвары SSR к dev-серверу с помощью [`configureServer`](/guide/api-plugin#configureserver) и к серверу предварительного просмотра с помощью [`configurePreviewServer`](/guide/api-plugin#configurepreviewserver).

:::tip Примечание
Используйте пост-хук, чтобы ваш мидлвар SSR выполнялся _после_ мидлваров Vite.
:::
