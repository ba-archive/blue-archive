<script setup lang="ts">
import { getStoryWorksMyWork } from '~/api'
import type { StoryWork } from '~/types/story-gallery'

const storyWorks = ref<StoryWork[]>()

onMounted(async () => {
  storyWorks.value = await getStoryWorksMyWork()
})
</script>

<template>
  <div
    class="story-work-list"
    grid="~ cols-1 justify-center" gap-2 overflow-y-auto
    sm:grid="cols-1"
    md:grid="cols-2"
    lg:grid="cols-3"
    xl:grid="cols-4"
    xxl:grid="cols-5"
  >
    <MyWorkCard
      v-for="storyWork, i in storyWorks" :key="storyWork.id"
      grid-justify-self-center v-model="storyWorks[i]"
    />
  </div>
</template>
