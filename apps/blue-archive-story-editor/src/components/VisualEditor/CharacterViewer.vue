<script setup lang="ts">
import * as PIXI from 'pixi.js'
import { Spine, SpineDebugRenderer } from 'pixi-spine'
import type { Character } from '~/types/visual-editor'

const appStore = useAppStore()

const model = defineModel<Character>({ required: true })
const canvasWrapper = ref(null) as any as Ref<HTMLDivElement>

function loadSpineData(app: PIXI.Application, name: string, path: string): Promise<any> {
  return new Promise((resolve, reject) => {
    app.loader.reset()
    app.loader
      .add(name, path)
      .load((loader, resources) => {
        const temp = resources
        resolve(temp[name].spineData)
      })
    app.loader.onError.add((e) => {
      console.error('loader onError', e)
      reject(e)
    })
  })
}



const animations = ref<string[]>([])
const spine = ref<Spine | null>(null)
const app = new PIXI.Application({ backgroundColor: 0xCCCCCC, resizeTo: canvasWrapper.value })
const container = new PIXI.Container()
app.stage.addChild(container)
const SPINE_SCALE = 0.8
const DIV_SCALE = 0.5

// extensions.add(ResizePlugin)
function initPixi() {
  canvasWrapper.value.appendChild(app.view)
  app.resizeTo = canvasWrapper.value
  app.resize()
}

async function loadSpine(path: string) {
  container.removeChildren()
  spine.value = new Spine(await loadSpineData(app, path, path))
  animations.value = spine.value.spineData.animations.map(item => item.name)
  model.value.face = animations.value[0]
  // const spineDebugger = new SpineDebugRenderer()
  // spineDebugger.drawBoundingBoxes = true
  // spine.debug = spineDebugger
  container.addChild(spine.value as Spine)
  container.scale.set(SPINE_SCALE)
  container.x = app.screen.width / 2
  container.y = app.screen.height / 2 + container.height * SPINE_SCALE / (2 / DIV_SCALE)
}

onMounted(async () => {
  initPixi()
})

onUpdated(() => {
  app.resize()
  container.scale.set(SPINE_SCALE)
  container.x = app.screen.width / 2
  container.y = app.screen.height / 2 + container.height * SPINE_SCALE / (2 / DIV_SCALE)
})

watchEffect(async () => {
  const spineUrl = appStore.getCharacterSpineUrl(model.value.id)
  if (spineUrl)
    await loadSpine(spineUrl)
  else
    container.removeChildren()
})

function handleChangeAnimation(name: string) {
  model.value.face = name
  spine!.value?.state.setAnimation(0, name, false)
}
</script>

<template>
  <div class="character-viewer" flex="~ col">
    <h3>
      <span>
        {{ model.name }} ({{ model.id }})
      </span>
      表情选择：{{ model }}
    </h3>
    <div class="animations" my1 mb2>
      <button
        v-for="name in animations" :key="name"
        :class="{ 'bg-gray-3': name === model.face }"
        mx.5 my.5 px3 py1 btn text="sm"
        @click="handleChangeAnimation(name)"
      >
        {{ name }}
      </button>
    </div>
    <div h48rem w28rem>
      <div ref="canvasWrapper" class="canvas-wrapper" h-96rem w-56rem transform-origin-lt scale-50 of-hidden b-rd-2 />
    </div>
  </div>
</template>
