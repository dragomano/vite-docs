# Параметры сервера {#server-options}

Если не указано иное, параметры в этом разделе применяются только в режиме разработки.

## server.host

- **Тип:** `string | boolean`
- **По умолчанию:** `'localhost'`

Укажите, на каких IP-адресах сервер должен прослушивать запросы.
Установите это значение на `0.0.0.0` или `true`, чтобы прослушивать все адреса, включая локальные и публичные.

Это можно установить через CLI, используя `--host 0.0.0.0` или `--host`.

::: tip ПРИМЕЧАНИЕ

Существуют случаи, когда другие серверы могут отвечать вместо Vite.

Первый случай — это когда используется `localhost`. Node.js версии 17 и выше по умолчанию изменяет порядок результатов разрешённых DNS-адресов. При доступе к `localhost` браузеры используют DNS для разрешения адреса, и этот адрес может отличаться от адреса, на котором слушает Vite. Vite выводит разрешённый адрес, когда он отличается.

Вы можете установить [`dns.setDefaultResultOrder('verbatim')`](https://nodejs.org/api/dns.html#dns_dns_setdefaultresultorder_order), чтобы отключить поведение изменения порядка. Vite тогда будет выводить адрес как `localhost`.

```js twoslash [vite.config.js]
import { defineConfig } from 'vite'
import dns from 'node:dns'

dns.setDefaultResultOrder('verbatim')

export default defineConfig({
  // конфиг
})
```

Второй случай — это когда используются wildcard-хосты (например, `0.0.0.0`). Это связано с тем, что серверы, слушающие на не-wildcard-хостах, имеют приоритет над теми, которые слушают на wildcard-хостах.

:::

::: tip Доступ к серверу на WSL2 из вашей локальной сети

При запуске Vite на WSL2 недостаточно установить `host: true`, чтобы получить доступ к серверу из вашей локальной сети.
Смотрите [документацию по WSL](https://learn.microsoft.com/en-us/windows/wsl/networking#accessing-a-wsl-2-distribution-from-your-local-area-network-lan) для получения дополнительных сведений.

:::

## server.allowedHosts

- **Тип:** `string[] | true`
- **По умолчанию:** `[]`

Имена хостов, на которые Vite разрешено отвечать.
`localhost` и домены под `.localhost`, а также все IP-адреса разрешены по умолчанию.
При использовании HTTPS эта проверка пропускается.

Если строка начинается с `.`, это позволит использовать это имя хоста без `.`, а также все его поддомены. Например, `.example.com` разрешит доступ к `example.com`, `foo.example.com` и `foo.bar.example.com`. Если установлено значение `true`, серверу разрешено отвечать на запросы для любых хостов.

::: details Какие хосты безопасно добавлять?

Хосты, над которыми у вас есть контроль и которые вы можете разрешить по IP-адресам, безопасно добавлять в список разрешённых хостов.

Например, если вы владеете доменом `vite.dev`, вы можете добавить `vite.dev` и `.vite.dev` в список. Если вы не владеете этим доменом и не можете доверять его владельцу, вы не должны его добавлять.

В частности, вы никогда не должны добавлять в этот список домены верхнего уровня, такие как `.com`. Это объясняется тем, что любой желающий может зарегистрировать домен, такой как `example.com`, и управлять IP-адресом, на который он указывает.

:::

::: danger

Установка `server.allowedHosts` в значение `true` позволяет любому веб-сайту отправлять запросы на ваш сервер разработки через атаки с подменой DNS, что дает возможность загружать ваш исходный код и контент. Мы рекомендуем всегда использовать явный список разрешённых хостов. См. [GHSA-vg6x-rcgg-rjx6](https://github.com/vitejs/vite/security/advisories/GHSA-vg6x-rcgg-rjx6) для получения дополнительной информации.

:::

::: details Настройка через переменную окружения
Вы можете установить переменную окружения `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS`, чтобы добавить дополнительный разрешённый хост.
:::

## server.port

- **Тип:** `number`
- **По умолчанию:** `5173`

Укажите порт сервера. Обратите внимание, что если порт уже используется, Vite автоматически попытается использовать следующий доступный порт, поэтому это может быть не тот порт, на котором в конечном итоге будет слушать сервер.

## server.strictPort

- **Тип:** `boolean`

Установите значение `true`, чтобы выйти, если порт уже используется, вместо того чтобы автоматически пытаться использовать следующий доступный порт.

## server.https

- **Тип:** `https.ServerOptions`

Включите TLS + HTTP/2. Значение является [объектом `options`](https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener), переданным в `https.createServer()`.

Обратите внимание, что это понижает уровень только до TLS, если также используется опция [`server.proxy`](#server-proxy).

Необходим действительный сертификат. Для базовой настройки вы можете добавить [@vitejs/plugin-basic-ssl](https://github.com/vitejs/vite-plugin-basic-ssl) в плагины проекта, который автоматически создаст и кэширует самоподписанный сертификат. Однако мы рекомендуем создавать свои собственные сертификаты.

## server.open

- **Тип:** `boolean | string`

Автоматически открывать приложение в браузере при запуске сервера. Когда значение является строкой, оно будет использоваться как путь URL. Если вы хотите открыть сервер в конкретном браузере, который вам нравится, вы можете установить переменную окружения `process.env.BROWSER` (например, `firefox`). Вы также можете установить `process.env.BROWSER_ARGS`, чтобы передать дополнительные аргументы (например, `--incognito`).

`BROWSER` и `BROWSER_ARGS` — это специальные переменные окружения, которые вы можете установить в файле `.env` для их настройки. См. [пакет `open`](https://github.com/sindresorhus/open#app) для получения дополнительных сведений.

**Пример:**

```js
export default defineConfig({
  server: {
    open: '/docs/index.html'
  }
})
```

## server.proxy

- **Тип:** `Record<string, string | ProxyOptions>`

Настройте пользовательские правила прокси для dev-сервера. Ожидает объект пар `{ ключ: опции }`. Любые запросы, путь которых начинается с этого ключа, будут проксироваться на указанный целевой адрес. Если ключ начинается с `^`, он будет интерпретироваться как `RegExp`. Опция `configure` может быть использована для доступа к экземпляру прокси. Если запрос соответствует какому-либо из настроенных правил прокси-сервера, он не будет преобразован Vite.

Обратите внимание, что если вы используете неотносительный [`base`](/config/shared-options.md#base), вы должны префиксировать каждый ключ этим `base`.

Расширяет [`http-proxy-3`](https://github.com/sagemathinc/http-proxy-3#options). Дополнительные опции можно найти [здесь](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/server/middlewares/proxy.ts#L13).

В некоторых случаях вам также может понадобиться настроить основной dev-сервер (например, чтобы добавить пользовательские мидлвары в внутреннее приложение [connect](https://github.com/senchalabs/connect)). Для этого вам нужно написать свой собственный [плагин](/guide/using-plugins.html) и использовать функцию [configureServer](/guide/api-plugin.html#configureserver).

**Пример:**

```js
export default defineConfig({
  server: {
    proxy: {
      // сокращение строки:
      // http://localhost:5173/foo
      //   -> http://localhost:4567/foo
      '/foo': 'http://localhost:4567',
      // с параметрами:
      // http://localhost:5173/api/bar
      //   -> http://jsonplaceholder.typicode.com/bar
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      // с RegEx: http://localhost:5173/fallback/ -> http://jsonplaceholder.typicode.com/
      '^/fallback/.*': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/fallback/, '')
      },
      // Использование экземпляра прокси-сервера
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        configure: (proxy, options) => {
          // прокси будет представлять собой экземпляр 'http-proxy'
        }
      },
      // Проксирование веб-сокетов или socket.io:
      // ws://localhost:5173/socket.io
      //   -> ws://localhost:5174/socket.io
      // Будьте осторожны, используя "rewriteWsOrigin", так как это может оставить
      // проксирование открытым для атак CSRF.
      '/socket.io': {
        target: 'ws://localhost:5174',
        ws: true,
        rewriteWsOrigin: true
      }
    }
  }
})
```

## server.cors

- **Тип:** `boolean | CorsOptions`
- **По умолчанию:** `{ origin: /^https?:\/\/(?:(?:[^:]+\.)?localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/ }` (разрешает localhost, `127.0.0.1` и `::1`)

Настройте CORS для dev-сервера. Передайте [объект `options`](https://github.com/expressjs/cors#configuration-options), чтобы точно настроить поведение, или `true`, чтобы разрешить любой источник.

::: danger

Установка `server.cors` в значение `true` позволяет любому веб-сайту отправлять запросы на ваш сервер разработки и загружать ваш исходный код и контент. Мы рекомендуем всегда использовать явный список разрешённых источников.

:::

## server.headers

- **Тип:** `OutgoingHttpHeaders`

Укажите заголовки ответов сервера.

## server.hmr

- **Тип:** `boolean | { protocol?: string, host?: string, port?: number, path?: string, timeout?: number, overlay?: boolean, clientPort?: number, server?: Server }`

Отключите или настройте соединение HMR (в случаях, когда веб-сокет HMR должен использовать иной адрес, чем HTTP-сервер).

Установите `server.hmr.overlay` в `false`, чтобы отключить наложение ошибок сервера.

`protocol` устанавливает протокол WebSocket, используемый для подключения HMR: `ws` (WebSocket) или `wss` (WebSocket Secure).

`clientPort` — это расширенная опция, которая переопределяет порт только на стороне клиента, позволяя вам обслуживать веб-сокет на другом порту, чем тот, который ищет клиентский код.

Когда `server.hmr.server` определён, Vite будет обрабатывать запросы на соединение HMR через предоставленный сервер. Если не активен режим мидлвара, Vite попытается обработать запросы на соединение HMR через существующий сервер. Это может быть полезно при использовании самоподписанных сертификатов или когда вы хотите открыть Vite через сеть на одном порту.

Посмотрите [`vite-setup-catalogue`](https://github.com/sapphi-red/vite-setup-catalogue) для получения примеров.

::: tip ПРИМЕЧАНИЕ

С учётом конфигурации по умолчанию, обратные прокси перед Vite должны поддерживать проксирование WebSocket. Если клиент HMR Vite не может подключиться к WebSocket, клиент будет переключаться на прямое подключение к серверу HMR Vite, обходя обратные прокси:

```
Direct websocket connection fallback. Check out https://vite.dev/config/server-options.html#server-hmr to remove the previous connection error.
```

Ошибка, которая появляется в браузере, когда происходит переключение на резервный вариант, может быть проигнорирована. Чтобы избежать ошибки, обходя обратные прокси, вы можете:

- настроить обратный прокси для проксирования WebSocket
- установить [`server.strictPort = true`](#server-strictport) и установить `server.hmr.clientPort` на то же значение, что и `server.port`
- установить `server.hmr.port` на другое значение, отличное от [`server.port`](#server-port)

:::

## server.warmup

- **Тип:** `{ clientFiles?: string[], ssrFiles?: string[] }`
- **Связано:** [Подготовка часто используемых файлов](/guide/performance.html#warm-up-frequently-used-files)

Предварительно подготавливайте файлы для трансформации и кэшируйте результаты заранее. Это улучшает начальную загрузку страницы при запуске сервера и предотвращает каскадные преобразования.

`clientFiles` — это файлы, которые используются только на клиенте, в то время как `ssrFiles` — это файлы, которые используются только в SSR. Они принимают массив путей к файлам или шаблоны [`tinyglobby`](https://github.com/SuperchupuDev/tinyglobby), относительные к `root`.

Убедитесь, что вы добавляете только те файлы, которые часто используются, чтобы не перегружать dev-сервер Vite при запуске.

```js
export default defineConfig({
  server: {
    warmup: {
      clientFiles: ['./src/components/*.vue', './src/utils/big-utils.js'],
      ssrFiles: ['./src/server/modules/*.js']
    }
  }
})
```

## server.watch

- **Тип:** `object | null`

Опции для наблюдателя файловой системы, которые передаются в [chokidar](https://github.com/paulmillr/chokidar/tree/3.6.0#api).

Наблюдатель сервера Vite следит за `root` и по умолчанию пропускает директории `.git/`, `node_modules/`, `test-results/`, а также `cacheDir` и `build.outDir` Vite. При обновлении отслеживаемого файла Vite применит HMR и обновит страницу только при необходимости.

Если установлено значение `null`, файлы не будут отслеживаться. [`server.watcher`](/guide/api-javascript.html#vitedevserver) предоставит совместимый эмиттер событий, но вызовы `add` или `unwatch` не будут иметь эффекта.

::: warning Наблюдение за файлами в `node_modules`

В настоящее время невозможно отслеживать файлы и пакеты в `node_modules`. Для дальнейшего прогресса и обходных путей вы можете следить за [проблемой #8619](https://github.com/vitejs/vite/issues/8619).

:::

::: warning Использование Vite в Windows Subsystem for Linux (WSL) 2

При запуске Vite на WSL2 наблюдение за файловой системой не работает, когда файл редактируется приложениями Windows (процессами, не относящимися к WSL2). Это связано с [ограничением WSL2](https://github.com/microsoft/WSL/issues/4739). Это также относится к запуску на Docker с бэкендом WSL2.

Чтобы исправить это, вы можете:

- **Рекомендуется**: Используйте приложения WSL2 для редактирования ваших файлов.
  - Также рекомендуется переместить папку проекта за пределы файловой системы Windows. Доступ к файловой системе Windows из WSL2 медленный. Устранение этой накладной нагрузки улучшит производительность.
- Установите `{ usePolling: true }`.
  - Обратите внимание, что [`usePolling` приводит к высокой загрузке ЦП](https://github.com/paulmillr/chokidar/tree/3.6.0#performance).

:::

## server.middlewareMode

- **Тип:** `boolean`
- **По умолчанию:** `false`

Создайте сервер Vite в режиме мидлвара.

- **Связано:** [appType](./shared-options#apptype), [SSR - Настройка dev-сервера](/guide/ssr#setting-up-the-dev-server)

- **Пример:**

```js twoslash
import express from 'express'
import { createServer as createViteServer } from 'vite'

async function createServer() {
  const app = express()

  // Создаём сервер Vite в режиме мидлвара
  const vite = await createViteServer({
    server: { middlewareMode: true },
    // не включаем стандартные модули-мидлвары Vite для работы с HTML
    appType: 'custom'
  })
  // Используем экземпляр connect в качестве мидлвара
  app.use(vite.middlewares)

  app.use('*', async (req, res) => {
    // Поскольку `appType` равен `'custom'`, здесь следует обслуживать ответ.
    // Примечание: если `appType` равен `'spa'` или `'mpa'`, Vite включает мидлваров
    // для обработки HTML-запросов и 404, поэтому пользовательские мидлвары должны
    // быть добавлены перед мидлварами Vite, чтобы они вступили в силу.
  })
}

createServer()
```

## server.fs.strict

- **Тип:** `boolean`
- **По умолчанию:** `true` (включено по умолчанию с версии Vite 2.7)

Ограничьте обслуживание файлов за пределами корня рабочего пространства.

## server.fs.allow

- **Тип:** `string[]`

Ограничьте файлы, которые могут быть обслужены через `/@fs/`. Когда `server.fs.strict` установлен в `true`, доступ к файлам за пределами этого списка директорий, которые не импортируются из разрешённого файла, приведёт к ошибке 403.

Можно указать как директории, так и файлы.

Vite будет искать корень потенциального рабочего пространства и использовать его по умолчанию. Действительное рабочее пространство должно соответствовать следующим условиям, в противном случае будет использован [корень проекта](/guide/#index-html-and-project-root):

- содержит поле `workspaces` в `package.json`
- содержит один из следующих файлов:
  - `lerna.json`
  - `pnpm-workspace.yaml`

Принимает путь для указания пользовательского корня рабочего пространства. Это может быть абсолютный путь или путь относительно [корня проекта](/guide/#index-html-and-project-root). Например:

```js
export default defineConfig({
  server: {
    fs: {
      // Разрешаем обслуживать файлы с одного уровня до корня проекта
      allow: ['..']
    }
  }
})
```

Когда указано `server.fs.allow`, автоматическое определение корня рабочего пространства будет отключено. Для расширения оригинального поведения предоставлена утилита `searchForWorkspaceRoot`:

```js
import { defineConfig, searchForWorkspaceRoot } from 'vite'

export default defineConfig({
  server: {
    fs: {
      allow: [
        // поиск корня рабочего пространства
        searchForWorkspaceRoot(process.cwd()),
        // ваши пользовательские правила
        '/path/to/custom/allow_directory',
        '/path/to/custom/allow_file.demo'
      ]
    }
  }
})
```

## server.fs.deny

- **Тип:** `string[]`
- **По умолчанию:** `['.env', '.env.*', '*.{crt,pem}', '**/.git/**']`

Чёрный список для чувствительных файлов, которые ограничены для обслуживания dev-сервером Vite. Этот список будет иметь более высокий приоритет, чем [`server.fs.allow`](#server-fs-allow). Поддерживаются [шаблоны picomatch](https://github.com/micromatch/picomatch#globbing-features).

:::tip ПРИМЕЧАНИЕ

Этот чёрный список не применяется к [директории `public`](/guide/assets.md#the-public-directory). Все файлы в этой директории обслуживаются без фильтрации, так как они копируются напрямую в выходную директорию во время сборки.

:::

## server.origin

- **Тип:** `string`

Определяет источник сгенерированных URL-адресов ресурсов во время разработки.

```js
export default defineConfig({
  server: {
    origin: 'http://127.0.0.1:8080'
  }
})
```

## server.sourcemapIgnoreList

- **Тип:** `false | (sourcePath: string, sourcemapPath: string) => boolean`
- **По умолчанию:** `(sourcePath) => sourcePath.includes('node_modules')`

Определяет, следует ли игнорировать исходные файлы в sourcemap сервера, используемом для заполнения расширения sourcemap [`x_google_ignoreList`](https://developer.chrome.com/articles/x-google-ignore-list/).

`server.sourcemapIgnoreList` является эквивалентом [`build.rollupOptions.output.sourcemapIgnoreList`](https://rollupjs.org/configuration-options/#output-sourcemapignorelist) для dev-сервера. Разница между этими двумя параметрами конфигурации заключается в том, что функция rollup вызывается с относительным путём для `sourcePath`, в то время как `server.sourcemapIgnoreList` вызывается с абсолютным путём. В процессе разработки большинство модулей имеют карту и источник в одной папке, поэтому относительный путь для `sourcePath` — это само имя файла. В этих случаях использование абсолютных путей делает это более удобным.

По умолчанию исключаются все пути, содержащие `node_modules`. Вы можете передать `false`, чтобы отключить это поведение, или, для полного контроля, функцию, которая принимает путь к источнику и путь к sourcemap и возвращает, следует ли игнорировать путь к источнику.

```js
export default defineConfig({
  server: {
    // Это значение по умолчанию, и оно добавит все файлы с `node_modules`
    // в их путях в список игнорируемых.
    sourcemapIgnoreList(sourcePath, sourcemapPath) {
      return sourcePath.includes('node_modules')
    }
  }
})
```

::: tip Примечание
[`server.sourcemapIgnoreList`](#server-sourcemapignorelist) и [`build.rollupOptions.output.sourcemapIgnoreList`](https://rollupjs.org/configuration-options/#output-sourcemapignorelist) необходимо устанавливать независимо. `server.sourcemapIgnoreList` — это конфигурация только для сервера и не получает своего значения по умолчанию из определённых опций rollup.
:::
