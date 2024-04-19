<script setup lang="ts">
import { getStoryWorksMyWork } from '~/api'
import type { StoryWork } from '~/types/story-gallery'

const storyWorks = ref<StoryWork[]>()

onMounted(async () => {
  storyWorks.value = await getStoryWorksMyWork()
})
</script>

<template>
  <div class="my-works">
    <div
      class="story-work-list"
      grid="~ cols-1 justify-center" gap-2
      sm:grid="cols-1"
      md:grid="cols-1"
      lg:grid="cols-2"
      xl:grid="cols-3"
      xxl:grid="cols-4"
    >
      <MyWorkCard v-for="storyWork in storyWorks" :key="storyWork.id" v-bind="storyWork" grid-justify-self-center />
    </div>
  </div>
</template>
