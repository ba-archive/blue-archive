<script setup lang="ts">
import backgrounds from '~/assets/excel/ScenarioBGNameExcelTable.json'

type Background = typeof backgrounds.DataList[number]
type ImageBackground = Background & { BGType: 'Image' }
type SpineBackground = Background & { BGType: 'Spine' }

const spineBackgrounds = ref<SpineBackground[]>([])
const imageBackgrounds = ref<ImageBackground[]>([])

const currentTab = ref<'image' | 'spine'>('image')

for (const background of backgrounds.DataList) {
  if (background.BGType === 'Spine')
    spineBackgrounds.value.push(background as SpineBackground)
  else if (background.BGType === 'Image')
    imageBackgrounds.value.push(background as ImageBackground)
  else
    console.warn('unrecognized background: ', background)
}

function getImageBackgroundUrl(background: ImageBackground) {
  return `https://yuuka.cdn.diyigemt.com/image/ba-all-data/${background.BGFileName}.jpg`
}

// function getSpineBackgroundName(background: SpineBackground) {
//   const spinePath = background.BGFileName
//   const matched = spinePath.match(/SpineBG_Lobby(.*)/)
//   if (matched) {
//     const spineName = matched[1]
//     return spineName
//   }
//   return ''
// }

// function getBackgroundSpineUrl(background: SpineBackground) {
//   const spineName = getSpineBackgroundName(background)
//   if (spineName)
//     return `https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/${spineName}_home/${spineName}_home.skel`

//   return ''
// }

const model = defineModel<number>({ required: true })
const selected = ref<Background | null>(null)
function handleSelect(background: Background) {
  selected.value = background
  model.value = background.Name
}
</script>

<template>
  <div class="background-selector" h-5xl w-5xl of-hidden flex="~">
    <div>
      <div class="tab-bar" flex>
        <button btn :class="{ 'bg-gray-2': currentTab === 'image' }" @click="currentTab = 'image'">
          image
        </button>
        <!-- <button btn :class="{ 'bg-gray-2': currentTab === 'spine' }" @click="currentTab = 'spine'">
          spine
        </button> -->
      </div>
      <div class="wrapper" h-full w-md>
        <div class="image-background-list" grid="~ cols-4 justify-between" h-full gap-1 of-y-auto>
          <template v-if="currentTab === 'image'">
            <div v-for="background in imageBackgrounds" :key="background.Name" class="image-background">
              <!-- todo 添加默认长宽 -->
              <img v-lazy="getImageBackgroundUrl(background)" @click="handleSelect(background)">
            </div>
          </template>
          <!-- <template v-if="currentTab === 'spine'">
            <div
              v-for="background in spineBackgrounds" :key="background.Name" class="spineBackground"
              card h-20 w-28 of-hidden @click="selected = background"
            >
              <span>{{ getSpineBackgroundName(background) }}</span>
              <div>{{ background.AnimationRoot }}</div>
              <div>{{ background.AnimationName }}</div>
            </div>
          </template> -->
        </div>
      </div>
    </div>
    <div flex="~ col 1">
      <div class="background-info" h-xs>
        <div>
          BGFileName: {{ selected?.BGFileName }}
        </div>
        <div>
          BGType: {{ selected?.BGType }}
        </div>
      </div>
      <div class="background-previewer" flex="~ 1 center" of-hidden bg-gray-3>
        <template v-if="selected">
          <img v-if="selected.BGType === 'Image'" v-lazy="getImageBackgroundUrl(selected as ImageBackground)">
          <!-- <SpineViewer
            v-if="selected.BGType === 'Spine'" v-model="selected.AnimationName"
            h-full-w-full
            :skel-url="getBackgroundSpineUrl(selected as SpineBackground)"
          /> -->
        </template>
      </div>
    </div>
  </div>
</template>
