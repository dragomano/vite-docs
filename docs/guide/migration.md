# Переход с версии v7 {#migration-from-v7}

Если вы мигрируете с `rolldown-vite` — это был технический preview Rolldown для Vite 6 и 7, — то вам актуальны только разделы с бейджем <Badge text="NRV" type="warning" /> в заголовке.

## Изменение целевых браузеров по умолчанию {#default-browser-target-change} [<Badge text="NRV" type="warning" />](#migration-from-v7)

Значение по умолчанию для `build.target` и `'baseline-widely-available'` обновлено до более новых версий браузеров:

- Chrome 107 → 111
- Edge 107 → 111
- Firefox 104 → 114
- Safari 16.0 → 16.4

Эти версии браузеров соответствуют наборам функций [Baseline](https://web-platform-dx.github.io/web-features/), классифицируемых как широко доступные на 1 января 2026. Другими словами, все они были выпущены примерно два с половиной года назад.

## Rolldown

Vite 8 использует инструменты на базе Rolldown и Oxc вместо esbuild и Rollup.

### Поэтапная миграция {#gradual-migration}

Пакет `rolldown-vite` реализует Vite 7 с Rolldown, но без остальных изменений Vite 8. Его можно использовать как промежуточный шаг при переходе на Vite 8. Чтобы перейти с обычного Vite 7 на `rolldown-vite`, смотрите [руководство по интеграции Rolldown](https://v7.vite.dev/guide/rolldown) в документации Vite 7.

Если вы мигрируете с `rolldown-vite` на Vite 8, достаточно откатить изменения зависимостей в `package.json` и обновиться до Vite 8:

```json
{
  "devDependencies": {
    "vite": "npm:rolldown-vite@7.2.2" // [!code --]
    "vite": "^8.0.0" // [!code ++]
  }
}
```

### Оптимизатор зависимостей теперь использует Rolldown {#dependency-optimizer-now-uses-rolldown}

Для предварительной оптимизации зависимостей теперь используется Rolldown вместо esbuild. Для обратной совместимости Vite по-прежнему поддерживает [`optimizeDeps.esbuildOptions`](/config/dep-optimization-options#optimizedeps-esbuildoptions), автоматически преобразуя его в [`optimizeDeps.rolldownOptions`](/config/dep-optimization-options#optimizedeps-rolldownoptions). Опция `optimizeDeps.esbuildOptions` теперь считается устаревшей и будет удалена в будущем — рекомендуем перейти на `optimizeDeps.rolldownOptions`.

Следующие опции преобразуются автоматически:

- [`esbuildOptions.minify`](https://esbuild.github.io/api/#minify) -> [`rolldownOptions.output.minify`](https://rolldown.rs/reference/OutputOptions.minify)
- [`esbuildOptions.treeShaking`](https://esbuild.github.io/api/#tree-shaking) -> [`rolldownOptions.treeshake`](https://rolldown.rs/reference/InputOptions.treeshake)
- [`esbuildOptions.define`](https://esbuild.github.io/api/#define) -> [`rolldownOptions.transform.define`](https://rolldown.rs/reference/InputOptions.transform#define)
- [`esbuildOptions.loader`](https://esbuild.github.io/api/#loader) -> [`rolldownOptions.moduleTypes`](https://rolldown.rs/reference/InputOptions.moduleTypes)
- [`esbuildOptions.preserveSymlinks`](https://esbuild.github.io/api/#preserve-symlinks) -> [`!rolldownOptions.resolve.symlinks`](https://rolldown.rs/reference/InputOptions.resolve#symlinks)
- [`esbuildOptions.resolveExtensions`](https://esbuild.github.io/api/#resolve-extensions) -> [`rolldownOptions.resolve.extensions`](https://rolldown.rs/reference/InputOptions.resolve#extensions)
- [`esbuildOptions.mainFields`](https://esbuild.github.io/api/#main-fields) -> [`rolldownOptions.resolve.mainFields`](https://rolldown.rs/reference/InputOptions.resolve#mainfields)
- [`esbuildOptions.conditions`](https://esbuild.github.io/api/#conditions) -> [`rolldownOptions.resolve.conditionNames`](https://rolldown.rs/reference/InputOptions.resolve#conditionnames)
- [`esbuildOptions.keepNames`](https://esbuild.github.io/api/#keep-names) -> [`rolldownOptions.output.keepNames`](https://rolldown.rs/reference/OutputOptions.keepNames)
- [`esbuildOptions.platform`](https://esbuild.github.io/api/#platform) -> [`rolldownOptions.platform`](https://rolldown.rs/reference/InputOptions.platform)
- [`esbuildOptions.plugins`](https://esbuild.github.io/plugins/) -> [`rolldownOptions.plugins`](https://rolldown.rs/reference/InputOptions.plugins) (частичная поддержка)

Получить опции, которые подставил слой совместимости, можно из хука `configResolved`:

```js
const plugin = {
  name: 'log-config',
  configResolved(config) {
    console.log('options', config.optimizeDeps.rolldownOptions)
  },
},
```

### Трансформации JavaScript с помощью Oxc {#javascript-transforms-by-oxc}

Теперь для трансформации JavaScript используется Oxc вместо esbuild. Для обратной совместимости Vite по-прежнему поддерживает опцию [`esbuild`](/config/shared-options#esbuild), автоматически преобразуя её в [`oxc`](/config/shared-options#oxc). Опция `esbuild` теперь считается устаревшей и будет удалена в будущем — рекомендуем перейти на `oxc`.

Следующие опции преобразуются автоматически:

- `esbuild.jsxInject` -> `oxc.jsxInject`
- `esbuild.include` -> `oxc.include`
- `esbuild.exclude` -> `oxc.exclude`
- [`esbuild.jsx`](https://esbuild.github.io/api/#jsx) -> [`oxc.jsx`](https://oxc.rs/docs/guide/usage/transformer/jsx)
  - `esbuild.jsx: 'preserve'` -> `oxc.jsx: 'preserve'`
  - `esbuild.jsx: 'automatic'` -> `oxc.jsx: { runtime: 'automatic' }`
    - [`esbuild.jsxImportSource`](https://esbuild.github.io/api/#jsx-import-source) -> `oxc.jsx.importSource`
  - `esbuild.jsx: 'transform'` -> `oxc.jsx: { runtime: 'classic' }`
    - [`esbuild.jsxFactory`](https://esbuild.github.io/api/#jsx-factory) -> `oxc.jsx.pragma`
    - [`esbuild.jsxFragment`](https://esbuild.github.io/api/#jsx-fragment) -> `oxc.jsx.pragmaFrag`
  - [`esbuild.jsxDev`](https://esbuild.github.io/api/#jsx-dev) -> `oxc.jsx.development`
  - [`esbuild.jsxSideEffects`](https://esbuild.github.io/api/#jsx-side-effects) -> `oxc.jsx.pure`
- [`esbuild.define`](https://esbuild.github.io/api/#define) -> [`oxc.define`](https://oxc.rs/docs/guide/usage/transformer/global-variable-replacement#define)
- [`esbuild.banner`](https://esbuild.github.io/api/#banner) -> кастомный плагин с использованием хука transform
- [`esbuild.footer`](https://esbuild.github.io/api/#footer) -> кастомный плагин с использованием хука transform

Опция [`esbuild.supported`](https://esbuild.github.io/api/#supported) не поддерживается Oxc. Если она вам нужна, смотрите [oxc-project/oxc#15373](https://github.com/oxc-project/oxc/issues/15373).

Получить опции, которые подставил слой совместимости, можно из хука `configResolved`:

```js
const plugin = {
  name: 'log-config',
  configResolved(config) {
    console.log('options', config.oxc)
  },
},
```

На данный момент Oxc-трансформер не поддерживает понижение нативных декораторов, так как мы ждём дальнейшего продвижения спецификации (см. [oxc-project/oxc#9170](https://github.com/oxc-project/oxc/issues/9170)).

:::: details Обходное решение для понижения нативных декораторов

Пока можно использовать [Babel](https://babeljs.io/) или [SWC](https://swc.rs/) для понижения нативных декораторов. SWC быстрее Babel, но **не поддерживает самую свежую версию спецификации декораторов**, которую поддерживает esbuild.

Спецификация декораторов несколько раз обновлялась после достижения stage 3. Поддерживаемые инструментами версии:

- `"2023-11"` — поддерживают esbuild, TypeScript 5.4+ и Babel
- `"2023-05"` — поддерживает TypeScript 5.2+
- `"2023-01"` — поддерживает TypeScript 5.0+
- `"2022-03"` — поддерживает SWC

Различия между версиями описаны в [руководстве Babel по версиям декораторов](https://babeljs.io/docs/babel-plugin-proposal-decorators#version).

**Использование Babel:**

::: code-group

```bash [npm]
$ npm install -D @rollup/plugin-babel @babel/plugin-proposal-decorators
```

```bash [Yarn]
$ yarn add -D @rollup/plugin-babel @babel/plugin-proposal-decorators
```

```bash [pnpm]
$ pnpm add -D @rollup/plugin-babel @babel/plugin-proposal-decorators
```

```bash [Bun]
$ bun add -D @rollup/plugin-babel @babel/plugin-proposal-decorators
```

```bash [Deno]
$ deno add -D npm:@rollup/plugin-babel npm:@babel/plugin-proposal-decorators
```

:::

```ts [vite.config.ts]
import { defineConfig, withFilter } from 'vite'
import { babel } from '@rollup/plugin-babel'

export default defineConfig({
  plugins: [
    withFilter(
      babel({
        configFile: false,
        plugins: [
          ['@babel/plugin-proposal-decorators', { version: '2023-11' }],
        ],
      }),
      // Выполнять эту трансформацию только если файл содержит декоратор.
      { transform: { code: '@' } },
    ),
  ],
})
```

**Использование SWC:**

::: code-group

```bash [npm]
$ npm install -D @rollup/plugin-swc @swc/core
```

```bash [Yarn]
$ yarn add -D @rollup/plugin-swc @swc/core
```

```bash [pnpm]
$ pnpm add -D @rollup/plugin-swc @swc/core
```

```bash [Bun]
$ bun add -D @rollup/plugin-swc @swc/core
```

```bash [Deno]
$ deno add -D npm:@rollup/plugin-swc npm:@swc/core
```

:::

```js
import { defineConfig, withFilter } from 'vite'

export default defineConfig({
  // ...
  plugins: [
    withFilter(
      swc({
        swc: {
          jsc: {
            parser: { decorators: true, decoratorsBeforeExport: true },
            // ПРИМЕЧАНИЕ: SWC пока не поддерживает версию '2023-11'.
            transform: { decoratorVersion: '2022-03' },
          },
        },
      }),
      // Выполнять эту трансформацию только если файл содержит декоратор.
      { transform: { code: '@' } },
    ),
  ],
})
```

::::

#### Резервные варианты с esbuild {#esbuild-fallbacks}

`esbuild` больше не используется Vite напрямую и становится опциональной зависимостью. Если ваш плагин использует функцию `transformWithEsbuild`, необходимо установить `esbuild` как `devDependency`. Сама функция `transformWithEsbuild` объявлена устаревшей и будет удалена в будущем. Рекомендуем перейти на новую функцию `transformWithOxc`.

### Минификация JavaScript с помощью Oxc {#javascript-minification-by-oxc}

Для минификации JavaScript теперь используется Oxc Minifier вместо esbuild. Можно временно вернуться к esbuild через устаревшую опцию [`build.minify: 'esbuild'`](/config/build-options#build-minify). Эта опция будет удалена в будущем, и вам потребуется установить `esbuild` как `devDependency`, так как Vite больше не зависит от него напрямую.

Если вы использовали опции `esbuild.minify*` для управления минификацией, теперь используйте `build.rolldownOptions.output.minify`. Если использовали `esbuild.drop`, теперь доступны опции [`build.rolldownOptions.output.minify.compress.drop*`](https://oxc.rs/docs/guide/usage/minifier/dead-code-elimination).

Сокращение имён свойств (property mangling) и связанные с ним опции не поддерживаются Oxc. Если они вам нужны — смотрите [oxc-project/oxc#15375](https://github.com/oxc-project/oxc/issues/15375).

esbuild и Oxc Minifier делают немного разные предположения об исходном коде. Если подозреваете, что минификатор ломает ваш код, сравните эти предположения:

- [Предположения esbuild при минификации](https://esbuild.github.io/api/#minify-considerations)
- [Предположения Oxc Minifier](https://oxc.rs/docs/guide/usage/minifier.html#assumptions)

Пожалуйста, сообщайте о любых найденных проблемах с минификацией в ваших JavaScript-приложениях.

### Минификация CSS с помощью Lightning CSS {#css-minification-by-lightning-css}

По умолчанию для минификации CSS теперь используется [Lightning CSS](https://lightningcss.dev/). Вернуться к esbuild можно через опцию [`build.cssMinify: 'esbuild'`](/config/build-options#build-cssminify). При этом потребуется установить `esbuild` как `devDependency`.

Lightning CSS по умолчанию использует более современные CSS-конструкции. Из-за этого размер минифицированного CSS-бандла иногда может немного вырасти.

### Единообразная совместимость с CommonJS {#consistent-commonjs-interop}

Импорт `default` из модуля CommonJS (CJS) теперь обрабатывается единообразно.

Если выполняется одно из следующих условий, импорт `default` — это значение `module.exports` импортируемого CJS-модуля. В противном случае импорт `default` — это значение `module.exports.default` импортируемого CJS-модуля:

- Импортирующий файл имеет расширение `.mjs` или `.mts`.
- Ближайший `package.json` для импортирующего файла содержит поле `type` со значением `module`.
- Значение `module.exports.__esModule` импортируемого CJS-модуля не равно `true`.

::: details Предыдущее поведение

В режиме разработки, если выполнялось одно из следующих условий, импорт `default` — это значение `module.exports` импортируемого CJS-модуля. В противном случае импорт `default` — это значение `module.exports.default` импортируемого CJS-модуля:

- _Импортирующий файл включён в оптимизацию зависимостей_ и имеет расширение `.mjs` или `.mts`.
- _Импортирующий файл включён в оптимизацию зависимостей_ и ближайший `package.json` для него содержит поле `type` со значением `module`.
- Значение `module.exports.__esModule` импортируемого CJS-модуля не равно `true`.

В режиме сборки условия были:

- Значение `module.exports.__esModule` импортируемого CJS-модуля не равно `true`.
- _Свойство `default` у `module.exports` не существует_.

(при условии, что [`build.commonjsOptions.defaultIsModuleExports`](https://github.com/rollup/plugins/tree/master/packages/commonjs#defaultismoduleexports) не изменено со значения по умолчанию `'auto'`)

:::

Подробности об этой проблеме — в [документации Rolldown](https://rolldown.rs/in-depth/bundling-cjs#ambiguous-default-import-from-cjs-modules).

Это изменение может сломать существующий код, импортирующий CJS-модули. Для временного возврата к старому поведению можно использовать устаревшую опцию `legacy.inconsistentCjsInterop: true`. Если вы обнаружили пакет, который пострадал от этого изменения — сообщите об этом автору пакета или отправьте ему пулреквест, обязательно приложив ссылку на документ Rolldown выше, чтобы автор понял контекст.

### Удалено определение формата модуля по содержимому файла {#removed-module-resolution-using-format-sniffing}

Раньше, когда в `package.json` одновременно присутствовали поля `browser` и `module`, Vite выбирал нужное поле, заглядывая в содержимое файла (и обычно брал ESM-файл для браузера). Такое поведение было введено из-за того, что некоторые пакеты использовали `module` для указания ESM-файла под Node.js, а другие — `browser` для UMD-файла под браузер. Поскольку современное поле `exports` решает эту проблему и уже широко принято, Vite больше не применяет эту эвристику и строго следует порядку в опции [`resolve.mainFields`](/config/shared-options#resolve-mainfields). Если вы полагались на прежнее поведение — используйте [`resolve.alias`](/config/shared-options#resolve-alias) для сопоставления нужного поля с файлом или применяйте патч через менеджер пакетов (например, `patch-package`, `pnpm patch`).

### Сохранение вызовов `require` для внешних модулей {#require-calls-for-externalized-modules}

Вызовы `require` для внешних модулей теперь сохраняются как `require` и не преобразуются в `import`. Это сделано для сохранения правильной семантики `require`. Если нужно всё-таки преобразовать их в `import` — используйте встроенный плагин Rolldown `esmExternalRequirePlugin`, который переэкспортируется из `vite`.

```js
import { defineConfig, esmExternalRequirePlugin } from 'vite'

export default defineConfig({
  // ...
  plugins: [
    esmExternalRequirePlugin({
      external: ['react', 'vue', /^node:/],
    }),
  ],
})
```

См. подробности в [документации Rolldown](https://rolldown.rs/in-depth/bundling-cjs#require-external-modules).

### `import.meta.url` в форматах UMD / IIFE {#import-meta-url-in-umd-iife}

Свойство `import.meta.url` больше не заменяется полифиллом в форматах вывода UMD / IIFE. По умолчанию оно заменяется на `undefined`. Если нужно сохранить прежнее поведение, используйте опцию [`define`](/config/shared-options#define) вместе с [`build.rolldownOptions.output.intro`](https://rolldown.rs/reference/OutputOptions.intro). Подробности — в [документации Rolldown](https://rolldown.rs/in-depth/non-esm-output-formats#well-known-import-meta-properties).

### Удалена опция `build.rollupOptions.watch.chokidar` {#removed-build-rollupoptions-watch-chokidar-option}

Опция `build.rollupOptions.watch.chokidar` удалена. Переходите на [`build.rolldownOptions.watch.notify`](https://rolldown.rs/reference/InputOptions.watch#notify).

### Устарела опция `build.rollupOptions.output.manualChunks` {#deprecate-build-rollupoptions-output-manualchunks}

Опция `output.manualChunks` устарела. Rolldown имеет более гибкую опцию [`codeSplitting`](https://rolldown.rs/reference/OutputOptions.codeSplitting). Подробности об `codeSplitting` см. в документации Rolldown: [Ручное разделение кода - Rolldown](https://rolldown.rs/in-depth/manual-code-splitting).

### Поддержка типов модулей и их автоопределение {#module-type-support-and-auto-detection}

_Это изменение касается только авторов плагинов._

Rolldown имеет экспериментальную поддержку [типов модулей](https://rolldown.rs/guide/notable-features#module-types), аналогичную опции [`loader`](https://esbuild.github.io/api/#loader) в esbuild. Из-за этого Rolldown теперь автоматически определяет тип модуля по расширению файла. Если в хуках `load` или `transform` вы преобразуете содержимое других типов модулей в JavaScript, может потребоваться явно указывать `moduleType: 'js'` в возвращаемом значении:

```js
const plugin = {
  name: 'txt-loader',
  load(id) {
    if (id.endsWith('.txt')) {
      const content = fs.readFile(id, 'utf-8')
      return {
        code: `export default ${JSON.stringify(content)}`,
        moduleType: 'js', // [!code ++]
      }
    }
  },
}
```

### Другие связанные устаревания {#other-related-deprecations}

Следующие опции объявлены устаревшими и будут удалены в будущем:

- `build.rollupOptions` → переименована в `build.rolldownOptions`
- `worker.rollupOptions` переименована в `worker.rolldownOptions`
- `build.commonjsOptions` теперь не делает ничего (no-op)
- `build.dynamicImportVarsOptions.warnOnError`: теперь не делает ничего (no-op)

## Основные изменения {#general-changes} [<Badge text="NRV" type="warning" />](#migration-from-v7)

## Удалённые устаревшие функции {#removed-deprecated-features} [<Badge text="NRV" type="warning" />](#migration-from-v7)

Передача URL в `import.meta.hot.accept` больше не поддерживается. Пожалуйста, [передавайте вместо этого id](https://github.com/vitejs/vite/pull/21382)

**TODO: Это изменение ещё не реализовано, но будет реализовано до стабильного релиза.**

## Расширенные возможности {#advanced}

Эти нарушающие совместимость изменения затронут лишь небольшое количество проектов:

- **[TODO: будет исправлено до стабильного релиза]** https://github.com/rolldown/rolldown/issues/5726 (затрагивает nuxt, qwik)
- **[TODO: будет исправлено до стабильного релиза]** Устаревшие чанки теперь выводятся как файл-ресурс (asset), а не как чанк, из-за отсутствия функции предварительного emit-чанка [](https://github.com/rolldown/rolldown/issues/4034). Это означает, что опции чанков к ним не применяются, и в манифесте они не будут отображаться как чанки.
- **[TODO: будет исправлено до стабильного релиза]** Крайний случай с комментарием `@vite-ignore` [](https://github.com/vitejs/rolldown-vite/issues/426)
- [Extglobs](https://github.com/micromatch/picomatch/blob/master/README.md#extglobs) пока не поддерживаются [](https://github.com/vitejs/rolldown-vite/issues/365)
- `define` не делит ссылку на объекты: если передать объект в `define`, каждая переменная получит свою копию объекта. Подробности — в [документации Oxc Transformer](https://oxc.rs/docs/guide/usage/transformer/global-variable-replacement#define).
- Изменения в объекте `bundle` (объект, передаваемый в хуки `generateBundle` / `writeBundle` и возвращаемый функцией `build`):
  - назначение `bundle[foo] = …` больше не поддерживается (Rollup тоже не рекомендовал). Используйте `this.emitFile()`.
  - ссылка на объект не сохраняется между хуками [](https://github.com/vitejs/rolldown-vite/issues/410)
  - `structuredClone(bundle)` падает с `DataCloneError`. Эта возможность удалена. Клонируйте через `structuredClone({ ...bundle })` [](https://github.com/vitejs/rolldown-vite/issues/128)
- Все параллельные хуки Rollup теперь работают как последовательные. Подробности — в [документации Rolldown](https://rolldown.rs/apis/plugin-api#sequential-hook-execution).
- Директива `"use strict";` иногда не вставляется. Подробности — в [документации Rolldown](https://rolldown.rs/in-depth/directives).
- Понижение ниже ES5 с помощью plugin-legacy не поддерживается [](https://github.com/vitejs/rolldown-vite/issues/452)
- Передача одного и того же браузера с разными версиями в `build.target` теперь вызывает ошибку: раньше esbuild брал последнюю версию, что, скорее всего, не было желаемым поведением.
- Функции, которые Rolldown не поддерживает (и Vite больше не поддерживает):
  - `build.rollupOptions.output.format: 'system'` [](https://github.com/rolldown/rolldown/issues/2387)
  - `build.rollupOptions.output.format: 'amd'` [](https://github.com/rolldown/rolldown/issues/2528)
  - Полная поддержка legacy namespace в TypeScript [](https://github.com/oxc-project/oxc/issues/14227)
  - Хук `shouldTransformCachedModule` [](https://github.com/rolldown/rolldown/issues/4389)
  - Хук `resolveImportMeta` [](https://github.com/rolldown/rolldown/issues/1010)
  - Хук `renderDynamicImport` [](https://github.com/rolldown/rolldown/issues/4532)
  - Хук `resolveFileUrl`
- Функции `parseAst` / `parseAstAsync` объявлены устаревшими в пользу `parseSync` / `parse`, у которых больше возможностей.

## Переход с v6 {#migration-from-v6}

Сначала ознакомьтесь с [Руководством по переходу с v6](https://v7.vite.dev/guide/migration) в документации Vite v7, чтобы увидеть необходимые изменения для переноса вашего приложения на Vite 7, а затем продолжите с изменениями на этой странице.
