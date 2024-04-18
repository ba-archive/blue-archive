<script setup lang="ts">
import { getStoryWorks } from '~/api'
import type { StoryWork } from '~/types/story-gallery'

const storyWorks = ref<StoryWork[]>([])
onMounted(async () => {
  storyWorks.value = await getStoryWorks()
})
</script>

<template>
  <div class="story-gallery" flex="~ col" gap-2>
    <NavHeader />
    <StoryWorkList :story-works="storyWorks" />
  </div>
</template>
