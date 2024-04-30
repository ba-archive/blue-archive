<script setup lang="ts">
import BaStoryPlayer from 'ba-story-player'
import 'ba-story-player/dist/style.css'
import type { NexonJSONStory } from '~/types/story'

const props = defineProps<{
  story: NexonJSONStory
  summary: {
    chapterName: string
    summary: string
  }
}>()
const playerVIf = defineModel('vif', { required: false, default: false })

const storyPlayer = ref<HTMLDivElement>()
const { width, height } = useElementSize(storyPlayer)

function reloadPlayer() {
  playerVIf.value = false
  nextTick(() => {
    playerVIf.value = true
  })
}

watch(() => [props.story, props.summary], () => {
  reloadPlayer()
})

watchDebounced(
  () => [width.value, height.value],
  () => {
    reloadPlayer()
  },
  { debounce: 1000 },
)

defineExpose({
  reload: reloadPlayer,
  play: () => playerVIf.value = true,
  destroy: () => playerVIf.value = false,
})
</script>

<template>
  <div ref="storyPlayer" class="story-player" inline-block h630px w1120px of-hidden bg-gray-8>
    <BaStoryPlayer
      v-if="playerVIf"
      class="player-container"
      data-url="https://yuuka.cdn.diyigemt.com/image/ba-all-data"
      language="Cn"
      user-name="sensei"
      use-super-sampling=""
      :story="story"
      :story-summary="summary"
      :width="width"
      :height="height"
      :exit-fullscreen-time-out="5000"
    />
  </div>
</template>
