# Интеграция с бэкендом {#backend-integration}

:::tip Примечание
Если вы хотите обслуживать HTML с помощью традиционного бэкенда (например, Rails, Laravel), но использовать Vite для обслуживания ресурсов, проверьте существующие интеграции, перечисленные в [Awesome Vite](https://github.com/vitejs/awesome-vite#integrations-with-backends).

Если вам нужна пользовательская интеграция, вы можете следовать шагам в этом руководстве, чтобы настроить её вручную.
:::

1. В вашей конфигурации Vite настройте точку входа и включите манифест сборки:

   ```js twoslash [vite.config.js]
   import { defineConfig } from 'vite'
   // ---cut---
   export default defineConfig({
     server: {
       cors: {
         // источник, к которому вы будете обращаться через браузер
         origin: 'http://my-backend.example.com',
       },
     },
     build: {
       // генерация .vite/manifest.json в outDir
       manifest: true,
       rollupOptions: {
         // перезапись стандартной точки входа .html
         input: '/path/to/main.js',
       },
     },
   })
   ```

   Если вы не отключили [полифилл предварительной загрузки модулей](/config/build-options.md#build-polyfillmodulepreload), вам также нужно импортировать полифилл в вашу точку входа.

   ```js
   // добавление начала входной точки вашего приложения
   import 'vite/modulepreload-polyfill'
   ```

2. Для разработки вставьте следующее в HTML-шаблон вашего сервера (замените `http://localhost:5173` на локальный URL, по которому работает Vite):

   ```html
   <!-- в режиме разработки -->
   <script type="module" src="http://localhost:5173/@vite/client"></script>
   <script type="module" src="http://localhost:5173/main.js"></script>
   ```

   Чтобы правильно обслуживать ресурсы, у вас есть два варианта:
   - Убедитесь, что сервер настроен на проксирование запросов статических ресурсов к серверу Vite
   - Установите [`server.origin`](/config/server-options.md#server-origin), чтобы сгенерированные URL-адреса ресурсов разрешались с использованием URL-адреса бэкенд-сервера вместо относительного пути

   Это необходимо для правильной загрузки ресурсов, таких как изображения.

   Обратите внимание, что если вы используете React с `@vitejs/plugin-react`, вам также нужно добавить это перед вышеуказанными скриптами, так как плагин не может изменить HTML, который вы обслуживаете (замените `http://localhost:5173` на локальный URL, по которому работает Vite):

   ```html
   <script type="module">
     import RefreshRuntime from 'http://localhost:5173/@react-refresh'
     RefreshRuntime.injectIntoGlobalHook(window)
     window.$RefreshReg$ = () => {}
     window.$RefreshSig$ = () => (type) => type
     window.__vite_plugin_react_preamble_installed__ = true
   </script>
   ```

3. Для продакшен-сборки, после выполнения команды `vite build`, будет сгенерирован файл `.vite/manifest.json` вместе с другими файлами ресурсов. Пример файла манифеста выглядит следующим образом:

   ```json [.vite/manifest.json] style:max-height:400px
   {
     "_shared-B7PI925R.js": {
       "file": "assets/shared-B7PI925R.js",
       "name": "shared",
       "css": ["assets/shared-ChJ_j-JJ.css"]
     },
     "_shared-ChJ_j-JJ.css": {
       "file": "assets/shared-ChJ_j-JJ.css",
       "src": "_shared-ChJ_j-JJ.css"
     },
     "logo.svg": {
       "file": "assets/logo-BuPIv-2h.svg",
       "src": "logo.svg"
     },
     "baz.js": {
       "file": "assets/baz-B2H3sXNv.js",
       "name": "baz",
       "src": "baz.js",
       "isDynamicEntry": true
     },
     "views/bar.js": {
       "file": "assets/bar-gkvgaI9m.js",
       "name": "bar",
       "src": "views/bar.js",
       "isEntry": true,
       "imports": ["_shared-B7PI925R.js"],
       "dynamicImports": ["baz.js"]
     },
     "views/foo.js": {
       "file": "assets/foo-BRBmoGS9.js",
       "name": "foo",
       "src": "views/foo.js",
       "isEntry": true,
       "imports": ["_shared-B7PI925R.js"],
       "css": ["assets/foo-5UjPuW-k.css"]
     }
   }
   ```

   Манифест имеет структуру `Record<name, chunk>`, где каждый чанк соответствует интерфейсу `ManifestChunk`:

   ```ts style:max-height:400px
   interface ManifestChunk {
     /**
      * Имя исходного файла этого чанка / ресурса, если известно
     */
     src?: string
     /**
      * Имя выходного файла этого чанка / ресурса
     */
     file: string
     /**
      * Список CSS-файлов, импортируемых этим чанком
     */
     css?: string[]
     /**
      * Список файлов-ресурсов (кроме CSS), импортируемых этим чанком
     */
     assets?: string[]
     /**
      * Является ли этот чанк или ресурс точкой входа
     */
     isEntry?: boolean
     /**
      * Имя этого чанка / ресурса, если известно
     */
     name?: string
     /**
      * Является ли этот чанк динамической точкой входа
     *
     * Это поле присутствует только в JS-чанках.
     */
     isDynamicEntry?: boolean
     /**
      * Список статически импортируемых чанков этим чанком
     *
     * Значения — это ключи манифеста. Поле присутствует только в JS-чанках.
     */
     imports?: string[]
     /**
      * Список динамически импортируемых чанков этим чанком
     *
     * Значения — это ключи манифеста. Поле присутствует только в JS-чанках.
     */
     dynamicImports?: string[]
   }
   ```

   Каждая запись в манифесте представляет собой что-то одно из следующего списка:
   - **Чанки точек входа**: Генерируются из файлов, указанных в [`build.rollupOptions.input`](https://rollupjs.org/configuration-options/#input). Эти чанки имеют `isEntry: true`, а их ключ — это относительный путь src от корня проекта.
   - **Динамические чанки точек входа**: Генерируются из динамических импортов. Эти чанки имеют `isDynamicEntry: true`, а их ключ — это относительный путь src от корня проекта.
   - **Чанки, не являющиеся точками входа**: Их ключ — это базовое имя сгенерированного файла с префиксом `_`.
   - **Чанки активов**: Генерируются из импортированных активов, таких как изображения, шрифты. Их ключ — это относительный путь src от корня проекта.
   - **CSS-**файлы**: Когда [`build.cssCodeSplit`](/config/build-options.md#build-csscodesplit) равно `false`, генерируется единый CSS-файл с ключом `style.css`. Когда `build.cssCodeSplit` не равно `false`, ключ генерируется аналогично JS-чанкам (т. е. чанки точек входа не будут иметь префикс `_`, а чанки, не являющиеся точками входа, будут иметь префикс `_`).

   JS-чанки (чанки, не являющиеся ресурсами или CSS) будут содержать информацию о своих статических и динамических импортах (это ключи, соответствующие нужным чанкам в манифесте). Чанки также перечисляют соответствующие им CSS-файлы и файлы ресурсов, если они имеются.

4. Вы можете использовать этот файл для рендеринга ссылок или директив предварительной загрузки с хешированными именами файлов.

   Вот пример HTML-шаблона для рендеринга правильных ссылок. Синтаксис здесь приведен только для объяснения, замените его на язык шаблонов вашего сервера. Функция `importedChunks` приведена для иллюстрации и не предоставляется Vite.

   ```html
   <!-- в режиме разработки -->

   <!-- для cssFile из manifest[name].css -->
   <link rel="stylesheet" href="/{{ cssFile }}" />

   <!-- для чанка из importedChunks(manifest, name) -->
   <!-- для cssFile из chunk.css -->
   <link rel="stylesheet" href="/{{ cssFile }}" />

   <script type="module" src="/{{ manifest[name].file }}"></script>

   <!-- для чанка из importedChunks(manifest, name) -->
   <link rel="modulepreload" href="/{{ chunk.file }}" />
   ```

   В частности, бэкенд, генерирующий HTML, должен включать следующие теги, учитывая файл манифеста и точку входа:

   Обратите внимание, что рекомендуется следовать этому порядку для оптимальной производительности:
   1. Тег `<link rel="stylesheet">` для каждого файла в списке `css` чанка точки входа (если он существует).
   2. Рекурсивно следовать всем чанкам в списке `imports` точки входа и включать тег `<link rel="stylesheet">` для каждого CSS-файла из списка `css` каждого импортированного чанка (если он существует).
   3. Тег для ключа `file` чанка точки входа. Это может быть `<script type="module">` для JavaScript или `<link rel="stylesheet">` для CSS.
   4. Опционально, тег `<link rel="modulepreload">` для ключа `file` каждого импортированного JavaScript-чанка, снова рекурсивно следуя импорту, начиная с чанка точки входа.

   Следуя приведённому выше примеру манифеста, для точки входа `main.js` в продакшен-сборке должны быть включены следующие теги:

   ```html
   <link rel="stylesheet" href="assets/main.b82dbe22.css" />
   <link rel="stylesheet" href="assets/shared.a834bfc3.css" />
   <script type="module" src="assets/main.4889e940.js"></script>
   <!-- опционально -->
   <link rel="modulepreload" href="assets/shared.83069a53.js" />
   ```

   В то время как следующее должно быть включено для точки входа `views/foo.js`:

   ```html
   <link rel="stylesheet" href="assets/shared.a834bfc3.css" />
   <script type="module" src="assets/foo.869aea0d.js"></script>
   <!-- опционально -->
   <link rel="modulepreload" href="assets/shared.83069a53.js" />
   ```

   ::: details Псевдо-реализация `importedChunks`
   Пример псевдо-реализации `importedChunks` на TypeScript (это потребуется адаптировать для вашего языка программирования и языка шаблонов):

   ```ts
   import type { Manifest, ManifestChunk } from 'vite'

   export default function importedChunks(
     manifest: Manifest,
     name: string,
   ): ManifestChunk[] {
     const seen = new Set<string>()

     function getImportedChunks(chunk: ManifestChunk): ManifestChunk[] {
       const chunks: ManifestChunk[] = []
       for (const file of chunk.imports ?? []) {
         const importee = manifest[file]
         if (seen.has(file)) {
           continue
         }
         seen.add(file)

         chunks.push(...getImportedChunks(importee))
         chunks.push(importee)
       }

       return chunks
     }

     return getImportedChunks(manifest[name])
   }
   ```

   :::