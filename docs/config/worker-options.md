# Параметры воркера {#worker-options}

Если не указано иное, параметры, описанные в этом разделе, применяются ко всем процессам разработки, сборки и режима предварительного просмотра.

## worker.format

- **Тип:** `'es' | 'iife'`
- **По умолчанию:** `'iife'`

Формат вывода для сборки воркера.

## worker.plugins

- **Тип:** [`() => (Plugin | Plugin[])[]`](./shared-options#plugins)

Плагины Vite, которые применяются к сборкам воркеров. Обратите внимание, что [config.plugins](./shared-options#plugins) применяется только к воркерам в режиме разработки, поэтому их следует настраивать здесь для сборки.
Функция должна возвращать новые экземпляры плагинов, так как они используются в параллельных сборках воркеров Rollup. Таким образом, изменения опций `config.worker` в хуке `config` будут проигнорированы.

## worker.rolldownOptions

<!-- TODO: update the link below to Rolldown's documentation -->

- **Тип:** [`RolldownOptions`](https://rollupjs.org/configuration-options/)

Опции Rollup для сборки воркера.

## worker.rollupOptions

- **Тип:** `RolldownOptions`
- **Устарело**

Эта опция является псевдонимом `worker.rolldownOptions`. Используйте `worker.rolldownOptions` вместо неё.
