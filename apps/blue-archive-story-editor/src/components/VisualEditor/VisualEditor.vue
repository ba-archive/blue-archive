<script setup lang="ts">
import 'ba-story-player/dist/style.css'
import BaStoryPlayer from 'ba-story-player'
import { buildNexonJSONStory } from '~/common/nexon-script/visual-editor'
import { StoryNodeType } from '~/types/visual-editor';

const store = useVisualEditorStore()

function handleAddCard() {
  store.newNode(StoryNodeType.CharacterNode)
}

const jsonStory = computed(() => {
  return buildNexonJSONStory(store.storyNodes)
})

const storySummary = {
  chapterName: '章节名',
  summary: '测试用剧情编辑器预览剧情',
}

const playerVIf = ref(false)
const player = ref<InstanceType<typeof BaStoryPlayer> | undefined>(undefined)
function reloadPlayer() {
  playerVIf.value = false
  nextTick(() => {
    playerVIf.value = true
  })
}
const playerWidth = 740
const playerHeight = 400
</script>

<template>
  <div class="visual-editor">
    <!-- <div class="toolbar">
      <button></button>
    </div> -->
    <div flex="~">
      <div class="story-node-list" inline-block bg-gray-1 p-3 children:m-b-3>
        <StoryCardContainer
          v-for="_, i in store.storyNodes" :key="store.storyNodes[i].id"
          v-model="store.storyNodes[i]"
        />
        <AddCard @click="handleAddCard" />
      <!-- <CharacterSelect v-model="selectedStudent" /> -->
      <!-- <StudentViewer :student="testStudent" /> -->
      </div>
      <div class="preview" flex="~ col" :style="{ width: `${playerWidth + 24}px` }" card>
        <div class="player-preview">
          <div class="toolbar" flex>
            <button btn @click="reloadPlayer">
              加载
            </button>
          </div>
          <div class="player-container" :style="{ height: `${playerHeight}px`, width: `${playerWidth}px` }" relative z-0>
            <BaStoryPlayer
              v-if="playerVIf"
              ref="player"
              class="player-container"
              data-url="https://yuuka.cdn.diyigemt.com/image/ba-all-data"
              language="Cn"
              user-name="sensei"
              use-super-sampling=""
              :story="jsonStory"
              :story-summary="storySummary"
              :width="playerWidth"
              :height="playerHeight"
              :exit-fullscreen-time-out="5000"
            />
          </div>
        </div>
        <JSONEditor :code="JSON.stringify(jsonStory, null, 2)" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
