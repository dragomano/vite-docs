# Переход с версии v6 {#migration-from-v6}

## Поддержка Node.js {#node-js-support}

Vite больше не поддерживает Node.js 18, так как её жизненный цикл завершён. Теперь требуется Node.js версии 20.19+ или 22.12+.

## Изменение целевых браузеров по умолчанию {#default-browser-target-change}

Значение по умолчанию для `build.target` обновлено до более новых версий браузеров:

- Chrome: 87 → 107
- Edge: 88 → 107
- Firefox: 78 → 104
- Safari: 14.0 → 16.0

Эти версии браузеров соответствуют наборам функций [Baseline](https://web-platform-dx.github.io/web-features/), классифицируемых как широко доступные на 1 мая 2025. Другими словами, все они были выпущены до 1 ноября 2022.

В Vite 5 целевой параметр по умолчанию назывался `'modules'`, но он больше не доступен. Вместо него введён новый целевой параметр по умолчанию: `'baseline-widely-available'`.

## Основные изменения {#general-changes}

### Удалена поддержка устаревшего Sass API {#removed-sass-legacy-api-support}

Как и планировалось, поддержка устаревшего Sass API удалена. Vite теперь поддерживает только современный API. Опции `css.preprocessorOptions.sass.api` и `css.preprocessorOptions.scss.api` можно удалить.

## Удалённые устаревшие функции {#removed-deprecated-features}

- `splitVendorChunkPlugin` (помечен как устаревший в v5.2.7)
  - Этот плагин изначально был добавлен для упрощения миграции на Vite v2.9.
  - Для управления разбиением на чанки при необходимости можно использовать опцию `build.rollupOptions.output.manualChunks`.
- `enforce` / `transform` на уровне хуков для `transformIndexHtml` (помечены как устаревшие в v4.0.0)
  - Интерфейс был изменён для соответствия [объектным хукам Rollup](https://rollupjs.org/plugin-development/#build-hooks:~:text=Instead%20of%20a%20function%2C%20hooks%20can%20also%20be%20objects.).
  - Вместо `enforce` следует использовать `order`, а вместо `transform` — `handler`.

## Расширенные возможности {#advanced}

Существуют и другие критические изменения, которые затрагивают лишь немногих пользователей.

- [[#19979] chore: определён диапазон версий для одноранговых зависимостей](https://github.com/vitejs/vite/pull/19979)
  - Указан диапазон версий одноранговых зависимостей для препроцессоров CSS.
- [[#20013] refactor: удалён неиспользуемый `legacy.proxySsrExternalModules`](https://github.com/vitejs/vite/pull/20013)
  - Свойство `legacy.proxySsrExternalModules` не оказывало влияния начиная с Vite 6 и теперь удалено.
- [[#19985] refactor!: удалены устаревшие свойства, используемые только для типов](https://github.com/vitejs/vite/pull/19985)
  - Удалены следующие неиспользуемые свойства: `ModuleRunnerOptions.root`, `ViteDevServer._importGlobMap`, `ResolvePluginOptions.isFromTsImporter`, `ResolvePluginOptions.getDepsOptimizer`, `ResolvePluginOptions.shouldExternalize`, `ResolvePluginOptions.ssrConfig`.
- [[#19986] refactor: удалены устаревшие свойства Environment API](https://github.com/vitejs/vite/pull/19986)
  - Эти свойства были помечены как устаревшие с самого начала и теперь удалены.
- [[#19987] refactor!: удалены устаревшие типы, связанные с `HotBroadcaster`](https://github.com/vitejs/vite/pull/19987)
  - Эти типы были частью устаревшего Runtime API и теперь удалены: `HMRBroadcaster`, `HMRBroadcasterClient`, `ServerHMRChannel`, `HMRChannel`.
- [[#19996] fix(ssr)!: исключён доступ к переменной `Object` в преобразованном SSR-коде](https://github.com/vitejs/vite/pull/19996)
  - Теперь для контекста выполнения модуля требуется `__vite_ssr_exportName__`.
- [[#20045] fix: все значения `optimizeDeps.entries` обрабатываются как шаблоны (globs)](https://github.com/vitejs/vite/pull/20045)
  - `optimizeDeps.entries` больше не принимает строковые пути напрямую, теперь всегда используются шаблоны (globs).
- [[#20222] feat: применение некоторых промежуточных слоёв до хука `configureServer`](https://github.com/vitejs/vite/pull/20222), [[#20224] feat: применение некоторых промежуточных слоёв до хука `configurePreviewServer`](https://github.com/vitejs/vite/pull/20224)
  - Некоторые промежуточные слои теперь применяются до хуков `configureServer` / `configurePreviewServer`. Если вы не хотите, чтобы определённый маршрут использовал опции [`server.cors`](../config/server-options.md#server-cors) / [`preview.cors`](../config/preview-options.md#preview-cors), убедитесь, что связанные заголовки удалены из ответа.

## Переход с v5 {#migration-from-v5}

Сначала ознакомьтесь с [Руководством по переходу с v5](https://v6.vite.dev/guide/migration.html) в документации Vite v6, чтобы увидеть необходимые изменения для переноса вашего приложения на Vite 6, а затем продолжите с изменениями на этой странице.
