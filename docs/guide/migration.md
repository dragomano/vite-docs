# Миграция с v4 {#migration-from-v4}

## Поддержка Node.js {#node-js-support}

Vite больше не поддерживает Node.js 14 / 16 / 17 / 19, которые достигли конца своей поддержки. Теперь требуется Node.js 18 / 20+.

## Rollup 4 {#rollup-4}

Vite теперь использует Rollup 4, который также приносит изменения, нарушающие обратную совместимость, в частности:

- Свойство `assertions` для импортов было переименовано в `attributes`.
- Плагины Acorn больше не поддерживаются.
- Для плагинов Vite опция `skipSelf` в `this.resolve` теперь по умолчанию равна `true`.
- Для плагинов Vite `this.parse` теперь поддерживает только опцию `allowReturnOutsideFunction`.

Ознакомиться с полным списком критических изменений можно в [заметках о релизе Rollup](https://github.com/rollup/rollup/releases/tag/v4.0.0), а для изменений, связанных со сборкой — в [`build.rollupOptions`](/config/build-options.md#build-rollupoptions).

Если вы используете TypeScript, убедитесь, что установлена опция `moduleResolution: 'bundler'` (или `node16`/`nodenext`), так как Rollup 4 требует этого. Либо вы можете установить `skipLibCheck: true` вместо этого.

## Устаревание CJS Node API {#deprecate-cjs-node-api}

CJS Node API Vite устарел. При вызове `require('vite')` теперь выводится предупреждение об устаревании. Вам следует обновить ваши файлы или фреймворки, чтобы импортировать ESM-версию Vite вместо этого.

В базовом проекте Vite убедитесь, что:

1. Содержимое файла `vite.config.js` использует синтаксис ESM.
2. Ближайший файл `package.json` содержит `"type": "module"`, или используйте расширение `.mjs`/`.mts`, например, `vite.config.mjs` или `vite.config.mts`.

Для других проектов есть несколько общих подходов:

- **Настройка ESM по умолчанию, выбор CJS при необходимости:** Добавьте `"type": "module"` в файл `package.json` проекта. Все файлы `*.js` теперь интерпретируются как ESM и должны использовать синтаксис ESM. Вы можете переименовать файл с расширением `.cjs`, чтобы продолжать использовать CJS.
- **Сохранение CJS по умолчанию, выбор ESM при необходимости:** Если в файле `package.json` проекта нет `"type": "module"`, все файлы `*.js` интерпретируются как CJS. Вы можете переименовать файл с расширением `.mjs`, чтобы использовать ESM.
- **Динамический импорт Vite:** Если вам нужно продолжать использовать CJS, вы можете динамически импортировать Vite, используя `import('vite')`. Это требует, чтобы ваш код был написан в асинхронном контексте, но это должно быть управляемо, так как API Vite в основном асинхронный.

Смотрите [руководство по решению проблем](/guide/troubleshooting.html#vite-cjs-node-api-deprecated) для получения дополнительной информации.

## Переработка стратегии замены `define` и `import.meta.env.*` {#rework-define-and-import-meta-env-replacement-strategy}

В Vite 4 функции [`define`](/config/shared-options.md#define) и [`import.meta.env.*`](/guide/env-and-mode.md#env-variables) используют разные стратегии замены в режиме разработки и сборки:

- В режиме разработки обе функции инжектируются как глобальные переменные в `globalThis` и `import.meta` соответственно.
- В режиме сборки обе функции статически заменяются с помощью регулярного выражения.

Это приводит к несоответствию между режимами разработки и сборки при попытке доступа к переменным, и иногда даже вызывает сбои сборки. Например:

```js
// vite.config.js
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify('1.0.0'),
  },
})
```

```js
const data = { __APP_VERSION__ }
// dev: { __APP_VERSION__: "1.0.0" } ✅
// build: { "1.0.0" } ❌

const docs = 'Мне нравится import.meta.env.MODE'
// dev: "Мне нравится import.meta.env.MODE" ✅
// build: "Мне нравится "production"" ❌
```

Vite 5 исправляет это, используя `esbuild` для обработки замен в сборках, что соответствует поведению в режиме разработки.

Это изменение не должно повлиять на большинство настроек, так как уже задокументировано, что значения `define` должны следовать синтаксису esbuild:

> Чтобы быть последовательными с поведением esbuild, выражения должны быть либо JSON-объектом (null, boolean, number, string, array или object), либо единственным идентификатором.

Однако, если вы предпочитаете продолжать статически заменять значения напрямую, вы можете использовать [`@rollup/plugin-replace`](https://github.com/rollup/plugins/tree/master/packages/replace).

## Общие изменения {#general-changes}

### Значение внешних модулей SSR теперь соответствует рабочей среде {#ssr-externalized-modules-value-now-matches-production}

В Vite 4 внешние модули SSR оборачиваются с обработкой `.default` и `.__esModule` для лучшей совместимости, но это не соответствует рабочему поведению при загрузке средой выполнения (например, Node.js), что вызывает трудноуловимые несоответствия. По умолчанию все прямые зависимости проекта являются внешними для SSR.

Vite 5 теперь удаляет обработку `.default` и `.__esModule`, чтобы соответствовать рабочему поведению. На практике это не должно повлиять на правильно упакованные зависимости, но если вы столкнетесь с новыми проблемами при загрузке модулей, попробуйте следующие рефакторинги:

```js
// До:
import { foo } from 'bar'

// После:
import _bar from 'bar'
const { foo } = _bar
```

```js
// До:
import foo from 'bar'

// После:
import * as _foo from 'bar'
const foo = _foo.default
```

Обратите внимание, что эти изменения соответствуют поведению Node.js, поэтому вы также можете запускать импорты в Node.js, чтобы протестировать это. Если вы предпочитаете сохранить предыдущее поведение, установите `true` для опции `legacy.proxySsrExternalModules`.

### `worker.plugins` теперь является функцией {#worker-plugins-is-now-a-function}

В Vite 4 параметр [`worker.plugins`](/config/worker-options.md#worker-plugins) принимал массив плагинов (`(Plugin | Plugin[])[]`). Начиная с Vite 5, его необходимо настраивать как функцию, которая возвращает массив плагинов (`() => (Plugin | Plugin[])[]`). Это изменение необходимо для того, чтобы параллельные сборки воркеров выполнялись более последовательно и предсказуемо.

### Разрешение путей, содержащих `.`, для возврата к index.html {#allow-path-containing-to-fallback-to-index-html}

В Vite 4 доступ к пути в режиме разработки, содержащему `.`, не возвращал index.html, даже если [`appType`](/config/shared-options.md#apptype) был установлен в `'spa'` (по умолчанию). Начиная с Vite 5, он будет возвращать index.html.

Обратите внимание, что браузер больше не будет показывать сообщение об ошибке 404 в консоли, если вы укажете путь к изображению на несуществующий файл (например, `<img src="./file-does-not-exist.png">`).

### Согласование поведения HTML-обработки в режиме разработки и предпросмотра {#align-dev-and-preview-html-serving-behaviou}

В Vite 4 серверы разработки и предпросмотра обрабатывают HTML на основе его структуры каталогов и наличия завершающего слэша по-разному. Это вызывает несоответствия при тестировании вашего собранного приложения. Vite 5 рефакторит это в единое поведение, как показано ниже, учитывая следующую структуру файлов:

```
├── index.html
├── file.html
└── dir
    └── index.html
```

| Запрос            | Прежнее поведение (dev)      | Прежнее поведение (preview) | Текущее поведение (dev & preview) |
| ----------------- | ---------------------------- | ----------------- | ---------------------------- |
| `/dir/index.html` | `/dir/index.html`            | `/dir/index.html` | `/dir/index.html`            |
| `/dir`            | `/index.html` (Запасной SPA) | `/dir/index.html` | `/index.html` (Запасной SPA) |
| `/dir/`           | `/dir/index.html`            | `/dir/index.html` | `/dir/index.html`            |
| `/file.html`      | `/file.html`                 | `/file.html`      | `/file.html`                 |
| `/file`           | `/index.html` (Запасной SPA) | `/file.html`      | `/file.html`                 |
| `/file/`          | `/index.html` (Запасной SPA) | `/file.html`      | `/index.html` (Запасной SPA) |

### Файлы манифеста теперь по умолчанию генерируются в директории `.vite` {#manifest-files-are-now-generated-in-vite-directory-by-default}

В Vite 4 файлы манифеста ([`build.manifest`](/config/build-options.md#build-manifest) и [`build.ssrManifest`](/config/build-options.md#build-ssrmanifest)) по умолчанию генерировались в корне [`build.outDir`](/config/build-options.md#build-outdir).

Начиная с Vite 5, они будут генерироваться в директории `.vite` в `build.outDir` по умолчанию. Это изменение помогает избежать конфликтов с публичными файлами, имеющими одинаковые имена манифестов, когда они копируются в `build.outDir`.

### Соответствующие CSS-файлы не перечисляются как верхний уровень в файле manifest.json {#corresponding-css-files-are-not-listed-as-top-level-entry-in-manifest-json-file}

В Vite 4 соответствующий CSS-файл для точки входа JavaScript также перечислялся как верхний уровень в файле манифеста ([`build.manifest`](/config/build-options.md#build-manifest)). Эти записи были добавлены непреднамеренно и работали только для простых случаев.

В Vite 5 соответствующие CSS-файлы можно найти только в разделе файла точки входа JavaScript. При инжекции JS-файла соответствующие CSS-файлы [должны быть инжектированы](/guide/backend-integration.md#:~:text=%3C!%2D%2D%20if%20production%20%2D%2D%3E%0A%3Clink%20rel%3D%22stylesheet%22%20href%3D%22/assets/%7B%7B%20manifest%5B%27main.js%27%5D.css%20%7D%7D%22%20/%3E%0A%3Cscript%20type%3D%22module%22%20src%3D%22/assets/%7B%7B%20manifest%5B%27main.js%27%5D.file%20%7D%7D%22%3E%3C/script%3E). Если CSS должен быть инжектирован отдельно, он должен быть добавлен как отдельная точка входа.

### Сочетания клавиш CLI требуют дополнительного нажатия `Enter` {#cli-shortcuts-require-an-additional-enter-press}

Сочетания клавиш интерфейса командной строки, такие как `r` для перезапуска сервера разработки, теперь требуют дополнительного нажатия `Enter` для активации сочетания. Например, `r + Enter` для перезапуска сервера разработки.

Это изменение предотвращает захват и управление специфическими для ОС сочетаниями клавиш Vite, что позволяет лучше совместить сервер разработки Vite с другими процессами и избегает [предыдущих проблем](https://github.com/vitejs/vite/pull/14342).

### Обновление поведения TypeScript для `experimentalDecorators` и `useDefineForClassFields` {#update-experimentalDecorators-and-useDefineForClassFields-typescript-behaviour}

Vite 5 использует esbuild 0.19 и удаляет совместимый слой для esbuild 0.18, что изменяет способ обработки [`experimentalDecorators`](https://www.typescriptlang.org/tsconfig#experimentalDecorators) и [`useDefineForClassFields`](https://www.typescriptlang.org/tsconfig#useDefineForClassFields).

- **`experimentalDecorators` по умолчанию не включен**

  Вам нужно установить `compilerOptions.experimentalDecorators` в `true` в `tsconfig.json`, чтобы использовать декораторы.

- **Значения по умолчанию для `useDefineForClassFields` зависят от значения `target` в TypeScript**

  Если `target` не установлен на `ESNext` или `ES2022` или новее, или если файл `tsconfig.json` отсутствует, `useDefineForClassFields` по умолчанию будет равен `false`, что может вызвать проблемы с значением по умолчанию `esbuild.target`, равным `esnext`. Это может привести к транспиляции в [статические блоки инициализации](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Static_initialization_blocks#browser_compatibility), которые могут не поддерживаться в вашем браузере.

  Поэтому рекомендуется установить `target` на `ESNext` или `ES2022` или новее, или явно установить `useDefineForClassFields` в `true` при настройке `tsconfig.json`.

```jsonc
{
  "compilerOptions": {
    // Установите true при использовании декораторов
    "experimentalDecorators": true,
    // Установите true, если видите ошибки парсинга в браузере
    "useDefineForClassFields": true,
  },
}
```

### Удаление флага `--https` и `https: true` {#remove-https-flag-and-https-true}

Флаг `--https` устанавливает `server.https: true` и `preview.https: true` внутренне. Эта конфигурация предназначалась для использования вместе с функцией автоматической генерации HTTPS-сертификатов, которая [была удалена в Vite 3](https://v3.vitejs.dev/guide/migration.html#automatic-https-certificate-generation). Следовательно, эта конфигурация больше не полезна, так как она запускает Vite HTTPS-сервер без сертификата.

Если вы используете [`@vitejs/plugin-basic-ssl`](https://github.com/vitejs/vite-plugin-basic-ssl) или [`vite-plugin-mkcert`](https://github.com/liuweiGL/vite-plugin-mkcert), они уже установят конфигурацию `https` внутренне, поэтому вы можете удалить `--https`, `server.https: true` и `preview.https: true` из вашей настройки.

### Удаление API `resolvePackageEntry` и `resolvePackageData` {#remove-resolvepackageentry-and-resolvepackagedata-apis}

API `resolvePackageEntry` и `resolvePackageData` удалены, так как они раскрывали внутренности Vite и блокировали потенциальные оптимизации Vite 4.3 в прошлом. Эти API можно заменить сторонними пакетами, например:

- `resolvePackageEntry`: [`import.meta.resolve`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta/resolve) или пакет [`import-meta-resolve`](https://github.com/wooorm/import-meta-resolve).
- `resolvePackageData`: То же самое, что и выше, и поднимитесь по директории пакета, чтобы получить корневой `package.json`. Или используйте пакет сообщества [`vitefu`](https://github.com/svitejs/vitefu).

```js
import { resolve } from 'import-meta-resolve'
import { findDepPkgJsonPath } from 'vitefu'
import fs from 'node:fs'

const pkg = 'my-lib'
const basedir = process.cwd()

// `resolvePackageEntry`:
const packageEntry = resolve(pkg, basedir)

// `resolvePackageData`:
const packageJsonPath = findDepPkgJsonPath(pkg, basedir)
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
```

## Удалённые устаревшие API {#removed-deprecated-apis}

- Экспорт по умолчанию CSS-файлов (например, `import style from './foo.css'`): используйте вместо этого запрос `?inline`
- `import.meta.globEager`: используйте вместо этого `import.meta.glob('*', { eager: true })`
- `ssr.format: 'cjs'` и `legacy.buildSsrCjsExternalHeuristics` ([#13816](https://github.com/vitejs/vite/discussions/13816))
- `server.middlewareMode: 'ssr'` и `server.middlewareMode: 'html'`: используйте вместо этого [`appType`](/config/shared-options.md#apptype) + [`server.middlewareMode: true`](/config/server-options.md#server-middlewaremode) ([#8452](https://github.com/vitejs/vite/pull/8452))

## Расширенные возможности {#advanced}

Существуют некоторые изменения, которые касаются только создателей плагинов/инструментов:

- [[#14119] refactor!: merge `PreviewServerForHook` into `PreviewServer` type](https://github.com/vitejs/vite/pull/14119)
  - Хук `configurePreviewServer` теперь принимает тип `PreviewServer` вместо типа `PreviewServerForHook`.
- [[#14818] refactor(preview)!: use base middleware](https://github.com/vitejs/vite/pull/14818)
  - Посредники, добавленные из возвращаемой функции в `configurePreviewServer`, теперь не имеют доступа к `base` при сравнении значения `req.url`. Это согласует поведение с сервером разработки. При необходимости вы можете проверить `base` из хука `configResolved`.
- [[#14834] fix(types)!: expose httpServer with Http2SecureServer union](https://github.com/vitejs/vite/pull/14834)
  - Вместо `http.Server` теперь используется `http.Server | http2.Http2SecureServer`, где это уместно.

Также есть и другие разрушающие изменения, которые касаются лишь немногих пользователей.

- [[#14098] fix!: avoid rewriting this (reverts #5312)](https://github.com/vitejs/vite/pull/14098)
  - Верхний уровень `this` по умолчанию перезаписывался в `globalThis` при сборке. Это поведение теперь удалено.
- [[#14231] feat!: add extension to internal virtual modules](https://github.com/vitejs/vite/pull/14231)
  - Идентификатор внутренних виртуальных модулей теперь имеет расширение (`.js`).
- [[#14583] refactor!: remove exporting internal APIs](https://github.com/vitejs/vite/pull/14583)
  - Удалены случайно экспортированные внутренние API: `isDepsOptimizerEnabled` и `getDepOptimizationConfig`
  - Удалены экспортированные внутренние типы: `DepOptimizationResult`, `DepOptimizationProcessing` и `DepsOptimizer`
  - Переименован тип `ResolveWorkerOptions` в `ResolvedWorkerOptions`
- [[#5657] fix: return 404 for resources requests outside the base path](https://github.com/vitejs/vite/pull/5657)
  - Ранее Vite отвечал на запросы вне базового пути без `Accept: text/html`, как если бы они были запрошены с базовым путем. Теперь Vite этого не делает и отвечает 404 вместо этого.
- [[#14723] fix(resolve)!: remove special .mjs handling](https://github.com/vitejs/vite/pull/14723)
  - Ранее, когда поле `"exports"` библиотеки сопоставлялось с файлом `.mjs`, Vite все равно пытался сопоставить поля `"browser"` и `"module"` для исправления совместимости с определенными библиотеками. Это поведение теперь удалено для согласования с алгоритмом разрешения экспортов.
- [[#14733] feat(resolve)!: remove `resolve.browserField`](https://github.com/vitejs/vite/pull/14733)
  - `resolve.browserField` был устаревшим с Vite 3 в пользу обновленного значения по умолчанию `['browser', 'module', 'jsnext:main', 'jsnext']` для [`resolve.mainFields`](/config/shared-options.md#resolve-mainfields).
- [[#14855] feat!: add isPreview to ConfigEnv and resolveConfig](https://github.com/vitejs/vite/pull/14855)
  - Переименован `ssrBuild` в `isSsrBuild` в объекте `ConfigEnv`.
- [[#14945] fix(css): correctly set manifest source name and emit CSS file](https://github.com/vitejs/vite/pull/14945)
  - Имена CSS-файлов теперь генерируются на основе имени чанка.

## Миграция с v3 {#migration-from-v3}

Сначала ознакомьтесь с [Руководством по миграции с v3](https://v4.vitejs.dev/guide/migration.html) в документации Vite v4, чтобы увидеть необходимые изменения для переноса вашего приложения на Vite v4, а затем продолжайте с изменениями на этой странице.
