# SSR с использованием API `ModuleRunner` {#ssr-using-modulerunner-api}

::: tip Обратная связь
Оставьте нам отзыв в [обсуждении обратной связи по Environment API](https://github.com/vitejs/vite/discussions/16358)
:::

`server.ssrLoadModule` был заменён на импорт из [Module Runner](/guide/api-environment#modulerunner).

Область применения: `Авторы плагинов Vite`

::: warning Депрекация в будущем
`ModuleRunner` был впервые введен в `v6.0`. Депрекация `server.ssrLoadModule` запланировано на будущую основную версию. Чтобы определить ваше использование, установите `future.removeSsrLoadModule` в `"warn"` в вашей конфигурации vite.
:::

## Мотивация {#motivation}

Метод `server.ssrLoadModule(url)` позволяет импортировать модули только в окружении `ssr` и может выполнять модули только в том же процессе, что и dev-сервер Vite. Для приложений с пользовательскими окружениями каждая из них связана с `ModuleRunner`, который может работать в отдельном потоке или процессе. Для импорта модулей теперь у нас есть `moduleRunner.import(url)`.

## Руководство по переходу {#migration-guide}

Проверьте [Руководство по Environment API для фреймворков](../guide/api-environment-frameworks.md).
