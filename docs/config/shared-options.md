# Общие параметры {#shared-options}

Если не указано иное, параметры, описанные в этом разделе, применяются ко всем процессам разработки, сборки и режима предварительного просмотра.

## root

- **Тип:** `string`
- **По умолчанию:** `process.cwd()`

Корневая директория проекта (где находится `index.html`). Может быть абсолютным путём или путём относительно текущей рабочей директории.

Смотрите [Корень проекта](/guide/#index-html-and-project-root) для получения дополнительной информации.

## base

- **Тип:** `string`
- **По умолчанию:** `/`
- **Связано:** [`server.origin`](/config/server-options.md#server-origin)

Базовый публичный путь при обслуживании в режиме разработки или продакшена. Допустимые значения включают:

- Абсолютный путь URL, например, `/foo/`
- Полный URL, например, `https://bar.com/foo/` (часть происхождения не будет использоваться в режиме разработки, поэтому значение будет таким же, как `/foo/`)
- Пустая строка или `./` (для встроенного развёртывания)

Смотрите [Публичный базовый путь](/guide/build#public-base-path) для получения дополнительной информации.

## mode

- **Тип:** `string`
- **По умолчанию:** `'development'` для просмотра, `'production'` для сборки

Указание этого в конфигурации переопределит режим по умолчанию как режимов **просмотра и сборки**. Это значение также может быть переопределено через командную строку с помощью опции `--mode`.

Смотрите [Переменные окружения и режимы](/guide/env-and-mode) для получения дополнительной информации.

## define

- **Тип:** `Record<string, any>`

Определите замены глобальных констант. Записи будут определены как глобальные во время разработки и статически заменены во время сборки.

Vite использует [esbuild с параметром `define`](https://esbuild.github.io/api/#define) для выполнения замен, поэтому выражения значений должны быть строкой, содержащей значение, сериализуемое в JSON (null, boolean, number, string, array или object), или единственным идентификатором. Для нестроковых значений Vite автоматически преобразует их в строку с помощью `JSON.stringify`.

**Пример:**

```js
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify('v1.0.0'),
    __API_URL__: 'window.__backend_api_url'
  }
})
```

::: tip ПРИМЕЧАНИЕ
Для пользователей TypeScript убедитесь, что вы добавили объявления типов в файл `vite-env.d.ts`, чтобы получить проверку типов и интеллектуальные подсказки.

Пример:

```ts
// vite-env.d.ts
declare const __APP_VERSION__: string
```

:::

## plugins

- **Тип:** `(Plugin | Plugin[] | Promise<Plugin | Plugin[]>)[]`

Массив плагинов для использования. Ложные плагины игнорируются, а массивы плагинов упрощаются. Если возвращается `Promise` (обещание), он будет разрешен перед выполнением. См. [Plugin API](/guide/api-plugin) для получения дополнительной информации о плагинах Vite.

## publicDir

- **Тип:** `string | false`
- **По умолчанию:** `"public"`

Директория для обслуживания в качестве обычных статических ресурсов. Файлы в этой директории обслуживаются по адресу `/` во время разработки и копируются в корень `outDir` во время сборки, и всегда обслуживаются или копируются без преобразования. Значение может быть либо абсолютным путём к файловой системе, либо путём относительно корня проекта.

Определение `publicDir` как `false` отключает эту функцию.

Смотрите [Директория `public`](/guide/assets#the-public-directory) для получения дополнительной информации.

## cacheDir

- **Тип:** `string`
- **По умолчанию:** `"node_modules/.vite"`

Директория для сохранения файлов кэша. Файлы в этой директории — это предварительно упакованные зависимости или другие файлы кэша, сгенерированные Vite, которые могут улучшить производительность. Вы можете использовать флаг `--force` или вручную удалить директорию, чтобы регенерировать файлы кэша. Значение может быть либо абсолютным путём к файловой системе, либо путём относительно корня проекта. По умолчанию используется `.vite`, если файл package.json не обнаружен.

## resolve.alias

- **Тип:**
  `Record<string, string> | Array<{ find: string | RegExp, replacement: string, customResolver?: ResolverFunction | ResolverObject }>`

Будет передано в `@rollup/plugin-alias` как его [опция `entries`](https://github.com/rollup/plugins/tree/master/packages/alias#entries). Может быть либо объектом, либо массивом пар `{ find, replacement, customResolver }`.

При создании псевдонимов для путей файловой системы всегда используйте абсолютные пути. Относительные значения псевдонимов будут использоваться как есть и не будут разрешены в пути файловой системы.

Более сложное пользовательское разрешение можно достичь с помощью [плагинов](/guide/api-plugin).

::: warning Использование с SSR
Если вы настроили псевдонимы для [экстернализованных зависимостей SSR](/guide/ssr.md#ssr-externals), вы можете захотеть создать псевдонимы для фактических пакетов `node_modules`. Как [Yarn](https://classic.yarnpkg.com/en/docs/cli/add/#toc-yarn-add-alias), так и [pnpm](https://pnpm.io/aliases/) поддерживают создание псевдонимов через префикс `npm:`.
:::

## resolve.dedupe

- **Тип:** `string[]`

Если у вас есть дублированные копии одной и той же зависимости в вашем приложении (вероятно, из-за подъёма или связанных пакетов в монорепозиториях), используйте эту опцию, чтобы принудить Vite всегда разрешать указанные зависимости к одной и той же копии (из корня проекта).

:::warning SSR + ESM
Для сборок SSR дедупликация не работает для выходных данных сборки ESM, настроенных с помощью `build.rollupOptions.output`. Обходным решением является использование выходных данных сборки CJS, пока ESM не получит лучшую поддержку плагинов для загрузки модулей.
:::

## resolve.conditions <NonInheritBadge />

- **Тип:** `string[]`
- **По умолчанию:** `['module', 'browser', 'development|production']` (`defaultClientConditions`)

Дополнительные разрешённые условия при разрешении [условных экспортов](https://nodejs.org/api/packages.html#packages_conditional_exports) из пакета.

Пакет с условными экспортами может иметь следующее поле `exports` в своем `package.json`:

```json
{
  "exports": {
    ".": {
      "import": "./index.mjs",
      "require": "./index.js"
    }
  }
}
```

Здесь `import` и `require` являются «условиями». Условия могут быть вложенными и должны указываться от наиболее специфичных к наименее специфичным.

`development|production` — это специальное значение, которое заменяется на `production` или `development` в зависимости от значения `process.env.NODE_ENV`. Оно заменяется на `production`, когда `process.env.NODE_ENV === 'production'`, и на `development` в противном случае.

Обратите внимание, что условия `import`, `require`, `default` всегда применяются, если требования выполнены.

## resolve.mainFields <NonInheritBadge />

- **Тип:** `string[]`
- **По умолчанию:** `['browser', 'module', 'jsnext:main', 'jsnext']` (`defaultClientMainFields`)

Список полей в `package.json`, которые будут проверяться при разрешении точки входа пакета. Обратите внимание, что это имеет меньший приоритет, чем условные экспорты, разрешённые из поля `exports`: если точка входа успешно разрешена из `exports`, поле main будет проигнорировано.

## resolve.extensions

- **Тип:** `string[]`
- **По умолчанию:** `['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json']`

Список расширений файлов, которые будут проверяться для импортов, опускающих расширения. Обратите внимание, что **не рекомендуется** опускать расширения для пользовательских типов импорта (например, `.vue`), так как это может повлиять на поддержку в IDE и типах.

## resolve.preserveSymlinks

- **Тип:** `boolean`
- **По умолчанию:** `false`

Включение этой настройки заставляет Vite определять идентичность файла по исходному пути файла (т. е. пути без учёта символических ссылок), а не по реальному пути файла (т. е. пути с учётом символических ссылок).

- **Связано:** [esbuild#preserve-symlinks](https://esbuild.github.io/api/#preserve-symlinks), [webpack#resolve.symlinks](https://webpack.js.org/configuration/resolve/#resolvesymlinks)

## html.cspNonce

- **Тип:** `string`
- **Связано:** [Политика безопасности контента (CSP)](/guide/features#content-security-policy-csp)

Заполнитель значения `nonce`, который будет использоваться при генерации тегов script / style. Установка этого значения также создаст мета-тег с значением `nonce`.

## css.modules

- **Тип:**
  ```ts
  interface CSSModulesOptions {
    getJSON?: (
      cssFileName: string,
      json: Record<string, string>,
      outputFileName: string
    ) => void
    scopeBehaviour?: 'global' | 'local'
    globalModulePaths?: RegExp[]
    exportGlobals?: boolean
    generateScopedName?:
      | string
      | ((name: string, filename: string, css: string) => string)
    hashPrefix?: string
    /**
     * по умолчанию: undefined
     */
    localsConvention?:
      | 'camelCase'
      | 'camelCaseOnly'
      | 'dashes'
      | 'dashesOnly'
      | ((
          originalClassName: string,
          generatedClassName: string,
          inputFile: string
        ) => string)
  }
  ```

Настройте поведение CSS-модулей. Опции передаются в [postcss-modules](https://github.com/css-modules/postcss-modules).

Эта опция не имеет эффекта при использовании [Lightning CSS](../guide/features.md#lightning-css). Если включено, следует использовать [`css.lightningcss.cssModules`](https://lightningcss.dev/css-modules.html) вместо этого.

## css.postcss

- **Тип:** `string | (postcss.ProcessOptions & { plugins?: postcss.AcceptedPlugin[] })`

Встроенная конфигурация PostCSS или пользовательская директория для поиска конфигурации PostCSS (по умолчанию — корень проекта).

Для встроенной конфигурации PostCSS ожидается такой же формат, как в `postcss.config.js`. Однако для свойства `plugins` можно использовать только [формат массива](https://github.com/postcss/postcss-load-config/blob/main/README.md#array).

Поиск выполняется с помощью [postcss-load-config](https://github.com/postcss/postcss-load-config), и загружаются только поддерживаемые имена файлов конфигурации. Конфигурационные файлы вне корня рабочего пространства (или [корня проекта](/guide/#index-html-and-project-root), если рабочее пространство не найдено) по умолчанию не ищутся. При необходимости вы можете указать пользовательский путь вне корня для загрузки конкретного конфигурационного файла.

Обратите внимание, что если предоставлена встроенная конфигурация, Vite не будет искать другие источники конфигурации PostCSS.

## css.preprocessorOptions

- **Тип:** `Record<string, object>`

Укажите параметры, которые будут переданы CSS-препроцессорам. Расширения файлов используются в качестве ключей для параметров. Поддерживаемые параметры для каждого препроцессора можно найти в их соответствующей документации:

- `sass`/`scss`:
  - Использует `sass-embedded`, если установлен, в противном случае `sass`. Для достижения наилучшей производительности рекомендуется установить пакет `sass-embedded`.
  - [Опции](https://sass-lang.com/documentation/js-api/interfaces/stringoptions/)
- `less`: [Опции](https://lesscss.org/usage/#less-options).
- `styl`/`stylus`: Поддерживается только [`define`](https://stylus-lang.com/docs/js.html#define-name-node), который можно передать в виде объекта.

**Пример:**

```js
export default defineConfig({
  css: {
    preprocessorOptions: {
      less: {
        math: 'parens-division'
      },
      styl: {
        define: {
          $specialColor: new stylus.nodes.RGBA(51, 197, 255, 1)
        }
      },
      scss: {
        importers: [
          // ...
        ]
      }
    }
  }
})
```

### css.preprocessorOptions[extension].additionalData

- **Тип:** `string | ((source: string, filename: string) => (string | { content: string; map?: SourceMap }))`

Эта опция может быть использована для внедрения дополнительного кода в каждое содержимое стиля. Обратите внимание, что если вы включаете фактические стили, а не только переменные, эти стили будут дублироваться в финальной сборке.

**Пример:**

```js
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `$injectedColor: orange;`
      }
    }
  }
})
```

## css.preprocessorMaxWorkers

- **Тип:** `number | true`
- **По умолчанию:** `true`

Определяет максимальное количество потоков, которые могут использовать препроцессоры CSS. Если указано `true`, это означает использование всех процессоров минус один. Если установить значение `0`, Vite не будет создавать дополнительные потоки и выполнит препроцессоры в основном потоке.

В зависимости от настроек препроцессора Vite может запускать препроцессоры в основном потоке, даже если эта опция не установлена в `0`.

## css.devSourcemap

- **Экспериментально:** [Оставить отзыв](https://github.com/vitejs/vite/discussions/13845)
- **Тип:** `boolean`
- **По умолчанию:** `false`

Включать ли карты источников во время разработки.

## css.transformer

- **Экспериментально:** [Оставить отзыв](https://github.com/vitejs/vite/discussions/13835)
- **Тип:** `'postcss' | 'lightningcss'`
- **По умолчанию:** `'postcss'`

Выбирает движок, используемый для обработки CSS. Ознакомьтесь с [Lightning CSS](../guide/features.md#lightning-css) для получения дополнительной информации.

::: info Дублирующиеся `@import`
Обратите внимание, что postcss (postcss-import) имеет другое поведение с дублирующимися `@import` по сравнению с браузерами. См. [postcss/postcss-import#462](https://github.com/postcss/postcss-import/issues/462).
:::

## css.lightningcss

- **Экспериментально:** [Оставить отзыв](https://github.com/vitejs/vite/discussions/13835)
- **Тип:**

```js
import type {
  CSSModulesConfig,
  Drafts,
  Features,
  NonStandard,
  PseudoClasses,
  Targets
} from 'lightningcss'
```

```js
{
  targets?: Targets
  include?: Features
  exclude?: Features
  drafts?: Drafts
  nonStandard?: NonStandard
  pseudoClasses?: PseudoClasses
  unusedSymbols?: string[]
  cssModules?: CSSModulesConfig,
  // ...
}
```

Настраивает Lightning CSS. Полные параметры трансформации можно найти в [репозитории Lightning CSS](https://github.com/parcel-bundler/lightningcss/blob/master/node/index.d.ts).

## json.namedExports

- **Тип:** `boolean`
- **По умолчанию:** `true`

Поддерживать ли именованные импорты из файлов `.json`.

## json.stringify

- **Тип:** `boolean | 'auto'`
- **По умолчанию:** `'auto'`

Если установлено значение `true`, импортированный JSON будет преобразован в `export default JSON.parse("...")`, что значительно более производительно, чем литералы объектов, особенно когда файл JSON большой.

Если установлено значение `'auto'`, данные будут сериализованы в строку только в том случае, если [они весят больше 10 КБ](https://v8.dev/blog/cost-of-javascript-2019#json:~:text=A%20good%20rule%20of%20thumb%20is%20to%20apply%20this%20technique%20for%20objects%20of%2010%20kB%20or%20larger).

## esbuild

- **Тип:** `ESBuildOptions | false`

`ESBuildOptions` расширяет [опции трансформации esbuild](https://esbuild.github.io/api/#transform). Наиболее распространённый случай использования — это настройка JSX:

```js
export default defineConfig({
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment'
  }
})
```

По умолчанию esbuild применяется к файлам `ts`, `jsx` и `tsx`. Вы можете настроить это с помощью `esbuild.include` и `esbuild.exclude`, которые могут быть регулярным выражением, шаблоном [picomatch](https://github.com/micromatch/picomatch#globbing-features) или массивом любого из них.

Кроме того, вы также можете использовать `esbuild.jsxInject`, чтобы автоматически внедрять импорты вспомогательных функций JSX для каждого файла, преобразованного с помощью esbuild:

```js
export default defineConfig({
  esbuild: {
    jsxInject: `import React from 'react'`
  }
})
```

Когда [`build.minify`](./build-options.md#build-minify) установлено в `true`, все оптимизации минификации применяются по умолчанию. Чтобы отключить [определённые аспекты](https://esbuild.github.io/api/#minify) минификации, установите любое из параметров `esbuild.minifyIdentifiers`, `esbuild.minifySyntax` или `esbuild.minifyWhitespace` в `false`. Обратите внимание, что опцию `esbuild.minify` нельзя использовать для переопределения `build.minify`.

Установите в `false`, чтобы отключить трансформации esbuild.

## assetsInclude

- **Тип:** `string | RegExp | (string | RegExp)[]`
- **Связано:** [Обработка статических ресурсов](/guide/assets)

Укажите дополнительные [шаблоны picomatch](https://github.com/micromatch/picomatch#globbing-features), которые будут рассматриваться как статические ресурсы, чтобы:

- Они были исключены из конвейера трансформации плагина, когда на них ссылаются из HTML или когда они запрашиваются напрямую через `fetch` или XHR.

- Импортирование их из JS вернёт строку их разрешённого URL (это можно переопределить, если у вас есть плагин с `enforce: 'pre'`, чтобы обрабатывать тип ресурса иначе).

Список встроенных типов ресурсов можно найти [здесь](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/constants.ts).

**Пример:**

```js
export default defineConfig({
  assetsInclude: ['**/*.gltf']
})
```

## logLevel

- **Тип:** `'info' | 'warn' | 'error' | 'silent'`

Настройте уровень подробности вывода в консоль. По умолчанию установлено значение `'info'`.

## customLogger

- **Тип:**
  ```ts
  interface Logger {
    info(msg: string, options?: LogOptions): void
    warn(msg: string, options?: LogOptions): void
    warnOnce(msg: string, options?: LogOptions): void
    error(msg: string, options?: LogErrorOptions): void
    clearScreen(type: LogType): void
    hasErrorLogged(error: Error | RollupError): boolean
    hasWarned: boolean
  }
  ```

Используйте пользовательский логгер для записи сообщений. Вы можете использовать API Vite `createLogger`, чтобы получить логгер по умолчанию и настроить его, например, изменить сообщение или отфильтровать определённые предупреждения.

```ts twoslash
import { createLogger, defineConfig } from 'vite'

const logger = createLogger()
const loggerWarn = logger.warn

logger.warn = (msg, options) => {
  // Игнорировать предупреждение о пустых CSS-файлах
  if (msg.includes('vite:css') && msg.includes(' is empty')) return
  loggerWarn(msg, options)
}

export default defineConfig({
  customLogger: logger
})
```

## clearScreen

- **Тип:** `boolean`
- **По умолчанию:** `true`

Установите значение `false`, чтобы предотвратить очистку экрана терминала Vite при записи определённых сообщений. Через командную строку используйте `--clearScreen false`.

## envDir

- **Тип:** `string | false`
- **По умолчанию:** `root`

Директория, из которой загружаются файлы `.env`. Может быть абсолютным путём или путём относительно корня проекта. `false` отключит загрузку файла `.env`.

Смотрите [здесь](/guide/env-and-mode#env-files) для получения дополнительной информации о файлах окружения.

## envPrefix

- **Тип:** `string | string[]`
- **По умолчанию:** `VITE_`

Переменные окружения, начинающиеся с `envPrefix`, будут доступны в вашем клиентском исходном коде через `import.meta.env`.

:::warning ЗАМЕТКИ ПО БЕЗОПАСНОСТИ
`envPrefix` не должен быть установлен в `''`, так как это приведёт к раскрытию всех ваших переменных окружения и может вызвать неожиданное утечку конфиденциальной информации. Vite выдаст ошибку при обнаружении `''`.

Если вы хотите раскрыть переменную без префикса, вы можете использовать [define](#define) для её экспонирования:

```js
define: {
  'import.meta.env.ENV_VARIABLE': JSON.stringify(process.env.ENV_VARIABLE)
}
```

:::

## appType

- **Тип:** `'spa' | 'mpa' | 'custom'`
- **По умолчанию:** `'spa'`

Независимо от того, является ли ваше приложение одностраничным приложением (SPA), [многостраничным приложением (MPA)](../guide/build#multi-page-app) или пользовательским приложением (SSR и фреймворки с пользовательской обработкой HTML):

- `'spa'`: включите HTML-мидлвары и используйте резервное копирование SPA. Настройте [sirv](https://github.com/lukeed/sirv) с `single: true` в режиме предварительного просмотра
- `'mpa'`: включите HTML-мидлвары
- `'custom'`: не включайте HTML-мидлвары

Узнайте больше в [руководстве по SSR](/guide/ssr#vite-cli) Vite. Связано: [`server.middlewareMode`](./server-options#server-middlewaremode).

## future

- **Тип:** `Record<string, 'warn' | undefined>`
- **Связано:** [Критические изменения](/changes/)

Включите будущие критические изменения, чтобы подготовиться к плавному переходу на следующую основную версию Vite. Список может быть обновлён, добавлен или удалён в любое время по мере разработки новых функций.

Смотрите страницу [Критические изменения](/changes/) для получения подробной информации о возможных опциях.
