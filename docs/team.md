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
import { core, advisors, emeriti } from './_data/team'
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
    <template #title>Консультанты</template>
    <template #lead>
      Консультанты помогают направлять развитие Vite с точки зрения экосистемы,
      делясь своим опытом и участвуя в формировании Environment API и проектировании будущих API.
    </template>
    <template #members>
      <VPTeamMembers size="small" :members="advisors" />
    </template>
  </VPTeamPageSection>
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
