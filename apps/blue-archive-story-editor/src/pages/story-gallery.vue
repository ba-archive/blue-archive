<script setup lang="ts">
import { getStoryWorks } from '~/api'
import type { StoryWork } from '~/types/story-gallery'

const storyWorks = ref<StoryWork[]>([])
onMounted(async () => {
  storyWorks.value = await getStoryWorks()
})
</script>

<template>
  <div class="story-gallery-page" flex="~ col" gap-2 of-x-hidden>
    <div>
      <NavHeader />
      <StoryWorkList :story-works="storyWorks" />
    </div>
  </div>
</template>
