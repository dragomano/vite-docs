# Общие плагины во время сборки {#shared-plugins-during-build}

::: tip Обратная связь
Оставьте нам отзыв в [обсуждении обратной связи по Environment API](https://github.com/vitejs/vite/discussions/16358)
:::

Смотрите [Общие плагины во время сборки](/guide/api-environment.md#shared-plugins-during-build).

Область применения: `Авторы плагинов Vite`

::: warning Устаревание в будущем
`builder.sharedConfigBuild` был впервые введен в `v6.0`. Вы можете установить его в true, чтобы проверить, как ваши плагины работают с общей конфигурацией. Мы ищем отзывы о возможности изменения значения по умолчанию в будущей основной версии, как только экосистема плагинов будет готова.
:::

## Мотивация {#motivation}

Согласовать конвейеры плагинов для разработки и сборки.

## Руководство по переходу {#migration-guide}

Чтобы иметь возможность делиться плагинами между окружениями, состояние плагина должно быть индексировано по текущему окружению. Плагин следующей формы будет подсчитывать количество преобразованных модулей во всех окружениях.

```js
function CountTransformedModulesPlugin() {
  let transformedModules
  return {
    name: 'count-transformed-modules',
    buildStart() {
      transformedModules = 0
    },
    transform(id) {
      transformedModules++
    },
    buildEnd() {
      console.log(transformedModules)
    },
  }
}
```

Если мы вместо этого хотим подсчитать количество преобразованных модулей для каждого окружения, нам нужно сохранить карту:

```js
function PerEnvironmentCountTransformedModulesPlugin() {
  const state = new Map<Environment, { count: number }>()
  return {
    name: 'count-transformed-modules',
    perEnvironmentStartEndDuringDev: true,
    buildStart() {
      state.set(this.environment, { count: 0 })
    }
    transform(id) {
      state.get(this.environment).count++
    },
    buildEnd() {
      console.log(this.environment.name, state.get(this.environment).count)
    }
  }
}
```

Чтобы упростить этот шаблон, Vite экспортирует вспомогательную функцию `perEnvironmentState`:

```js
function PerEnvironmentCountTransformedModulesPlugin() {
  const state = perEnvironmentState<{ count: number }>(() => ({ count: 0 }))
  return {
    name: 'count-transformed-modules',
    perEnvironmentStartEndDuringDev: true,
    buildStart() {
      state(this).count = 0
    }
    transform(id) {
      state(this).count++
    },
    buildEnd() {
      console.log(this.environment.name, state(this).count)
    }
  }
}
```
