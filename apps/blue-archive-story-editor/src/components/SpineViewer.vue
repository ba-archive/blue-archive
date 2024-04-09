<script setup lang="ts">
import * as PIXI from 'pixi.js'
import { Spine, SpineDebugRenderer } from 'pixi-spine'

const props = defineProps<{
  skelUrl: string
}>()

const model = defineModel<string>()

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
const SPINE_SCALE = 0.5
const DIV_SCALE = 0.5

// extensions.add(ResizePlugin)
function initPixi() {
  canvasWrapper.value.appendChild(app.view)
  app.resizeTo = canvasWrapper.value
  app.resize()

  setTimeout(() => {
    const graphic = new PIXI.Graphics()
    graphic.beginFill(0xFF0000)
    graphic.drawCircle(0, 0, 5)
    graphic.drawCircle(app.screen.width, 0, 5)
    graphic.drawCircle(app.screen.width, app.screen.height, 5)
    graphic.drawCircle(0, app.screen.height, 5)
    graphic.drawCircle(app.screen.width / 2, app.screen.height / 2, 5)
    graphic.endFill()
    app.stage.addChild(graphic)
  }, 6000)
}

async function loadSpine(path: string) {
  container.removeChildren()
  spine.value = new Spine(await loadSpineData(app, path, path))
  animations.value = spine.value.spineData.animations.map(item => item.name)
  model.value = animations.value[0]

  // const spineDebugger = new SpineDebugRenderer()
  // spineDebugger.drawBones = false
  // spineDebugger.drawRegionAttachments = false
  // spineDebugger.drawClipping = false
  // spineDebugger.drawMeshHull = false
  // spineDebugger.drawMeshTriangles = false
  // spineDebugger.drawPaths = false
  // spineDebugger.drawBoundingBoxes = true
  // spine.value.debug = spineDebugger

  container.addChild(spine.value as Spine)
  container.scale.set(SPINE_SCALE)
  container.x = app.screen.width / 2
  container.y = app.screen.height / 2 + container.height * SPINE_SCALE * DIV_SCALE
}

onMounted(async () => {
  initPixi()
})

onUpdated(() => {
  app.resize()
  container.scale.set(SPINE_SCALE)
  container.x = app.screen.width / 2
  container.y = app.screen.height / 2 + container.height * SPINE_SCALE * DIV_SCALE
})

watchEffect(async () => {
  const spineUrl = props.skelUrl
  if (spineUrl)
    await loadSpine(spineUrl)
  else
    container.removeChildren()
})

function handleChangeAnimation(name: string) {
  model.value = name
  spine!.value?.state.setAnimation(0, name, false)
}
</script>

<template>
  <div class="spine-viewer" flex="~ col" h-full>
    <div class="animations" my1 mb2>
      <button
        v-for="name in animations" :key="name"
        :class="{ 'bg-gray-3': name === model }"
        mx.5 my.5 px3 py1 btn text="sm"
        @click="handleChangeAnimation(name)"
      >
        {{ name }}
      </button>
    </div>
    <div relative flex-1 of-hidden>
      <div ref="canvasWrapper" class="canvas-wrapper" absolute h="2/1" w="2/1" transform-origin-lt scale-50 of-hidden />
    </div>
  </div>
</template>
