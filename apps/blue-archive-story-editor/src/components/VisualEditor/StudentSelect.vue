<script setup lang="ts">
import { useAppStore } from '~/stores/app'
import type { Character } from '~/types/visual-editor'
import type { CharacterData } from '~/types/app'

const appStore = useAppStore()

const model = defineModel<{
  id: number
  name: string
  club: string
  fx: string
  emotion: string
} | null>({ required: true })

const studentSelectCard = ref<HTMLDivElement | null>(null)

const studentListShow = ref(false)
const studentListY = ref<string | undefined>(undefined)
const studentListX = ref<string | undefined>(undefined)

const selected = computed({
  get: () => {
    return model.value || {
      id: 0,
      name: '',
      club: '',
      fx: '',
      emotion: '',
    }
  },
  set: (value) => {
    if (!value.id)
      model.value = null
    else
      model.value = value
  },
})

// async function checkImageExist(url: string) {
//   const img = new Image()
//   img.src = url
//   return new Promise((resolve) => {
//     img.onload = () => resolve(true)
//     img.onerror = () => resolve(false)
//   })
// }

const DEFAULT_AVATAR_URL = 'https://sdfsdf.dev/50x50.jpg'

// todo 优化
function getCharacterAvatarUrl(id: number) {
  // const url1 = `/avatars/${id}.webp`
  // if (await checkImageExist(url1)) {
  //   return url1
  // }
  // else {
  for (const each of appStore.charactersData) {
    if (id === each.id) {
      const url2 = `https://yuuka.cdn.diyigemt.com/image/ba-all-data/${each.textureDir}.png`
      // if (await checkImageExist(url2))
      return url2
    }
  }
  return DEFAULT_AVATAR_URL
  // }
}

function handleShowStudentSelect() {
  studentListShow.value = true
  const el = studentSelectCard
  if (!el.value)
    return
  studentListX.value = `${el.value.offsetLeft + el.value.clientWidth + 8}px`
  studentListY.value = `${el.value.offsetTop}px`
}

function handleStudentSelect(character_data: CharacterData) {
  selected.value = {
    id: character_data.id,
    name: character_data.nameCn,
    club: character_data.club,
    fx: '',
    emotion: '',
  }
  studentListShow.value = false
}
</script>

<template>
  <div
    ref="studentSelectCard" class="student-select"
    w30rem b-rd-md bg-white p4 shadow-md
  >
    <div class="student-data" flex px1>
      <img
        :src="selected.id ? getCharacterAvatarUrl(selected.id) : DEFAULT_AVATAR_URL"
        h26
        w26 b-rd-2 object-cover
        @click="handleShowStudentSelect"
      >
      <div flex="~ col" ml4 gap-y-1>
        <div class="name">
          {{ selected.name }} ({{ selected.id }})
        </div>
      </div>
    </div>
    <StudentViewer v-model="selected" />
    <TheModal v-model:show="studentListShow" width="30rem" :x="studentListX" :y="studentListY">
      <ul
        class="students"
        grid="~ cols-5 justify-items-center"
        hmd wmd gap-2 of-x-hidden of-y-auto p-1
      >
        <li
          v-for="character_data in appStore.charactersData.slice(0, 140)" :key="character_data.id"
          relative h20 w20 select-none of-hidden b-rd-2 transition hover:scale-110
          @click="handleStudentSelect(character_data)"
        >
          <img
            :src="getCharacterAvatarUrl(character_data.id)"
            h20
            w20 object-cover
          >
          <div
            class="name"
            absolute bottom-0 h5 w-full of-hidden ws-nowrap p-x-1
            text="~ white size-sm center shadow-sm ellipsis" bg="gray op-70"
          >
            {{ character_data.nameCn || character_data.nameKr || character_data.devName || character_data.id }}
          </div>
        </li>
      </ul>
    </TheModal>
  </div>
</template>
