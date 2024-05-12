<script setup lang="ts">
import { getStoryWork } from '~/api'
import { buildNexonJSONStory } from '~/common/visual-editor'
import type { NexonJSONStory } from '~/types/story'

const route = useRoute<'/player/[[id]]'>()

const story = ref<NexonJSONStory>({
  GroupId: 0,
  translator: '',
  content: [],
})

const storySummary = {
  chapterName: 'string',
  summary: 'string',
}

watchEffect(async () => {
  if (!route.params.id)
    return
  // todo use new api
  story.value = buildNexonJSONStory((await getStoryWork(route.params.id)).story.content)
})
</script>

<template>
  <div class="player-page" flex="~ col" h-100vh gap-2 of-x-hidden>
    <NavHeader />
    <div class="player-container" flex="1 ~ center">
      <StoryPlayer :story="story" :summary="storySummary" resize />
    </div>
  </div>
</template>
