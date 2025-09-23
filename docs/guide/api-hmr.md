# HMR API {#hmr-api}

:::tip Примечание
Это API для работы с HMR на стороне клиента. Чтобы управлять обновлениями HMR в плагинах, смотрите [handleHotUpdate](./api-plugin#handlehotupdate).

Интерфейс управления HMR предназначен в основном для разработчиков фреймворков и инструментов. Если вы обычный разработчик, то, скорее всего, HMR уже настроен за вас в стартовых шаблонах для вашего фреймворка.
:::

Vite предоставляет собственный интерфейс управления HMR через специальный объект `import.meta.hot`:

```ts twoslash
import type { ModuleNamespace } from 'vite/types/hot.d.ts'
import type {
  CustomEventName,
  InferCustomEventPayload,
} from 'vite/types/customEvent.d.ts'

// ---cut---
interface ImportMeta {
  readonly hot?: ViteHotContext
}

interface ViteHotContext {
  readonly data: any

  accept(): void
  accept(cb: (mod: ModuleNamespace | undefined) => void): void
  accept(dep: string, cb: (mod: ModuleNamespace | undefined) => void): void
  accept(
    deps: readonly string[],
    cb: (mods: Array<ModuleNamespace | undefined>) => void,
  ): void

  dispose(cb: (data: any) => void): void
  prune(cb: (data: any) => void): void
  invalidate(message?: string): void

  on<T extends CustomEventName>(
    event: T,
    cb: (payload: InferCustomEventPayload<T>) => void,
  ): void
  off<T extends CustomEventName>(
    event: T,
    cb: (payload: InferCustomEventPayload<T>) => void,
  ): void
  send<T extends CustomEventName>(
    event: T,
    data?: InferCustomEventPayload<T>,
  ): void
}
```

## Обязательная проверка {#required-conditional-guard}

Прежде всего, убедитесь, что вы защищаете все использования HMR API условным блоком, чтобы код мог быть удалён в продакшен-сборке:

```js
if (import.meta.hot) {
  // код HMR
}
```

## IntelliSense для TypeScript {#intellisense-for-typescript}

Vite предоставляет определения типов для `import.meta.hot` в [`vite/client.d.ts`](https://github.com/vitejs/vite/blob/main/packages/vite/client.d.ts). Вы можете добавить `vite/client` в `tsconfig.json`, чтобы TypeScript подхватил определения типов:

```json [tsconfig.json]
{
  "compilerOptions": {
    "types": ["vite/client"]
  }
}
```

## `hot.accept(cb)`

Чтобы модуль мог принимать обновления сам, используйте `import.meta.hot.accept` с функцией обратного вызова, который получает обновлённый модуль:

```js twoslash
import 'vite/client'
// ---cut---
export const count = 1

if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    if (newModule) {
      // newModule не определён, когда произошла ошибка SyntaxError
      console.log('обновлено: count = ', newModule.count)
    }
  })
}
```

Модуль, который «принимает» горячие обновления, считается **границей HMR**.

HMR в Vite на самом деле не заменяет изначально импортированный модуль: если модуль границы HMR повторно экспортирует импорты из зависимости, то он отвечает за обновление этих повторных экспортов (и эти экспорты должны использовать `let`). Кроме того, импортеры выше по цепочке от модуля границы не будут уведомлены об изменении. Эта упрощённая реализация HMR достаточна для большинства случаев использования в разработке, позволяя нам избежать дорогостоящей работы по созданию прокси-модулей.

Vite требует, чтобы вызов этой функции выглядел как `import.meta.hot.accept(` (чувствительно к пробелам) в исходном коде, чтобы модуль мог принимать обновления. Это требование статического анализа, который Vite выполняет для включения поддержки HMR для модуля.

## `hot.accept(deps, cb)`

Модуль также может принимать обновления от прямых зависимостей без перезагрузки самого себя:

```js twoslash
// @filename: /foo.d.ts
export declare const foo: () => void

// @filename: /example.js
import 'vite/client'
// ---cut---
import { foo } from './foo.js'

foo()

if (import.meta.hot) {
  import.meta.hot.accept('./foo.js', (newFoo) => {
    // функция обратного вызова получает обновлённый модуль './foo.js'
    newFoo?.foo()
  })

  // Также может принимать массив зависимых модулей:
  import.meta.hot.accept(
    ['./foo.js', './bar.js'],
    ([newFooModule, newBarModule]) => {
      // Функция обратного вызова получает массив, в котором только обновлённый модуль является
      // ненулевым. Если обновление не было успешным (например, из-за синтаксической ошибки),
      // массив будет пустым
    },
  )
}
```

## `hot.dispose(cb)`

Самопринимающий модуль или модуль, который ожидает, что его примут другие, может использовать `hot.dispose` для очистки любых постоянных побочных эффектов, созданных его обновлённой копией:

```js twoslash
import 'vite/client'
// ---cut---
function setupSideEffect() {}

setupSideEffect()

if (import.meta.hot) {
  import.meta.hot.dispose((data) => {
    // очистка побочного эффекта
  })
}
```

## `hot.prune(cb)`

Регистрирует функцию обратного вызова, который будет вызван, когда модуль больше не импортируется на странице. В отличие от `hot.dispose`, это можно использовать, если исходный код сам очищает побочные эффекты при обновлениях, и вам нужно очистить только когда модуль удаляется со страницы. Vite в настоящее время использует это для импортов `.css`.

```js twoslash
import 'vite/client'
// ---cut---
function setupOrReuseSideEffect() {}

setupOrReuseSideEffect()

if (import.meta.hot) {
  import.meta.hot.prune((data) => {
    // очистка побочного эффекта
  })
}
```

## `hot.data`

Объект `import.meta.hot.data` сохраняется между разными экземплярами одного и того же обновлённого модуля. Он может быть использован для передачи информации от предыдущей версии модуля к следующей.

Обратите внимание, что повторное присвоение самого `data` не поддерживается. Вместо этого вы должны изменять свойства объекта `data`, чтобы информация, добавленная из других обработчиков, сохранялась.

```js twoslash
import 'vite/client'
// ---cut---
// ok
import.meta.hot.data.someValue = 'hello'

// не поддерживается
import.meta.hot.data = { someValue: 'hello' }
```

## `hot.decline()`

В настоящее время это не выполняет никаких действий и существует для обратной совместимости. В будущем это может измениться, если появится новое использование для этого. Чтобы указать, что модуль не может быть обновлён горячим способом, используйте `hot.invalidate()`.

## `hot.invalidate(message?: string)`

Самопринимающий модуль может во время выполнения понять, что он не может обработать обновление HMR, и поэтому обновление должно быть принудительно передано импортерам. Вызвав `import.meta.hot.invalidate()`, HMR сервер аннулирует импортеров вызывающего модуля, как если бы вызывающий модуль не был самопринимающим. Это приведёт к выводу сообщения как в консоли браузера, так и в терминале. Вы можете передать сообщение, чтобы дать контекст о том, почему произошло аннулирование.

Обратите внимание, что вы всегда должны вызывать `import.meta.hot.accept`, даже если планируете сразу же вызвать `invalidate`, иначе клиент HMR не будет слушать будущие изменения самопринимающего модуля. Чтобы чётко донести ваше намерение, мы рекомендуем вызывать `invalidate` внутри функции обратного вызова `accept`, как показано ниже:

```js twoslash
import 'vite/client'
// ---cut---
import.meta.hot.accept((module) => {
  // Вы можете использовать новый экземпляр модуля, чтобы решить, следует ли его аннулировать.
  if (cannotHandleUpdate(module)) {
    import.meta.hot.invalidate()
  }
})
```

## `hot.on(event, cb)`

Прослушивает событие HMR.

Следующие события HMR автоматически отправляются Vite:

- `'vite:beforeUpdate'` когда обновление собирается быть применено (например, модуль будет заменён)
- `'vite:afterUpdate'` когда обновление только что было применено (например, модуль был заменён)
- `'vite:beforeFullReload'` когда собирается произойти полная перезагрузка
- `'vite:beforePrune'` когда модули, которые больше не нужны, собираются быть удалены
- `'vite:invalidate'` когда модуль становится недействительным с помощью `import.meta.hot.invalidate()`
- `'vite:error'` когда происходит ошибка (например, синтаксическая ошибка)
- `'vite:ws:disconnect'` когда соединение WebSocket потеряно
- `'vite:ws:connect'` когда соединение WebSocket (пере-)установлено

Пользовательские события HMR также могут быть отправлены из плагинов. Смотрите [handleHotUpdate](./api-plugin#handlehotupdate) для получения дополнительных сведений.

## `hot.off(event, cb)`

Удаляет функцию обратного вызова из слушателей событий.

## `hot.send(event, data)`

Отправляет пользовательские события обратно на dev-сервер Vite.

Если вызов происходит до подключения, данные будут буферизованы и отправлены, как только соединение будет установлено.

Смотрите [Связь клиент-сервер](/guide/api-plugin.html#client-server-communication) для получения дополнительных сведений.

## Дополнительная информация {#further-reading}

Если вы хотите узнать больше о том, как использовать HMR API и как он работает изнутри, ознакомьтесь с этими ресурсами:

- [Горячая замена модулей проста](https://bjornlu.com/blog/hot-module-replacement-is-easy)
