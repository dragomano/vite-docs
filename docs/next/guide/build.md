# Продакшен-сборка {#building-for-production}

Когда приходит время развернуть продакшен-версию вашего приложения, просто выполните команду `vite build`. По умолчанию она использует `<root>/index.html` в качестве точки входа для сборки и создает пакет приложения, который подходит для развёртывания на статическом хостинге. Ознакомьтесь с разделом [Развёртывание статического сайта](./static-deploy) для получения инструкций по популярным сервисам.

## Совместимость с браузерами {#browser-compatibility}

По умолчанию продакшен-сборка ориентируется на современные браузеры, входящие в категорию [базовых](https://web-platform-dx.github.io/web-features/) широко распространённых (Baseline Widely Available). Поддерживаемые версии браузеров:

<!-- Search for the `ESBUILD_BASELINE_WIDELY_AVAILABLE_TARGET` constant for more information -->

- Chrome >=111
- Edge >=111
- Firefox >=114
- Safari >=16.4

Вы можете указать пользовательские цели через опцию конфигурации [`build.target`](/config/build-options.md#build-target), где самой низкой целью является `es2015`. Если установлена более низкая цель, Vite всё равно будет требовать эти минимальные диапазоны поддержки браузеров, так как он полагается на [встроенный динамический импорт ESM](https://caniuse.com/es6-module-dynamic-import) и [`import.meta`](https://caniuse.com/mdn-javascript_operators_import_meta):

<!-- Search for the `defaultEsbuildSupported` constant for more information -->

- Chrome >=64
- Firefox >=67
- Safari >=11.1
- Edge >=79

Обратите внимание, что по умолчанию Vite обрабатывает только синтаксические преобразования и **не включает полифиллы**. Вы можете ознакомиться с https://cdnjs.cloudflare.com/polyfill/, который автоматически генерирует пакеты полифиллов на основе строки UserAgent браузера пользователя.

Поддержка устаревших браузеров может быть обеспечена с помощью пакета [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy), который автоматически генерирует устаревшие чанки и соответствующие полифиллы для функций языка ES. Устаревшие чанки загружаются условно только в браузерах, которые не поддерживают встроенный ESM.

## Публичный базовый путь {#public-base-path}

- Связанная тема: [Обработка ресурсов](./assets)

Если вы развёртываете свой проект под вложенным публичным путём, просто укажите опцию конфигурации [`base`](/config/shared-options.md#base), и все пути к ресурсам будут переписаны соответственно. Эта опция также может быть указана в качестве флага командной строки, например, `vite build --base=/my/public/path/`.

URL-адреса ресурсов, импортируемых через JS, ссылки `url()` в CSS и ссылки на ресурсы в ваших `.html` файлах автоматически корректируются с учётом этой опции во время сборки.

Исключение составляют случаи, когда вам нужно динамически конкатенировать URL-адреса на лету. В этом случае вы можете использовать глобально инжектированную переменную `import.meta.env.BASE_URL`, которая будет публичным базовым путём. Обратите внимание, что эта переменная статически заменяется во время сборки, поэтому она должна появляться точно в том виде, в каком есть (т. е. `import.meta.env['BASE_URL']` не сработает).

Для более продвинутого управления базовым путём ознакомьтесь с [Расширенными параметрами базового пути](#advanced-base-options).

### Относительный базовый путь {#relative-base}

Если вы не знаете базовый путь заранее, вы можете установить относительный базовый путь с помощью `"base": "./"` или `"base": ""`. Это сделает все сгенерированные URL-адреса относительными к каждому файлу.

:::warning Поддержка старых браузеров при использовании относительных базовых путей

Поддержка `import.meta` необходима для относительных базовых путей. Если вам нужно поддерживать [браузеры, которые не поддерживают `import.meta`](https://caniuse.com/mdn-javascript_operators_import_meta), вы можете использовать [плагин `legacy`](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy).

:::

## Настройка сборки {#customizing-the-build}

Сборку можно настроить с помощью различных [параметров конфигурации](/config/build-options.md). В частности, вы можете напрямую настроить основные [параметры Rolldown](https://rollupjs.org/configuration-options/) через `build.rolldownOptions`:

<!-- TODO: update the link above and below to Rolldown's documentation -->

```js
export default defineConfig({
  build: {
    rolldownOptions: {
      // https://rollupjs.org/configuration-options/
    }
  }
})
```

Например, можно указать несколько выходных данных Rolldown с плагинами, которые применяются только во время сборки.

## Стратегия разделения на чанки {#chunking-strategy}

Вы можете настроить, как чанки разделяются, используя `build.rolldownOptions.output.advancedChunks` (см. [документацию Rolldown](https://rolldown.rs/in-depth/advanced-chunks)). Для настройки разделения сборки на чанки при работе с фреймворком обратитесь к соответствующей документации.

## Обработка ошибок загрузки {#load-error-handling}

Vite генерирует событие `vite:preloadError`, когда не удаётся загрузить динамические импорты. `event.payload` содержит оригинальную ошибку импорта. При вызове `event.preventDefault()` ошибка не будет выброшена.

```js twoslash
window.addEventListener('vite:preloadError', (event) => {
  window.location.reload() // например, обновим страницу
})
```

Когда происходит новое развёртывание, сервис хостинга может удалить ресурсы из предыдущих развёртываний. В результате пользователь, который посетил ваш сайт до нового развёртывания, может столкнуться с ошибкой импорта. Эта ошибка возникает, потому что ресурсы, работающие на устройстве этого пользователя, устарели, и он пытается импортировать соответствующий старый чанк, который был удалён. Это событие полезно для решения подобной ситуации. В этом случае убедитесь, что для HTML-файла установлено `Cache-Control: no-cache`, иначе будут продолжать использоваться старые ресурсы.

## Пересборка при изменении файлов {#rebuild-on-files-changes}

Вы можете включить наблюдатель Rollup с помощью команды `vite build --watch`. Либо вы можете напрямую настроить основные параметры наблюдателя ([`WatcherOptions`](https://rollupjs.org/configuration-options/#watch)) через опцию `build.watch`:

<!-- TODO: update the link above to Rolldown's documentation -->

```js [vite.config.js]
export default defineConfig({
  build: {
    watch: {
      // https://rollupjs.org/configuration-options/#watch
    }
  }
})
```

С включенным флагом `--watch` изменения в файле `vite.config.js`, а также в любых файлах, подлежащих объединению, приведут к пересборке.

## Многостраничное приложение {#multi-page-app}

Предположим, у вас есть следующая структура проекта:

```
├── package.json
├── vite.config.js
├── index.html
├── main.js
└── nested
    ├── index.html
    └── nested.js
```

Во время разработки просто перейдите или создайте ссылку на `/nested/` — это работает как ожидается, так же, как и для обычного статического файлового сервера.

Во время сборки всё, что вам нужно сделать, это указать несколько `.html` файлов в качестве точек входа:

```js twoslash [vite.config.js]
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  build: {
    rolldownOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        nested: resolve(__dirname, 'nested/index.html')
      }
    }
  }
})
```

Если вы укажете другую корневую директорию, помните, что `__dirname` всё равно будет указывать на папку вашего файла vite.config.js при разрешении входных путей. Поэтому вам нужно будет добавить вашу запись `root` в аргументы для `resolve`.

Обратите внимание, что для HTML файлов Vite игнорирует имя, указанное для входа в объекте `rolldownOptions.input`, и вместо этого учитывает разрешённый идентификатор файла при генерации HTML-ресурса в папке dist. Это обеспечивает согласованную структуру с тем, как работает dev-сервер.

## Режим библиотеки {#library-mode}

Когда вы разрабатываете библиотеку, ориентированную на браузер, вы, вероятно, проводите большую часть времени на тестовой/демонстрационной странице, которая импортирует вашу фактическую библиотеку. С Vite вы можете использовать ваш `index.html` для этой цели, чтобы получить плавный процесс разработки.

Когда приходит время упаковать вашу библиотеку для распространения, используйте опцию конфигурации [`build.lib`](/config/build-options.md#build-lib). Убедитесь, что вы также исключили любые зависимости, которые не хотите включать в вашу библиотеку, например, `vue` или `react`:

::: code-group

```js twoslash [vite.config.js (одна точка входа)]
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.js'),
      name: 'MyLib',
      // соответствующие расширения будут добавлены
      fileName: 'my-lib'
    },
    rolldownOptions: {
      // убедитесь, что вы исключили зависимости, которые не должны быть объединены
      // в вашу библиотеку
      external: ['vue'],
      output: {
        // Предоставьте глобальные переменные для использования в сборке UMD
        // для исключённых зависимостей
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
```

```js twoslash [vite.config.js (несколько точек входа)]
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  build: {
    lib: {
      entry: {
        'my-lib': resolve(__dirname, 'lib/main.js'),
        secondary: resolve(__dirname, 'lib/secondary.js')
      },
      name: 'MyLib'
    },
    rollupOptions: {
      // убедитесь, что вы исключили зависимости, которые не должны быть объединены
      // в вашу библиотеку
      external: ['vue'],
      output: {
        // Предоставьте глобальные переменные для использования в сборке UMD
        // для исключённых зависимостей
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
```

:::

Файл входа будет содержать экспорты, которые могут быть импортированы пользователями вашего пакета:

```js [lib/main.js]
import Foo from './Foo.vue'
import Bar from './Bar.vue'
export { Foo, Bar }
```

Запуск команды `vite build` с этой конфигурацией использует предустановку Rollup, ориентированную на создание библиотек, и производит два формата пакетов: `es` и `umd` (настраиваемые через `build.lib`):

- `es` и `umd` (для одной точки входа)
- `es` и `cjs` (для нескольких точек входа)

Форматы можно настроить с помощью опции [`build.lib.formats`](/config/build-options.md#build-lib).

```
$ vite build
building for production...
dist/my-lib.js      0.08 kB / gzip: 0.07 kB
dist/my-lib.umd.cjs 0.30 kB / gzip: 0.16 kB
```

Рекомендуемый `package.json` для вашей библиотеки:

::: code-group

```json [package.json (одна точка входа)]
{
  "name": "my-lib",
  "type": "module",
  "files": ["dist"],
  "main": "./dist/my-lib.umd.cjs",
  "module": "./dist/my-lib.js",
  "exports": {
    ".": {
      "import": "./dist/my-lib.js",
      "require": "./dist/my-lib.umd.cjs"
    }
  }
}
```

```json [package.json (несколько точек входа)]
{
  "name": "my-lib",
  "type": "module",
  "files": ["dist"],
  "main": "./dist/my-lib.cjs",
  "module": "./dist/my-lib.js",
  "exports": {
    ".": {
      "import": "./dist/my-lib.js",
      "require": "./dist/my-lib.cjs"
    },
    "./secondary": {
      "import": "./dist/secondary.js",
      "require": "./dist/secondary.cjs"
    }
  }
}
```

:::

### Поддержка CSS {#css-support}

Если ваша библиотека импортирует какой-либо CSS, он будет собран в один CSS-файл наряду с собранными JS-файлами, например, `dist/my-lib.css`. Имя по умолчанию соответствует `build.lib.fileName`, но его также можно изменить с помощью опции [`build.lib.cssFileName`](/config/build-options.md#build-lib).

Вы можете экспортировать CSS-файл в вашем `package.json`, чтобы его могли импортировать пользователи:

```json {12}
{
  "name": "my-lib",
  "type": "module",
  "files": ["dist"],
  "main": "./dist/my-lib.umd.cjs",
  "module": "./dist/my-lib.js",
  "exports": {
    ".": {
      "import": "./dist/my-lib.js",
      "require": "./dist/my-lib.umd.cjs"
    },
    "./style.css": "./dist/my-lib.css"
  }
}
```

::: tip Расширения файлов
Если в `package.json` не указано `"type": "module"`, Vite сгенерирует разные расширения файлов для совместимости с Node.js. `.js` станет `.mjs`, а `.cjs` станет `.js`.
:::

::: tip Переменные окружения
В режиме библиотеки все использования [`import.meta.env.*`](./env-and-mode.md) статически заменяются при создании продакшен-сборки. Однако использования `process.env.*` не заменяются, чтобы потребители вашей библиотеки могли динамически изменять их. Если это нежелательно, вы можете использовать `define: { 'process.env.NODE_ENV': '"production"' }`, например, чтобы статически заменить их, или использовать [`esm-env`](https://github.com/benmccann/esm-env) для лучшей совместимости со сборщиками и средами выполнения.
:::

::: warning Расширенное использование
Режим библиотеки включает в себя простую и предвзятую конфигурацию для библиотек, ориентированных на браузер и JS-фреймворки. Если вы разрабатываете библиотеки, не предназначенные для браузера, или вам требуются сложные процессы сборки, вы можете использовать [tsdown](https://tsdown.ru/) или [Rolldown](https://rolldown.rs/) напрямую.
:::

## Расширенные параметры базового пути {#advanced-base-options}

::: warning
Эта функция является экспериментальной. [Оставьте отзыв](https://github.com/vitejs/vite/discussions/13834).
:::

Для сложных случаев использования развёрнутые ресурсы и публичные файлы могут находиться в разных путях, например, для использования различных стратегий кэширования.
Пользователь может выбрать развёртывание в трех разных случаях:

- Сгенерированные HTML файлы входа (которые могут обрабатываться во время серверного рендеринга)
- Сгенерированные хэшированные ресурсы (JS, CSS и другие типы файлов, такие как изображения)
- Скопированные [публичные файлы](assets.md#the-public-directory)

Одного статического [базового пути](#public-base-path) недостаточно в этих сценариях. Vite предоставляет экспериментальную поддержку для расширенных базовых опций во время сборки, используя `experimental.renderBuiltUrl`.

```ts twoslash
import type { UserConfig } from 'vite'
// prettier-ignore
const config: UserConfig = {
// ---cut-before---
experimental: {
  renderBuiltUrl(filename, { hostType }) {
    if (hostType === 'js') {
      return { runtime: `window.__toCdnUrl(${JSON.stringify(filename)})` }
    } else {
      return { relative: true }
    }
  },
},
// ---cut-after---
}
```

Если хэшированные ресурсы и публичные файлы не развёртываются вместе, опции для каждой группы могут быть определены независимо, используя тип ресурса `type`, который включен во второй параметр `context`, передаваемый функции.

```ts twoslash
import type { UserConfig } from 'vite'
import path from 'node:path'
// prettier-ignore
const config: UserConfig = {
// ---cut-before---
experimental: {
  renderBuiltUrl(filename, { hostId, hostType, type }) {
    if (type === 'public') {
      return 'https://www.domain.com/' + filename
    } else if (path.extname(hostId) === '.js') {
      return {
        runtime: `window.__assetsPath(${JSON.stringify(filename)})`
      }
    } else {
      return 'https://cdn.domain.com/assets/' + filename
    }
  },
},
// ---cut-after---
}
```

Обратите внимание, что переданное значение `filename` является декодированным URL, и если функция возвращает строку URL, она также должна быть декодирована. Vite автоматически обработает кодирование при рендеринге URL. Если возвращается объект с `runtime`, кодирование должно обрабатываться вами самостоятельно в необходимых местах, так как код во время выполнения будет рендериться как есть.
