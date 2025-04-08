# Интеграция Rolldown {#rolldown-integration}

Vite планирует интегрировать [Rolldown](https://rolldown.rs) — JavaScript-бандлер на Rust, чтобы улучшить производительность сборки и расширить возможности.

## Что такое Rolldown? {#what-is-rolldown}

Rolldown — это современный высокопроизводительный JavaScript-бандлер, написанный на Rust. Он разработан как замена Rollup с сохранением совместимости, но с существенным приростом производительности.

Ключевые принципы Rolldown:

- **Скорость**: Реализация на Rust для максимальной производительности
- **Совместимость**: Работает с существующими плагинами Rollup
- **Удобство**: Знакомый API для пользователей Rollup

## Почему Vite переходит на Rolldown {#why-vite-is-migrating-to-rolldown}

1. **Унификация**: Сейчас Vite использует esbuild для предварительной сборки зависимостей и Rollup для продакшн-сборки. Rolldown объединит эти процессы в один высокопроизводительный инструмент, упрощая архитектуру.

2. **Производительность**: Реализация на Rust дает значительный прирост скорости по сравнению с JavaScript-решениями. Хотя конкретные показатели зависят от проекта, первые тесты показывают впечатляющие результаты.

Подробнее о причинах создания Rolldown можно узнать в [официальной документации](https://rolldown.rs/guide/#why-rolldown).

## Преимущества тестирования `rolldown-vite` {#benefits-of-trying-rolldown-vite}

- Более быстрая сборка, особенно для крупных проектов
- Улучшение будущей интеграции Rolldown в Vite, благодаря обратной связи
- Подготовка своих проектов к официальному переходу на Rolldown

## Как попробовать Rolldown {#how-to-try-rolldown}

Версия Vite на базе Rolldown доступна в виде отдельного пакета `rolldown-vite`. Для тестирования добавьте переопределения в ваш `package.json`:

:::code-group

```json [npm]
{
  "overrides": {
    "vite": "npm:rolldown-vite@latest"
  }
}
```

```json [Yarn]
{
  "resolutions": {
    "vite": "npm:rolldown-vite@latest"
  }
}
```

```json [pnpm]
{
  "pnpm": {
    "overrides": {
      "vite": "npm:rolldown-vite@latest"
    }
  }
}
```

```json [Bun]
{
  "overrides": {
    "vite": "npm:rolldown-vite@latest"
  }
}
```

:::

После добавления переопределений переустановите зависимости и запускайте сервер разработки или сборку проекта как обычно. Дополнительные изменения конфигурации не требуются.

## Известные ограничения {#known-limitations}

Хотя Rolldown стремится быть полной заменой Rollup, некоторые функции всё ещё находятся в разработке, а также есть небольшие преднамеренные различия в поведении. Полный список можно найти в [этом PR на GitHub](https://github.com/vitejs/rolldown-vite/pull/84#issue-2903144667), который регулярно обновляется.

## Сообщение о проблемах {#reporting-issues}

Поскольку это экспериментальная интеграция, вы можете столкнуться с проблемами. Если это произошло, пожалуйста, сообщайте о них в репозитории [`vitejs/rolldown-vite`](https://github.com/vitejs/rolldown-vite), **а не в основном репозитории Vite**.

При [сообщении о проблемах](https://github.com/vitejs/rolldown-vite/issues/new) следуйте шаблону issue и укажите:

- Минимальный пример для воспроизведения проблемы
- Данные о вашем окружении (ОС, версия Node, пакетный менеджер)
- Соответствующие сообщения об ошибках или логи

Для оперативного обсуждения и решения проблем присоединяйтесь к [Discord Rolldown](https://chat.rolldown.rs/).

## Планы на будущее {#future-plans}

Пакет `rolldown-vite` — это временное решение для сбора отзывов и стабилизации интеграции Rolldown. В будущем эта функциональность будет перенесена в основной репозиторий Vite.

Мы призываем вас опробовать `rolldown-vite` и внести вклад в его развитие через отзывы и сообщения о проблемах.

## Руководство для авторов плагинов и фреймворков {#plugin-framework-authors-guide}

### Ключевые изменения {#the-list-of-big-changes}

- Для сборки теперь используется Rolldown (ранее использовался Rollup)
- Для оптимизации теперь используется Rolldown (ранее использовался esbuild)
- Поддержка CommonJS теперь обрабатывается Rolldown (ранее использовался @rollup/plugin-commonjs)
- Для понижения синтаксиса теперь используется Oxc (ранее использовался esbuild)
- Для минификации CSS по умолчанию используется Lightning CSS (ранее использовался esbuild)
- Для минификации JS по умолчанию теперь используется Oxc minifier (ранее использовался esbuild)
- Для сборки конфигурации теперь используется Rolldown (ранее использовался esbuild)

### Определение rolldown-vite {#detecting-rolldown-vite}

Вы можете определить это одним из способов:

- проверив наличие `this.meta.rolldownVersion`

```js
const plugin = {
  resolveId() {
    if (this.meta.rolldownVersion) {
      // логика для rolldown-vite
    } else {
      // логика для rollup-vite
    }
  },
}
```

- проверив наличие экспорта `rolldownVersion`

```js
import * as vite from 'vite'

if (vite.rolldownVersion) {
  // логика для rolldown-vite
} else {
  // логика для rollup-vite
}
```

Если у вас есть `vite` в зависимостях (не peer dependency), экспорт `rolldownVersion` полезен, так как его можно использовать из любого места вашего кода.

### Игнорирование проверки опций в Rolldown {#ignoring-option-validation-in-rolldown}

Rolldown выбрасывает ошибку при передаче неизвестных или недопустимых опций. Поскольку некоторые опции, доступные в Rollup, не поддерживаются Rolldown, вы можете столкнуться с ошибками. Ниже приведен пример такого сообщения об ошибке:

> Error: Failed validate input options.
>
> - For the "preserveEntrySignatures". Invalid key: Expected never but received "preserveEntrySignatures".

Эту проблему можно решить, условно передавая опцию после проверки, что код выполняется с `rolldown-vite`, как показано выше.

Если вы хотите временно отключить эту ошибку, можно установить переменную окружения `ROLLDOWN_OPTIONS_VALIDATION=loose`. Однако учтите, что в конечном итоге вам нужно будет перестать передавать опции, не поддерживаемые Rolldown.

### `transformWithEsbuild` требует отдельной установки `esbuild` {#transformwithesbuild-requires-esbuild-to-be-installed-separately}

Аналогичная функция `transformWithOxc`, использующая Oxc вместо `esbuild`, экспортируется из `rolldown-vite`.

### Слой совместимости для опций `esbuild` {#compatibility-layer-for-esbuild-options}

Rolldown-Vite включает слой совместимости, преобразующий опции `esbuild` в соответствующие опции Oxc или `rolldown`. Как протестировано в [ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci/blob/rolldown-vite/README-temp.md), это работает во многих случаях, включая простые плагины `esbuild`.

**Однако важно отметить**, что **поддержка опций `esbuild` будет удалена в будущем**. Мы рекомендуем использовать соответствующие опции Oxc или `rolldown`.

Вы можете получить опции, установленные слоем совместимости, через хук `configResolved`.

```js
const plugin = {
  name: 'log-config',
  configResolved(config) {
    console.log('options', config.optimizeDeps, config.oxc)
  },
},
```

### Фильтрация хуков {#hook-filter-feature}

Rolldown представил [функцию фильтрации хуков](https://rolldown.rs/guide/plugin-development#plugin-hook-filters) для уменьшения накладных расходов на взаимодействие между средами выполнения Rust и JavaScript. Использование этой функции позволяет повысить производительность вашего плагина.

Эта возможность также поддерживается в Rollup 4.38.0+ и Vite 6.3.0+. Для обеспечения обратной совместимости вашего плагина со старыми версиями убедитесь, что фильтрация также выполняется внутри обработчиков хуков.

### Преобразование контента в JavaScript в хуках `load` или `transform` {#converting-content-to-javascript-in-load-or-transform-hooks}

Если вы преобразуете контент других типов в JavaScript в хуках `load` или `transform`, возможно, потребуется добавить `moduleType: 'js'` к возвращаемому значению.

```js
const plugin = {
  name: 'txt-loader',
  load(id) {
    if (id.endsWith('.txt')) {
      const content = fs.readFile(id, 'utf-8')
      return {
        code: `export default ${JSON.stringify(content)}`,
        moduleType: 'js', // [!code ++]
      }
    }
  },
}
```

Это связано с тем, что [Rolldown поддерживает модули, отличные от JavaScript](https://rolldown.rs/guide/in-depth/module-types), и определяет тип модуля по расширению файла, если он не указан явно.

Обратите внимание, что `rolldown-vite` **не поддерживает ModuleTypes в режиме разработки (dev)**.
