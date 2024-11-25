---
title: Конфигурация Vite
---

# Конфигурация Vite {#configuring-vite}

При запуске `vite` из командной строки Vite автоматически попытается найти файл конфигурации с именем `vite.config.js` в [корне проекта](/guide/#index-html-and-project-root) (также поддерживаются другие расширения JS и TS).

Самый простой файл конфигурации выглядит так:

```js
// vite.config.js
export default {
  // опции конфигурации
}
```

Обратите внимание, что Vite поддерживает использование синтаксиса ES модулей в файле конфигурации, даже если проект не использует нативный узел ESM, например, `type: "module"` в `package.json`. В этом случае файл конфигурации автоматически предварительно обрабатывается перед загрузкой.

Вы также можете явно указать файл конфигурации для использования с помощью опции CLI `--config` (разрешается относительно `cwd`):

```bash
vite --config my-config.js
```

## Настройка Intellisense {#config-intellisense}

Поскольку Vite поставляется с типами TypeScript, вы можете использовать интеллектуальные подсказки вашей IDE с помощью типовых подсказок jsdoc:

```js
/** @type {import('vite').UserConfig} */
export default {
  // ...
}
```

В качестве альтернативы вы можете использовать вспомогательную функцию `defineConfig`, которая должна обеспечивать интеллектуальные подсказки без необходимости в аннотациях jsdoc:

```js
import { defineConfig } from 'vite'

export default defineConfig({
  // ...
})
```

Vite также поддерживает файлы конфигурации TypeScript. Вы можете использовать `vite.config.ts` с вышеупомянутой вспомогательной функцией `defineConfig` или с оператором `satisfies`:

```ts
import type { UserConfig } from 'vite'

export default {
  // ...
} satisfies UserConfig
```

## Конфигурация по условию {#conditional-config}

Если конфигурация должна условно определять параметры в зависимости от команды (`serve` или `build`), используемого [режима](/guide/env-and-mode), является ли это сборкой SSR (`isSsrBuild`) или предварительным просмотром сборки (`isPreview`), она может экспортировать функцию:

```js twoslash
import { defineConfig } from 'vite'
// ---cut---
export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  if (command === 'serve') {
    return {
      // конфигурация, специфичная для разработки
    }
  } else {
    // command === 'build'
    return {
      // конфигурация, специфичная для сборки
    }
  }
})
```

Важно отметить, что в API Vite значение `command` равно `serve` во время разработки (в консоли [`vite`](/guide/cli#vite), `vite dev` и `vite serve` являются псевдонимами), и `build` при сборке для продакшена ([`vite build`](/guide/cli#vite-build)).

`isSsrBuild` и `isPreview` — это дополнительные необязательные флаги для различения типов команд `build` и `serve` соответственно. Некоторые инструменты, которые загружают конфигурацию Vite, могут не поддерживать эти флаги и будут передавать `undefined` вместо этого. Поэтому рекомендуется использовать явное сравнение с `true` и `false`.

## Асинхронная конфигурация {#async-config}

Если конфигурация должна вызывать асинхронные функции, она может экспортировать асинхронную функцию вместо этого. И эта асинхронная функция также может быть передана через `defineConfig` для улучшенной поддержки интеллектуальных подсказок:

```js twoslash
import { defineConfig } from 'vite'
// ---cut---
export default defineConfig(async ({ command, mode }) => {
  const data = await asyncFunction()
  return {
    // конфигурация vite
  }
})
```

## Использование переменных окружения в конфигурации {#using-environment-variables-in-config}

Переменные окружения можно получить из `process.env`, как обычно.

Обратите внимание, что Vite по умолчанию не загружает файлы `.env`, так как файлы для загрузки можно определить только после оценки конфигурации Vite, например, параметры `root` и `envDir` влияют на поведение загрузки. Однако вы можете использовать экспортированную вспомогательную функцию `loadEnv`, чтобы загрузить конкретный файл `.env`, если это необходимо.

```js twoslash
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  // Загрузите файл окружения на основе `mode` в текущем рабочем каталоге.
  // Установите третий параметр в '' для загрузки всех переменных окружения
  // независимо от префикса `VITE_`.
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // конфигурация vite
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV)
    }
  }
})
```
