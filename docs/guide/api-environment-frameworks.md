# Environment API для фреймворков {#environment-api-for-frameworks}

:::warning Экспериментально
Environment API находится на экспериментальной стадии. Мы будем сохранять стабильность API между крупными релизами, чтобы дать экосистеме возможность экспериментировать и развивать их. Планируется стабилизировать эти новые API (с возможными значительными изменениями) в будущем крупном релизе после того, как проекты-потребители смогут протестировать новые функции и подтвердить их работоспособность.

Ресурсы:

- [Обсуждение отзывов](https://github.com/vitejs/vite/discussions/16358), где мы собираем отзывы о новых API.
- [Пулреквест](https://github.com/vitejs/vite/pull/16471), в котором новый API был реализован и рассмотрен.

Пожалуйста, поделитесь с нами своим мнением.
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
`runner` вычисляется лениво (lazy evaluation) только при первом обращении к нему. Обратите внимание, что Vite включает поддержку карт источников (source maps) при создании `runner` через вызов `process.setSourceMapsEnabled` или переопределением `Error.prepareStackTrace`, если первый метод недоступен.
:::

Фреймворки, которые взаимодействуют со своей средой выполнения через [Fetch API](https://developer.mozilla.org/ru/docs/Web/API/Window/fetch), могут использовать `FetchableDevEnvironment`, предоставляющий стандартизированный способ обработки запросов через метод `handleRequest`:

```ts
import {
  createServer,
  createFetchableDevEnvironment,
  isFetchableDevEnvironment,
} from 'vite'

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

// Теперь любой компонент, использующий Environment API, может вызывать `dispatchFetch`
if (isFetchableDevEnvironment(server.environments.custom)) {
  const response: Response = await server.environments.custom.dispatchFetch(
    new Request('/request-to-handle'),
  )
}
```

:::warning
Vite выполняет валидацию входных и выходных данных метода `dispatchFetch`:
- Запрос должен быть экземпляром глобального класса `Request`
- Ответ должен быть экземпляром глобального класса `Response`

В случае несоответствия Vite выбросит ошибку `TypeError`.

Хотя `FetchableDevEnvironment` реализован как класс, команда Vite считает это деталью реализации, которая может измениться в любой момент.
:::

## `RunnableDevEnvironment` по умолчанию {#default-runnabledevenvironment}

Учитывая сервер Vite, настроенный в режиме мидлвара, как описано в [руководстве по настройке SSR](/guide/ssr#setting-up-the-dev-server), давайте реализуем мидлвар SSR, используя Environment API. Помните, что это не обязательно должно называться `ssr`, поэтому в этом примере мы назовём его `server`. Обработка ошибок опущена.

```js
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

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
  const indexHtmlPath = path.resolve(__dirname, 'index.html')
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

## SSR, независимый от среды выполнения {#runtime-agnostic-ssr}

Поскольку `RunnableDevEnvironment` может использоваться только для выполнения кода в той же среде выполнения, что и сервер Vite, он требует среды выполнения, которая может запускать сервер Vite (среда выполнения, совместимая с Node.js). Это означает, что вам нужно будет использовать базовый `DevEnvironment`, чтобы сделать его независимым от среды выполнения.

:::info Предложение `FetchableDevEnvironment`

Первоначальное предложение включало метод `run` в классе `DevEnvironment`, позволяющий вызывать импорт на стороне раннера, используя опцию `transport`. В ходе нашего тестирования мы обнаружили, что API не был достаточно универсальным, чтобы начать его рекомендовать. Сейчас мы собираем отзывы о [предложении `FetchableDevEnvironment`](https://github.com/vitejs/vite/discussions/18191).

:::

`RunnableDevEnvironment` имеет функцию `runner.import`, которая возвращает значение модуля. Но эта функция недоступна в базовом `DevEnvironment` и требует, чтобы код, использующий API Vite, и пользовательские модули были отделены.

Например, следующий пример использует значение пользовательского модуля из кода, использующего API Vite:

```ts
// код, использующий API Vite
import { createServer } from 'vite'

const server = createServer()
const ssrEnvironment = server.environment.ssr
const input = {}

const { createHandler } = await ssrEnvironment.runner.import('./entrypoint.js')
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

В CLI вызов `vite build` и `vite build --ssr` по-прежнему будет собирать только клиентское или только SSR-окружение для обеспечения обратной совместимости.

Когда `builder` не является `undefined` (или при вызове `vite build --app`), `vite build` будет собирать всё приложение целиком. В будущем это станет поведением по умолчанию в мажорной версии. Будет создан экземпляр `ViteBuilder` (эквивалент `ViteDevServer` для сборки), чтобы собрать все настроенные окружения для продакшена. По умолчанию сборка окружений выполняется последовательно с учетом порядка, указанного в записи `environments`. Фреймворк или пользователь могут дополнительно настроить, как собираются окружения, используя:

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

Плагины также могут определять хук `buildApp`. Хуки с порядком `'pre'` и `null` выполняются до настроенного `builder.buildApp`, а хуки с порядком `'post'` — после него. Свойство `environment.isBuilt` можно использовать для проверки, было ли окружение уже построено.

## Код, независимый от окружения {#environment-agnostic-code}

Чаще всего текущий экземпляр `environment` будет доступен как часть контекста выполняемого кода, поэтому необходимость доступа к ним через `server.environments` должна быть редкой. Например, внутри хуков плагинов окружение доступно как часть `PluginContext`, поэтому к нему можно получить доступ с помощью `this.environment`. См. [Environment API для плагинов](./api-environment-plugins.md), чтобы узнать, как создавать плагины, учитывающие окружение.
