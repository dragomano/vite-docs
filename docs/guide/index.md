# Первые шаги {#getting-started}

<audio id="vite-audio">
  <source src="/vite.mp3" type="audio/mpeg">
</audio>

## Введение {#overview}

Vite (французское слово, означающее «быстрый», произносится `/vit/`<button style="border:none;padding:3px;border-radius:4px;vertical-align:bottom" id="play-vite-audio" onclick="document.getElementById('vite-audio').play();"><svg style="height:2em;width:2em"><use href="/voice.svg#voice" /></svg ></button>, как «вит») — это инструмент сборки, цель которого — обеспечить более быструю и удобную разработку современных веб-проектов. Он состоит из двух основных частей:

- Сервер разработки, обеспечивающий [расширенные возможности](./features) по сравнению со [встроенными ES-модулями](https://developer.mozilla.org/ru/docs/Web/JavaScript/Guide/Modules), например, чрезвычайно быструю [горячую замену модулей (HMR)](./features#hot-module-replacement).

- Команда сборки, которая объединяет ваш код с [Rollup](https://rollupjs.org), предварительно настроенным для вывода высоко оптимизированных статических ресурсов для продакшен-версии.

Vite имеет определённые предпочтения и поставляется с разумными настройками «из коробки». Ознакомьтесь с возможностями в [соответствующей главе](./features). Поддержка фреймворков или интеграция с другими инструментами возможна через [Плагины](./using-plugins). Глава [Конфигурация](../config/) объясняет, как адаптировать Vite под ваш проект, если это необходимо.

Vite также обладает высокой расширяемостью благодаря своим [Plugin API](./api-plugin) и [JavaScript API](./api-javascript) с полной поддержкой типизации.

Вы можете узнать больше о причинах создания проекта в главе [Почему Vite](./why).

## Поддержка браузеров {#browser-support}

В режиме разработки Vite использует [`esnext` в качестве целевого формата трансформации](https://esbuild.github.io/api/#target), так как мы исходим из того, что используется современный браузер, поддерживающий все последние функции JavaScript и CSS. Это предотвращает понижение синтаксиса, позволяя Vite подавать браузеру модули максимально близко к исходному коду.

Для продакшен-сборок Vite по умолчанию ориентируется на [базовые](https://web-platform-dx.github.io/web-features/) широко распространённые браузеры. Это браузеры, выпущенные не менее 2,5 лет назад. Целевую версию можно понизить через конфигурацию. Кроме того, поддержка устаревших браузеров возможна с использованием официального плагина [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy). Подробности смотрите в разделе [Продакшен-сборка](./build).

## Попробуйте Vite онлайн {#trying-vite-online}

Вы можете поэкспериментировать с Vite на сайте [StackBlitz](https://vite.new/). Ваша сборка на основе Vite будет запущена прямо в браузере, поэтому она будет почти идентична локальной, но при этом не потребует установки чего-либо в вашей системе. Вы можете перейти по адресу `vite.new/{template}`, чтобы выбрать используемый фреймворк.

Поддерживаемые пресеты шаблонов:

|             JavaScript              |                TypeScript                 |
| :---------------------------------: | :---------------------------------------: |
| [vanilla](https://vite.new/vanilla) | [vanilla-ts](https://vite.new/vanilla-ts) |
|     [vue](https://vite.new/vue)     |     [vue-ts](https://vite.new/vue-ts)     |
|   [react](https://vite.new/react)   |   [react-ts](https://vite.new/react-ts)   |
|  [preact](https://vite.new/preact)  |  [preact-ts](https://vite.new/preact-ts)  |
|     [lit](https://vite.new/lit)     |     [lit-ts](https://vite.new/lit-ts)     |
|  [svelte](https://vite.new/svelte)  |  [svelte-ts](https://vite.new/svelte-ts)  |
|   [solid](https://vite.new/solid)   |   [solid-ts](https://vite.new/solid-ts)   |
|    [qwik](https://vite.new/qwik)    |    [qwik-ts](https://vite.new/qwik-ts)    |

## Создание первого проекта на Vite {#scaffolding-your-first-vite-project}

::: tip Примечание по совместимости
Для работы Vite требуется [Node.js](https://nodejs.org/en/) версии 20.19+, 22.12+. Однако некоторые шаблоны требуют более высокой версии Node.js для работы. Пожалуйста, обновите их, если ваш менеджер пакетов предупреждает об этом.
:::

::: code-group

```bash [NPM]
$ npm create vite@latest
```

```bash [Yarn]
$ yarn create vite
```

```bash [PNPM]
$ pnpm create vite
```

```bash [Bun]
$ bun create vite
```

```bash [Deno]
$ deno init --npm vite
```

:::

Затем следуйте подсказкам!

Вы также можете напрямую указать имя проекта и шаблон, который хотите использовать, с помощью дополнительных опций командной строки. Например, чтобы создать проект Vite + Vue, выполните команду:

::: code-group

```bash [NPM]
# с npm 7+ необходимо дополнительное двойное тире:
$ npm create vite@latest my-vue-app -- --template vue
```

```bash [Yarn]
$ yarn create vite my-vue-app --template vue
```

```bash [PNPM]
$ pnpm create vite my-vue-app --template vue
```

```bash [Bun]
$ bun create vite my-vue-app --template vue
```

```bash [Deno]
$ deno init --npm vite my-vue-app --template vue
```

:::

Более подробную информацию о каждом поддерживаемом шаблоне см. в [create-vite](https://github.com/vitejs/vite/tree/main/packages/create-vite): `vanilla`, `vanilla-ts`, `vue`, `vue-ts`, `react`, `react-ts`, `react-swc`, `react-swc-ts`, `preact`, `preact-ts`, `lit`, `lit-ts`, `svelte`, `svelte-ts`, `solid`, `solid-ts`, `qwik`, `qwik-ts`.

Вы можете использовать `.` в качестве имени проекта для создания шаблона в текущем каталоге.

## Шаблоны сообщества {#community-templates}

create-vite — это инструмент для быстрого запуска проекта из базового шаблона для популярных фреймворков. Посмотрите на Awesome Vite [шаблоны, поддерживаемые сообществом](https://github.com/vitejs/awesome-vite#templates), которые включают другие инструменты или ориентированы на другие фреймворки.

Если шаблон находится по адресу `https://github.com/user/project`, вы можете опробовать его онлайн, используя `https://github.stackblitz.com/user/project` (добавив `.stackblitz` после `github` в URL-адресе проекта).

Вы также можете использовать такой инструмент, как [degit](https://github.com/Rich-Harris/degit), чтобы скомпоновать свой проект с одним из шаблонов. Предполагая, что проект находится на GitHub и использует `main` в качестве ветки по умолчанию, вы можете создать локальную копию, используя следующие команды:

```bash
npx degit user/project#main my-project
cd my-project

npm install
npm run dev
```

## Ручная установка {#manual-installation}

В своем проекте вы можете установить инструмент командной строки `vite`, используя:

::: code-group

```bash [NPM]
$ npm install -D vite
```

```bash [Yarn]
$ yarn add -D vite
```

```bash [PNPM]
$ pnpm add -D vite
```

```bash [Bun]
$ bun add -D vite
```

```bash [Deno]
$ deno add -D npm:vite
```

:::

Затем создайте файл `index.html`:

```html
<p>Привет, Vite!</p>
```

И, наконец, запустите соответствующую команду CLI в терминале:

::: code-group

```bash [NPM]
$ npx vite
```

```bash [Yarn]
$ yarn vite
```

```bash [PNPM]
$ pnpm vite
```

```bash [Bun]
$ bunx vite
```

```bash [Deno]
$ deno run -A npm:vite
```

:::

`index.html` будет обслуживаться по адресу `http://localhost:5173`.

## `index.html` и корень проекта {#index-html-and-project-root}

Вы могли заметить, что в проекте Vite `index.html` находится в корневой директории, а не спрятан внутри `public`. Это сделано намеренно: во время разработки Vite является сервером, а `index.html` — точкой входа в ваше приложение.

Vite рассматривает `index.html` как исходный код и часть графа модулей. Он разрешает `<script type="module" src="...">`, который ссылается на ваш исходный код JavaScript. Даже встроенные `<script type="module">` и CSS, на которые ссылаются через `<link href>`, также будут обработаны с помощью Vite. Кроме того, URL-адреса внутри `index.html` автоматически перестраиваются, поэтому нет необходимости в специальных заглушках вида `%PUBLIC_URL%`.

Подобно статическим http-серверам, Vite имеет концепцию «корневого каталога», с которого обрабатываются ваши файлы. Во всей остальной документации вы увидите ссылки на него как на `<root>`. Абсолютные URL-адреса в вашем исходном коде будут разрешаться с использованием корня проекта в качестве базы, поэтому вы можете писать код так, как будто работаете с обычным статическим файловым сервером (только гораздо мощнее!). Vite также способен работать с зависимостями, которые расположены вне корня текущего проекта, что делает его пригодным для использования даже в системе, основанной на монорепозитории (`packages/a` может ссылаться на `packages/b`).

Vite также поддерживает [многостраничные приложения](./build#multi-page-app) с несколькими точками входа `.html`.

#### Указание альтернативной корневой директории {#specifying-alternative-root}

Запуск `vite` запускает dev-сервер, используя текущий каталог в качестве корневого. Вы можете указать альтернативную корневую директорию с помощью `vite serve some/sub/dir`.
Обратите внимание, что Vite также разрешит [свой файл конфигурации (т. е. `vite.config.js`)](/config/#configuring-vite) в корне проекта, поэтому вам нужно будет переместить его, если корень будет изменён.

## Интерфейс командной строки {#command-line-interface}

В проекте, где установлен Vite, вы можете использовать бинарный файл `vite` в своих npm-скриптах или запускать его напрямую с помощью `npx vite`. Вот стандартные скрипты npm в проекте Vite:

<!-- prettier-ignore -->
```json
{
  "scripts": {
    "dev": "vite", // запуск dev-сервера, псевдонимы: `vite dev`, `vite serve`
    "build": "vite build", // продакшен-сборка
    "preview": "vite preview" // локальный предварительный просмотр продакшен-сборки
  }
}
```

Вы можете указать дополнительные опции CLI, такие как `--port` или `--open`. Для получения полного списка опций CLI выполните команду `npx vite --help` в вашем проекте.

Подробнее об [Интерфейсе командной строки](./cli.md)

## Использование невыпущенных коммитов {#using-unreleased-commits}

Если вы не можете дождаться нового релиза, чтобы протестировать последние функции, вы можете установить конкретный коммит Vite с помощью https://pkg.pr.new:

::: code-group

```bash [npm]
$ npm install -D https://pkg.pr.new/vite@SHA
```

```bash [Yarn]
$ yarn add -D https://pkg.pr.new/vite@SHA
```

```bash [pnpm]
$ pnpm add -D https://pkg.pr.new/vite@SHA
```

```bash [Bun]
$ bun add -D https://pkg.pr.new/vite@SHA
```

```bash [Deno]
$ deno add -D https://pkg.pr.new/vite@SHA
```

:::

Замените `SHA` на любой из [SHA коммитов Vite](https://github.com/vitejs/vite/commits/main/). Обратите внимание, что будут работать только коммиты за последний месяц, так как более старые коммиты удаляются.

В качестве альтернативы вы также можете клонировать [репозиторий Vite](https://github.com/vitejs/vite) на свой локальный компьютер, а затем собрать и связать его самостоятельно (требуется [pnpm](https://pnpm.io/)):

```bash
git clone https://github.com/vitejs/vite.git
cd vite
pnpm install
cd packages/vite
pnpm run build
pnpm link --global # используйте предпочитаемый менеджер пакетов для этого шага
```

Затем перейдите к проекту, основанному на Vite, и запустите `pnpm link --global vite` (или менеджер пакетов, который вы использовали для глобального объединения `vite`). Теперь перезапустите dev-сервер, чтобы оказаться на острие атаки!

::: tip Зависимости, использующие Vite
Чтобы заменить версию Vite, используемую зависимостями транзитивно, вы должны использовать [npm overrides](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#overrides) или [pnpm overrides](https://pnpm.io/package_json#pnpmoverrides).
:::

## Сообщество {#community}

Если у вас есть вопросы или вам нужна помощь, обращайтесь к сообществу в [Discord](https://chat.vite.dev) и в [обсуждениях на GitHub](https://github.com/vitejs/vite/discussions).
