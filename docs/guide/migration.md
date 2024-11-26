# Миграция с v5 {#migration-from-v5}

## Environment API {#environment-api}

В рамках нового экспериментального [Environment API](/guide/api-environment.md) потребовалась большой внутренний рефакторинг. Vite 6 стремится избежать разрушающих изменений, чтобы обеспечить быструю миграцию большинства проектов на новое крупное обновление. Мы подождем, пока значительная часть экосистемы перейдет на новое API, прежде чем стабилизировать его и начать рекомендовать использование новых API. Могут быть некоторые крайние случаи, но они должны затрагивать только низкоуровневое использование фреймворками и инструментами. Мы работали с поддерживающими в экосистеме, чтобы смягчить эти различия перед выпуском. Пожалуйста, [откройте проблему](https://github.com/vitejs/vite/issues/new?assignees=&labels=pending+triage&projects=&template=bug_report.yml), если вы заметите регрессию.

Некоторые внутренние API были удалены из-за изменений в реализации Vite. Если вы полагались на один из них, пожалуйста, создайте [запрос на функцию](https://github.com/vitejs/vite/issues/new?assignees=&labels=enhancement%3A+pending+triage&projects=&template=feature_request.yml).

## Vite Runtime API {#vite-runtime-api}

Экспериментальный Runtime API Vite эволюционировал в Module Runner API, выпущенный в Vite 6 как часть нового экспериментального [Environment API](/guide/api-environment). Учитывая, что функция была экспериментальной, удаление предыдущего API, введенного в Vite 5.1, не является разрушающим изменением, но пользователям потребуется обновить свое использование на эквивалент Module Runner API в процессе миграции на Vite 6.

## Основные изменения {#general-changes}

### Значение по умолчанию для `resolve.conditions` {#default-value-for-resolve-conditions}

Это изменение не затрагивает пользователей, которые не настраивали [`resolve.conditions`](/config/shared-options#resolve-conditions) / [`ssr.resolve.conditions`](/config/ssr-options#ssr-resolve-conditions) / [`ssr.resolve.externalConditions`](/config/ssr-options#ssr-resolve-externalconditions).

В Vite 5 значение по умолчанию для `resolve.conditions` было `[]`, и некоторые условия добавлялись внутренне. Значение по умолчанию для `ssr.resolve.conditions` было равно значению `resolve.conditions`.

С Vite 6 некоторые условия больше не добавляются внутренне и должны быть включены в значения конфигурации. Условия, которые больше не добавляются внутренне для

- `resolve.conditions`: `['module', 'browser', 'development|production']`
- `ssr.resolve.conditions`: `['module', 'node', 'development|production']`

Значения по умолчанию для этих опций обновлены до соответствующих значений, и `ssr.resolve.conditions` больше не использует `resolve.conditions` в качестве значения по умолчанию. Обратите внимание, что `development|production` — это специальная переменная, которая заменяется на `production` или `development` в зависимости от значения `process.env.NODE_ENV`. Эти значения по умолчанию экспортируются из `vite` как `defaultClientConditions` и `defaultServerConditions`.

Если вы указали пользовательское значение для `resolve.conditions` или `ssr.resolve.conditions`, вам необходимо обновить его, чтобы включить новые условия. Например, если вы ранее указывали `['custom']` для `resolve.conditions`, вам нужно указать `['custom', ...defaultClientConditions]` вместо этого.

### JSON stringify {#json-stringify}

В Vite 5, когда установлено [`json.stringify: true`](/config/shared-options#json-stringify), [`json.namedExports`](/config/shared-options#json-namedexports) был отключён.

С Vite 6, даже когда установлено `json.stringify: true`, `json.namedExports` не отключается, и значение учитывается. Если вы хотите достичь предыдущего поведения, вы можете установить `json.namedExports: false`.

Vite 6 также вводит новое значение по умолчанию для `json.stringify`, которое равно `'auto'`, что будет сериализовать только большие JSON-файлы. Чтобы отключить это поведение, установите `json.stringify: false`.

### Расширенная поддержка ссылок на ресурсы в HTML-элементах {#extended-support-of-asset-references-in-html-elements}

В Vite 5 только несколько поддерживаемых HTML-элементов могли ссылаться на ресурсы, которые будут обработаны и упакованы Vite, такие как `<link href>`, `<img src>` и т. д.

Vite 6 расширяет поддержку ещё большего количества HTML-элементов. Полный список можно найти в документации по [HTML-функциям](/guide/features.html#html).

Чтобы отключить обработку HTML для определённых элементов, вы можете добавить атрибут `vite-ignore` к элементу.

### postcss-load-config {#postcss-load-config}

[`postcss-load-config`](https://npmjs.com/package/postcss-load-config) был обновлён до версии 6 с версии 4. Теперь для загрузки файлов конфигурации PostCSS на TypeScript требуется [`tsx`](https://www.npmjs.com/package/tsx) или [`jiti`](https://www.npmjs.com/package/jiti) вместо [`ts-node`](https://www.npmjs.com/package/ts-node). Также теперь требуется [`yaml`](https://www.npmjs.com/package/yaml) для загрузки файлов конфигурации PostCSS в формате YAML.

### Sass теперь по умолчанию использует современный API {#sass-now-uses-modern-api-by-default}

В Vite 5 по умолчанию использовался устаревший API для Sass. Vite 5.4 добавил поддержку современного API.

С Vite 6 по умолчанию используется современный API для Sass. Если вы всё ещё хотите использовать устаревший API, вы можете установить [`css.preprocessorOptions.sass.api: 'legacy'` / `css.preprocessorOptions.scss.api: 'legacy'`](/config/shared-options#css-preprocessoroptions). Но обратите внимание, что поддержка устаревшего API будет удалена в Vite 7.

Чтобы перейти на современный API, смотрите [документацию по Sass](https://sass-lang.com/documentation/breaking-changes/legacy-js-api/).

### Настройка имени выходного файла CSS в режиме библиотеки {#customize-css-output-file-name-in-library-mode}

В Vite 5 имя выходного файла CSS в режиме библиотеки всегда было `style.css` и не могло быть легко изменено через конфигурацию Vite.

С Vite 6 имя выходного файла по умолчанию теперь использует `"name"` из `package.json`, аналогично выходным файлам JS. Если [`build.lib.fileName`](/config/build-options.md#build-lib) установлено со строкой, это значение также будет использоваться для имени выходного файла CSS. Чтобы явно установить другое имя файла CSS, вы можете использовать новый [`build.lib.cssFileName`](/config/build-options.md#build-lib) для его настройки.

Чтобы перейти, если вы полагались на имя файла `style.css`, вам следует обновить ссылки на него на новое имя, основанное на вашем имени пакета. Например:

```json [package.json]
{
  "name": "my-lib",
  "exports": {
    "./style.css": "./dist/style.css" // [!code --]
    "./style.css": "./dist/my-lib.css" // [!code ++]
  }
}
```

Если вы предпочитаете оставить `style.css`, как в Vite 5, вы можете установить `build.lib.cssFileName: 'style'` вместо этого.

## Расширенные возможности {#advanced}

Существуют и другие разрушающие изменения, которые затрагивают лишь немногих пользователей.

- [[#17922] fix(css)!: remove default import in ssr dev](https://github.com/vitejs/vite/pull/17922)
  - Поддержка импорта по умолчанию для CSS-файлов была [устаревшей в Vite 4](https://v4.vite.dev/guide/migration.html#importing-css-as-a-string) и удалена в Vite 5, но она всё ещё непреднамеренно поддерживалась в режиме разработки SSR. Эта поддержка теперь удалена.
- [[#15637] fix!: default `build.cssMinify` to `'esbuild'` for SSR](https://github.com/vitejs/vite/pull/15637)
  - [`build.cssMinify`](/config/build-options#build-cssminify) теперь включен по умолчанию даже для сборок SSR.
- [[#18070] feat!: proxy bypass with WebSocket](https://github.com/vitejs/vite/pull/18070)
  - `server.proxy[path].bypass` теперь вызывается для запросов обновления WebSocket, и в этом случае параметр `res` будет `undefined`.
- [[#18209] refactor!: bump minimal terser version to 5.16.0](https://github.com/vitejs/vite/pull/18209)
  - Минимально поддерживаемая версия terser для [`build.minify: 'terser'`](/config/build-options#build-minify) была повышена с 5.4.0 до 5.16.0.
- [[#18231] chore(deps): update dependency @rollup/plugin-commonjs to v28](https://github.com/vitejs/vite/pull/18231)
  - [`commonjsOptions.strictRequires`](https://github.com/rollup/plugins/blob/master/packages/commonjs/README.md#strictrequires) теперь по умолчанию равен `true` (ранее был `'auto'`).
    - Это может привести к увеличению размера пакета, но обеспечит более детерминированные сборки.
    - Если вы указываете файл CommonJS в качестве точки входа, вам могут потребоваться дополнительные шаги. Читайте [документацию плагина commonjs](https://github.com/rollup/plugins/blob/master/packages/commonjs/README.md#using-commonjs-files-as-entry-points) для получения дополнительной информации.
- [[#18243] chore(deps)!: migrate `fast-glob` to `tinyglobby`](https://github.com/vitejs/vite/pull/18243)
  - Диафазные фигурные скобки (`{01..03}` ⇒ `['01', '02', '03']`) и инкрементные фигурные скобки (`{2..8..2}` ⇒ `['2', '4', '6', '8']`) больше не поддерживаются в glob-выражениях.
- [[#18395] feat(resolve)!: allow removing conditions](https://github.com/vitejs/vite/pull/18395)
  - Этот PR не только вводит разрушающее изменение, упомянутое выше как «Значение по умолчанию для `resolve.conditions`», но также делает так, что `resolve.mainFields` не используется для неэкспортируемых зависимостей в SSR. Если вы использовали `resolve.mainFields` и хотите применить это к неэкспортируемым зависимостям в SSR, вы можете использовать [`ssr.resolve.mainFields`](/config/ssr-options#ssr-resolve-mainfields).
- [[#18493] refactor!: remove fs.cachedChecks option](https://github.com/vitejs/vite/pull/18493)
  - Эта оптимизация по желанию была удалена из-за крайних случаев при записи файла в кэшированную папку и немедленном его импорте.
- [[#18697] fix(deps)!: update dependency dotenv-expand to v12](https://github.com/vitejs/vite/pull/18697)
  - Переменные, используемые в интерполяции, теперь должны быть объявлены до интерполяции. Для получения дополнительной информации смотрите [журнал изменений `dotenv-expand`](https://github.com/motdotla/dotenv-expand/blob/v12.0.1/CHANGELOG.md#1200-2024-11-16).
- [[#16471] feat: v6 - Environment API](https://github.com/vitejs/vite/pull/16471)

  - Обновления модуля, поддерживающего только SSR, больше не приводят к полной перезагрузке страницы в клиенте. Чтобы вернуться к предыдущему поведению, можно использовать пользовательский плагин Vite:
    <details>
    <summary>Посмотреть пример</summary>

    ```ts twoslash
    import type { Plugin, EnvironmentModuleNode } from 'vite'
    function hmrReload(): Plugin {
      return {
        name: 'hmr-reload',
        enforce: 'post',
        hotUpdate: {
          order: 'post',
          handler({ modules, server, timestamp }) {
            if (this.environment.name !== 'ssr') return
            let hasSsrOnlyModules = false
            const invalidatedModules = new Set<EnvironmentModuleNode>()
            for (const mod of modules) {
              if (mod.id == null) continue
              const clientModule =
                server.environments.client.moduleGraph.getModuleById(mod.id)
              if (clientModule != null) continue
              this.environment.moduleGraph.invalidateModule(
                mod,
                invalidatedModules,
                timestamp,
                true,
              )
              hasSsrOnlyModules = true
            }
            if (hasSsrOnlyModules) {
              server.ws.send({ type: 'full-reload' })
              return []
            }
          },
        },
      }
    }
    ```

    </details>

## Миграция с v4 {#migration-from-v4}

Сначала ознакомьтесь с [Руководством по миграции с v4](https://v5.vite.dev/guide/migration.html) в документации Vite v5, чтобы увидеть необходимые изменения для переноса вашего приложения на Vite 5, а затем продолжите с изменениями на этой странице.
