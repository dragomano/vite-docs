---
title: Благодарности
description: Vite стоит на плечах гигантов. Спасибо всем проектам и участникам, которые делают Vite возможным.
---

<script setup>
import { computed } from 'vue'
import { data } from './_data/acknowledgements.data'
import { useSponsor, voidZero } from './.vitepress/theme/composables/sponsor'
import VPSponsors from '@components/vitepress-default/VPSponsors.vue'

const { data: sponsorData } = useSponsor()

const allSponsors = computed(() => {
  if (!sponsorData.value) return []
  return [
    {
      tier: 'Предоставлено вам',
      size: 'big',
      items: [voidZero],
    },
    ...sponsorData.value,
  ]
})

function npmUrl(name) {
  return `https://npmx.dev/package/${name}`
}
</script>

# Благодарности {#acknowledgements}

Vite стоит на плечах гигантов. Мы хотим выразить огромную благодарность всем проектам, участникам и спонсорам, которые делают Vite возможным.

## Участники {#contributors}

Vite разрабатывается международной командой участников. Ознакомьтесь со [страницей команды](/team), чтобы познакомиться с основными членами команды.

Мы также благодарим всех [участников на GitHub](https://github.com/vitejs/vite/graphs/contributors), которые помогали улучшать Vite через код, сообщения об ошибках, документацию и переводы документации.

## Спонсоры {#sponsors}

Разработка Vite поддерживается щедрыми спонсорами. Вы можете поддержать Vite через [GitHub Sponsors](https://github.com/sponsors/vitejs) или [Open Collective](https://opencollective.com/vite).

<div class="sponsors-container">
  <VPSponsors :data="allSponsors" />
</div>

## Зависимости {#dependencies}

Vite зависит от этих замечательных проектов с открытым исходным кодом:

### Основные зависимости {#notable-dependencies}

<div class="deps-list notable">
  <div v-for="dep in data.notableDependencies" :key="dep.name" class="dep-item">
    <div class="dep-header">
      <a :href="npmUrl(dep.name)" target="_blank" rel="noopener"><code>{{ dep.name }}</code></a>
      <span class="dep-links">
        <a v-if="dep.repository" :href="dep.repository" target="_blank" rel="noopener" class="dep-link">Репозиторий</a>
        <a v-if="dep.funding" :href="dep.funding" target="_blank" rel="noopener" class="dep-link sponsor">Поддержать</a>
      </span>
    </div>
    <p v-if="dep.author" class="dep-author">
      <a v-if="dep.authorUrl" :href="dep.authorUrl" target="_blank" rel="noopener">{{ dep.author }}</a><template v-else>{{ dep.author }}</template>
    </p>
    <p v-if="dep.description">{{ dep.description }}</p>
  </div>
</div>

### Авторы входящих в сборку зависимостей {#bundled-dependency-authors}

<table class="authors-table">
  <thead>
    <tr>
      <th>Автор</th>
      <th>Пакеты</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="author in data.authors" :key="author.name">
      <td>
        <a v-if="author.url" :href="author.url" target="_blank" rel="noopener">{{ author.name }}</a>
        <template v-else>{{ author.name }}</template>
        <a v-if="author.funding" :href="author.funding" target="_blank" rel="noopener" class="sponsor-link">Поддержать</a>
      </td>
      <td>
        <template v-for="(pkg, index) in author.packages" :key="pkg.name">
          <span class="pkg-item"><a :href="npmUrl(pkg.name)" target="_blank" rel="noopener"><code>{{ pkg.name }}</code></a><a v-if="pkg.funding" :href="pkg.funding" target="_blank" rel="noopener" class="sponsor-link">Поддержать</a></span><template v-if="index < author.packages.length - 1">, </template>
        </template>
      </td>
    </tr>
  </tbody>
</table>

::: tip Для авторов пакетов
Этот раздел автоматически генерируется на основе полей `author` и `funding` в `package.json` каждого пакета. Если вы хотите обновить отображение вашего пакета здесь, вы можете изменить эти поля в своём пакете.
:::

## Инструменты разработки {#development-tools}

Рабочий процесс разработки в Vite обеспечивается следующими инструментами:

<div class="deps-list notable">
  <div v-for="dep in data.devTools" :key="dep.name" class="dep-item">
    <div class="dep-header">
      <a :href="npmUrl(dep.name)" target="_blank" rel="noopener"><code>{{ dep.name }}</code></a>
      <span class="dep-links">
        <a v-if="dep.repository" :href="dep.repository" target="_blank" rel="noopener" class="dep-link">Репозиторий</a>
        <a v-if="dep.funding" :href="dep.funding" target="_blank" rel="noopener" class="dep-link sponsor">Поддержать</a>
      </span>
    </div>
    <p v-if="dep.author" class="dep-author">
      <a v-if="dep.authorUrl" :href="dep.authorUrl" target="_blank" rel="noopener">{{ dep.author }}</a><template v-else>{{ dep.author }}</template>
    </p>
    <p v-if="dep.description">{{ dep.description }}</p>
  </div>
</div>

## Прошлые заметные зависимости {#past-notable-dependencies}

Мы также благодарим сопровождающих этих проектов, которые использовались в предыдущих версиях Vite:

<table>
  <thead>
    <tr>
      <th>Пакет</th>
      <th>Описание</th>
      <th>Ссылки</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="dep in data.pastNotableDependencies" :key="dep.name">
      <td><a :href="npmUrl(dep.name)" target="_blank" rel="noopener"><code>{{ dep.name }}</code></a></td>
      <td>{{ dep.description }}</td>
      <td><a :href="dep.repository" target="_blank" rel="noopener">Репозиторий</a></td>
    </tr>
  </tbody>
</table>

<style scoped>
.deps-list {
  display: grid;
  gap: 1rem;
  margin: 1rem 0;
}

.deps-list.notable {
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

.dep-item {
  padding: 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.dep-item .dep-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.dep-item a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.dep-item a:hover {
  text-decoration: underline;
}

.dep-item .dep-links {
  display: flex;
  gap: 0.5rem;
}

.dep-item .dep-link {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background: var(--vp-c-default-soft);
}

.dep-item .dep-author {
  margin: 0.25rem 0 0;
  color: var(--vp-c-text-2);
  font-size: 0.8rem;
}

.dep-item .dep-link.sponsor {
  background: var(--vp-c-brand-soft);
}

.dep-item p {
  margin: 0.5rem 0 0;
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
}

.authors-table .sponsor-link {
  margin-left: 0.5rem;
  font-size: 0.75rem;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.authors-table .sponsor-link:hover {
  text-decoration: underline;
}
</style>