# Хук `hotUpdate` плагина HMR {#hmr-hotupdate-plugin-hook}

::: tip Обратная связь
Оставьте нам отзыв в [обсуждении обратной связи по Environment API](https://github.com/vitejs/vite/discussions/16358)
:::

Мы планируем депрекацию хука `handleHotUpdate` плагина в пользу хука [`hotUpdate`](/guide/api-environment#the-hotupdate-hook), чтобы он был осведомлён об [Environment API](/guide/api-environment.md) и обрабатывал дополнительные события наблюдения с `create` и `delete`.

Область применения: `Авторы плагинов Vite`

::: warning Депрекация в будущем
Хук `hotUpdate` был впервые введен в `v6.0`. Депрекация `handleHotUpdate` запланирована на будущую основную версию. Мы не рекомендуем отказываться от `handleHotUpdate`. Если вы хотите поэкспериментировать и оставить нам отзыв, вы можете установить `future.removePluginHookHandleHotUpdate` в `"warn"` в вашей конфигурации Vite.
:::

## Мотивация {#motivation}

Хук [`handleHotUpdate`](/guide/api-plugin.md#handlehotupdate) позволяет выполнять пользовательское управление обновлениями HMR. Список модулей, которые необходимо обновить, передается в `HmrContext`:

```ts
interface HmrContext {
  file: string
  timestamp: number
  modules: Array<ModuleNode>
  read: () => string | Promise<string>
  server: ViteDevServer
}
```

Этот хук вызывается один раз для всех окружений, и переданные модули содержат смешанную информацию только из окружений `client` и `ssr`. Как только фреймворки перейдут на пользовательские окружения, потребуется новый хук, который будет вызываться для каждого из них.

Новый хук `hotUpdate` работает так же, как `handleHotUpdate`, но вызывается для каждого окружения и получает новый экземпляр `HotUpdateOptions`:

```ts
interface HotUpdateOptions {
  type: 'create' | 'update' | 'delete'
  file: string
  timestamp: number
  modules: Array<EnvironmentModuleNode>
  read: () => string | Promise<string>
  server: ViteDevServer
}
```

Текущее окружение разработки можно получить, как и в других хуках плагина, с помощью `this.environment`. Список `modules` теперь будет содержать только узлы модулей из текущего окружения. Каждое обновление окружения может определять разные стратегии обновления.

Этот хук также теперь вызывается для дополнительных событий наблюдения, а не только для `'update'`. Используйте `type`, чтобы различать их.

## Руководство по переходу {#migration-guide}

Отфильтруйте и уточните список затронутых модулей, чтобы HMR был более точным.

```js
handleHotUpdate({ modules }) {
  return modules.filter(condition)
}

// Переход к...

hotUpdate({ modules }) {
  return modules.filter(condition)
}
```

Верните пустой массив и выполните полную перезагрузку:

```js
handleHotUpdate({ server, modules, timestamp }) {
  // Ручная инвалидация модулей
  const invalidatedModules = new Set()
  for (const mod of modules) {
    server.moduleGraph.invalidateModule(
      mod,
      invalidatedModules,
      timestamp,
      true
    )
  }
  server.ws.send({ type: 'full-reload' })
  return []
}

// Переход к...

hotUpdate({ modules, timestamp }) {
  // Ручная инвалидация модулей
  const invalidatedModules = new Set()
  for (const mod of modules) {
    this.environment.moduleGraph.invalidateModule(
      mod,
      invalidatedModules,
      timestamp,
      true
    )
  }
  this.environment.hot.send({ type: 'full-reload' })
  return []
}
```

Верните пустой массив и выполните полное пользовательское управление HMR, отправляя пользовательские события клиенту:

```js
handleHotUpdate({ server }) {
  server.ws.send({
    type: 'custom',
    event: 'special-update',
    data: {}
  })
  return []
}

// Переход к...

hotUpdate() {
  this.environment.hot.send({
    type: 'custom',
    event: 'special-update',
    data: {}
  })
  return []
}
```
