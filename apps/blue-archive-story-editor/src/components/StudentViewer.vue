<script setup lang="ts">
import * as PIXI from 'pixi.js'
import { Spine, SpineDebugRenderer } from 'pixi-spine'
import type { Student } from '~/types/app'

const props = defineProps<{ student: Student }>()
const model = defineModel<string | null>()
const canvasWrapper = ref(null) as any as Ref<HTMLDivElement>

function loadSpineData(app: PIXI.Application, name: string, path: string): Promise<any> {
  return new Promise((resolve) => {
    app.loader
      .add(name, path)
      .load((loader, resources) => {
        resolve(resources[name].spineData)
      })
  })
}

function getStudentSpineUrl(student: Student) {
  return `/SpineCharacters/${student.id}_spr/${student.id}_spr.skel`
}

const animations = ref<string[]>([])
const spine = ref<Spine | null>(null)

// extensions.add(ResizePlugin)

onMounted(async () => {
  const app = new PIXI.Application({ backgroundColor: 0xCCCCCC, resizeTo: canvasWrapper.value })
  // await app.init()
  canvasWrapper.value.appendChild(app.view)

  // await Assets.load([
  //   {
  //     alias: 'arisSkeleton',
  //     src: '/SpineCharacters/aris_spr/aris_spr.skel',
  //   },
  //   {
  //     alias: 'arisAtlas',
  //     src: '/SpineCharacters/aris_spr/aris_spr.atlas',
  //   },
  // ])

  // Assets.add('arisSkeleton', '/SpineCharacters/aris_spr/aris_spr.skel')
  // Assets.add('arisAtlas', '/SpineCharacters/aris_spr/aris_spr.atlas')

  const container = new PIXI.Container()
  const _spine = new Spine(await loadSpineData(app, 'arisSkeleton', getStudentSpineUrl(props.student)))
  spine.value = _spine
  animations.value = _spine.spineData.animations.map(item => item.name)
  model.value = animations.value[0]
  // const spineDebugger = new SpineDebugRenderer()
  // spineDebugger.drawBoundingBoxes = true
  // spine.debug = spineDebugger

  // eslint-disable-next-line no-console
  console.log(spine.value)
  const SPINE_SCALE = 0.8
  const DIV_SCALE = 0.5
  container.scale.set(SPINE_SCALE)
  container.addChild(_spine)
  app.stage.addChild(container)

  container.x = app.screen.width / 2
  container.y = app.screen.height / 2 + container.height * SPINE_SCALE / (2 / DIV_SCALE)
})

function handleChangeAnimation(name: string) {
  model.value = name
  spine!.value?.state.setAnimation(0, name, false)
}
</script>

<template>
  <div class="student-viewer" flex="~ col" card w-lg>
    <h3>
      <span>
        {{ student.name }} ({{ student.id }})
      </span>
      表情选择：{{ model }}
    </h3>
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
    <div ref="canvasWrapper" class="canvas-wrapper" h-96rem w-61rem transform-origin-lt scale-50 of-hidden b-rd />
  </div>
</template>
