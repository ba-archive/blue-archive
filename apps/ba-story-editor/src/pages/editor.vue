<script setup lang="ts">
import BaStoryPlayer from 'ba-story-player'
import 'ba-story-player/dist/style.css'
import yuuka from './../../scripts/yuuka.json'
import { buildNexonScript } from './../common/nexon-script/parser'

const playerWidth = ref(750)
const playerHeight = ref(400)
const storySummary = {
  chapterName: '章节名',
  summary: '从奇怪的梦中醒来之后的[USERNAME]老师从联邦学生会的干部七神凛那里听到学生会长失踪的消息。由于学生会长失踪，学园城市基沃托斯陷入了混乱。为了解决这场混乱，老师和学生会的干部一同前往夏莱办公室。',
}
const story = yuuka

const playerContainerStyle = computed(() => ({
  width: `${playerWidth}px`,
  height: `${playerHeight}px`,
}))

// store
onMounted(async () => {
  const editorStore = useEditorStore()
  const nexonScriptEditorStore = useNexonScriptEditorStore()
  const nexonJSONStory = await editorStore.loadNexonJSONStory()
  if (nexonJSONStory.value)
    nexonScriptEditorStore.code = buildNexonScript(nexonJSONStory.value)
})
</script>

<template>
  <div id="editor" :style="{}" flex="~ justify-center" border="~ 1 red" children:border="~ 1 blue" h-full min-w-6xl children-overflow-hidden>
    <div :style="playerContainerStyle">
      <BaStoryPlayer
        class="player-container"
        data-url="https://yuuka.cdn.diyigemt.com/image/ba-all-data"
        language="Cn"
        user-name="sensei"
        use-super-sampling=""
        :story="story"
        :story-summary="storySummary"
        :width="playerWidth"
        :height="playerHeight"
        :exit-fullscreen-time-out="5000"
      />
    </div>
    <div flex-1>
      <NexonScriptEditor class="nexon-script-editor" />
    </div>
  </div>
</template>
../../scripts/yuuka.json../common/nexon-script/parser
