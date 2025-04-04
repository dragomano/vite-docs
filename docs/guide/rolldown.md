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
