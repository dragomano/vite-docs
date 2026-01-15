---
layout: page
title: Знакомство с командой
description: Разработкой Vite руководит международная команда.
---

<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamPageSection,
  VPTeamMembers
} from '@voidzero-dev/vitepress-theme'
import { core, emeriti } from './_data/team'
</script>

<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>Знакомство с командой</template>
    <template #lead>
      Разработкой Vite занимается международная команда,
      некоторые участники которой представлены ниже.
    </template>
  </VPTeamPageTitle>
  <VPTeamMembers :members="core" />
  <VPTeamPageSection>
    <template #title>Почётная команда</template>
    <template #lead>
      Здесь мы отмечаем участников команды, которые уже не активны, но внесли ценный вклад в прошлом.
    </template>
    <template #members>
      <VPTeamMembers size="small" :members="emeriti" />
    </template>
  </VPTeamPageSection>
</VPTeamPage>
