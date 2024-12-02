# Использование экземпляров `Environment` {#using-environment-instances}

:::warning Экспериментально
Environment API является экспериментальным. Мы будем поддерживать стабильность API в Vite 6, чтобы дать экосистеме возможность экспериментировать и строить на его основе. Мы планируем стабилизировать эти новые API с возможными изменениями, нарушающими обратную совместимость, в Vite 7.

Ресурсы:

- [Обсуждение отзывов](https://github.com/vitejs/vite/discussions/16358), где мы собираем отзывы о новых API.
- [PR Environment API](https://github.com/vitejs/vite/pull/16471), где новый API был реализован и рассмотрен.

Пожалуйста, поделитесь с нами своим мнением.
:::

## Доступ к окружениям {#accessing-the-environments}

Во время разработки доступные окружения на dev-сервере можно получить с помощью `server.environments`:

```js
// создайте сервер или получите его из хука configureServer
const server = await createServer(/* options */)

const environment = server.environments.client
environment.transformRequest(url)
console.log(server.environments.ssr.moduleGraph)
```

Вы также можете получить доступ к текущему окружению из плагинов. См. [Environment API для плагинов](./api-environment-plugins.md#accessing-the-current-environment-in-hooks) для получения дополнительной информации.

## Класс `DevEnvironment` {#devenvironment-class}

Во время разработки каждое окружение является экземпляром класса `DevEnvironment`:

```ts
class DevEnvironment {
  /**
   * Уникальный идентификатор для окружения на сервере Vite.
   * По умолчанию Vite предоставляет окружения 'client' и 'ssr'.
   */
  name: string
  /**
   * Канал связи для отправки и получения сообщений от
   * связанного модуля-исполнителя в целевом времени выполнения.
   */
  hot: NormalizedHotChannel
  /**
   * Граф узлов модулей с импортированными отношениями между
   * обработанными модулями и кэшированным результатом обработанного кода.
   */
  moduleGraph: EnvironmentModuleGraph
  /**
   * Разрешённые плагины для этого окружения, включая те,
   * которые созданы с помощью хука `create` для каждого окружения.
   */
  plugins: Plugin[]
  /**
   * Позволяет разрешать, загружать и преобразовывать код через
   * конвейер плагинов окружения.
   */
  pluginContainer: EnvironmentPluginContainer
  /**
   * Разрешённые параметры конфигурации для этого окружения. Параметры на глобальном уровне сервера
   * принимаются как значения по умолчанию для всех окружений и могут
   * быть переопределены (условия разрешения, внешние зависимости, оптимизированные зависимости).
   */
  config: ResolvedConfig & ResolvedDevEnvironmentOptions

  constructor(
    name: string,
    config: ResolvedConfig,
    context: DevEnvironmentContext,
  )

  /**
   * Разрешает URL в идентификатор, загружает его и обрабатывает код с помощью
   * конвейера плагинов. Граф модулей также обновляется.
   */
  async transformRequest(url: string): Promise<TransformResult | null>

  /**
   * Регистрирует запрос для обработки с низким приоритетом. Это полезно
   * для избежания каскадных зависимостей. Сервер Vite имеет информацию об
   * импортированных модулях от других запросов, поэтому он может предварительно
   * подготовить граф модулей, чтобы модули уже были обработаны, когда они запрашиваются.
   */
  async warmupRequest(url: string): Promise<void>
}
```

С `DevEnvironmentContext`, являющимся:

```ts
interface DevEnvironmentContext {
  hot: boolean
  transport?: HotChannel | WebSocketServer
  options?: EnvironmentOptions
  remoteRunner?: {
    inlineSourceMap?: boolean
  }
  depsOptimizer?: DepsOptimizer
}
```

и с `TransformResult`, являющимся:

```ts
interface TransformResult {
  code: string
  map: SourceMap | { mappings: '' } | null
  etag?: string
  deps?: string[]
  dynamicDeps?: string[]
}
```

Экземпляр окружения на сервере Vite позволяет обрабатывать URL с помощью метода `environment.transformRequest(url)`. Эта функция использует конвейер плагинов для разрешения `url` в идентификатор модуля, загружает его (читается файл из файловой системы или через плагин, который реализует виртуальный модуль), а затем преобразует код. Во время преобразования модуля импорты и другие метаданные будут записаны в граф модулей окружения путём создания или обновления соответствующего узла модуля. Когда обработка завершена, результат преобразования также сохраняется в модуле.

:::info Именование transformRequest
Мы используем `transformRequest(url)` и `warmupRequest(url)` в текущей версии этого предложения, чтобы было проще обсуждать и понимать пользователям, знакомым с текущим API Vite. Перед выпуском мы можем воспользоваться возможностью пересмотреть эти названия. Например, их можно было бы назвать `environment.processModule(url)` или `environment.loadModule(url)`, заимствуя идею из `context.load(id)` в хуках плагинов Rollup. На данный момент мы считаем, что лучше сохранить текущие названия и отложить это обсуждение.
:::

## Отдельные графы модулей {#separate-module-graphs}

Каждое окружение имеет изолированный граф модулей. Все графы модулей имеют одинаковую сигнатуру, поэтому можно реализовать универсальные алгоритмы для обхода или запроса графа, не завися от окружения. `hotUpdate` является хорошим примером. Когда файл изменяется, граф модулей каждого окружения будет использоваться для обнаружения затронутых модулей и выполнения HMR для каждого окружения независимо.

::: info
Vite v5 имел смешанный граф модулей Client и SSR. Учитывая необработанный или недействительный узел, невозможно определить, соответствует ли он окружению Client, SSR или обоим. Узлы модулей имеют некоторые свойства с префиксами, такие как `clientImportedModules` и `ssrImportedModules` (и `importedModules`, который возвращает объединение обоих). `importers` содержит всех импортеров как из окружения Client, так и из SSR для каждого узла модуля. Узел модуля также имеет `transformResult` и `ssrTransformResult`. Слой обратной совместимости позволяет экосистеме мигрировать от устаревшего `server.moduleGraph`.
:::

Каждый модуль представлен экземпляром `EnvironmentModuleNode`. Модули могут быть зарегистрированы в графе, не будучи ещё обработанными (в этом случае `transformResult` будет равен `null`). `importers` и `importedModules` также обновляются после обработки модуля.

```ts
class EnvironmentModuleNode {
  environment: string

  url: string
  id: string | null = null
  file: string | null = null

  type: 'js' | 'css'

  importers = new Set<EnvironmentModuleNode>()
  importedModules = new Set<EnvironmentModuleNode>()
  importedBindings: Map<string, Set<string>> | null = null

  info?: ModuleInfo
  meta?: Record<string, any>
  transformResult: TransformResult | null = null

  acceptedHmrDeps = new Set<EnvironmentModuleNode>()
  acceptedHmrExports: Set<string> | null = null
  isSelfAccepting?: boolean
  lastHMRTimestamp = 0
  lastInvalidationTimestamp = 0
}
```

`environment.moduleGraph` является экземпляром `EnvironmentModuleGraph`:

```ts
export class EnvironmentModuleGraph {
  environment: string

  urlToModuleMap = new Map<string, EnvironmentModuleNode>()
  idToModuleMap = new Map<string, EnvironmentModuleNode>()
  etagToModuleMap = new Map<string, EnvironmentModuleNode>()
  fileToModulesMap = new Map<string, Set<EnvironmentModuleNode>>()

  constructor(
    environment: string,
    resolveId: (url: string) => Promise<PartialResolvedId | null>,
  )

  async getModuleByUrl(
    rawUrl: string,
  ): Promise<EnvironmentModuleNode | undefined>

  getModuleById(id: string): EnvironmentModuleNode | undefined

  getModulesByFile(file: string): Set<EnvironmentModuleNode> | undefined

  onFileChange(file: string): void

  onFileDelete(file: string): void

  invalidateModule(
    mod: EnvironmentModuleNode,
    seen: Set<EnvironmentModuleNode> = new Set(),
    timestamp: number = Date.now(),
    isHmr: boolean = false,
  ): void

  invalidateAll(): void

  async ensureEntryFromUrl(
    rawUrl: string,
    setIsSelfAccepting = true,
  ): Promise<EnvironmentModuleNode>

  createFileOnlyEntry(file: string): EnvironmentModuleNode

  async resolveUrl(url: string): Promise<ResolvedUrl>

  updateModuleTransformResult(
    mod: EnvironmentModuleNode,
    result: TransformResult | null,
  ): void

  getModuleByEtag(etag: string): EnvironmentModuleNode | undefined
}
```
