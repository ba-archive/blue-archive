<script setup lang="ts">
import 'ba-story-player/dist/style.css'
import BaStoryPlayer from 'ba-story-player'
import { Container, Draggable } from 'vue3-smooth-dnd'
import type { DropResult } from 'vue3-smooth-dnd'
import type { Application } from 'pixi.js'
import { buildNexonJSONStory } from '~/common/visual-editor'
import { StoryNodeType } from '~/types/visual-editor'
import type { StoryNode } from '~/types/visual-editor'
import type { CharacterSelect } from '~/components/VisualEditor/CharacterSelect'
import { createStoryWork, uploadFile } from '~/api'

const store = useVisualEditorStore()
const route = useRoute<'/visual-editor/[[id]]'>()
const router = useRouter()

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
const player = ref<{ app: Application } | undefined>(undefined)
// watchEffect(() => {
//   useAppStore().pixiApp = player.value?.app
// })

const emitter = useEmitter()
const editPropertyShow = ref(false)

function handleEditorReload() {
  playerVIf.value = false
  nextTick(() => {
    playerVIf.value = true
  })
}
function handleEditorEditStoryProperty() {
  editPropertyShow.value = true
}
async function handleEditorSave() {
  await store.saveStory()

  if (player.value) {
    const app = player.value.app
    // todo 截取部分图片
    const image: HTMLImageElement = app.renderer.plugins.extract.image(app.stage, 'image/jpeg', 1)

    const resp = await uploadFile(await dataURItoBlob(image.src), `${store.storyId}_cover.jpg`)
    store.storyCover = resp.path
  }

  await store.saveStory()
}

onMounted(() => {
  emitter.on('editor.reload', handleEditorReload)
  emitter.on('editor.edit_story_property', handleEditorEditStoryProperty)
  emitter.on('editor.save', handleEditorSave)
})

onUnmounted(() => {
  emitter.off('editor.reload', handleEditorReload)
  emitter.off('editor.edit_story_property', handleEditorEditStoryProperty)
  emitter.off('editor.save', handleEditorSave)
})

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

watch(() => route.params.id, async () => {
  if (route.params.id) {
    await store.loadStory(route.params.id)
  }
  else {
    const data = {
      title: 'untitled',
      cover: 'https://sdfsdf.dev/400x300.jpg',
      description: '',
      story: { content: [] },
      released: false,
    }
    const story = await createStoryWork(data)
    router.replace(`/visual-editor/${story.id}`)
  }
}, { immediate: true })

const characterSelectInstance = shallowRef<CharacterSelect>()
provide('character-select', characterSelectInstance)
</script>

<template>
  <div id="visual-editor-index" flex="~ col" of-hidden>
    <div class="visual-editor-content" flex="~ 1" gap-2 of-hidden p-2>
      <div class="preview" flex="~ col" :style="{ minWidth: `${playerWidth + 24}px` }" card h-full>
        <div class="player-preview" bg-black>
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
      <div class="story-node-list" inline-block card min-w24rem w27rem>
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
              <StoryCardContainer v-model="store.storyNodes[i]" @remove="handleRemoveCard(store.storyNodes[i])" />
            </Draggable>
          </Container>
          <AddCard m3 @click="handleAddCard" />
        </div>
      </div>
    </div>
    <div class="modals">
      <StoryProperty v-model:show="editPropertyShow" />
      <CharacterSelect ref="characterSelectInstance" />
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
