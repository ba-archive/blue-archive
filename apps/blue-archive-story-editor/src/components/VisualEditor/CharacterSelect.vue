<script setup lang="ts">
import { useAppStore } from '~/stores/app'
import type { CharacterData } from '~/types/app'

const appStore = useAppStore()

const model = defineModel<{
  id: number
  name: string
  club: string
  face: string
  emotion: string
  effect: string
} | null>({ required: true })

const characterSelectCard = ref<HTMLDivElement | undefined>(undefined)

const characterListShow = ref(false)

const selected = computed({
  get: () => {
    return model.value || {
      id: 0,
      name: '',
      club: '',
      face: '',
      emotion: '',
      effect: '',
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

function handleSelectCharacter() {
  characterListShow.value = true
}
function handleUnSelectCharacter() {
  model.value = null // clear selected character
  characterListShow.value = false
}

function handleCharacterSelect(character_data: CharacterData) {
  selected.value = {
    id: character_data.id,
    name: character_data.nameCn,
    club: character_data.club,
    face: '',
    emotion: '',
    effect: '',
  }
  characterListShow.value = false
}
</script>

<template>
  <div ref="characterSelectCard" class="character-select" h5xl w-4xl flex="~">
    <div h-full w-auto class="character-list" flex="~ col" gap-3>
      <div class="character-data" flex px1>
        <img
          v-lazy="appStore.getCharacterAvatarUrl(selected.id)"
          h26
          w26 b-rd-2 object-cover
          @click="handleSelectCharacter"
          @click.right.prevent="handleUnSelectCharacter"
        >
        <div flex="~ col" ml4 gap-y-1>
          <div class="name">
            {{ selected.name }} ({{ selected.id }})
          </div>
        </div>
      </div>
      <ul
        class="characters"
        grid="~ cols-5 justify-items-center"
        flex-1 gap-2 of-x-hidden of-y-auto p-1
      >
        <li
          v-for="character_data in appStore.charactersData.slice(0, 220)" :key="character_data.id"
          relative h20 w20 select-none of-hidden b-rd-2 transition hover:scale-110
          @click="handleCharacterSelect(character_data)"
        >
          <img
            v-lazy="appStore.getCharacterAvatarUrl(character_data.id)"
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
    </div>
    <div class="character-spine-data" w30rem>
      <CharacterViewer v-model="selected" h-full />
    </div>
  </div>
</template>
