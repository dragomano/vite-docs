# Environment API для сред выполнения {#environment-api-for-runtimes}

:::info Релиз-кандидат
Environment API находится на стадии релиз-кандидата. Мы будем поддерживать стабильность API между основными релизами, чтобы экосистема могла экспериментировать и развиваться на их основе. Однако обратите внимание, что [некоторые конкретные API](/changes/#considering) всё ещё считаются экспериментальными.

Мы планируем стабилизировать эти новые API (с возможными критическими изменениями) в будущем крупном релизе, как только проекты, зависящие от них, получат достаточно времени для экспериментов и проверки новых функций.

Ресурсы:

- [Обсуждение отзывов](https://github.com/vitejs/vite/discussions/16358), где мы собираем отзывы о новых API.
- [Пулреквест](https://github.com/vitejs/vite/pull/16471), в котором новый API был реализован и рассмотрен.

Пожалуйста, поделитесь с нами своим мнением.
:::

## Фабрики окружений {#environment-factories}

Фабрики окружений предназначены для реализации поставщиками окружений, такими как Cloudflare, а не конечными пользователями. Фабрики окружений возвращают `EnvironmentOptions` для наиболее распространённого случая использования целевой среды выполнения как для окружений разработки, так и для сборки. Параметры окружения по умолчанию также могут быть установлены, чтобы пользователю не нужно было это делать.

```ts
function createWorkerdEnvironment(
  userConfig: EnvironmentOptions
): EnvironmentOptions {
  return mergeConfig(
    {
      resolve: {
        conditions: [
          /*...*/
        ]
      },
      dev: {
        createEnvironment(name, config) {
          return createWorkerdDevEnvironment(name, config, {
            hot: true,
            transport: customHotChannel()
          })
        }
      },
      build: {
        createEnvironment(name, config) {
          return createWorkerdBuildEnvironment(name, config)
        }
      }
    },
    userConfig
  )
}
```

Тогда файл конфигурации может быть записан следующим образом:

```js
import { createWorkerdEnvironment } from 'vite-environment-workerd'

export default {
  environments: {
    ssr: createWorkerdEnvironment({
      build: {
        outDir: '/dist/ssr'
      }
    }),
    rsc: createWorkerdEnvironment({
      build: {
        outDir: '/dist/rsc'
      }
    })
  }
}
```

и фреймворки могут использовать окружение со средой выполнения workerd для выполнения серверной отрисовки (SSR) с помощью:

```js
const ssrEnvironment = server.environments.ssr
```

## Создание новой фабрики окружений {#creating-a-new-environment-factory}

Сервер разработки Vite по умолчанию предоставляет два окружения: окружение `client` и окружение `ssr`. Окружение клиента по умолчанию является окружением браузера, а модульный раннер реализуется путём импорта виртуального модуля `/@vite/client` в клиентские приложения. Окружение SSR по умолчанию работает в том же процессе Node, что и сервер Vite, и позволяет серверам приложений обрабатывать запросы во время разработки с полной поддержкой HMR.

Преобразованный исходный код называется модулем, а отношения между модулями, обрабатываемыми в каждом окружении, хранятся в графе модулей. Преобразованный код для этих модулей отправляется в среды выполнения, связанные с каждым окружением, для выполнения. Когда модуль оценивается в среде выполнения, его импортированные модули запрашиваются, что инициирует обработку секции графа модулей.

Модульный раннер Vite позволяет выполнять любой код, предварительно обрабатывая его с помощью плагинов Vite. Это отличается от `server.ssrLoadModule`, поскольку реализация раннера отделена от сервера. Это позволяет авторам библиотек и фреймворков реализовать свой уровень взаимодействия между сервером Vite и раннером. Браузер взаимодействует с соответствующим окружением, используя WebSocket сервера и через HTTP-запросы. Модульный раннер Node может напрямую вызывать функции для обработки модулей, так как он работает в том же процессе. Другие окружения могут запускать модули, подключаясь к среде выполнения JS, такой как workerd, или к Worker Thread, как это делает Vitest.

Одна из целей этой функции — предоставить настраиваемый API для обработки и выполнения кода. Пользователи могут создавать новые фабрики окружений, используя открытые примитивы.

```ts
import { DevEnvironment, HotChannel } from 'vite'

function createWorkerdDevEnvironment(
  name: string,
  config: ResolvedConfig,
  context: DevEnvironmentContext
) {
  const connection = /* ... */
  const transport: HotChannel = {
    on: (listener) => { connection.on('message', listener) },
    send: (data) => connection.send(data),
  }

  const workerdDevEnvironment = new DevEnvironment(name, config, {
    options: {
      resolve: { conditions: ['custom'] },
      ...context.options,
    },
    hot: true,
    transport,
  })
  return workerdDevEnvironment
}
```

## `ModuleRunner`

Модульный раннер создается в целевой среде выполнения. Все API в следующем разделе импортируются из `vite/module-runner`, если не указано иное. Эта точка экспорта сохраняется как можно более легковесной, экспортируя только минимально необходимое для создания модульных раннеров.

**Сигнатура типа:**

```ts
export class ModuleRunner {
  constructor(
    public options: ModuleRunnerOptions,
    public evaluator: ModuleEvaluator = new ESModulesEvaluator(),
    private debug?: ModuleRunnerDebugger
  ) {}
  /**
   * URL для выполнения.
   * Принимает путь к файлу, путь к серверу или идентификатор, относительный к корню.
   */
  public async import<T = any>(url: string): Promise<T>
  /**
   * Очистить все кэши, включая слушатели HMR.
   */
  public clearCache(): void
  /**
   * Очистить все кэши, удалить всех слушателей HMR, сбросить поддержку sourcemap.
   * Этот метод не останавливает соединение HMR.
   */
  public async close(): Promise<void>
  /**
   * Возвращает `true`, если раннер был закрыт вызовом `close()`.
   */
  public isClosed(): boolean
}
```

Модульный оценщик в `ModuleRunner` отвечает за выполнение кода. Vite экспортирует `ESModulesEvaluator` из коробки, который использует `new AsyncFunction` для оценки кода. Вы можете предоставить свою реализацию, если ваша среда выполнения JavaScript не поддерживает небезопасную оценку.

Модульный раннер предоставляет метод `import`. Когда сервер Vite инициирует событие HMR `full-reload`, все затронутые модули будут переоценены. Имейте в виду, что модульный раннер не обновляет объект `exports`, когда это происходит (он перезаписывает его); вам нужно будет снова выполнить `import` или получить модуль из `evaluatedModules`, если вы полагаетесь на наличие последнего объекта `exports`.

**Пример использования:**

```js
import { ModuleRunner, ESModulesEvaluator } from 'vite/module-runner'
import { transport } from './rpc-implementation.js'

const moduleRunner = new ModuleRunner(
  {
    transport
  },
  new ESModulesEvaluator()
)

await moduleRunner.import('/src/entry-point.js')
```

## `ModuleRunnerOptions`

```ts twoslash
import type {
  InterceptorOptions as InterceptorOptionsRaw,
  ModuleRunnerHmr as ModuleRunnerHmrRaw,
  EvaluatedModules,
} from 'vite/module-runner'
import type { Debug } from '@type-challenges/utils'

type InterceptorOptions = Debug<InterceptorOptionsRaw>
type ModuleRunnerHmr = Debug<ModuleRunnerHmrRaw>
/** см. ниже */
type ModuleRunnerTransport = unknown

// ---cut---
interface ModuleRunnerOptions {
  /**
   * Набор методов для взаимодействия с сервером.
   */
  transport: ModuleRunnerTransport
  /**
   * Настройка того, как разрешаются sourcemap.
   * Предпочитает `node`, если доступен `process.setSourceMapsEnabled`.
   * В противном случае по умолчанию будет использоваться `prepareStackTrace`,
   * который переопределяет метод `Error.prepareStackTrace`.
   * Вы можете предоставить объект для настройки того, как содержимое файлов и
   * sourcemap разрешаются для файлов, которые не были обработаны Vite.
   */
  sourcemapInterceptor?:
    | false
    | 'node'
    | 'prepareStackTrace'
    | InterceptorOptions
  /**
   * Отключить HMR или настроить параметры HMR.
   *
   * @default true
   */
  hmr?: boolean | ModuleRunnerHmr
  /**
   * Пользовательский кэш модулей. Если не предоставлен, создается отдельный кэш модулей
   * для каждого экземпляра модульного раннера.
   */
  evaluatedModules?: EvaluatedModules
}
```

## `ModuleEvaluator`

**Сигнатура типа:**

```ts twoslash
import type { ModuleRunnerContext as ModuleRunnerContextRaw } from 'vite/module-runner'
import type { Debug } from '@type-challenges/utils'

type ModuleRunnerContext = Debug<ModuleRunnerContextRaw>

// ---cut---
export interface ModuleEvaluator {
  /**
   * Количество строк с префиксом в преобразованном коде.
   */
  startOffset?: number
  /**
   * Оценить код, который был преобразован Vite.
   * @param context Контекст функции
   * @param code Преобразованный код
   * @param id Идентификатор, который использовался для получения модуля
   */
  runInlinedModule(
    context: ModuleRunnerContext,
    code: string,
    id: string
  ): Promise<any>
  /**
   * Оценить экстернализированный модуль.
   * @param file URL файла для внешнего модуля
   */
  runExternalModule(file: string): Promise<any>
}
```

Vite экспортирует `ESModulesEvaluator`, который по умолчанию реализует этот интерфейс. Он использует `new AsyncFunction` для оценки кода, поэтому, если код содержит встроенный sourcemap, он должен содержать [смещение в 2 строки](https://tc39.es/ecma262/#sec-createdynamicfunction), чтобы учесть добавленные новые строки. Это делается автоматически `ESModulesEvaluator`. Пользовательские оценщики не будут добавлять дополнительные строки.

## `ModuleRunnerTransport`

**Сигнатура типа:**

```ts twoslash
import type { ModuleRunnerTransportHandlers } from 'vite/module-runner'
/** объект */
type HotPayload = unknown
// ---cut---
interface ModuleRunnerTransport {
  connect?(handlers: ModuleRunnerTransportHandlers): Promise<void> | void
  disconnect?(): Promise<void> | void
  send?(data: HotPayload): Promise<void> | void
  invoke?(data: HotPayload): Promise<{ result: any } | { error: any }>
  timeout?: number
}
```

Транспортный объект, который взаимодействует с окружением через RPC или путём прямого вызова функции. Когда метод `invoke` не реализован, необходимо реализовать методы `send` и `connect`. Vite будет внутренне конструировать `invoke`.

Вам нужно связать его с экземпляром `HotChannel` на сервере, как в этом примере, где модульный раннер создается в рабочем потоке:

::: code-group

```js [worker.js]
import { parentPort } from 'node:worker_threads'
import { fileURLToPath } from 'node:url'
import { ESModulesEvaluator, ModuleRunner } from 'vite/module-runner'

/** @type {import('vite/module-runner').ModuleRunnerTransport} */
const transport = {
  connect({ onMessage, onDisconnection }) {
    parentPort.on('message', onMessage)
    parentPort.on('close', onDisconnection)
  },
  send(data) {
    parentPort.postMessage(data)
  }
}

const runner = new ModuleRunner(
  {
    transport
  },
  new ESModulesEvaluator()
)
```

```js [server.js]
import { BroadcastChannel } from 'node:worker_threads'
import { createServer, RemoteEnvironmentTransport, DevEnvironment } from 'vite'

function createWorkerEnvironment(name, config, context) {
  const worker = new Worker('./worker.js')
  const handlerToWorkerListener = new WeakMap()

  const workerHotChannel = {
    send: (data) => worker.postMessage(data),
    on: (event, handler) => {
      if (event === 'connection') return

      const listener = (value) => {
        if (value.type === 'custom' && value.event === event) {
          const client = {
            send(payload) {
              worker.postMessage(payload)
            }
          }
          handler(value.data, client)
        }
      }
      handlerToWorkerListener.set(handler, listener)
      worker.on('message', listener)
    },
    off: (event, handler) => {
      if (event === 'connection') return
      const listener = handlerToWorkerListener.get(handler)
      if (listener) {
        worker.off('message', listener)
        handlerToWorkerListener.delete(handler)
      }
    }
  }

  return new DevEnvironment(name, config, {
    transport: workerHotChannel
  })
}

await createServer({
  environments: {
    worker: {
      dev: {
        createEnvironment: createWorkerEnvironment
      }
    }
  }
})
```

:::

Другой пример, использующий HTTP-запрос для взаимодействия между раннером и сервером:

```ts
import { ESModulesEvaluator, ModuleRunner } from 'vite/module-runner'

export const runner = new ModuleRunner(
  {
    transport: {
      async invoke(data) {
        const response = await fetch(`http://my-vite-server/invoke`, {
          method: 'POST',
          body: JSON.stringify(data)
        })
        return response.json()
      }
    }
    hmr: false, // отключите HMR, так как для HMR требуется transport.connect
  },
  new ESModulesEvaluator()
)

await runner.import('/entry.js')
```

В этом случае можно использовать метод `handleInvoke` в `NormalizedHotChannel`:

```ts
const customEnvironment = new DevEnvironment(name, config, context)

server.onRequest((request: Request) => {
  const url = new URL(request.url)
  if (url.pathname === '/invoke') {
    const payload = (await request.json()) as HotPayload
    const result = customEnvironment.hot.handleInvoke(payload)
    return new Response(JSON.stringify(result))
  }
  return Response.error()
})
```

Но обратите внимание, что для поддержки HMR методы `send` и `connect` обязательны. Метод `send` обычно вызывается, когда срабатывает пользовательское событие (например, `import.meta.hot.send("my-event")`).

Vite экспортирует `createServerHotChannel` из основной точки входа для поддержки HMR во время серверного рендеринга Vite.
