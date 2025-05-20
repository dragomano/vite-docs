# `this.environment` в хуках {#this-environment-in-hooks}

::: tip Обратная связь
Оставьте нам отзыв в [обсуждении обратной связи по Environment API](https://github.com/vitejs/vite/discussions/16358)
:::

До Vite 6 было доступно только два окружения: `client` и `ssr`. Один аргумент плагина `options.ssr` в хуках `resolveId`, `load` и `transform` позволял авторам плагинов различать эти два окружения при обработке модулей в хуках плагинов. В Vite 6 приложение Vite может определять любое количество именованных окружений по мере необходимости. Мы вводим `this.environment` в контексте плагина для взаимодействия с окружением текущего модуля в хуках.

Область применения: `Авторы плагинов Vite`

::: warning Депрекация в будущем
`this.environment` был введен в `v6.0`. Депрекация `options.ssr` запланировано на `v7.0`. В этот момент мы начнем рекомендовать миграцию ваших плагинов на использование нового API. Чтобы определить ваше использование, установите `future.removePluginHookSsrArgument` в `"warn"` в вашей конфигурации vite.
:::

## Мотивация {#motivation}

`this.environment` не только позволяет реализации хуков плагина знать текущее имя окружения, но также предоставляет доступ к параметрам конфигурации окружения, информации о графе модулей и конвейеру трансформации (`environment.config`, `environment.moduleGraph`, `environment.transformRequest()`). Наличие экземпляра окружения в контексте позволяет авторам плагинов избежать зависимости от всего dev-сервера (обычно кэшируется при запуске через хук `configureServer`).

## Руководство по переходу {#migration-guide}

Для быстрой адаптации существующего плагина замените аргумент `options.ssr` на `this.environment.config.consumer === 'server'` в хуках `resolveId`, `load` и `transform`:

```ts
import { Plugin } from 'vite'

export function myPlugin(): Plugin {
  return {
    name: 'my-plugin',
    resolveId(id, importer, options) {
      const isSSR = options.ssr // [!code --]
      const isSSR = this.environment.config.consumer === 'server' // [!code ++]

      if (isSSR) {
        // Логика, специфичная для SSR
      } else {
        // Логика, специфичная для клиента
      }
    },
  }
}
```

Для более надёжной долгосрочной реализации хук плагина должен обрабатывать [несколько окружений](/guide/api-environment.html#accessing-the-current-environment-in-hooks), используя детализированные параметры окружения вместо того, чтобы полагаться на имя окружения.
