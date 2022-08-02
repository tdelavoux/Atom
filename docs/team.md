---
layout: page
---

<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamMembers
} from 'vitepress/theme'

const members = [
  {
    avatar: 'https://github.com/tdelavoux.png',
    name: 'Thibault',
    title: 'Creator',
    links: [
      { icon: 'github', link: 'https://github.com/tdelavoux' },
    ]
  },
  {
    avatar: 'https://github.com/nathanaelhoun.png',
    name: 'Nathanaël',
    title: 'Contributor',
    links: [
      {icon: 'github', link: 'https://github.com/nathanaelhoun'}
    ]
  },
   {
    avatar: 'https://github.com/asturo.png',
    name: 'Arthur',
    title: 'Contributor',
    links: [
      {icon: 'github', link: 'https://github.com/Asturo'}
    ]
  }
]
</script>

<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>
      Our Team
    </template>
    <template #lead>
      The development of Atom is pushed by these people, when they feel they are in the mood
    </template>
  </VPTeamPageTitle>
  <VPTeamMembers
    :members="members"
  />
</VPTeamPage>
