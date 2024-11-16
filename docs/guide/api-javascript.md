# JavaScript API {#javascript-api}

JavaScript API Vite полностью типизированы, и рекомендуется использовать TypeScript или включить проверку типов JS в VS Code, чтобы воспользоваться интуитивным вводом и валидацией.

## `createServer`

**Сигнатура типа:**

```ts
async function createServer(inlineConfig?: InlineConfig): Promise<ViteDevServer>
```

**Пример использования:**

```ts twoslash
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const server = await createServer({
  // любые допустимые параметры конфигурации пользователя, а также `mode` и `configFile`
  configFile: false,
  root: __dirname,
  server: {
    port: 1337,
  },
})
await server.listen()

server.printUrls()
server.bindCLIShortcuts({ print: true })
```

::: tip ПРИМЕЧАНИЕ
При использовании `createServer` и `build` в одном и том же процессе Node.js обе функции зависят от `process.env.NODE_ENV` для правильной работы, что также зависит от параметра конфигурации `mode`. Чтобы избежать конфликтующего поведения, установите `process.env.NODE_ENV` или `mode` для двух API в значение `development`. В противном случае вы можете запустить дочерний процесс для выполнения API отдельно.
:::

::: tip ПРИМЕЧАНИЕ
При использовании [режима посредника](/config/server-options.html#server-middlewaremode) в сочетании с [конфигурацией прокси для WebSocket](/config/server-options.html#server-proxy) родительский http-сервер должен быть предоставлен в `middlewareMode`, чтобы правильно привязать прокси.

<details>
<summary>Пример</summary>

```ts twoslash
import http from 'http'
import { createServer } from 'vite'

const parentServer = http.createServer() // или express, koa и т. д.

const vite = await createServer({
  server: {
    // Включаем режим посредника
    middlewareMode: {
      // Предоставляем родительский http-сервер для прокси WebSocket
      server: parentServer,
    },
    proxy: {
      '/ws': {
        target: 'ws://localhost:3000',
        // Проксируем WebSocket
        ws: true,
      },
    },
  },
})

// @noErrors: 2339
parentServer.use(vite.middlewares)
```

</details>
:::

## `InlineConfig`

Интерфейс `InlineConfig` расширяет `UserConfig` дополнительными свойствами:

- `configFile`: укажите файл конфигурации для использования. Если не установлен, Vite попытается автоматически разрешить его из корня проекта. Установите в `false`, чтобы отключить автоматическое разрешение.
- `envFile`: Установите в `false`, чтобы отключить файлы `.env`.

## `ResolvedConfig`

Интерфейс `ResolvedConfig` имеет все те же свойства, что и `UserConfig`, за исключением того, что большинство свойств разрешены и не равны `undefined`. Он также содержит утилиты, такие как:

- `config.assetsInclude`: Функция для проверки, считается ли `id` ресурсом.
- `config.logger`: Внутренний объект логгера Vite.

## `ViteDevServer`

```ts
interface ViteDevServer {
  /**
   * Разрешенный объект конфигурации Vite.
   */
  config: ResolvedConfig
  /**
   * Экземпляр приложения connect
   * - Может использоваться для подключения пользовательских посредников к dev-серверу.
   * - Также может использоваться в качестве функции обработчика для пользовательского http-сервера
   *   или в качестве посредника в любых фреймворках Node.js в стиле connect.
   *
   * https://github.com/senchalabs/connect#use-middleware
   */
  middlewares: Connect.Server
  /**
   * Экземпляр нативного http-сервера Node.
   * Будет равен null в режиме посредника.
   */
  httpServer: http.Server | null
  /**
   * Экземпляр наблюдателя Chokidar. Если `config.server.watch` установлен в `null`,
   * возвращает объект-эмиттер событий без действий (noop).
   * https://github.com/paulmillr/chokidar#api
   */
  watcher: FSWatcher
  /**
   * Сервер WebSocket с методом `send(payload)`.
   */
  ws: WebSocketServer
  /**
   * Контейнер плагина Rollup, который может выполнять хуки плагина для заданного файла.
   */
  pluginContainer: PluginContainer
  /**
   * Граф модуля, который отслеживает отношения импорта, сопоставление URL с файлами
   * и состояние HMR (горячей замены модулей).
   */
  moduleGraph: ModuleGraph
  /**
   * Разрешенные URL-адреса, которые Vite выводит в CLI. Будет равен null в режиме посредника или
   * до вызова `server.listen`.
   */
  resolvedUrls: ResolvedServerUrls | null
  /**
   * Программно разрешить, загрузить и преобразовать URL и получить результат
   * без прохождения через конвейер http-запросов.
   */
  transformRequest(
    url: string,
    options?: TransformOptions,
  ): Promise<TransformResult | null>
  /**
   * Применить встроенные преобразования HTML Vite и любые преобразования HTML плагинов.
   */
  transformIndexHtml(
    url: string,
    html: string,
    originalUrl?: string,
  ): Promise<string>
  /**
   * Загрузить заданный URL как инстанцированный модуль для SSR (серверного рендеринга).
   */
  ssrLoadModule(
    url: string,
    options?: { fixStacktrace?: boolean },
  ): Promise<Record<string, any>>
  /**
   * Исправить стек вызовов ошибок SSR (серверного рендеринга).
   */
  ssrFixStacktrace(e: Error): void
  /**
   * Запускает HMR (горячую замену модулей) для модуля в графе модулей. Вы можете использовать API `server.moduleGraph`
   * для получения модуля, который нужно перезагрузить. Если `hmr` установлен в false, это не выполняет никаких действий (no-op).
   */
  reloadModule(module: ModuleNode): Promise<void>
  /**
   * Запуск сервера.
   */
  listen(port?: number, isRestart?: boolean): Promise<ViteDevServer>
  /**
   * Перезапуск сервера.
   *
   * @param forceOptimize - принудить оптимизатор к повторной сборке, то же самое, что и флаг командной строки --force.

   */
  restart(forceOptimize?: boolean): Promise<void>
  /**
   * Остановка сервера.
   */
  close(): Promise<void>
  /**
   * Привязка ярлыков командной строки (CLI).
   */
  bindCLIShortcuts(options?: BindCLIShortcutsOptions<ViteDevServer>): void
  /**
   * Вызов `await server.waitForRequestsIdle(id)` будет ожидать, пока все статические импорты
   * будут обработаны. Если вызов осуществляется из хуков плагина загрузки или преобразования, id необходимо
   * передать в качестве параметра, чтобы избежать взаимных блокировок. Вызов этой функции после обработки первого
   * раздела статических импортов графа модулей будет разрешен немедленно.
   * @experimental
   */
  waitForRequestsIdle: (ignoredId?: string) => Promise<void>
}
```

:::info
`waitForRequestsIdle` предназначен для использования в качестве обходного пути для улучшения пользовательского опыта (DX) для функций, которые не могут быть реализованы с учётом требований dev-сервера Vite. Он может использоваться во время запуска такими инструментами, как Tailwind, чтобы отложить генерацию CSS-классов приложения до тех пор, пока код приложения не будет обработан, избегая вспышек изменений стиля. Когда эта функция используется в хуке загрузки или преобразования, и используется сервер HTTP1 по умолчанию, один из шести http-каналов будет заблокирован до тех пор, пока сервер не обработает все статические импорты. Оптимизатор зависимостей Vite в настоящее время использует эту функцию, чтобы избежать полной перезагрузки страницы при отсутствии зависимостей, откладывая загрузку предварительно собранных зависимостей до тех пор, пока все импортированные зависимости не будут собраны из статических источников. Vite может перейти на другую стратегию в будущем крупном релизе, установив `optimizeDeps.crawlUntilStaticImports: false` по умолчанию, чтобы избежать потери производительности в крупных приложениях при холодном старте.
:::

## `build`

**Сигнатура типа:**

```ts
async function build(
  inlineConfig?: InlineConfig,
): Promise<RollupOutput | RollupOutput[]>
```

**Пример использования:**

```ts twoslash
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'vite'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

await build({
  root: path.resolve(__dirname, './project'),
  base: '/foo/',
  build: {
    rollupOptions: {
      // ...
    },
  },
})
```

## `preview`

**Сигнатура типа:**

```ts
async function preview(inlineConfig?: InlineConfig): Promise<PreviewServer>
```

**Пример использования:**

```ts twoslash
import { preview } from 'vite'
const previewServer = await preview({
  // любые допустимые параметры конфигурации пользователя, а также `mode` и `configFile`
  preview: {
    port: 8080,
    open: true,
  },
})
previewServer.printUrls()
previewServer.bindCLIShortcuts({ print: true })
```

## `PreviewServer`

```ts
interface PreviewServer {
  /**
   * Разрешенный объект конфигурации Vite.
   */
  config: ResolvedConfig
  /**
   * Экземпляр приложения connect.
   * - Может использоваться для подключения пользовательских промежуточных ПО к серверу предпросмотра.
   * - Также может использоваться в качестве функции обработчика для пользовательского http-сервера
   *   или в качестве промежуточного ПО в любых фреймворках Node.js в стиле connect.
   *
   * https://github.com/senchalabs/connect#use-middleware
   */
  middlewares: Connect.Server
  /**
   * экземпляр нативного http-сервера Node
   */
  httpServer: http.Server
  /**
   * Разрешенные URL-адреса, которые Vite выводит в CLI.
   * Будет равен null до того, как сервер начнет прослушивание.
   */
  resolvedUrls: ResolvedServerUrls | null
  /**
   * Распечатка адресов сервера
   */
  printUrls(): void
  /**
   * Привязка ярлыков командной строки
   */
  bindCLIShortcuts(options?: BindCLIShortcutsOptions<PreviewServer>): void
}
```

## `resolveConfig`

**Сигнатура типа:**

```ts
async function resolveConfig(
  inlineConfig: InlineConfig,
  command: 'build' | 'serve',
  defaultMode = 'development',
  defaultNodeEnv = 'development',
  isPreview = false,
): Promise<ResolvedConfig>
```

Значение `command` равно `serve` в режиме разработки и предпросмотра, и `build` в режиме сборки.

## `mergeConfig`

**Сигнатура типа:**

```ts
function mergeConfig(
  defaults: Record<string, any>,
  overrides: Record<string, any>,
  isRoot = true,
): Record<string, any>
```

Глубоко объединяет две конфигурации Vite. `isRoot` представляет уровень внутри конфигурации Vite, который объединяется. Например, установите `false`, если вы объединяете два параметра `build`.

::: tip ПРИМЕЧАНИЕ
`mergeConfig` принимает только конфигурацию в объектной форме. Если у вас есть конфигурация в форме обратного вызова, вы должны вызвать её перед передачей в `mergeConfig`.

Вы можете использовать вспомогательную функцию `defineConfig`, чтобы объединить конфигурацию в форме обратного вызова с другой конфигурацией:

```ts twoslash
import {
  defineConfig,
  mergeConfig,
  type UserConfigFnObject,
  type UserConfig,
} from 'vite'
declare const configAsCallback: UserConfigFnObject
declare const configAsObject: UserConfig

// ---cut---
export default defineConfig((configEnv) =>
  mergeConfig(configAsCallback(configEnv), configAsObject),
)
```

:::

## `searchForWorkspaceRoot`

**Сигнатура типа:**

```ts
function searchForWorkspaceRoot(
  current: string,
  root = searchForPackageRoot(current),
): string
```

**Связанные темы:** [server.fs.allow](/config/server-options.md#server-fs-allow)

Ищет корневую директорию потенциального рабочего пространства, если она соответствует следующим условиям, в противном случае будет использоваться `root`:

- содержит поле `workspaces` в `package.json`
- содержит один из следующих файлов
  - `lerna.json`
  - `pnpm-workspace.yaml`

## `loadEnv`

**Сигнатура типа:**

```ts
function loadEnv(
  mode: string,
  envDir: string,
  prefixes: string | string[] = 'VITE_',
): Record<string, string>
```

**Связанные темы:** [`.env` Files](./env-and-mode.md#env-files)

Загружает файлы `.env` в директории `envDir`. По умолчанию загружаются только переменные окружения, начинающиеся с `VITE_`, если параметр `prefixes` не изменён.

## `normalizePath`

**Сигнатура типа:**

```ts
function normalizePath(id: string): string
```

**Связанные темы:** [Path Normalization](./api-plugin.md#path-normalization)

Нормализует путь для взаимодействия между плагинами Vite.

## `transformWithEsbuild`

**Сигнатура типа:**

```ts
async function transformWithEsbuild(
  code: string,
  filename: string,
  options?: EsbuildTransformOptions,
  inMap?: object,
): Promise<ESBuildTransformResult>
```

Преобразовывает JavaScript или TypeScript с помощью esbuild. Полезно для плагинов, которые предпочитают соответствовать внутреннему преобразованию esbuild в Vite.

## `loadConfigFromFile`

**Сигнатура типа:**

```ts
async function loadConfigFromFile(
  configEnv: ConfigEnv,
  configFile?: string,
  configRoot: string = process.cwd(),
  logLevel?: LogLevel,
  customLogger?: Logger,
): Promise<{
  path: string
  config: UserConfig
  dependencies: string[]
} | null>
```

Загружает файл конфигурации Vite вручную с помощью esbuild.

## `preprocessCSS`

- **Экспериментально:** [Оставить отзыв](https://github.com/vitejs/vite/discussions/13815)

**Сигнатура типа:**

```ts
async function preprocessCSS(
  code: string,
  filename: string,
  config: ResolvedConfig,
): Promise<PreprocessCSSResult>

interface PreprocessCSSResult {
  code: string
  map?: SourceMapInput
  modules?: Record<string, string>
  deps?: Set<string>
}
```

Предварительно обрабатывает файлы `.css`, `.scss`, `.sass`, `.less`, `.styl` и `.stylus` в обычный CSS, чтобы его можно было использовать в браузерах или обрабатывать другими инструментами. Похоже на [встроенную поддержку предварительной обработки CSS](/guide/features#css-pre-processors), соответствующий предварительный процессор должен быть установлен, если он используется.

Используемый предварительный процессор определяется по расширению `filename`. Если `filename` заканчивается на `.module.{ext}`, он интерпретируется как [CSS-модуль](https://github.com/css-modules/css-modules), и возвращаемый результат будет включать объект `modules`, сопоставляющий оригинальные имена классов с преобразованными.

Обратите внимание, что предварительная обработка не разрешает URL-адреса в `url()` или `image-set()`.
