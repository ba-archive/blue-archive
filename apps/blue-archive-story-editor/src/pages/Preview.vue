<script setup lang="ts">
import 'ba-story-player/dist/style.css'
import BaStoryPlayer from 'ba-story-player'
import { ref } from 'vue'

const playerWidth = ref(750)
const playerHeight = ref(400)
const storySummary = {
  chapterName: '章节名',
  summary: '从奇怪的梦中醒来之后的[USERNAME]老师从联邦学生会的干部七神凛那里听到学生会长失踪的消息。由于学生会长失踪，学园城市基沃托斯陷入了混乱。为了解决这场混乱，老师和学生会的干部一同前往夏莱办公室。',
}
const playerContainerStyle = computed(() => ({
  width: `${playerWidth.value}px`,
  height: `${playerHeight.value}px`,
}))

const code = ref('{}')
const playerVIf = ref(false)

function reloadPlayer() {
  playerVIf.value = false
  nextTick(() => {
    playerVIf.value = true
  })
}
</script>

<template>
  <div id="editor" :style="{}" flex="~ justify-center" border="~ 1 red" children:border="~ 1 blue" h-full min-w-6xl children-overflow-hidden>
    <div>
      <div :style="playerContainerStyle">
        <BaStoryPlayer
          v-if="playerVIf"
          class="player-container"
          data-url="https://yuuka.cdn.diyigemt.com/image/ba-all-data"
          language="Cn"
          user-name="sensei"
          use-super-sampling=""
          :story="jloads(code)"
          :story-summary="storySummary"
          :width="playerWidth"
          :height="playerHeight"
          :exit-fullscreen-time-out="5000"
        />
      </div>
      <button btn @click="reloadPlayer">
        reload
      </button>
    </div>
    <div flex-1>
      <JSONEditor v-model:code="code" />
    </div>
  </div>
</template>
