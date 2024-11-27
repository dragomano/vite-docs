# Environment API для фреймворков {#environment-api-for-frameworks}

:::warning Экспериментально
Первоначальная работа над этим API была представлена в Vite 5.1 под названием «Vite Runtime API». Это руководство описывает пересмотренный API, переименованный в Environment API. Этот API будет выпущен в Vite 6 как экспериментальный. Вы уже можете протестировать его в последней версии `vite@6.0.0-beta.x`.

Ресурсы:

- [Обсуждение отзывов](https://github.com/vitejs/vite/discussions/16358), где мы собираем отзывы о новых API.
- [PR Environment API](https://github.com/vitejs/vite/pull/16471), где новый API был реализован и рассмотрен.

Пожалуйста, поделитесь с нами своими отзывами, пока вы тестируете предложение.
:::

## Окружения и фреймворки {#environments-and-frameworks}

Неявное окружение `ssr` и другие не-клиентские окружения по умолчанию используют `RunnableDevEnvironment` во время разработки. Хотя это требует, чтобы среда выполнения совпадала с той, в которой работает сервер Vite, это работает аналогично `ssrLoadModule` и позволяет фреймворкам мигрировать и включать HMR для их истории разработки SSR. Вы можете защитить любое исполняемое окружение с помощью функции `isRunnableDevEnvironment`.

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
`runner` оценивается жадно при первом доступе. Имейте в виду, что Vite включает поддержку карт источников, когда `runner` создаётся вызовом `process.setSourceMapsEnabled` или переопределением `Error.prepareStackTrace`, если это не доступно.
:::

## `RunnableDevEnvironment` по умолчанию {#default-runnabledevenvironment}

Учитывая сервер Vite, настроенный в режиме посредника, как описано в [руководстве по настройке SSR](/guide/ssr#setting-up-the-dev-server), давайте реализуем посредник SSR, используя Environment API. Обработка ошибок опущена.

```js
import { createServer } from 'vite'

const server = await createServer({
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
const environment = server.environments.node

app.use('*', async (req, res, next) => {
  const url = req.originalUrl

  // 1. Чтение index.html
  const indexHtmlPath = path.resolve(__dirname, 'index.html')
  let template = fs.readFileSync(indexHtmlPath, 'utf-8')

  // 2. Применение HTML-преобразований Vite. Это внедряет клиент HMR Vite,
  //    а также применяет HTML-преобразования от плагинов Vite, например,
  //    глобальные преамбулы от @vitejs/plugin-react
  template = await server.transformIndexHtml(url, template)

  // 3. Загрузка серверного входа. import(url) автоматически преобразует
  //    исходный код ESM для использования в Node.js! Не требуется сборка,
  //    и обеспечивается полная поддержка HMR.
  const { render } = await environment.runner.import('/src/entry-server.js')

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

## SSR, независимый от среды выполнения {#runtime-agnostic-ssr}

Поскольку `RunnableDevEnvironment` может использоваться только для выполнения кода в той же среде выполнения, что и сервер Vite, он требует среды выполнения, которая может запускать сервер Vite (среда выполнения, совместимая с Node.js). Это означает, что вам нужно будет использовать сырой `DevEnvironment`, чтобы сделать его независимым от среды выполнения.

:::info Предложение `FetchableDevEnvironment`

Первоначальное предложение имело метод `run` в классе `DevEnvironment`, который позволял потребителям вызывать импорт на стороне runner, используя опцию `transport`. В ходе нашего тестирования мы обнаружили, что API не был достаточно универсальным, чтобы начать его рекомендовать. В данный момент мы собираем отзывы о [предложении `FetchableDevEnvironment`](https://github.com/vitejs/vite/discussions/18191).

:::

`RunnableDevEnvironment` имеет функцию `runner.import`, которая возвращает значение модуля. Но эта функция недоступна в сыром `DevEnvironment` и требует, чтобы код, использующий API Vite, и пользовательские модули были отделены.

Например, следующий пример использует значение пользовательского модуля из кода, использующего API Vite:

```ts
// код, использующий API Vite
import { createServer } from 'vite'

const server = createServer()
const ssrEnvironment = server.environment.ssr
const input = {}

const { createHandler } = await ssrEnvironment.runner.import('./entry.js')
const handler = createHandler(input)
const response = handler(new Request('/'))

// -------------------------------------
// ./entrypoint.js
export function createHandler(input) {
  return function handler(req) {
    return new Response('hello')
  }
}
```

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
if (ssrEnvironment instanceof RunnableDevEnvironment) {
  ssrEnvironment.runner.import('virtual:entrypoint')
} else if (ssrEnvironment instanceof CustomDevEnvironment) {
  ssrEnvironment.runEntrypoint('virtual:entrypoint')
} else {
  throw new Error(`Unsupported runtime for ${ssrEnvironment.name}`)
}

// -------------------------------------
// virtual:entrypoint
const { createHandler } = await import('./entrypoint.js')
const handler = createHandler(input)
const response = handler(new Request('/'))

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

const req = new Request('/')

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

const response = handler(new Request('/'))

// -------------------------------------
// ./entrypoint.js
export function createHandler(input) {
  return function handler(req) {
    return new Response('hello')
  }
}
```

## Окружения во время сборки {#environments-during-build}

В CLI вызов `vite build` и `vite build --ssr` по-прежнему будет собирать только клиентские и только SSR окружения для обратной совместимости.

Когда `builder` не равен `undefined` (или при вызове `vite build --app`), `vite build` будет выбирать сборку всего приложения вместо этого. Это станет стандартным поведением в будущем мажорном релизе. Будет создан экземпляр `ViteBuilder` (эквивалент `ViteDevServer` во время сборки) для сборки всех настроенных окружений для продакшен-режима. По умолчанию сборка окружений выполняется последовательно, соблюдая порядок записи `environments`. Фреймворк или пользователь могут дополнительно настроить, как окружения будут собираться, используя:

```js
export default {
  builder: {
    buildApp: async (builder) => {
      const environments = Object.values(builder.environments)
      return Promise.all(
        environments.map((environment) => builder.build(environment)),
      )
    },
  },
}
```

## Код, независимый от окружения {#environment-agnostic-code}

Чаще всего текущий экземпляр `environment` будет доступен как часть контекста выполняемого кода, поэтому необходимость доступа к ним через `server.environments` должна быть редкой. Например, внутри хуков плагинов окружение доступно как часть `PluginContext`, поэтому к нему можно получить доступ с помощью `this.environment`. См. [Environment API для плагинов](./api-environment-plugins.md), чтобы узнать, как создавать плагины, учитывающие окружение.
