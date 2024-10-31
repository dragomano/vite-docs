# Обработка статических ресурсов {#static-asset-handling}

- См. также: [Публичный базовый путь](./build#public-base-path)
- См. также: [Параметр конфигурации `assetsInclude`](/config/shared-options.md#assetsinclude)

## Импорт ресурса в виде URL {#importing-asset-as-url}

При импорте статического ресурса будет возвращён разрешённый публичный URL, когда он будет обслуживаться:

```js twoslash
import 'vite/client'
// ---cut---
import imgUrl from './img.png'
document.getElementById('hero-img').src = imgUrl
```

Например, `imgUrl` будет `/img.png` во время разработки и станет `/assets/img.2d8efhg.png` в рабочей сборке.

Поведение аналогично `file-loader` в webpack. Разница в том, что импорт может использовать как абсолютные публичные пути (основанные на корне проекта во время разработки), так и относительные пути.

- Ссылки `url()` в CSS обрабатываются аналогичным образом.

- Если используется плагин Vue, ссылки на ресурсы в шаблонах Vue SFC автоматически преобразуются в импорты.

- Общие типы файлов изображений, медиа и шрифтов автоматически определяются как ресурсы. Вы можете расширить внутренний список, используя опцию [`assetsInclude`](/config/shared-options.md#assetsinclude).

- Ссылки на ресурсы включаются в графовую структуру ресурсов сборки, получают хешированные имена файлов и могут обрабатываться плагинами для оптимизации.

- Ресурсы, размер которых меньше, чем указано в опции [`assetsInlineLimit`](/config/build-options.md#build-assetsinlinelimit), будут встроены как URL-адреса данных base64.

- Заполнители Git LFS автоматически исключаются из встраивания, потому что они не содержат содержимое файла, который они представляют. Чтобы получить встраивание, убедитесь, что вы загрузили содержимое файла через Git LFS перед сборкой.

- TypeScript по умолчанию не распознаёт импорты статических ресурсов как допустимые модули. Чтобы исправить это, включите [`vite/client`](./features#client-types).

::: tip Встраивание SVG через `url()`
При передаче URL SVG в вручную сконструированное `url()` с помощью JS, переменная должна быть заключена в двойные кавычки:

```js twoslash
import 'vite/client'
// ---cut---
import imgUrl from './img.svg'
document.getElementById('hero-img').style.background = `url("${imgUrl}")`
```

:::

### Импорт явных URL {#explicit-url-imports}

Ресурсы, которые не включены во внутренний список или в `assetsInclude`, могут быть явно импортированы как URL-адреса с использованием суффикса `?url`. Это полезно, например, для импорта [Houdini Paint Worklets](https://houdini.how/usage) («Рабочие модули рисования Houdini»).

```js twoslash
import 'vite/client'
// ---cut---
import workletURL from 'extra-scalloped-border/worklet.js?url'
CSS.paintWorklet.addModule(workletURL)
```

### Импорт ресурса в виде строки {#importing-asset-as-string}

Ресурсы могут быть импортированы как строки с использованием суффикса `?raw`:

```js twoslash
import 'vite/client'
// ---cut---
import shaderString from './shader.glsl?raw'
```

### Импорт скрипта в виде веб-воркера {#importing-script-as-a-worker}

Скрипты могут быть импортированы как веб-воркеры с использованием суффиксов `?worker` или `?sharedworker`:

```js twoslash
import 'vite/client'
// ---cut---
// Отдельный чанк в рабочей сборке
import Worker from './shader.js?worker'
const worker = new Worker()
```

```js twoslash
import 'vite/client'
// ---cut---
// sharedworker
import SharedWorker from './shader.js?sharedworker'
const sharedWorker = new SharedWorker()
```

```js twoslash
import 'vite/client'
// ---cut---
// Вложения в виде строк base64
import InlineWorker from './shader.js?worker&inline'
```

Посмотрите главу [Веб-воркеры](./features.md#web-workers) для получения дополнительной информации.

## Директория `public` {#the-public-directory}

Если у вас есть ресурсы, которые:

- Никогда не упоминаются в исходном коде (например, `robots.txt`)
- Должны сохранять точно такое же имя файла (без хеширования)
- ...или вы просто не хотите импортировать ресурс, чтобы получить его URL

То вы можете поместить ресурс в специальную директорию `public` в корне вашего проекта. Ресурсы в этой директории будут обслуживаться по корневому пути `/` во время разработки и будут скопированы в корень директории dist без изменений.

По умолчанию директория находится по пути `<root>/public`, но может быть изменена с помощью опции [`publicDir`](/config/shared-options.md#publicdir).

Обратите внимание на следующее:

- Вы всегда должны ссылаться на ресурсы `public`, используя абсолютный путь от корня — например, `public/icon.png` должен упоминаться в исходном коде как `/icon.png`.
- Ресурсы в `public` не могут быть импортированы из JavaScript.

## new URL(url, import.meta.url) {#new-url-url-import-meta-url}

[import.meta.url](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Operators/import.meta) — это нативная функция ESM, которая предоставляет URL текущего модуля. Сочетая её с нативным [конструктором URL](https://developer.mozilla.org/ru/docs/Web/API/URL), мы можем получить полный, разрешённый URL статического ресурса, используя относительный путь из JavaScript модуля:

```js
const imgUrl = new URL('./img.png', import.meta.url).href

document.getElementById('hero-img').src = imgUrl
```

Это работает нативно в современных браузерах — на самом деле, Vite не нужно обрабатывать этот код вообще во время разработки!

Этот паттерн также поддерживает динамические URL через шаблонные литералы:

```js
function getImageUrl(name) {
  return new URL(`./dir/${name}.png`, import.meta.url).href
}
```

Во время создания рабочей сборки Vite выполнит необходимые преобразования, чтобы URL-адреса по-прежнему указывали на правильное местоположение, даже после объединения и хеширования ресурсов. Однако строка URL должна быть статической, чтобы её можно было проанализировать, в противном случае код останется без изменений, что может вызвать ошибки во время выполнения, если `build.target` не поддерживает `import.meta.url`.

```js
// Vite не будет преображать это
const imgUrl = new URL(imagePath, import.meta.url).href
```

::: warning Не работает с SSR
Этот паттерн не работает, если вы используете Vite для серверного рендеринга, потому что `import.meta.url` имеет разные семантики в браузерах и Node.js. Серверный бандл также не может заранее определить URL-адрес клиента.
:::
