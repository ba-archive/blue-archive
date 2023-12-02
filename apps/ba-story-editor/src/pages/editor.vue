<script setup lang="ts">
import 'ba-story-player/dist/style.css'
import BaStoryPlayer from 'ba-story-player'
import { ref } from 'vue'
import { NexonScriptParser, buildNexonJSONStory, buildNexonScript } from './../common/nexon-script/parser'
import type { JSONStory, NexonJSONStory } from '~/types/story'

const editorStore = useEditorStore()

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

const nexonJSONStory = editorStore.loadNexonJSONStory()
const nexonScript = ref<string>('')
const jsonStory = ref<JSONStory>()
const generatedNexonJSONStory = ref<NexonJSONStory>()

type ViewType = 'njson' | 'ns' | 'story' | 'gnjson'
const currentView = ref<ViewType>('njson')
function onViewChange(viewType: ViewType) {
  currentView.value = viewType
  if (viewType === 'ns') {
    updateNS()
  }
  else if (viewType === 'story') {
    updateNS()
    updateStory()
  }
  else if (viewType === 'gnjson') {
    updateNS()
    updateStory()
    updateGNJSON()
  }
}

function onNJSONChange(code: string) {
  nexonJSONStory.value = JSON.parse(code)
  console.log(code)
}
function updateNS() {
  nexonScript.value = buildNexonScript(nexonJSONStory.value)
}
function updateStory() {
  const parser = new NexonScriptParser(nexonScript.value)
  jsonStory.value = parser.parseToJSONStory(nexonJSONStory.value.GroupId)
}
function updateGNJSON() {
  if (jsonStory.value)
    generatedNexonJSONStory.value = buildNexonJSONStory(jsonStory.value)
}
watchEffect(updateNS)
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
        :story="editorStore.nexonJSONStory"
        :story-summary="storySummary"
        :width="playerWidth"
        :height="playerHeight"
        :exit-fullscreen-time-out="5000"
      />
    </div>
    <div flex-1>
      <div flex="~" gap-3>
        <button @click="onViewChange('njson')">
          njson
        </button>
        <button @click="onViewChange('ns')">
          ns
        </button>
        <button @click="onViewChange('story')">
          story
        </button>
        <button @click="onViewChange('gnjson')">
          gnjson
        </button>
      </div>
      <div>
        <KeepAlive>
          <JSONEditor v-if="currentView === 'njson'" :code="jdumps(nexonJSONStory)" class="njson-editor" @update:code="onNJSONChange" />
          <NexonScriptEditor v-else-if="currentView === 'ns'" :code="nexonScript" class="ns-editor" />
          <JSONEditor v-else-if="currentView === 'story'" :code="jdumps(jsonStory)" class="story-editor" />
          <JSONEditor v-else-if="currentView === 'gnjson'" :code="jdumps(generatedNexonJSONStory)" class="gnjson-editor" />
        </KeepAlive>
      </div>
    </div>
  </div>
</template>
