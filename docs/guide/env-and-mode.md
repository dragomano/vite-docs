# Переменные окружения и режимы {#env-variables-and-modes}

## Переменные окружения {#env-variables}

Vite предоставляет переменные окружения через специальный объект **`import.meta.env`**, которые статически заменяются во время сборки. Некоторые встроенные переменные доступны во всех случаях:

- **`import.meta.env.MODE`**: {string} режим, в котором работает приложение ([mode](#modes)).

- **`import.meta.env.BASE_URL`**: {string} базовый URL, с которого обслуживается приложение. Это определяется с помощью [опции конфигурации `base`](/config/shared-options.md#base).

- **`import.meta.env.PROD`**: {boolean} указывает, работает ли приложение в продакшен-режиме (работает ли dev-сервер с `NODE_ENV='production'` или приложение, собранное с `NODE_ENV='production'`).

- **`import.meta.env.DEV`**: {boolean} указывает, работает ли приложение в режиме разработки (всегда противоположно `import.meta.env.PROD`).

- **`import.meta.env.SSR`**: {boolean} указывает, работает ли приложение в [серверном режиме](./ssr.md#conditional-logic).

## Файлы `.env` {#env-files}

Vite использует [dotenv](https://github.com/motdotla/dotenv) для загрузки дополнительных переменных окружения из следующих файлов в вашем [каталоге окружения](/config/shared-options.md#envdir):

```
.env                # загружается во всех случаях
.env.local          # загружается во всех случаях, игнорируется git
.env.[mode]         # загружается только в указанном режиме
.env.[mode].local   # загружается только в указанном режиме, игнорируется git
```

:::tip Приоритеты загрузки переменных окружения

Файл переменных окружения для конкретного режима (например, `.env.production`) имеет более высокий приоритет, чем общий файл (например, `.env`).

Vite всегда будет загружать `.env` и `.env.local`, а также файлы, специфичные для режима, в формате `.env.[mode]`. Переменные, объявленные в файлах, специфичных для режима, будут иметь приоритет над переменными в общих файлах, но переменные, определённые только в `.env` или `.env.local`, всё равно будут доступны в окружении.

Кроме того, переменные окружения, которые уже существуют на момент выполнения Vite, имеют наивысший приоритет и не будут перезаписаны файлами `.env`. Например, при выполнении `VITE_SOME_KEY=123 vite build`.

Файлы `.env` загружаются в начале работы Vite. Перезапустите сервер после внесения изменений.
:::

Загруженные переменные окружения также доступны в вашем клиентском исходном коде через `import.meta.env` в виде строк.

Чтобы предотвратить случайное утечку переменных окружения в клиентский код, только переменные, начинающиеся с префикса `VITE_`, доступны в вашем коде, обработанном Vite. Например, для следующих переменных окружения:

```
VITE_SOME_KEY=123
DB_PASSWORD=foobar
```

Только `VITE_SOME_KEY` будет доступен как `import.meta.env.VITE_SOME_KEY` в вашем клиентском исходном коде, но `DB_PASSWORD` не будет доступен.

```js
console.log(import.meta.env.VITE_SOME_KEY) // "123"
console.log(import.meta.env.DB_PASSWORD) // undefined
```

:::tip Парсинг переменных окружения

Как показано выше, `VITE_SOME_KEY` является числом, но возвращает строку при парсинге. То же самое произойдёт и с булевыми переменными окружения. Убедитесь, что вы преобразуете в нужный тип при использовании в вашем коде.
:::

Кроме того, Vite использует [dotenv-expand](https://github.com/motdotla/dotenv-expand) для расширения переменных из коробки. Чтобы узнать больше о синтаксисе, ознакомьтесь с [их документацией](https://github.com/motdotla/dotenv-expand#what-rules-does-the-expansion-engine-follow).

Обратите внимание, что если вы хотите использовать `$` внутри значения вашей переменной окружения, вам нужно экранировать его с помощью `\`:

```
KEY=123
NEW_KEY1=test$foo   # test
NEW_KEY2=test\$foo  # test$foo
NEW_KEY3=test$KEY   # test123
```

Если вы хотите настроить префикс переменных окружения, посмотрите опцию [envPrefix](/config/shared-options.html#envprefix).

:::warning ЗАМЕТКИ ПО БЕЗОПАСНОСТИ

- Файлы `.env.*.local` являются локальными и могут содержать конфиденциальные переменные. Вам следует добавить `*.local` в ваш `.gitignore`, чтобы избежать их добавления в git.

- Поскольку любые переменные, доступные в вашем исходном коде Vite, окажутся в вашем клиентском пакете, переменные `VITE_*` _не должны_ содержать конфиденциальную информацию.
  :::

### IntelliSense для TypeScript {#intellisense-for-typescript}

По умолчанию Vite предоставляет определения типов для `import.meta.env` в [`vite/client.d.ts`](https://github.com/vitejs/vite/blob/main/packages/vite/client.d.ts). Хотя вы можете определить дополнительные пользовательские переменные окружения в файлах `.env.[mode]`, вы можете захотеть получить IntelliSense TypeScript для пользовательских переменных окружения, которые начинаются с префикса `VITE_`.

Чтобы достичь этого, можно создать файл `vite-env.d.ts` в каталоге `src`, а затем дополнить `ImportMetaEnv` следующим образом:

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // больше переменных окружения...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

Если ваш код зависит от типов из браузерных сред, таких как [DOM](https://github.com/microsoft/TypeScript/blob/main/src/lib/dom.generated.d.ts) и [WebWorker](https://github.com/microsoft/TypeScript/blob/main/src/lib/webworker.generated.d.ts), вы можете обновить поле [lib](https://www.typescriptlang.org/tsconfig#lib) в `tsconfig.json`.

```json
{
  "lib": ["WebWorker"]
}
```

:::warning Импорты нарушат расширение типов

Если расширение `ImportMetaEnv` не работает, убедитесь, что в `vite-env.d.ts` нет никаких операторов `import`. См. [документацию TypeScript](https://www.typescriptlang.org/docs/handbook/2/modules.html#how-javascript-modules-are-defined) для получения дополнительной информации.
:::

## Замена переменных окружения в HTML {#html-env-replacement}

Vite также поддерживает замену переменных окружения в HTML-файлах. Любые свойства из `import.meta.env` могут использоваться в HTML-файлах с помощью специального синтаксиса `%ENV_NAME%`:

```html
<h1>Vite работает в режиме %MODE%</h1>
<p>Используются данные из %VITE_API_URL%</p>
```

Если переменная окружения не существует в `import.meta.env`, например, `%NON_EXISTENT%`, она будет проигнорирована и не заменена, в отличие от `import.meta.env.NON_EXISTENT` в JS, где она заменяется на `undefined`.

Учитывая, что Vite используется многими фреймворками, он намеренно не навязывает сложные замены, такие как условные операторы. Vite можно расширить с помощью [существующего пользовательского плагина](https://github.com/vitejs/awesome-vite#transformers) или пользовательского плагина, который реализует [хук `transformIndexHtml`](./api-plugin#transformindexhtml).

## Режимы {#modes}

По умолчанию dev-сервер (команда `dev`) работает в режиме `development`, а команда `build` работает в режиме `production`.

Это означает, что при выполнении `vite build` будут загружены переменные окружения из `.env.production`, если такой файл существует:

```
# .env.production
VITE_APP_TITLE=Мое приложение
```

В вашем приложении вы можете отобразить заголовок, используя `import.meta.env.VITE_APP_TITLE`.

В некоторых случаях вы можете захотеть выполнить `vite build` с другим режимом, чтобы отобразить другой заголовок. Вы можете переопределить режим по умолчанию, используемый для команды, передав флаг `--mode`. Например, если вы хотите собрать ваше приложение для режима предварительной проверки («staging»):

```bash
vite build --mode staging
```

И создайте файл `.env.staging`:

```
# .env.staging
VITE_APP_TITLE=Мое приложение (staging)
```

Поскольку `vite build` по умолчанию собирает продакшен-сборку, вы также можете изменить это и собрать сборку для разработки, используя другой режим и конфигурацию файлов `.env`:

```
# .env.testing
NODE_ENV=development
```

## NODE_ENV и режимы {#node-env-and-modes}

Важно отметить, что `NODE_ENV` (`process.env.NODE_ENV`) и режимы — это два разных понятия. Вот как различные команды влияют на `NODE_ENV` и режим:

| Команда                                              | NODE_ENV        | Режим            |
| ---------------------------------------------------- | --------------- | --------------- |
| `vite build`                                         | `"production"`  | `"production"`  |
| `vite build --mode development`                      | `"production"`  | `"development"` |
| `NODE_ENV=development vite build`                    | `"development"` | `"production"`  |
| `NODE_ENV=development vite build --mode development` | `"development"` | `"development"` |

Разные значения `NODE_ENV` и режима также отражаются на соответствующих свойствах `import.meta.env`:

| Команда                | `import.meta.env.PROD` | `import.meta.env.DEV` |
| ---------------------- | ---------------------- | --------------------- |
| `NODE_ENV=production`  | `true`                 | `false`               |
| `NODE_ENV=development` | `false`                | `true`                |
| `NODE_ENV=other`       | `false`                | `true`                |

| Команда              | `import.meta.env.MODE` |
| -------------------- | ---------------------- |
| `--mode production`  | `"production"`         |
| `--mode development` | `"development"`        |
| `--mode staging`     | `"staging"`            |

:::tip `NODE_ENV` в `.env`-файлах

`NODE_ENV=...` можно установить в команде, а также в вашем файле `.env`. Если `NODE_ENV` указано в файле `.env.[mode]`, режим может быть использован для управления его значением. Однако `NODE_ENV` и режимы остаются двумя разными понятиями.

Основное преимущество использования `NODE_ENV=...` в команде заключается в том, что это позволяет Vite рано обнаружить значение. Это также позволяет вам читать `process.env.NODE_ENV` в вашей конфигурации Vite, так как Vite может загружать файлы окружения только после анализа конфигурации.
:::
