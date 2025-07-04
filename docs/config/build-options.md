# Параметры сборки {#build-options}

Если не указано иное, параметры, описанные в этом разделе, применяются только к сборке.

## build.target

- **Тип:** `string | string[]`
- **По умолчанию:** `'baseline-widely-available'`
- **Связано:** [Совместимость с браузерами](/guide/build#browser-compatibility)

Целевой уровень совместимости с браузерами для итоговой сборки. Значение по умолчанию — специальное значение Vite `'baseline-widely-available'`, которое ориентируется на браузеры, входящие в категорию [базовых](https://web-platform-dx.github.io/web-features/) широко распространённых (Baseline Widely Available) на 1 мая 2025 года. В частности, это `['chrome107', 'edge107', 'firefox104', 'safari16']`.

Другим специальным значением является `'esnext'`, которое предполагает встроенную поддержку динамического импорта и будет выполнять только минимальную транспиляцию.

Преобразование выполняется с помощью esbuild, и значение должно быть допустимой [опцией цели esbuild](https://esbuild.github.io/api/#target). Пользовательские цели могут быть либо версией ES (например, `es2015`), браузером с версией (например, `chrome58`), либо массивом нескольких целевых строк.

Обратите внимание, что сборка завершится неудачей, если код содержит функции, которые не могут быть безопасно транспилированы esbuild. См. [документацию esbuild](https://esbuild.github.io/content-types/#javascript) для получения дополнительных сведений.

## build.modulePreload

- **Тип:** `boolean | { polyfill?: boolean, resolveDependencies?: ResolveModulePreloadDependenciesFn }`
- **По умолчанию:** `{ polyfill: true }`

По умолчанию встраивается [полифилл для предварительной загрузки модулей](https://guybedford.com/es-module-preloading-integrity#modulepreload-polyfill). Полифилл автоматически встраивается в прокси-модуль каждого входа `index.html`. Если сборка настроена на использование нестандартного HTML-входа через `build.rollupOptions.input`, то необходимо вручную импортировать полифилл в вашем пользовательском входе:

```js
import 'vite/modulepreload-polyfill'
```

Примечание: полифилл **не** применяется в [режиме библиотеки](/guide/build#library-mode). Если вам нужно поддерживать браузеры без нативного динамического импорта, вам, вероятно, следует избегать его использования в вашей библиотеке.

Полифилл можно отключить, установив `{ polyfill: false }`.

Список чанков для предварительной загрузки для каждого динамического импорта вычисляется Vite. По умолчанию будет использоваться абсолютный путь, включая `base`, при загрузке этих зависимостей. Если `base` относительный (`''` или `'./'`), то в процессе выполнения используется `import.meta.url`, чтобы избежать абсолютных путей, зависящих от окончательной развёрнутой базы.

Существует экспериментальная поддержка тонкой настройки списка зависимостей и их путей с использованием функции `resolveDependencies`. [Оставить отзыв](https://github.com/vitejs/vite/discussions/13841). Ожидается, что это будет функция типа `ResolveModulePreloadDependenciesFn`:

```ts
type ResolveModulePreloadDependenciesFn = (
  url: string,
  deps: string[],
  context: {
    hostId: string
    hostType: 'html' | 'js'
  }
) => string[]
```

Функция `resolveDependencies` будет вызываться для каждого динамического импорта с списком чанков, от которых он зависит, а также будет вызываться для каждого чанка, импортированного в HTML-файлы входа. Можно вернуть новый массив зависимостей с отфильтрованными или добавленными зависимостями и изменёнными их путями. Пути `deps` относительны к `build.outDir`. Возвращаемое значение должно быть относительным путём к `build.outDir`.

```js twoslash
/** @type {import('vite').UserConfig} */
const config = {
  // prettier-ignore
  build: {
// ---cut-before---
modulePreload: {
  resolveDependencies: (filename, deps, { hostId, hostType }) => {
    return deps.filter(condition)
  },
},
// ---cut-after---
  }
}
```

Пути разрешённых зависимостей можно дополнительно изменить с помощью [`experimental.renderBuiltUrl`](../guide/build.md#advanced-base-options).

## build.polyfillModulePreload

- **Тип:** `boolean`
- **По умолчанию:** `true`
- **Устарело:** используйте `build.modulePreload.polyfill` вместо этого

Определяет, следует ли автоматически встраивать [полифилл для предварительной загрузки модулей](https://guybedford.com/es-module-preloading-integrity#modulepreload-polyfill).

## build.outDir

- **Тип:** `string`
- **По умолчанию:** `dist`

Укажите выходной каталог (относительно [корня проекта](/guide/#index-html-and-project-root)).

## build.assetsDir

- **Тип:** `string`
- **По умолчанию:** `assets`

Укажите каталог для вложения сгенерированных ресурсов (относительно `build.outDir`). Это не используется в [режиме библиотеки](/guide/build#library-mode).

## build.assetsInlineLimit

- **Тип:** `number` | `((filePath: string, content: Buffer) => boolean | undefined)`
- **По умолчанию:** `4096` (4 КБ)

Импортированные или упомянутые ресурсы, которые меньше этого порога, будут встроены как base64 URL, чтобы избежать дополнительных HTTP-запросов. Установите значение `0`, чтобы полностью отключить встраивание.

Если передан обратный вызов, можно вернуть булево значение для выбора включения или исключения. Если ничего не возвращается, применяется логика по умолчанию.

Заполнители Git LFS автоматически исключаются из встраивания, поскольку они не содержат содержимого файла, который они представляют.

::: tip Примечание
Если вы укажете `build.lib`, `build.assetsInlineLimit` будет проигнорирован, и ресурсы всегда будут встроены, независимо от размера файла или того, являются ли они заполнителем Git LFS.
:::

## build.cssCodeSplit

- **Тип:** `boolean`
- **По умолчанию:** `true`

Включить/отключить разделение кода CSS. При включении CSS, импортированный в асинхронные JS-чанки, будет сохранён как чанки и загружен вместе с загружаемым чанком.

Если отключено, весь CSS в проекте будет извлечён в один файл CSS.

::: tip Примечание
Если вы укажете `build.lib`, `build.cssCodeSplit` будет `false` по умолчанию.
:::

## build.cssTarget

- **Тип:** `string | string[]`
- **По умолчанию:** такой же, как и [`build.target`](#build-target)

Эта опция позволяет пользователям установить другую целевую версию браузера для минификации CSS, отличную от той, которая используется для транспиляции JavaScript.

Используйте этот параметр только при разработке для нестандартных браузеров. Например, Android WeChat WebView поддерживает большинство современных функций JavaScript, но не понимает [шестнадцатеричную нотацию цветов `#RGBA` в CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#rgb_colors). Чтобы Vite не преобразовывал цвета `rgba()` в шестнадцатеричный формат `#RGBA`, установите значение `chrome61` для параметра `build.cssTarget`.

## build.cssMinify

- **Тип:** `boolean | 'esbuild' | 'lightningcss'`
- **По умолчанию:** такой же, как и [`build.minify`](#build-minify) для клиента, `'esbuild'` для SSR

Эта опция позволяет пользователям переопределить минификацию CSS, вместо того чтобы использовать значение по умолчанию `build.minify`, так что вы можете настраивать минификацию для JS и CSS отдельно. Vite по умолчанию использует `esbuild` для минификации CSS. Установите опцию в `'lightningcss'`, чтобы использовать [Lightning CSS](https://lightningcss.dev/minification.html) вместо этого. Если выбрано, это можно настроить с помощью [`css.lightningcss`](./shared-options.md#css-lightningcss).

## build.sourcemap

- **Тип:** `boolean | 'inline' | 'hidden'`
- **По умолчанию:** `false`

Генерировать исходные карты для продакшен-сборки. Если `true`, будет создан отдельный файл sourcemap. Если `'inline'`, sourcemap будет добавлен к результирующему выходному файлу в виде data URI. `'hidden'` работает как `true`, за исключением того, что соответствующие комментарии sourcemap в собранных файлах подавляются.

## build.rollupOptions

- **Тип:** [`RollupOptions`](https://rollupjs.org/configuration-options/)

Напрямую настраивайте базовую сборку Rollup. Это то же самое, что и параметры, которые могут быть экспортированы из файла конфигурации Rollup, и они будут объединены с внутренними параметрами Rollup Vite. См. [документацию по параметрам Rollup](https://rollupjs.org/configuration-options/) для получения дополнительных сведений.

## build.commonjsOptions

- **Тип:** [`RollupCommonJSOptions`](https://github.com/rollup/plugins/tree/master/packages/commonjs#options)

Опции, которые передаются в [@rollup/plugin-commonjs](https://github.com/rollup/plugins/tree/master/packages/commonjs).

## build.dynamicImportVarsOptions

- **Тип:** [`RollupDynamicImportVarsOptions`](https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#options)
- **Связано:** [Динамический импорт](/guide/features#dynamic-import)

Опции, которые передаются в [@rollup/plugin-dynamic-import-vars](https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars).

## build.lib

- **Тип:** `{ entry: string | string[] | { [entryAlias: string]: string }, name?: string, formats?: ('es' | 'cjs' | 'umd' | 'iife')[], fileName?: string | ((format: ModuleFormat, entryName: string) => string), cssFileName?: string }`
- **Связано:** [Режим библиотеки](/guide/build#library-mode)

Сборка в виде библиотеки. `entry` является обязательным, так как библиотека не может использовать HTML в качестве входа. `name` — это открытая глобальная переменная и обязательна, когда `formats` включает `'umd'` или `'iife'`. Значения по умолчанию для `formats` — `['es', 'umd']`, или `['es', 'cjs']`, если используются несколько входов.

`fileName` — это имя выходного файла пакета, значение по умолчанию для `fileName` — это опция name из package.json, его также можно определить как функцию, принимающую `format` и `entryAlias` в качестве аргументов, и возвращающая имя файла.

Если ваш пакет импортирует CSS, для указания имени выходного файла CSS можно использовать `cssFileName`. По умолчанию используется то же значение, что и `fileName` , если оно задано в виде строки, в противном случае оно также возвращается к `"name"` в `package.json`.

```js twoslash [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: ['src/main.js'],
      fileName: (format, entryName) => `my-lib-${entryName}.${format}.js`,
      cssFileName: 'my-lib-style'
    }
  }
})
```

## build.manifest

- **Тип:** `boolean | string`
- **По умолчанию:** `false`
- **Связано:** [Интеграция с бэкендом](/guide/backend-integration)

Опция отвечает за то, нужно ли создавать файл манифеста, который будет содержать соответствие между оригинальными именами файлов ресурсов и их хэшированными версиями. Этот файл может быть полезен для серверных фреймворков, чтобы корректно подставлять ссылки на ресурсы.

Если указать строку, она будет использоваться как путь к файлу манифеста относительно директории `build.outDir`. Если же указать `true`, файл манифеста будет создан по пути `.vite/manifest.json`.

## build.ssrManifest

- **Тип:** `boolean | string`
- **По умолчанию:** `false`
- **Связано:** [Серверный рендеринг](/guide/ssr)

Опция отвечает за то, нужно ли создавать файл манифеста для SSR. Этот файл помогает определить, какие стили и ресурсы нужно подгружать в продакшен-режиме.

Если указать строку, она будет использоваться как путь к файлу манифеста относительно директории `build.outDir`. Если же указать `true`, файл манифеста будет создан по пути `.vite/ssr-manifest.json`.

## build.ssr

- **Тип:** `boolean | string`
- **По умолчанию:** `false`
- **Связано:** [Серверный рендеринг](/guide/ssr)

Создать сборку, ориентированную на SSR. Значение может быть строкой для прямого указания входа SSR или `true`, что требует указания входа SSR через `rollupOptions.input`.

## build.emitAssets

- **Тип:** `boolean`
- **По умолчанию:** `false`

Во время сборок, не относящихся к клиенту, статические ресурсы не выводятся, так как предполагается, что они будут выведены в рамках сборки клиента. Эта опция позволяет фреймворкам принудительно выводить их в других средах сборки. Ответственность за объединение ресурсов с постобработкой сборки лежит на фреймворке.

## build.ssrEmitAssets

- **Тип:** `boolean`
- **По умолчанию:** `false`

Во время сборки SSR статические ресурсы не выводятся, так как предполагается, что они будут выведены как часть клиентской сборки. Эта опция позволяет фреймворкам принудительно выводить их как в клиентской, так и в SSR сборке. Ответственность за объединение ресурсов лежит на фреймворке в процессе постобработки сборки. Этот параметр будет заменен на `build.emitAssets`, как только Environment API станет стабильным.

## build.minify

- **Тип:** `boolean | 'terser' | 'esbuild'`
- **По умолчанию:** `'esbuild'` для клиентской сборки, `false` для сборки SSR

Установите значение `false`, чтобы отключить минификацию, или укажите используемый минификатор. Значение по умолчанию — [esbuild](https://github.com/evanw/esbuild), который в 20 ~ 40 раз быстрее, чем terser, и только на 1 ~ 2% хуже по сжатию. [Бенчмарки](https://github.com/privatenumber/minification-benchmarks)

Обратите внимание, что опция `build.minify` не минифицирует пробелы при использовании формата `'es'` в режиме библиотеки, так как это удаляет аннотации pure и нарушает tree-shaking («встряхивание дерева»).

Terser должен быть установлен, когда он установлен в `'terser'`.

```sh
npm add -D terser
```

## build.terserOptions

- **Тип:** `TerserOptions`

Дополнительные [опции минификации](https://terser.org/docs/api-reference#minify-options), которые передаются в Terser.

Кроме того, вы также можете передать опцию `maxWorkers: number`, чтобы указать максимальное количество рабочих процессов для создания. По умолчанию это количество ЦПУ минус 1.

## build.write

- **Тип:** `boolean`
- **По умолчанию:** `true`

Установите значение `false`, чтобы отключить запись пакета на диск. Это в основном используется в [программных вызовах `build()`](/guide/api-javascript#build), когда требуется дальнейшая постобработка пакета перед записью на диск.

## build.emptyOutDir

- **Тип:** `boolean`
- **По умолчанию:** `true`, если `outDir` находится внутри `root`

По умолчанию Vite очистит `outDir` при сборке, если он находится внутри корня проекта. Он выдаст предупреждение, если `outDir` находится вне корня, чтобы избежать случайного удаления важных файлов. Вы можете явно установить эту опцию, чтобы подавить предупреждение. Это также доступно через командную строку как `--emptyOutDir`.

## build.copyPublicDir

- **Тип:** `boolean`
- **По умолчанию:** `true`

По умолчанию Vite будет копировать файлы из `publicDir` в `outDir` при сборке. Установите значение `false`, чтобы отключить эту функцию.

## build.reportCompressedSize

- **Тип:** `boolean`
- **По умолчанию:** `true`

Включить/отключить отчёт о размере, сжатом с помощью gzip. Сжатие больших выходных файлов может быть медленным, поэтому отключение этой функции может увеличить производительность сборки для крупных проектов.

## build.chunkSizeWarningLimit

- **Тип:** `number`
- **По умолчанию:** `500`

Порог для предупреждений о размере чанка (в кБ). Он сравнивается с несжатыми размерами чанков, так как [размер JavaScript сам по себе связан со временем выполнения](https://v8.dev/blog/cost-of-javascript-2019).

## build.watch

- **Тип:** [`WatcherOptions`](https://rollupjs.org/configuration-options/#watch) `| null`
- **По умолчанию:** `null`

Установите значение `{}`, чтобы включить наблюдатель Rollup. Это в основном используется в случаях, связанных с плагинами только для сборки или процессами интеграции.

::: warning Использование Vite в Windows Subsystem for Linux (WSL) 2

Существуют случаи, когда наблюдение за файловой системой не работает с WSL2. См. [`server.watch`](./server-options.md#server-watch) для получения дополнительных сведений.

:::
