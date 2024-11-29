# Интеграция с бэкендом {#backend-integration}

:::tip Примечание
Если вы хотите обслуживать HTML с помощью традиционного бэкенда (например, Rails, Laravel), но использовать Vite для обслуживания ресурсов, проверьте существующие интеграции, перечисленные в [Awesome Vite](https://github.com/vitejs/awesome-vite#integrations-with-backends).

Если вам нужна пользовательская интеграция, вы можете следовать шагам в этом руководстве, чтобы настроить её вручную.
:::

1. В вашей конфигурации Vite настройте точку входа и включите манифест сборки:

   ```js twoslash
   import { defineConfig } from 'vite'
   // ---cut---
   // vite.config.js
   export default defineConfig({
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

3. Для продакшен-сборки: после выполнения команды `vite build` будет сгенерирован файл `.vite/manifest.json` рядом с другими файлами ресурсов. Пример файла манифеста выглядит следующим образом:

   ```json
   {
     "main.js": {
       "file": "assets/main.4889e940.js",
       "src": "main.js",
       "isEntry": true,
       "dynamicImports": ["views/foo.js"],
       "css": ["assets/main.b82dbe22.css"],
       "assets": ["assets/asset.0ab0f9cd.png"],
       "imports": ["_shared.83069a53.js"]
     },
     "views/foo.js": {
       "file": "assets/foo.869aea0d.js",
       "src": "views/foo.js",
       "isDynamicEntry": true,
       "imports": ["_shared.83069a53.js"]
     },
     "_shared.83069a53.js": {
       "file": "assets/shared.83069a53.js",
       "css": ["assets/shared.a834bfc3.css"]
     }
   }
   ```

   - Манифест имеет структуру `Record<name, chunk>`
   - Для входных или динамических чанков ключом является относительный путь src от корня проекта.
   - Для не входных чанков ключом является базовое имя сгенерированного файла, предшествующее символом `_`.
   - Для CSS-файла, сгенерированного, когда [`build.cssCodeSplit`](/config/build-options.md#build-csscodesplit)  установлен в `false`, ключом является `style.css`.
   - Чанки будут содержать информацию о своих статических и динамических импортах (оба являются ключами, которые сопоставляются с соответствующим чанком в манифесте), а также соответствующие CSS и файлы ресурсов (если таковые имеются).

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

   - Тег `<link rel="stylesheet">` для каждого файла в списке `css` чанка точки входа
   - Рекурсивно следовать всем чанкам в списке `imports` точки входа и включать тег `<link rel="stylesheet">` для каждого CSS файла каждого импортированного чанка.
   - Тег для ключа `file` чанка точки входа (`<script type="module">` для JavaScript или `<link rel="stylesheet">` для CSS)
   - Опционально, тег `<link rel="modulepreload">` для `file` каждого импортированного JavaScript чанка, снова рекурсивно следуя импортам, начиная с чанка точки входа.

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
