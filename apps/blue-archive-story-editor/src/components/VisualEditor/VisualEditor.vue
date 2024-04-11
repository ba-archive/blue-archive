<script setup lang="ts">
import 'ba-story-player/dist/style.css'
import BaStoryPlayer from 'ba-story-player'
import type { DropResult } from 'vue3-smooth-dnd'
import { Container, Draggable } from 'vue3-smooth-dnd'
import { buildNexonJSONStory } from '~/common/nexon-script/visual-editor'
import type { StoryNode } from '~/types/visual-editor'
import { StoryNodeType } from '~/types/visual-editor'

const store = useVisualEditorStore()

function handleAddCard() {
  store.newNode(StoryNodeType.CharacterNode)
}

function handleRemoveCard(node: StoryNode) {
  store.removeNode(node.id)
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

function applyCardDrag(dropResult: DropResult) {
  const fromId = store.storyNodes[dropResult.removedIndex].id
  const toId = store.storyNodes[dropResult.addedIndex].id
  store.moveNode(fromId, toId)
}

const dropPlaceholderOptions = {
  className: 'drop-preview',
  animationDuration: '150',
  showOnTop: true,
}
</script>

<template>
  <div class="visual-editor" h-100vh w-100vw flex="~ col">
    <div class="headbar" flex bg-white py1 border="~ b-1" shadow-sm>
      <div class="left" flex flex-1>
        <img src="/plana-studio.svg" alt="logo" class="logo" mx2 h-35px>
        <button border shadow-sm btn @click="reloadPlayer">
          运行
        </button>
      </div>
      <div class="right" flex="~ center">
        <a href="https://github.com/ba-archive/blue-archive/tree/dev-notype/apps/blue-archive-story-editor" target="_blank">
          <i text="gray-9 3xl" i-mdi:github align-top icon-btn />
        </a>
      </div>
    </div>
    <div flex="~ 1" w-full gap-2 p-2>
      <div class="preview" flex="~ col" :style="{ width: `${playerWidth + 24}px` }" card h-full>
        <div class="player-preview">
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
        <JSONEditor :code="JSON.stringify(jsonStory, null, 2)" flex-1 of-y-auto height="100%" />
      </div>
      <div flex-1 />
      <div class="story-node-list" inline-block card w27rem>
        <div flex="~ col" h-full bg-gray-1>
          <Container
            flex-1 of-x-hidden of-y-auto children:m-3 important:min-h-0
            :animation-duration="150"
            :drop-placeholder="dropPlaceholderOptions"
            drag-handle-selector=".drag-handle"
            non-drag-area-selector=".add-card"
            @drop="applyCardDrag"
          >
            <Draggable v-for="_, i in store.storyNodes" :key="store.storyNodes[i].id">
              <StoryCardContainer
                v-model="store.storyNodes[i]" @remove="handleRemoveCard(store.storyNodes[i])"
              />
            </Draggable>
          </Container>
          <AddCard m3 @click="handleAddCard" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.drop-preview {
  background-color: rgba(150, 150, 200, 0.1);
  border: 1px dashed #abc;
  margin: 5px;
}
</style>
