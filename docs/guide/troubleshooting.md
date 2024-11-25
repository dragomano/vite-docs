# Решение проблем {#troubleshooting}

Смотрите [руководство по решению проблем Rollup](https://rollupjs.org/troubleshooting/) для получения дополнительной информации.

Если предложенные здесь решения не сработают, пожалуйста, попробуйте задать вопросы в [обсуждениях на GitHub](https://github.com/vitejs/vite/discussions) или в канале `#help` на [Vite Land Discord](https://chat.vite.dev).

## CJS {#cjs}

### Vite CJS Node API устарел {#vite-cjs-node-api-deprecated}

CJS сборка Node API Vite устарела и будет удалена в Vite 6. Смотрите [обсуждение на GitHub](https://github.com/vitejs/vite/discussions/13928) для получения дополнительного контекста. Вам следует обновить ваши файлы или фреймворки, чтобы импортировать ESM сборку Vite.

В базовом проекте Vite убедитесь, что:

1. Содержимое файла `vite.config.js` использует синтаксис ESM.
2. Ближайший файл `package.json` содержит `"type": "module"`, или используйте расширение `.mjs`/`.mts`, например `vite.config.mjs` или `vite.config.mts`.

Для других проектов есть несколько общих подходов:

- **Настройте ESM по умолчанию, при необходимости используйте CJS:** Добавьте `"type": "module"` в `package.json` проекта. Все файлы `*.js` теперь интерпретируются как ESM и должны использовать синтаксис ESM. Вы можете переименовать файл с расширением `.cjs`, чтобы продолжать использовать CJS.
- **Сохраните CJS по умолчанию, при необходимости используйте ESM:** Если в `package.json` проекта нет `"type": "module"`, все файлы `*.js` интерпретируются как CJS. Вы можете переименовать файл с расширением `.mjs`, чтобы использовать ESM.
- **Динамически импортируйте Vite:** Если вам нужно продолжать использовать CJS, вы можете динамически импортировать Vite с помощью `import('vite')`. Это требует, чтобы ваш код был написан в асинхронном контексте, но это должно быть управляемо, так как API Vite в основном асинхронный.

Если вы не уверены, откуда исходит предупреждение, вы можете запустить свой скрипт с флагом `VITE_CJS_TRACE=true`, чтобы записать трассировку стека:

```bash
VITE_CJS_TRACE=true vite dev
```

Если вы хотите временно игнорировать предупреждение, вы можете запустить свой скрипт с флагом `VITE_CJS_IGNORE_WARNING=true`:

```bash
VITE_CJS_IGNORE_WARNING=true vite dev
```

Обратите внимание, что файлы конфигурации postcss пока не поддерживают ESM + TypeScript (`.mts` или `.ts` в `"type": "module"`). Если у вас есть конфигурации postcss с `.ts` и вы добавили `"type": "module"` в package.json, вам также нужно будет переименовать конфигурацию postcss, чтобы использовать `.cts`.

## CLI {#cli}

### `Error: Cannot find module 'C:\foo\bar&baz\vite\bin\vite.js'` {#error-cannot-find-module-c-foo-bar-baz-vite-bin-vite-js}

Путь к вашей папке проекта может содержать `&`, что не работает с `npm` на Windows ([npm/cmd-shim#45](https://github.com/npm/cmd-shim/issues/45)).

Вам нужно будет либо:

- Перейти на другой менеджер пакетов (например, `pnpm`, `yarn`)
- Удалить `&` из пути к вашему проекту

## Конфигурация {#config}

### Этот пакет только для ESM {#this-package-is-esm-only}

При импорте пакета только ESM с помощью `require` возникает следующая ошибка:

> Failed to resolve "foo". This package is ESM only but it was tried to load by `require`.

> "foo" resolved to an ESM file. ESM file cannot be loaded by `require`.

Файлы ESM не могут быть загружены с помощью [`require`](<https://nodejs.org/docs/latest-v18.x/api/esm.html#require:~:text=Using%20require%20to%20load%20an%20ES%20module%20is%20not%20supported%20because%20ES%20modules%20have%20asynchronous%20execution.%20Instead%2C%20use%20import()%20to%20load%20an%20ES%20module%20from%20a%20CommonJS%20module.>).

Мы рекомендуем преобразовать вашу конфигурацию в ESM, сделав одно из следующих действий:

- добавив `"type": "module"` в ближайший `package.json`
- переименовав `vite.config.js`/`vite.config.ts` в `vite.config.mjs`/`vite.config.mts`

## Сервер для разработки {#dev-server}

### Запросы зависают навсегда {#requests-are-stalled-forever}

Если вы используете Linux, ограничения на дескрипторы файлов и ограничения inotify могут вызывать эту проблему. Поскольку Vite не объединяет большинство файлов, браузеры могут запрашивать много файлов, что требует большого количества дескрипторов файлов, превышая лимит.

Чтобы решить эту проблему:

- Увеличьте лимит дескрипторов файлов с помощью `ulimit`

  ```shell
  # Проверьте текущий лимит
  $ ulimit -Sn
  # Измените лимит (временно)
  $ ulimit -Sn 10000 # Возможно, вам также нужно изменить жёсткий лимит
  # Перезапустите ваш браузер
  ```

- Увеличьте следующие лимиты, связанные с inotify, с помощью `sysctl`

  ```shell
  # Проверьте текущие лимиты
  $ sysctl fs.inotify
  # Измените лимиты (временно)
  $ sudo sysctl fs.inotify.max_queued_events=16384
  $ sudo sysctl fs.inotify.max_user_instances=8192
  $ sudo sysctl fs.inotify.max_user_watches=524288
  ```

Если вышеуказанные шаги не сработают, вы можете попробовать добавить `DefaultLimitNOFILE=65536` в качестве раскомментированной конфигурации в следующие файлы:

- /etc/systemd/system.conf
- /etc/systemd/user.conf

Для Ubuntu Linux вам может потребоваться добавить строку `* - nofile 65536` в файл `/etc/security/limits.conf` вместо обновления конфигурационных файлов systemd.

Обратите внимание, что эти настройки сохраняются, но **требуется перезагрузка**.

### Сетевые запросы перестают загружаться {#network-requests-stop-loading}

При использовании самоподписанного SSL-сертификата Chrome игнорирует все директивы кэширования и перезагружает контент. Vite полагается на эти директивы кэширования.

Чтобы решить эту проблему, используйте доверенный SSL-сертификат.

Смотрите: [Проблемы с кэшем](https://helpx.adobe.com/mt/experience-manager/kb/cache-problems-on-chrome-with-SSL-certificate-errors.html), [Проблема с Chrome](https://bugs.chromium.org/p/chromium/issues/detail?id=110649#c8)

#### macOS {#macos}

Вы можете установить доверенный сертификат через CLI с помощью этой команды:

```
security add-trusted-cert -d -r trustRoot -k ~/Library/Keychains/login.keychain-db your-cert.cer
```

Или, импортировав его в приложение Keychain Access и обновив уровень доверия вашего сертификата на «Always Trust» (всегда доверять).

### 431 - Слишком большие заголовки запроса {#_431-request-header-fields-too-large}

Когда сервер / WebSocket-сервер получает большой HTTP заголовок, запрос будет отклонён, и будет показано следующее предупреждение:

> Server responded with status code 431. See https://vite.dev/guide/troubleshooting.html#_431-request-header-fields-too-large.

Это связано с тем, что Node.js ограничивает размер заголовка запроса для смягчения [CVE-2018-12121](https://www.cve.org/CVERecord?id=CVE-2018-12121).

Чтобы избежать этого, попробуйте уменьшить размер заголовка запроса. Например, если куки длинные, удалите их. Или вы можете использовать [`--max-http-header-size`](https://nodejs.org/api/cli.html#--max-http-header-sizesize), чтобы изменить максимальный размер заголовка.

## HMR {#hmr}

### Vite обнаруживает изменение файла, но HMR не работает {#vite-detects-a-file-change-but-the-hmr-is-not-working}

Возможно, вы импортируете файл с другим регистром. Например, существует `src/foo.js`, а `src/bar.js` содержит:

```js
import './Foo.js' // должен быть './foo.js'
```

Связанный запрос: [#964](https://github.com/vitejs/vite/issues/964)

### Vite не обнаруживает изменение файла {#vite-does-not-detect-a-file-change}

Если вы запускаете Vite с WSL2, Vite не может отслеживать изменения файлов в некоторых условиях. Смотрите опцию [`server.watch`](/config/server-options.md#server-watch).

### Происходит полная перезагрузка вместо HMR {#a-full-reload-happens-instead-of-hmr}

Если HMR не обрабатывается Vite или плагином, произойдет полная перезагрузка, так как это единственный способ обновить состояние.

Если HMR обрабатывается, но находится в пределах циклической зависимости, также произойдет полная перезагрузка для восстановления порядка выполнения. Чтобы решить эту проблему, попробуйте разорвать цикл. Вы можете запустить `vite --debug hmr`, чтобы записать путь циклической зависимости, если это вызвано изменением файла.

## Сборка {#build}

### Собранный файл не работает из-за ошибки CORS {#built-file-does-not-work-because-of-cors-error}

Если HTML файл был открыт с помощью протокола `file`, скрипты не будут выполняться, отображая следующую ошибку:

> Access to script at 'file:///foo/bar.js' from origin 'null' has been blocked by CORS policy: Cross origin requests are only supported for protocol schemes: http, data, isolated-app, chrome-extension, chrome, https, chrome-untrusted.

> Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at file:///foo/bar.js. (Reason: CORS request not http).

Смотрите [Reason: CORS request not HTTP | MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors/CORSRequestNotHttp) для получения дополнительной информации о том, почему это происходит.

Вам нужно будет получить доступ к файлу с помощью протокола `http`. Самый простой способ сделать это — запустить `npx vite preview`.

## Оптимизированные зависимости {#optimized-dependencies}

### Устаревшие предварительно объединённые зависимости при объединении с локальным пакетом
 {#outdated-pre-bundled-deps-when-linking-to-a-local-package}

Ключ хеша, используемый для аннулирования оптимизированных зависимостей, зависит от содержимого блокировки пакетов, патчей, применённых к зависимостям, и параметров в файле конфигурации Vite, которые влияют на объединение узловых модулей. Это означает, что Vite будет обнаруживать, когда зависимость переопределяется с помощью функции, такой как [npm overrides](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#overrides), и повторно объединить ваши зависимости при следующем запуске сервера. Vite не будет аннулировать зависимости, когда вы используете такие функции, как [npm link](https://docs.npmjs.com/cli/v9/commands/npm-link). В случае, если вы связываете или разъединяете зависимость, вам нужно будет принудительно повторно оптимизировать при следующем запуске сервера, используя `vite --force`. Мы рекомендуем использовать переопределения вместо этого, которые теперь поддерживаются каждым менеджером пакетов (см. также [pnpm overrides](https://pnpm.io/package_json#pnpmoverrides) и [yarn resolutions](https://yarnpkg.com/configuration/manifest/#resolutions)).

## Узкие места в производительности {#performance-bottlenecks}

Если вы сталкиваетесь с узкими местами в производительности приложения, что приводит к медленным загрузкам, попробуйте запустить встроенный инспектор Node.js с вашим сервером для разработки или при сборке вашего приложения, чтобы создать профиль CPU:

::: code-group

```bash [dev server]
vite --profile --open
```

```bash [build]
vite build --profile
```

:::

::: tip Сервер для разработки
Как только ваше приложение будет открыто в браузере, просто дождитесь его полной загрузки, затем вернитесь в терминал и нажмите клавишу `p` (это остановит инспектор Node.js), а затем нажмите клавишу `q`, чтобы остановить dev-сервер.
:::

Инспектор Node.js сгенерирует файл `vite-profile-0.cpuprofile` в корневой папке. Перейдите на https://www.speedscope.app/ и загрузите профиль CPU, используя кнопку `BROWSE`, чтобы проанализировать результат.

Вы можете установить [vite-plugin-inspect](https://github.com/antfu/vite-plugin-inspect), который позволяет вам исследовать промежуточное состояние плагинов Vite и также может помочь вам определить, какие плагины или промежуточные программные обеспечения являются узким местом в ваших приложениях. Плагин можно использовать как в режиме разработки, так и в режиме сборки. Ознакомьтесь с файлом readme для получения дополнительной информации.

## Прочее {#others}

### Модуль экстрагирован для совместимости с браузером {#module-externalized-for-browser-compatibility}

Когда вы используете модуль Node.js в браузере, Vite выведет следующее предупреждение:

> Module "fs" has been externalized for browser compatibility. Cannot access "fs.readFile" in client code.

Это связано с тем, что Vite не добавляет автоматически полифиллы для модулей Node.js.

Мы рекомендуем избегать использования модулей Node.js в коде для браузера, чтобы уменьшить размер сборки, хотя вы можете добавить полифиллы вручную. Если модуль импортируется из сторонней библиотеки (которая предназначена для использования в браузере), рекомендуется сообщить о проблеме разработчикам соответствующей библиотеки.

### Происходит ошибка синтаксиса / ошибка типа {#syntax-error-type-error-happens}

Vite не может обрабатывать и не поддерживает код, который работает только в нестрогом режиме (sloppy mode). Это связано с тем, что Vite использует ESM, и он всегда находится в [строгом режиме](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode) внутри ESM.

Например, вы можете увидеть эти ошибки:

> [ERROR] With statements cannot be used with the "esm" output format due to strict mode

> TypeError: Cannot create property 'foo' on boolean 'false'

Если этот код используется внутри зависимостей, вы можете использовать [`patch-package`](https://github.com/ds300/patch-package) (или [`yarn patch`](https://yarnpkg.com/cli/patch) или [`pnpm patch`](https://pnpm.io/cli/patch)) в качестве обходного пути.

### Расширения браузера {#browser-extensions}

Некоторые расширения браузера (например, блокировщики рекламы) могут препятствовать клиенту Vite в отправке запросов к dev-серверу Vite. В этом случае вы можете увидеть белый экран без зарегистрированных ошибок. Попробуйте отключить расширения, если у вас возникла эта проблема.

### Перекрёстные ссылки на дисках в Windows {#cross-drive-links-on-windows}

Если в вашем проекте на Windows есть перекрёстные ссылки на дисках, Vite может не работать.

Примером перекрёстных ссылок на дисках являются:

- виртуальный диск, связанный с папкой с помощью команды `subst`
- символическая ссылка/связь на другой диск с помощью команды `mklink` (например, глобальный кэш Yarn)

Связанный запрос: [#10802](https://github.com/vitejs/vite/issues/10802)
