# Environment API для фреймворков {#environment-api-for-frameworks}

:::info Релиз-кандидат
Environment API находится на стадии релиз-кандидата. Мы будем поддерживать стабильность API между основными релизами, чтобы экосистема могла экспериментировать и развиваться на их основе. Однако обратите внимание, что [некоторые конкретные API](/changes/#considering) всё ещё считаются экспериментальными.

Мы планируем стабилизировать эти новые API (с возможными критическими изменениями) в будущем крупном релизе, как только проекты, зависящие от них, получат достаточно времени для экспериментов и проверки новых функций.

Ресурсы:

- [Обсуждение отзывов](https://github.com/vitejs/vite/discussions/16358), где мы собираем отзывы о новых API.
- [Пулреквест](https://github.com/vitejs/vite/pull/16471), в котором новый API был реализован и рассмотрен.

Пожалуйста, поделитесь с нами своим мнением.
:::

## Уровни взаимодействия DevEnvironment {#devenvironment-communication-levels}

Поскольку среды могут выполняться в разных рантаймах, взаимодействие со средой может иметь ограничения в зависимости от рантайма. Чтобы фреймворки могли легко писать код, не зависящий от рантайма, Environment API предоставляет три уровня взаимодействия.

### `RunnableDevEnvironment`

`RunnableDevEnvironment` — это среда, которая может обмениваться произвольными JavaScript-значениями с кодом вашего приложения. Импорт модуля возвращает его реальные, «живые» экспорты (функции, экземпляры классов и любые другие значения), поэтому фреймворки могут напрямую запускать свои серверные точки входа. Неявное окружение `ssr` и другие окружения, отличные от клиентского, по умолчанию используют `RunnableDevEnvironment` во время разработки. Доступ к раннеру можно защитить с помощью функции `isRunnableDevEnvironment`.

Его свойство `runner` — это `ModuleRunner`. Вы импортируете модули через него с помощью `runner.import(url)`, который загружает, трансформирует и выполняет модуль из графа модулей Vite (в `url` можно передать путь к файлу, серверный путь или id относительно корня) и возвращает инстанцированный модуль с полной поддержкой HMR. Это современная замена для `server.ssrLoadModule`, поэтому фреймворки могут мигрировать на него, чтобы включить HMR в своей SSR-разработке.

:::info Почему оно может обмениваться произвольными значениями
`RunnableDevEnvironment` выполняет модули в том же рантайме, что и сервер Vite, поэтому значения передаются между ними внутри процесса, без сериализации. Именно это отличает его от [`FetchableDevEnvironment`](#fetchabledevenvironment), который может обмениваться данными только через сериализованные объекты `Request`/`Response` по Fetch API. В результате использование `RunnableDevEnvironment` требует, чтобы рантайм раннера совпадал с рантаймом, в котором работает сервер Vite.
:::

```ts
export class RunnableDevEnvironment extends DevEnvironment {
  public readonly runner: ModuleRunner
}

class ModuleRunner {
  /**
   * URL для выполнения.
   * Принимает путь к файлу, путь к серверу или идентификатор относительно корня.
   * Возвращает экземпляр модуля (такой же, как в ssrLoadModule)
   */
  public async import(url: string): Promise<Record<string, any>>
  /**
   * Другие методы ModuleRunner...
   */
}

if (isRunnableDevEnvironment(server.environments.ssr)) {
  await server.environments.ssr.runner.import('/entry-point.js')
}
```

:::warning
`runner` вычисляется лениво (lazy evaluation) только при первом обращении к нему. Обратите внимание, что Vite включает поддержку карт источников (source maps) при создании `runner` через вызов `process.setSourceMapsEnabled` или переопределением `Error.prepareStackTrace`, если первый метод недоступен.
:::

Учитывая сервер Vite, настроенный в режиме мидлвара, как описано в [руководстве по настройке SSR](/guide/ssr#setting-up-the-dev-server), давайте реализуем мидлвар SSR, используя Environment API. Помните, что это не обязательно должно называться `ssr`, поэтому в этом примере мы назовём его `server`. Обработка ошибок опущена.

```js
import fs from 'node:fs'
import path from 'node:path'
import { createServer } from 'vite'

const viteServer = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  environments: {
    server: {
      // по умолчанию модули выполняются в том же процессе, что и сервер Vite.
    },
  },
})

// Возможно, вам потребуется привести это к RunnableDevEnvironment в TypeScript или
// использовать isRunnableDevEnvironment для защиты доступа к runner
const serverEnvironment = viteServer.environments.server

app.use('*', async (req, res, next) => {
  const url = req.originalUrl

  // 1. Чтение index.html
  const indexHtmlPath = path.resolve(import.meta.dirname, 'index.html')
  let template = fs.readFileSync(indexHtmlPath, 'utf-8')

  // 2. Применение HTML-преобразований Vite. Это внедряет клиент HMR Vite,
  //    а также применяет HTML-преобразования от плагинов Vite, например,
  //    глобальные преамбулы от @vitejs/plugin-react
  template = await viteServer.transformIndexHtml(url, template)

  // 3. Загрузка серверного входа. import(url) автоматически преобразует
  //    исходный код ESM для использования в Node.js! Не требуется сборка,
  //    и обеспечивается полная поддержка HMR.
  const { render } = await serverEnvironment.runner.import(
    '/src/entry-server.js',
  )

  // 4. Рендеринг HTML приложения. Это предполагает, что экспортированная
  //    функция `render` entry-server.js вызывает соответствующие API SSR фреймворка,
  //    например, ReactDOMServer.renderToString()
  const appHtml = await render(url)

  // 5. Внедрение HTML, отрендеренного приложением, в шаблон.
  const html = template.replace(`<!--ssr-outlet-->`, appHtml)

  // 6. Отправка отрендеренного HTML обратно.
  res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
})
```

При использовании сред, поддерживающих HMR (таких как `RunnableDevEnvironment`), в ваш серверный входной файл следует добавить `import.meta.hot.accept()`, для оптимального поведения. Без этой правки изменения в серверных файлах приведут к инвалидации всего графа серверных модулей:

```js
// src/entry-server.js
export function render(...) { ... }

if (import.meta.hot) {
  import.meta.hot.accept()
}
```

### `FetchableDevEnvironment`

:::info

Мы ждём ваших отзывов о [предложении `FetchableDevEnvironment`](https://github.com/vitejs/vite/discussions/18191).

:::

`FetchableDevEnvironment` — это среда, которая может взаимодействовать со своим рантаймом через интерфейс [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch). Поскольку `RunnableDevEnvironment` можно реализовать только в ограниченном наборе рантаймов, мы рекомендуем использовать `FetchableDevEnvironment` вместо `RunnableDevEnvironment`.

Распространённая причина использовать его — это фреймворк, который хочет поддерживать рантайм, где Vite не может работать напрямую (например, Cloudflare Workers). В таком случае `RunnableDevEnvironment` использовать нельзя, поскольку он требует, чтобы раннер разделял рантайм сервера Vite, позволяя значениям пересекать границу внутри процесса. Стандартизация на Fetch API позволяет фреймворку сохранять единый путь обработки запросов для всех целевых рантаймов: его dev-middleware пересылает каждый входящий запрос от браузера как `Request` и возвращает полученный `Response` обратно в браузер, полностью отражая то, как приложение обрабатывает запросы в продакшене.

Эта среда предоставляет стандартизированный способ обработки запросов через метод `handleRequest`:

```ts
import {
  createServer,
  createFetchableDevEnvironment,
  isFetchableDevEnvironment,
} from

const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  environments: {
    custom: {
      dev: {
        createEnvironment(name, config) {
          return createFetchableDevEnvironment(name, config, {
            handleRequest(request: Request): Promise<Response> | Response {
              // обрабатываем Request и возвращаем Response
            },
          })
        },
      },
    },
  },
})

// Любой потребитель Environment API теперь может вызывать `dispatchFetch`:
if (isFetchableDevEnvironment(server.environments.custom)) {
  const response: Response = await server.environments.custom.dispatchFetch(
    new Request('http://example.com/request-to-handle'),
  )
}
```

:::warning
Vite проверяет входные и выходные данные метода `dispatchFetch`: запрос должен быть экземпляром глобального класса `Request`, а ответ - экземпляром глобального класса `Response`. Vite выбросит `TypeError`, если это не так.

Обратите внимание, что хотя `FetchableDevEnvironment` реализован как класс, команда Vite считает это деталью реализации, которая может измениться в любой момент.
:::

### `DevEnvironment` {#raw-devenvironment}

Если среда не реализует интерфейсы `RunnableDevEnvironment` или `FetchableDevEnvironment`, вам нужно вручную настраивать коммуникацию.

Если ваш код может выполняться в той же среде выполнения, что и пользовательские модули (т. е. он не зависит от специфичных для Node.js API), вы можете использовать виртуальный модуль. Этот подход устраняет необходимость доступа к значению из кода, использующего API Vite.

```ts
// код, использующий API Vite
import { createServer } from 'vite'

const server = createServer({
  plugins: [
    // плагин, который обрабатывает `virtual:entrypoint`
    {
      name: 'virtual-module',
      /* имплементация плагина */
    },
  ],
})
const ssrEnvironment = server.environment.ssr
const input = {}

// используйте открытые функции от каждой фабрики окружений, которые выполняют код
// проверьте, что они предоставляют для каждой фабрики окружений
if (ssrEnvironment instanceof CustomDevEnvironment) {
  ssrEnvironment.runEntrypoint('virtual:entrypoint')
} else {
  throw new Error(`Unsupported runtime for ${ssrEnvironment.name}`)
}

// -------------------------------------
// virtual:entrypoint
const { createHandler } = await import('./entrypoint.js')
const handler = createHandler(input)
const response = handler(new Request('http://example.com/'))

// -------------------------------------
// ./entrypoint.js
export function createHandler(input) {
  return function handler(req) {
    return new Response('hello')
  }
}
```

Например, чтобы вызвать `transformIndexHtml` на пользовательском модуле, можно использовать следующий плагин:

```ts {13-21}
function vitePluginVirtualIndexHtml(): Plugin {
  let server: ViteDevServer | undefined
  return {
    name: vitePluginVirtualIndexHtml.name,
    configureServer(server_) {
      server = server_
    },
    resolveId(source) {
      return source === 'virtual:index-html' ? '\0' + source : undefined
    },
    async load(id) {
      if (id === '\0' + 'virtual:index-html') {
        let html: string
        if (server) {
          this.addWatchFile('index.html')
          html = fs.readFileSync('index.html', 'utf-8')
          html = await server.transformIndexHtml('/', html)
        } else {
          html = fs.readFileSync('dist/client/index.html', 'utf-8')
        }
        return `export default ${JSON.stringify(html)}`
      }
      return
    },
  }
}
```

Если ваш код требует API Node.js, вы можете использовать `hot.send` для связи с кодом, который использует API Vite из пользовательских модулей. Однако имейте в виду, что этот подход может работать не так же после процесса сборки.

```ts
// код, использующий API Vite
import { createServer } from 'vite'

const server = createServer({
  plugins: [
    // плагин, который обрабатывает `virtual:entrypoint`
    {
      name: 'virtual-module',
      /* имплементация плагина */
    },
  ],
})
const ssrEnvironment = server.environment.ssr
const input = {}

// используйте открытые функции от каждой фабрики окружений, которые выполняют код
// проверьте, что они предоставляют для каждой фабрики окружений
if (ssrEnvironment instanceof RunnableDevEnvironment) {
  ssrEnvironment.runner.import('virtual:entrypoint')
} else if (ssrEnvironment instanceof CustomDevEnvironment) {
  ssrEnvironment.runEntrypoint('virtual:entrypoint')
} else {
  throw new Error(`Unsupported runtime for ${ssrEnvironment.name}`)
}

const req = new Request('http://example.com/')

const uniqueId = 'a-unique-id'
ssrEnvironment.send('request', serialize({ req, uniqueId }))
const response = await new Promise((resolve) => {
  ssrEnvironment.on('response', (data) => {
    data = deserialize(data)
    if (data.uniqueId === uniqueId) {
      resolve(data.res)
    }
  })
})

// -------------------------------------
// virtual:entrypoint
const { createHandler } = await import('./entrypoint.js')
const handler = createHandler(input)

import.meta.hot.on('request', (data) => {
  const { req, uniqueId } = deserialize(data)
  const res = handler(req)
  import.meta.hot.send('response', serialize({ res: res, uniqueId }))
})

const response = handler(new Request('http://example.com/'))

// -------------------------------------
// ./entrypoint.js
export function createHandler(input) {
  return function handler(req) {
    return new Response('hello')
  }
}
```

## Окружения во время сборки {#environments-during-build}

В CLI вызов `vite build` и `vite build --ssr` по-прежнему будет собирать только клиентское или только SSR-окружение для обеспечения обратной совместимости.

Когда параметр `builder` установлен (даже в виде пустого объекта `{}`, что делает команда `vite build --app`), `vite build` переключается в режим сборки всего приложения. В будущей major-версии это станет поведением по умолчанию. В этом режиме Vite создаёт экземпляр `ViteBuilder` (эквивалент `ViteDevServer` для сборки) и использует его для сборки всех настроенных окружений в продакшене. По умолчанию окружения собираются последовательно, в порядке, заданном в записи `environments`.

### Настройка сборки приложения через `builder.buildApp` {#configuring-the-app-build-with-builder-buildapp}

Фреймворк или пользователь может управлять процессом сборки окружений через параметр `builder.buildApp`. Он получает экземпляр `ViteBuilder` (в примере ниже назван `builder`) и отвечает за сборку каждого окружения. Например, чтобы собрать часть окружений параллельно:

```js [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  builder: {
    buildApp: async (builder) => {
      const environments = Object.values(builder.environments)
      await Promise.all(
        environments.map((environment) => builder.build(environment)),
      )
    },
  },
})
```

### Хук плагина `buildApp` {#the-buildapp-plugin-hook}

- **Тип:** `(this: MinimalPluginContextWithoutEnvironment, builder: ViteBuilder) => Promise<void>`
- **Режим работы:** `async`, `sequential`
- **Область применения:** [Глобальная](/guide/api-environment-plugins#per-environment-hooks-and-global-hooks)

Помимо опции конфигурации `builder.buildApp`, плагины могут определять хук `buildApp`, чтобы участвовать в сборке приложения. Опция конфигурации и хуки плагинов выполняются в определённом порядке: сначала хуки с порядком `'pre'` или `null`, затем настроенный `builder.buildApp`, а потом хуки с порядком `'post'`. Внутри хука свойство `environment.isBuilt` сообщает, было ли окружение уже собрано, что позволяет плагину избежать повторной сборки.

### Программная сборка с помощью `createBuilder` {#building-programmatically-with-createbuilder}

Чтобы запустить сборку приложения из своего кода, используйте `createBuilder` вместо самостоятельной функции `build`. `createBuilder` — это эквивалент `createServer` на этапе сборки: он обрабатывает конфигурацию и возвращает `ViteBuilder`, метод `buildApp` которого собирает все настроенные окружения. Вы также можете собрать одно конкретное окружение с помощью `builder.build(environment)`.

```js [build.js]
import { createBuilder } from 'vite'

const builder = await createBuilder()
await builder.buildApp()
```

`createBuilder` заменяет самостоятельную функцию `build` для сборок с поддержкой окружений. Функция `build` по-прежнему работает как простой вход для устаревших сборок только клиента и только SSR, описанных выше, но она не может собирать произвольные окружения. Вызов `builder.buildApp()` — это программный эквивалент команды `vite build --app`.

## Код, независимый от окружения {#environment-agnostic-code}

Чаще всего текущий экземпляр `environment` будет доступен как часть контекста выполняемого кода, поэтому необходимость доступа к ним через `server.environments` должна быть редкой. Например, внутри хуков плагинов окружение доступно как часть `PluginContext`, поэтому к нему можно получить доступ с помощью `this.environment`. См. [Environment API для плагинов](./api-environment-plugins.md), чтобы узнать, как создавать плагины, учитывающие окружение.
