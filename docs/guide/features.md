# Возможности {#features}

На самом базовом уровне разработка с помощью Vite не сильно отличается от использования статического файлового сервера. Однако Vite предоставляет множество улучшений по сравнению со встроенным импортом ESM для поддержки различных функций, которые обычно встречаются в системах на основе сборщиков.

## Разрешение зависимостей NPM и предварительное объединение {#npm-dependency-resolving-and-pre-bundling}

Нативный импорт ES не поддерживает импорт голых модулей, например:

```js
import { someMethod } from 'my-dep'
```

Упомянутый выше код приведет к ошибке в браузере. Vite обнаружит такой «голый» импорт модулей во всех обслуживаемых исходных файлах и выполнит следующее:

1. [Предварительное объединение зависимостей](./dep-pre-bundling) для улучшения скорости загрузки страниц и преобразования модулей CommonJS / UMD в ESM. Этап предварительного объединения выполняется с помощью [esbuild](http://esbuild.github.io/) и делает время холодного старта Vite значительно быстрее, чем у любого сборщика на основе JavaScript.

2. Замена импортов правильными URL-адресами, например `/node_modules/.vite/deps/my-dep.js?v=f3sf2ebd`, чтобы браузер мог правильно их импортировать.

**Зависимости сильно кэшируются**

Vite кэширует запросы к зависимостям через HTTP-заголовки, поэтому если вы хотите локально отредактировать/отладить зависимость, выполните [указанные шаги](./dep-pre-bundling#browser-cache).

## Горячая замена модулей {#hot-module-replacement}

Vite предоставляет [HMR API](./api-hmr) поверх родного ESM. Фреймворки с возможностями HMR могут использовать API для предоставления мгновенных и точных обновлений без перезагрузки страницы или удаления состояния приложения. Vite предоставляет сторонние интеграции HMR для [однофайловых компонентов Vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue) и [React Fast Refresh](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react). Есть также официальная интеграция для Preact через [@prefresh/vite](https://github.com/JoviDeCroock/prefresh/tree/main/packages/vite).

Обратите внимание, что вам не нужно настраивать их вручную — когда вы [создаете приложение с помощью `create-vite`](./), выбранные шаблоны уже будут настроены для вас.

## TypeScript

Vite поддерживает импорт файлов `.ts` из коробки.

### Только транспиляция {#transpile-only}

Обратите внимание, что Vite выполняет транспиляцию только для файлов `.ts` и **НЕ** выполняет проверку типов. Предполагается, что о проверке типов позаботится ваша IDE и процесс сборки.

Причина, по которой Vite не выполняет проверку типов в процессе преобразования, заключается в том, что эти две задачи работают принципиально по-разному. Транспиляция может работать на основе каждого файла и прекрасно сочетается с моделью компиляции Vite по требованию. Для сравнения, проверка типов требует знания всей графовой структуры модуля. Встраивание проверки типов в конвейер преобразований Vite неизбежно приведет к снижению скорости работы Vite.

Работа Vite заключается в том, чтобы как можно быстрее привести ваши исходные модули к виду, который можно запустить в браузере. Для этого мы рекомендуем отделить проверки статического анализа от конвейера преобразования Vite. Этот принцип применим и к другим проверкам статического анализа, таким как ESLint.

- Для продакшен-сборок вы можете выполнить команду `tsc --noEmit` в дополнение к команде сборки Vite.

- Во время разработки, если вам нужно больше, чем подсказки IDE, мы рекомендуем запускать `tsc --noEmit --watch` в отдельном процессе, или использовать [vite-plugin-checker](https://github.com/fi3ework/vite-plugin-checker), если вы предпочитаете, чтобы ошибки типов отображались непосредственно в браузере.

Vite использует [esbuild](https://github.com/evanw/esbuild) для транспиляции TypeScript в JavaScript, что примерно в 20~30 раз быстрее, чем ванильный `tsc`, а обновления HMR отражаются в браузере менее чем за 50 мс.

Используйте синтаксис [импортов и экспортов только для типов](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export), чтобы избежать потенциальных проблем, например, неправильного объединения импортов только по типу:

```ts
import type { T } from 'only/types'
export type { T }
```

### Параметры компилятора TypeScript {#typescript-compiler-options}

Некоторые поля конфигурации в секции `compilerOptions` в `tsconfig.json` требуют особого внимания.

#### `isolatedModules`

- [Документация TypeScript](https://www.typescriptlang.org/tsconfig#isolatedModules)

Должно быть установлено значение `true`.

Это связано с тем, что `esbuild` выполняет только транспиляцию без информации о типах, и не поддерживает определенные функции, такие как `const enum` и неявные импорты только для типов.

Вы должны установить `"isolatedModules": true` в вашем `tsconfig.json` в секции `compilerOptions`, чтобы TS предупреждал вас о функциях, которые не работают с изолированной транспиляцией.

Если зависимость не работает с `"isolatedModules": true`, можно использовать `"skipLibCheck": true` для временного подавления ошибок до тех пор, пока они не будут исправлены.

#### `useDefineForClassFields`

- [Документация TypeScript](https://www.typescriptlang.org/tsconfig#useDefineForClassFields)

Начиная с Vite 2.5.0, значение по умолчанию будет `true`, если целевая версия TypeScript — `ESNext`, `ES2022` или новее. Это соответствует [поведению `tsc` 4.3.2 и более поздних версий](https://github.com/microsoft/TypeScript/pull/42663). Это также стандартное поведение среды выполнения ECMAScript.

Для других целевых версий TypeScript значение по умолчанию будет `false`.

Однако это может быть неинтуитивно для тех, кто приходит из других языков программирования или более старых версий TypeScript. Вы можете прочитать больше о переходе в [заметках о выпуске TypeScript 3.7](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#the-usedefineforclassfields-flag-and-the-declare-property-modifier).

Если вы используете библиотеку, которая сильно зависит от полей класса, пожалуйста, будьте осторожны с предполагаемым использованием этой библиотеки.

Большинство библиотек (такие как [MobX](https://mobx.js.org/installation.html#use-spec-compliant-transpilation-for-class-properties)) ожидают, что `"useDefineForClassFields": true`.

Но некоторые библиотеки, включая [`lit-element`](https://github.com/lit/lit-element/issues/1030), ещё не перешли на этот новый стандарт. В этих случаях, пожалуйста, явно установите `useDefineForClassFields` в `false`.

#### `target`

- [Документация TypeScript](https://www.typescriptlang.org/tsconfig#target)

Vite по умолчанию не транспилирует TypeScript с заданным значением `target`, следуя тому же поведению, что и `esbuild`.

Вместо этого может быть использована опция [`esbuild.target`](/config/shared-options.html#esbuild), по умолчанию устанавливая значение `esnext` для минимальной транспиляции. В сборках опция [`build.target`](/config/build-options.html#build-target) имеет более высокий приоритет и также может быть установлена при необходимости.

::: warning `useDefineForClassFields`
Если `target` не содержит `ESNext` или `ES2022` или новее, или если нет файла `tsconfig.json`, `useDefineForClassFields` по умолчанию будет установлено в `false`, что может вызвать проблемы со значением `esbuild.target` по умолчанию, равным `esnext`. Это может привести к транспиляции в [статические блоки инициализации](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Static_initialization_blocks#browser_compatibility), которые могут не поддерживаться в вашем браузере.

Таким образом, рекомендуется установить `target` на `ESNext` или `ES2022` или новее, или явно установить `useDefineForClassFields` в `true` при настройке `tsconfig.json`.
:::

#### Другие параметры компилятора, влияющие на результат сборки {#other-compiler-options-affecting-the-build-result}

- [`extends`](https://www.typescriptlang.org/tsconfig#extends)
- [`importsNotUsedAsValues`](https://www.typescriptlang.org/tsconfig#importsNotUsedAsValues)
- [`preserveValueImports`](https://www.typescriptlang.org/tsconfig#preserveValueImports)
- [`verbatimModuleSyntax`](https://www.typescriptlang.org/tsconfig#verbatimModuleSyntax)
- [`jsx`](https://www.typescriptlang.org/tsconfig#jsx)
- [`jsxFactory`](https://www.typescriptlang.org/tsconfig#jsxFactory)
- [`jsxFragmentFactory`](https://www.typescriptlang.org/tsconfig#jsxFragmentFactory)
- [`jsxImportSource`](https://www.typescriptlang.org/tsconfig#jsxImportSource)
- [`experimentalDecorators`](https://www.typescriptlang.org/tsconfig#experimentalDecorators)
- [`alwaysStrict`](https://www.typescriptlang.org/tsconfig#alwaysStrict)

::: tip `skipLibCheck`
В стартовых шаблонах Vite есть `"skipLibCheck": "true"` по умолчанию, чтобы избежать проверки типов зависимостей, поскольку они могут поддерживать только определённые версии и конфигурации TypeScript. Более подробную информацию вы можете найти на сайте [vuejs/vue-cli#5688](https://github.com/vuejs/vue-cli/pull/5688).
:::

### Типы клиента {#client-types}

Типы Vite по умолчанию предназначены для API Node.js. Чтобы изменить окружение кода на стороне клиента в приложении Vite, добавьте файл декларации `d.ts`:

```typescript
/// <reference types="vite/client" />
```

В качестве альтернативы вы можете добавить `vite/client` в `compilerOptions.types` внутри `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["vite/client"]
  }
}
```

Это обеспечит следующие типовые шимы:

- Импорт ресурсов (например, импорт файла `.svg`)
- Типы для внедряемых Vite [переменных окружения](./env-and-mode#env-variables) в `import.meta.hot`
- Типы для [HMR API](./api-hmr) в `import.meta.hot`

::: tip
Чтобы переопределить стандартные типы, добавьте файл определения, который содержит ваши типы. Затем добавьте ссылку на типы перед `vite/client`.

Например, чтобы сделать стандартный импорт `*.svg` компонентом React:

- `vite-env-override.d.ts` (файл, содержащий ваши наборы):
  ```ts
  declare module '*.svg' {
    const content: React.FC<React.SVGProps<SVGElement>>
    export default content
  }
  ```
- Файл, содержащий ссылку на `vite/client`:
  ```ts
  /// <reference types="./vite-env-override.d.ts" />
  /// <reference types="vite/client" />
  ```

:::

## Vue

Vite обеспечивает первоклассную поддержку Vue:

- Поддержка Vue 3 SFC через [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue)
- Поддержка Vue 3 JSX через [@vitejs/plugin-vue-jsx](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx)
- Поддержка Vue 2.7 через [@vitejs/plugin-vue2](https://github.com/vitejs/vite-plugin-vue2)
- Поддержка Vue <2.7 через [vite-plugin-vue2](https://github.com/underfin/vite-plugin-vue2)

## JSX

Файлы `.jsx` и `.tsx` также поддерживаются из коробки. Транспиляция JSX также осуществляется с помощью [esbuild](https://esbuild.github.io).

Пользователи Vue должны использовать официальный плагин [@vitejs/plugin-vue-jsx](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx), который предоставляет специфические для Vue 3 функции, включая HMR, глобальное разрешение компонентов, директивы и слоты.

Если вы используете JSX без React или Vue, можно настроить пользовательские `jsxFactory` и `jsxFragment` с помощью [опции `esbuild`](https://esbuild.github.io). Например, для Preact:

```js twoslash
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment'
  }
})
```

Подробности в [документации esbuild](https://esbuild.github.io/content-types/#jsx).

Вы можете инжектировать JSX-помощники с помощью `jsxInject` (эта опция доступна только для Vite), чтобы избежать ручного импорта:

```js twoslash
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  esbuild: {
    jsxInject: `import React from 'react'`
  }
})
```

## CSS

Импорт файлов `.css` будет инжектировать их содержимое на страницу через тег `<style>` с поддержкой HMR.

### Встраивание и перебазирование `@import` {#import-inlining-and-rebasing}

Vite предварительно настроен для поддержки встраивания CSS `@import` через `postcss-import`. Также учитываются алиасы Vite для CSS `@import`. Кроме того, все ссылки CSS `url()`, даже если импортируемые файлы находятся в разных директориях, всегда автоматически перерабатываются для обеспечения корректности.

Алиасы `@import` и обработка URL также поддерживаются для файлов Sass и Less (см. [Препроцессоры CSS](#css-pre-processors)).

### PostCSS

Если проект содержит корректный конфиг PostCSS (любой формат, поддерживаемый [postcss-load-config](https://github.com/postcss/postcss-load-config), например, `postcss.config.js`), он будет автоматически применён ко всем импортированным CSS.

Обратите внимание, что минификация CSS будет выполняться после PostCSS и будет использовать опцию [`build.cssTarget`](/config/build-options.md#build-csstarget).

### CSS-модули {#css-modules}

Любой CSS-файл, заканчивающийся на `.module.css`, считается [CSS-модулем](https://github.com/css-modules/css-modules). Импорт такого файла вернет соответствующий объект модуля:

```css
/* example.module.css */
.red {
  color: red;
}
```

```js twoslash
import 'vite/client'
// ---cut---
import classes from './example.module.css'
document.getElementById('foo').className = classes.red
```

Поведение CSS-модулей можно настроить с помощью опции [`css.modules`](/config/shared-options.md#css-modules).

Если `css.modules.localsConvention` установлен для включения локалей в верблюжьем регистре (например, `localsConvention: 'camelCaseOnly'`), вы также можете использовать именованный импорт:

```js twoslash
import 'vite/client'
// ---cut---
// .apply-color -> applyColor
import { applyColor } from './example.module.css'
document.getElementById('foo').className = applyColor
```

### Препроцессоры CSS {#css-pre-processors}

Поскольку Vite ориентирован только на современные браузеры, рекомендуется использовать собственные переменные CSS с плагинами PostCSS, которые реализуют проекты CSSWG (например, [postcss-nesting](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-nesting)) и авторский простой CSS, соответствующий будущим стандартам.

Тем не менее, Vite обеспечивает встроенную поддержку файлов `.scss`, `.sass`, `.less`, `.styl` и `.stylus`. Для них не нужно устанавливать специфические для Vite плагины, но сам соответствующий препроцессор должен быть установлен:

```bash
# .scss и .sass
npm add -D sass

# .less
npm add -D less

# .styl и .stylus
npm add -D stylus
```

Если вы используете компоненты Vue в одном файле, это также автоматически включает `<style lang="sass">` и другие.

Vite улучшает разрешение `@import` для Sass и Less, так что псевдонимы Vite также учитываются. Кроме того, относительные ссылки `url()` внутри импортированных файлов Sass/Less, которые находятся в других директориях по сравнению с корневым файлом, также автоматически пересчитываются для обеспечения корректности.

Псевдонимы `@import` и пересчёт URL не поддерживаются для Stylus из-за ограничений его API.

Вы также можете использовать CSS-модули в сочетании с препроцессорами, добавляя `.module` к расширению файла, например, `style.module.scss`.

### Отключение внедрения CSS на странице {#disabling-css-injection-into-the-page}

Автоматическое внедрение содержимого CSS можно отключить с помощью параметра запроса `?inline`. В этом случае обработанная CSS-строка возвращается как экспорт модуля по умолчанию, как обычно, но стили не внедряются на страницу.

```js twoslash
import 'vite/client'
// ---cut---
import styles from './foo.css' // стили будут вставлены в страницу
import otherStyles from './bar.css?inline' // стили не будут вставлены в страницу
```

::: tip ПРИМЕЧАНИЕ
Импорт по умолчанию и именованный импорт из CSS-файлов (например, `import style from './foo.css'`) удален из Vite 5. Вместо этого используйте запрос `?inline`.
:::

### Lightning CSS {#lightning-css}

Начиная с версии Vite 4.4, появилась экспериментальная поддержка [Lightning CSS](https://lightningcss.dev/). Вы можете подключиться к нему, добавив [`css.transformer: 'lightningcss'`](../config/shared-options.md#css-transformer) в ваш конфигурационный файл и установив дополнительную зависимость [`lightningcss`](https://www.npmjs.com/package/lightningcss):

```bash
npm add -D lightningcss
```

Если эта опция включена, CSS-файлы будут обрабатываться Lightning CSS вместо PostCSS. Чтобы настроить его, вы можете передать параметры Lightning CSS в опцию конфигурации [`css.lightningcss`](../config/shared-options.md#css-lightningcss).

Для настройки CSS-модулей нужно будет использовать [`css.lightningcss.cssModules`](https://lightningcss.dev/css-modules.html) вместо [`css.modules`](../config/shared-options.md#css-modules) (который настраивает способ работы PostCSS с CSS-модулями).

По умолчанию Vite использует esbuild для минификации CSS. Lightning CSS также можно использовать в качестве минификатора CSS с помощью опции [`build.cssMinify: 'lightningcss'`](../config/build-options.md#build-cssminify).

::: tip ПРИМЕЧАНИЕ
[Препроцессоры CSS](#css-pre-processors) не поддерживаются при использовании Lightning CSS.
:::

## Статические ресурсы {#static-assets}

Импорт статического ресурса вернёт разрешённый публичный URL при его обслуживании:

```js twoslash
import 'vite/client'
// ---cut---
import imgUrl from './img.png'
document.getElementById('hero-img').src = imgUrl
```

Специальные запросы могут изменять способ загрузки ресурсов:

```js twoslash
import 'vite/client'
// ---cut---
// Явная загрузка ресурсов в виде URL
import assetAsURL from './asset.js?url'
```

```js twoslash
import 'vite/client'
// ---cut---
// Загружаем ресурсы в виде строк
import assetAsString from './shader.glsl?raw'
```

```js twoslash
import 'vite/client'
// ---cut---
// Загружаем веб-воркеров
import Worker from './worker.js?worker'
```

```js twoslash
import 'vite/client'
// ---cut---
// Веб-воркеры встраиваются в строки base64 во время сборки
import InlineWorker from './worker.js?worker&inline'
```

Подробнее в главе [Обработка статических ресурсов](./assets).

## JSON

Файлы JSON можно импортировать напрямую — также поддерживается именованный импорт:

```js twoslash
import 'vite/client'
// ---cut---
// импортируем весь объект
import json from './example.json'
// импорт корневого поля в виде именованных экспортов - помогает при встряхивании деревьев!
import { field } from './example.json'
```

## Глобальный импорт {#glob-import}

Vite поддерживает импорт нескольких модулей из файловой системы с помощью специальной функции `import.meta.glob`:

```js twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob('./dir/*.js')
```

Вышеизложенное преобразуется в следующее:

```js
// код, созданный vite
const modules = {
  './dir/foo.js': () => import('./dir/foo.js'),
  './dir/bar.js': () => import('./dir/bar.js')
}
```

Затем вы можете перебирать ключи объекта `modules`, чтобы получить доступ к соответствующим модулям:

```js
for (const path in modules) {
  modules[path]().then((mod) => {
    console.log(path, mod)
  })
}
```

По умолчанию совпадающие файлы лениво загружаются через динамический импорт и будут разбиты на отдельные части во время сборки. Если вы предпочитаете импортировать все модули напрямую (например, полагаясь на то, что побочные эффекты в этих модулях будут применены первыми), вы можете передать `{ eager: true }` в качестве второго аргумента:

```js twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob('./dir/*.js', { eager: true })
```

Вышеизложенное преобразуется в следующее:

```js
// код, созданный vite
import * as __glob__0_0 from './dir/foo.js'
import * as __glob__0_1 from './dir/bar.js'
const modules = {
  './dir/foo.js': __glob__0_0,
  './dir/bar.js': __glob__0_1
}
```

### Несколько шаблонов {#multiple-patterns}

Первым аргументом может быть массив глобалов, например:

```js twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob(['./dir/*.js', './another/*.js'])
```

### Шаблоны исключений {#negative-patterns}

Также поддерживаются шаблоны с префиксом `!`. Чтобы исключить некоторые файлы из результата, вы можете добавить шаблоны исключений в первый аргумент:

```js twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob(['./dir/*.js', '!**/bar.js'])
```

```js
// код, созданный vite
const modules = {
  './dir/foo.js': () => import('./dir/foo.js')
}
```

#### Именованные импорты {#named-imports}

С помощью опций `import` можно импортировать только части модулей:

```ts twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob('./dir/*.js', { import: 'setup' })
```

```ts
// код, созданный vite
const modules = {
  './dir/foo.js': () => import('./dir/foo.js').then((m) => m.setup),
  './dir/bar.js': () => import('./dir/bar.js').then((m) => m.setup)
}
```

В сочетании с опцией `eager` даже возможно включить «tree-shaking» («встряхивание дерева») для этих модулей:

```ts twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob('./dir/*.js', {
  import: 'setup',
  eager: true
})
```

```ts
// код, созданный vite:
import { setup as __glob__0_0 } from './dir/foo.js'
import { setup as __glob__0_1 } from './dir/bar.js'
const modules = {
  './dir/foo.js': __glob__0_0,
  './dir/bar.js': __glob__0_1
}
```

Установите для опции `import` значение `default`, чтобы импортировать экспорт по умолчанию.

```ts twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob('./dir/*.js', {
  import: 'default',
  eager: true
})
```

```ts
// код, созданный vite:
import __glob__0_0 from './dir/foo.js'
import __glob__0_1 from './dir/bar.js'
const modules = {
  './dir/foo.js': __glob__0_0,
  './dir/bar.js': __glob__0_1
}
```

#### Пользовательские запросы {#custom-queries}

Можно также использовать опцию `query`, чтобы задать запросы к импорту, например, импортировать ресурсы [как строку](/guide/assets.html#importing-asset-as-string) или [как url](/guide/assets.html#importing-asset-as-url):

```ts twoslash
import 'vite/client'
// ---cut---
const moduleStrings = import.meta.glob('./dir/*.svg', {
  query: '?raw',
  import: 'default'
})
const moduleUrls = import.meta.glob('./dir/*.svg', {
  query: '?url',
  import: 'default'
})
```

```ts
// код, созданный vite:
const moduleStrings = {
  './dir/foo.svg': () => import('./dir/foo.js?raw').then((m) => m['default']),
  './dir/bar.svg': () => import('./dir/bar.js?raw').then((m) => m['default'])
}
const moduleUrls = {
  './dir/foo.svg': () => import('./dir/foo.js?url').then((m) => m['default']),
  './dir/bar.svg': () => import('./dir/bar.js?url').then((m) => m['default'])
}
```

Вы также можете предоставлять пользовательские запросы для других плагинов:

```ts twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob('./dir/*.js', {
  query: { foo: 'bar', bar: true }
})
```

### Предостережения по поводу глобального импорта {#glob-import-caveats}

Обратите внимание, что:

- Это функция, специфичная для Vite, и не является стандартом веба или ES.
- Глобальные шаблоны обрабатываются как спецификаторы импорта: они должны быть либо относительными (начинаться с `./`), либо абсолютными (начинаться с `/`, разрешаемыми относительно корня проекта), либо путями псевдонимов (см. [опцию `resolve.alias`](/config/shared-options.md#resolve-alias)).
- Глобальное сопоставление выполняется с помощью [`fast-glob`](https://github.com/mrmlnc/fast-glob) — ознакомьтесь с его документацией для [поддерживаемых глобальных шаблонов](https://github.com/mrmlnc/fast-glob#pattern-syntax).
- Также следует учитывать, что все аргументы в `import.meta.glob` должны быть **переданы как литералы**. Вы не можете использовать переменные или выражения в них.

## Динамический импорт {#dynamic-import}

Подобно [глобальному импорту](#glob-import), Vite также поддерживает динамический импорт с помощью переменных.

```ts
const module = await import(`./dir/${file}.js`)
```

Обратите внимание, что переменные представляют имена файлов только на одном уровне. Если `file` имеет значение `'foo/bar'`, импорт будет неудачным. Для более продвинутого использования можно воспользоваться функцией [глобального импорта](#glob-import).

## WebAssembly

Предварительно скомпилированные файлы `.wasm` могут быть импортированы с помощью `?init`.
По умолчанию экспортируется функция инициализации, которая возвращает Promise из [`WebAssembly.Instance`](https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/Instance):

```js twoslash
import 'vite/client'
// ---cut---
import init from './example.wasm?init'

init().then((instance) => {
  instance.exports.test()
})
```

Функция init также может принимать в качестве второго аргумента importObject, который передается в [`WebAssembly.instantiate`](https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/instantiate):

```js twoslash
import 'vite/client'
import init from './example.wasm?init'
// ---cut---
init({
  imports: {
    someFunc: () => {
      /* ... */
    }
  }
}).then(() => {
  /* ... */
})
```

В продакшен-сборке файлы `.wasm`, размер которых меньше `assetInlineLimit`, будут вставляться в виде строк base64. В противном случае они будут рассматриваться как [статический ресурс](./assets) и извлекаться по требованию.

::: tip ПРИМЕЧАНИЕ
[Предложение по интеграции ES-модулей для WebAssembly](https://github.com/WebAssembly/esm-integration) в настоящее время не поддерживается.
Используйте [`vite-plugin-wasm`](https://github.com/Menci/vite-plugin-wasm) или другие плагины сообщества для работы с этим.
:::

### Доступ к модулю WebAssembly {#accessing-the-webassembly-module}

Если вам нужен доступ к объекту `Module`, например, чтобы инстанцировать его несколько раз, используйте [явный импорт URL](./assets#explicit-url-imports) для разрешения ресурса, а затем выполните инстанцирование:

```js twoslash
import 'vite/client'
// ---cut---
import wasmUrl from 'foo.wasm?url'

const main = async () => {
  const responsePromise = fetch(wasmUrl)
  const { module, instance } = await WebAssembly.instantiateStreaming(
    responsePromise
  )
  /* ... */
}

main()
```

### Получение модуля в Node.js {#fetching-the-module-in-node-js}

В SSR операция `fetch()`, выполняемая в рамках импорта `?init`, может завершиться с ошибкой `TypeError: Invalid URL`.
См. запрос [Support wasm in SSR](https://github.com/vitejs/vite/issues/8882).

Вот альтернативный вариант, предполагающий, что базой проекта является текущий каталог:

```js twoslash
import 'vite/client'
// ---cut---
import wasmUrl from 'foo.wasm?url'
import { readFile } from 'node:fs/promises'

const main = async () => {
  const resolvedUrl = (await import('./test/boot.test.wasm?url')).default
  const buffer = await readFile('.' + resolvedUrl)
  const { instance } = await WebAssembly.instantiate(buffer, {
    /* ... */
  })
  /* ... */
}

main()
```

## Веб-воркеры {#web-workers}

### Импорт с конструкторами {#import-with-constructors}

Скрипт веб-воркера можно импортировать с помощью [`new Worker()`](https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker) и [`new SharedWorker()`](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker/SharedWorker). По сравнению с суффиксами воркеров, этот синтаксис ближе к стандартам и является **рекомендуемым** способом создания воркеров.

```ts
const worker = new Worker(new URL('./worker.js', import.meta.url))
```

Конструктор воркера также принимает опции, которые могут быть использованы для создания «модульных» воркеров:

```ts
const worker = new Worker(new URL('./worker.js', import.meta.url), {
  type: 'module'
})
```

Обнаружение воркера будет работать только в том случае, если конструктор `new URL()` используется непосредственно внутри объявления `new Worker()`. Кроме того, все параметры опций должны быть статическими значениями (т. е. строковыми литералами).

### Импорт с суффиксами запросов {#import-with-query-suffixes}

Скрипт веб-воркера можно импортировать напрямую, добавив к запросу на импорт `?worker` или `?sharedworker`. По умолчанию экспортируется пользовательский конструктор воркера:

```js twoslash
import 'vite/client'
// ---cut---
import MyWorker from './worker?worker'

const worker = new MyWorker()
```

Скрипт воркера также может использовать ESM-операторы `import` вместо `импортаScripts()`. **Примечание**: во время разработки это зависит от [нативной поддержки браузера](https://caniuse.com/?search=module%20worker), но для промышленной сборки это откомпилировано.

По умолчанию скрипт воркера будет выдан в виде отдельного блока в продакшен-сборке. Если вы хотите вставить воркера в виде строк base64, добавьте запрос `inline`:

```js twoslash
import 'vite/client'
// ---cut---
import MyWorker from './worker?worker&inline'
```

Если вы хотите получить воркера в виде URL, добавьте запрос `url`:

```js twoslash
import 'vite/client'
// ---cut---
import MyWorker from './worker?worker&url'
```

Подробности о настройке объединения всех воркеров см. в главе [Параметры воркера](/config/worker-options.md).

## Политика безопасности контента (CSP) {#content-security-policy-csp}

Для развёртывания CSP необходимо установить определённые директивы или конфигурации, обусловленные внутренним устройством Vite.

### [`'nonce-{RANDOM}'`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/Sources#nonce-base64-value)

Когда [`html.cspNonce`](/config/shared-options#html-cspnonce) установлен, Vite добавляет атрибут `nonce` с указанным значением к любым тегам `<script>` и `<style>`, а также к тегам `<link>` для таблиц стилей и предварительной загрузки модулей. Кроме того, когда эта опция установлена, Vite будет инжектировать мета-тег (`<meta property="csp-nonce" nonce="PLACEHOLDER" />`).

Значение мета-тега `nonce` с `property="csp-nonce"` будет использоваться Vite всякий раз, когда это необходимо, как в процессе разработки, так и после сборки.

:::warning
Убедитесь, что вы заменяете placeholder уникальным значением для каждого запроса. Это важно для предотвращения обхода политики ресурса, что в противном случае можно легко сделать.
:::

### [`data:`](<https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/Sources#scheme-source:~:text=schemes%20(not%20recommended).-,data%3A,-Allows%20data%3A>)

По умолчанию, во время сборки Vite встраивает небольшие ресурсы в виде data URI. Необходимо разрешить `data:` для связанных директив (например, [`img-src`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/img-src), [`font-src`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/font-src)) или отключить это, установив [`build.assetsInlineLimit: 0`](/config/build-options#build-assetsinlinelimit).

:::warning
Не разрешайте `data:` для [`script-src`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src). Это позволит внедрить произвольные скрипты.
:::

## Оптимизация сборки {#build-optimizations}

> Функции, перечисленные ниже, автоматически применяются в процессе сборки, и нет необходимости в их явной настройке, если только вы не хотите их отключить.

### Разделение кода CSS {#css-code-splitting}

Vite автоматически извлекает CSS, используемый модулями в асинхронном чанке, и генерирует для него отдельный файл. CSS-файл автоматически загружается через тег `<link>` при загрузке связанного асинхронного чанка, и гарантируется, что асинхронный чанк будет оценён только после загрузки CSS, чтобы избежать [FOUC](https://en.wikipedia.org/wiki/Flash_of_unstyled_content#:~:text=A%20flash%20of%20unstyled%20content,before%20all%20information%20is%20retrieved.).

Если вы предпочитаете, чтобы весь CSS был извлечен в один файл, вы можете отключить разделение кода CSS, установив [`build.cssCodeSplit`](/config/build-options.md#build-csscodesplit) в `false`.

### Генерация директив предварительной загрузки {#preload-directives-generation}

Vite автоматически генерирует директивы `<link rel="modulepreload">` для входных фрагментов и их прямого импорта в собранном HTML.

### Оптимизация асинхронной загрузки чанков {#async-chunk-loading-optimization}

В реальных приложениях Rollup часто генерирует «общие» чанки — код, который разделяется между двумя или более другими кусками кода. В сочетании с динамическим импортом довольно часто возникает следующий сценарий:

<script setup>
import graphSvg from '../images/graph.svg?raw'
</script>
<svg-image :svg="graphSvg" />

В неоптимизированных сценариях, когда импортируется асинхронный чанк `A`, браузеру необходимо запросить и разобрать `A`, прежде чем он сможет понять, что ему также нужен общий чанк `C`. Это приводит к дополнительной сетевой задержке:

```
Вход ---> A ---> C
```

Vite автоматически переписывает вызовы динамического импорта с разделением кода, добавляя шаг предварительной загрузки, так что когда `A` запрашивается, `C` загружается **параллельно**:

```
Вход ---> (A + C)
```

Возможно, что у `C` есть дальнейшие импорты, что приведёт к ещё большему количеству задержек в неоптимизированном сценарии. Оптимизация Vite отслеживает все прямые импорты, чтобы полностью устранить задержки независимо от глубины импорта.
