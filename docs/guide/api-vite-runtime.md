# Vite Runtime API {#vite-runtime-api}

:::warning Низкоуровневый API
Этот API был введён в Vite 5.1 как экспериментальная функция. Он был добавлен для [сбора отзывов](https://github.com/vitejs/vite/discussions/15774). Вероятно, будут изменения, которые могут привести к поломке, поэтому убедитесь, что вы зафиксировали версию Vite на `~5.1.0`, когда используете его. Это низкоуровневый API, предназначенный для авторов библиотек и фреймворков. Если ваша цель — создать приложение, сначала ознакомьтесь с более высокоуровневыми плагинами и инструментами SSR в разделе [Awesome Vite SSR](https://github.com/vitejs/awesome-vite#ssr).

В настоящее время API пересматривается как [Environment API](https://github.com/vitejs/vite/discussions/16358), который будет выпущен в `^6.0.0-alpha.0`.
:::

«Vite Runtime» — это инструмент, который позволяет выполнять любой код, предварительно обрабатывая его с помощью плагинов Vite. Он отличается от `server.ssrLoadModule`, потому что реализация среды выполнения отделена от сервера. Это позволяет авторам библиотек и фреймворков реализовывать свой собственный уровень взаимодействия между сервером и средой выполнения.

Одна из целей этой функции — предоставить настраиваемый API для обработки и выполнения кода. Vite предоставляет достаточно инструментов для использования Vite Runtime из коробки, но пользователи могут расширять его, если их потребности не совпадают с встроенной реализацией Vite.

Все API можно импортировать из `vite/runtime`, если не указано иное.

## `ViteRuntime`

**Сигнатура типа:**

```ts
export class ViteRuntime {
  constructor(
    public options: ViteRuntimeOptions,
    public runner: ViteModuleRunner,
    private debug?: ViteRuntimeDebugger,
  ) {}
  /**
   * URL для выполнения. Принимает путь к файлу, путь к серверу или идентификатор, относительный к корню.
   */
  public async executeUrl<T = any>(url: string): Promise<T>
  /**
   * URL точки входа для выполнения. Принимает путь к файлу, путь к серверу или идентификатор, относительный к корню.
   * В случае полного перезагрузки, вызванного HMR, это модуль, который будет перезагружен.
   * Если этот метод вызывается несколько раз, все точки входа будут перезагружены по одной.
   */
  public async executeEntrypoint<T = any>(url: string): Promise<T>
  /**
   * Очищает все кэши, включая слушатели HMR.
   */
  public clearCache(): void
  /**
   * Очищает все кэши, удаляет всех слушателей HMR и сбрасывает поддержку карт источников.
   * Этот метод не останавливает соединение HMR.
   */
  public async destroy(): Promise<void>
  /**
   * Возвращает `true`, если среда выполнения была уничтожено вызовом метода `destroy()`.
   */
  public isDestroyed(): boolean
}
```

::: tip Расширенное использование
Если вы просто мигрируете с `server.ssrLoadModule` и хотите поддерживать HMR, рассмотрите возможность использования [`createViteRuntime`](#createviteruntime).
:::

Класс `ViteRuntime` требует параметры `root` и `fetchModule` при инициализации. Vite предоставляет `ssrFetchModule` на экземпляре [`server`](/guide/api-javascript) для более простой интеграции с Vite SSR. Vite также экспортирует `fetchModule` из своей основной точки входа — он не делает никаких предположений о том, как выполняется код, в отличие от `ssrFetchModule`, который ожидает, что код будет выполняться с использованием `new Function`. Это можно увидеть в картах источников, которые возвращают эти функции.

Исполнитель в `ViteRuntime` отвечает за выполнение кода. Vite экспортирует `ESModulesRunner` из коробки, он использует `new AsyncFunction` для выполнения кода. Вы можете предоставить свою собственную реализацию, если ваша среда выполнения JavaScript не поддерживает небезопасную оценку.

Два основных метода, которые предоставляет среда выполнения, — это `executeUrl` и `executeEntrypoint`. Единственное различие между ними заключается в том, что все модули, выполняемые с помощью `executeEntrypoint`, будут повторно выполнены, если HMR вызовет событие `full-reload`. Имейте в виду, что Vite Runtime не обновляет объект `exports`, когда это происходит (он перезаписывает его), вам нужно будет снова выполнить `executeUrl` или получить модуль из `moduleCache`, если вы полагаетесь на наличие актуального объекта `exports`.

**Пример использования:**

```js
import { ViteRuntime, ESModulesRunner } from 'vite/runtime'
import { root, fetchModule } from './rpc-implementation.js'

const runtime = new ViteRuntime(
  {
    root,
    fetchModule,
    // Вы также можете предоставить `hmr.connection` для поддержки HMR
  },
  new ESModulesRunner(),
)

await runtime.executeEntrypoint('/src/entry-point.js')
```

## `ViteRuntimeOptions`

```ts
export interface ViteRuntimeOptions {
  /**
   * Корень проекта
   */
  root: string
  /**
   * Метод для получения информации о модуле.
   * Для SSR Vite предоставляет функцию `server.ssrFetchModule`, которую вы можете использовать здесь.
   * Для других случаев использования среды выполнения Vite также предоставляет `fetchModule` из своей основной точки входа.
   */
  fetchModule: FetchFunction
  /**
   * Настройте, как разрешаются карты источников. Предпочитает `node`, если доступен `process.setSourceMapsEnabled`.
   * В противном случае по умолчанию будет использоваться `prepareStackTrace`, который переопределяет метод `Error.prepareStackTrace`.
   * Вы можете предоставить объект для настройки того, как содержимое файлов и карты источников разрешаются для файлов, которые не были обработаны Vite.
   */
  sourcemapInterceptor?:
    | false
    | 'node'
    | 'prepareStackTrace'
    | InterceptorOptions
  /**
   * Отключить HMR или настроить параметры HMR.
   */
  hmr?:
    | false
    | {
        /**
         * Настройте, как HMR взаимодействует между клиентом и сервером.
         */
        connection: HMRRuntimeConnection
        /**
         * Configure HMR logger.
         */
        logger?: false | HMRLogger
      }
  /**
   * Пользовательский кэш модулей. Если не предоставлен, создается отдельный кэш модулей для каждого экземпляра ViteRuntime.
   */
  moduleCache?: ModuleCacheMap
}
```

## `ViteModuleRunner`

**Сигнатура типа:**

```ts
export interface ViteModuleRunner {
  /**
   * Выполняет код, который был преобразован Vite.
   * @param context Контекст функции
   * @param code Преобразованный код
   * @param id Идентификатор, который использовался для получения модуля
   */
  runViteModule(
    context: ViteRuntimeModuleContext,
    code: string,
    id: string,
  ): Promise<any>
  /**
   * Выполняет экстернализированный модуль.
   * @param file URL файла для внешнего модуля
   */
  runExternalModule(file: string): Promise<any>
}
```

Vite экспортирует `ESModulesRunner`, который по умолчанию реализует этот интерфейс. Он использует `new AsyncFunction` для выполнения кода, поэтому, если код содержит встроенную карту источников, она должна содержать [смещение в 2 строки](https://tc39.es/ecma262/#sec-createdynamicfunction), чтобы учесть добавленные новые строки. Это делается автоматически с помощью `server.ssrFetchModule`. Если ваша реализация исполнителя не имеет этого ограничения, вы должны использовать `fetchModule` (экспортируемый из `vite`) напрямую.

## `HMRRuntimeConnection` {#hmrruntimeconnection}

**Сигнатура типа:**

```ts
export interface HMRRuntimeConnection {
  /**
   * Проверяется перед отправкой сообщений клиенту.
   */
  isReady(): boolean
  /**
   * Отправляет сообщение клиенту.
   */
  send(message: string): void
  /**
   * Настройте, как обрабатывается HMR, когда это соединение вызывает обновление.
   * Этот метод ожидает, что соединение начнет прослушивать обновления HMR и вызовет этот колбек, когда они будут получены.
   */
  onUpdate(callback: (payload: HMRPayload) => void): void
}
```

Этот интерфейс определяет, как устанавливается связь HMR. Vite экспортирует `ServerHMRConnector` из основной точки входа для поддержки HMR во время Vite SSR. Методы `isReady` и `send` обычно вызываются, когда срабатывает пользовательское событие (например, `import.meta.hot.send("my-event")`).

`onUpdate` вызывается только один раз, когда инициализируется новая среда выполнения. Он передает метод, который должен быть вызван, когда соединение вызывает событие HMR. Реализация зависит от типа соединения (например, это может быть `WebSocket`/`EventEmitter`/`MessageChannel`), но обычно выглядит примерно так:

```js
function onUpdate(callback) {
  this.connection.on('hmr', (event) => callback(event.data))
}
```

Функция обратного вызова ставится в очередь, и она будет ждать, пока текущее обновление не завершшится, прежде чем обрабатывать следующее обновление. В отличие от реализации в браузере, обновления HMR в Vite Runtime ждут, пока все слушатели (например, `vite:beforeUpdate`/`vite:beforeFullReload`) не завершат свою работу, прежде чем обновить модули.

## `createViteRuntime`

**Сигнатура типа:**

```ts
async function createViteRuntime(
  server: ViteDevServer,
  options?: MainThreadRuntimeOptions,
): Promise<ViteRuntime>
```

**Пример использования:**

```js
import { createServer } from 'vite'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

;(async () => {
  const server = await createServer({
    root: __dirname,
  })
  await server.listen()

  const runtime = await createViteRuntime(server)
  await runtime.executeEntrypoint('/src/entry-point.js')
})()
```

Этот метод служит простым заменителем для `server.ssrLoadModule`. В отличие от `ssrLoadModule`, `createViteRuntime` предоставляет поддержку HMR из коробки. Вы можете передать [`options`](#mainthreadruntimeoptions), чтобы настроить поведение SSR среды выполнения в соответствии с вашими потребностями.

## `MainThreadRuntimeOptions`

```ts
export interface MainThreadRuntimeOptions
  extends Omit<ViteRuntimeOptions, 'root' | 'fetchModule' | 'hmr'> {
  /**
   * Отключить HMR или настроить логгер HMR.
   */
  hmr?:
    | false
    | {
        logger?: false | HMRLogger
      }
  /**
   * Предоставьте пользовательский исполнитель модулей. Это контролирует, как выполняется код.
   */
  runner?: ViteModuleRunner
}
```
