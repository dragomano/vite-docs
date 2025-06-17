# Переход на API для каждой среды {#move-to-per-environment-apis}

::: tip Обратная связь
Оставьте нам отзыв в [обсуждении обратной связи по Environment API](https://github.com/vitejs/vite/discussions/16358)
:::

Несколько API из `ViteDevServer`, связанных с графом модулей и преобразованиями модулей, были перемещены в экземпляры `DevEnvironment`.

Область применения: `Авторы плагинов Vite`

::: warning Депрекация в будущем
Экземпляр `Environment` был впервые введен в `v6.0`. Депрекация `server.moduleGraph` и других методов, которые теперь находятся в окружениях, запланирована на будущую основную версию. Мы не рекомендуем пока отказываться от методов сервера. Чтобы определить ваше использование, установите их в вашей конфигурации Vite.
:::

```ts
future: {
  removeServerModuleGraph: 'warn',
  removeServerTransformRequest: 'warn',
}
```

:::

## Мотивация {#motivation}

В Vite v5 и ранее один dev-сервер Vite всегда имел два окружения (`client` и `ssr`). `server.moduleGraph` содержал смешанные модули из обоих этих окружений. Узлы были связаны через списки `clientImportedModules` и `ssrImportedModules` (но для каждого из них поддерживался единый список `importers`). Преобразованный модуль представлялся с помощью `id` и булевой переменной `ssr`. Эта булевая переменная должна была передаваться в API, например, `server.moduleGraph.getModuleByUrl(url, ssr)` и `server.transformRequest(url, { ssr })`.

В Vite v6 теперь возможно создавать любое количество пользовательских окружений (`client`, `ssr`, `edge` и т. д.). Одной булевой переменной `ssr` больше не достаточно. Вместо изменения API на форму `server.transformRequest(url, { environment })`, мы переместили эти методы в экземпляр окружения, что позволяет вызывать их без dev-сервера Vite.

## Руководство по переходу {#migration-guide}

- `server.moduleGraph` -> [`environment.moduleGraph`](/guide/api-environment-instances#separate-module-graphs)
- `server.transformRequest(url, ssr)` -> `environment.transformRequest(url)`
- `server.warmupRequest(url, ssr)` -> `environment.warmupRequest(url)`
