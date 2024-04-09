<script setup lang="ts">
import type { Character, CharacterNode } from '~/types/visual-editor.ts'

const model = defineModel<CharacterNode>({ required: true })
const appStore = useAppStore()

const currentClickedCharacterIndex = ref(0)
const characterSelectShow = ref(false)

function handleCharacterClicked(index: number) {
  currentClickedCharacterIndex.value = index
  characterSelectShow.value = true
}
function handleCharacterRightClicked(index: number) {
  model.value.characters[index] = null // unselect character
}
const cardContainer = inject('cardContainer') as Ref<HTMLDivElement | undefined>
</script>

<template>
  <div class="character-card">
    <div class="characters" flex="~ justify-between" mt2>
      <div
        v-for="character, index in model.characters"
        :key="character?.id" class="character"
        @click="handleCharacterClicked(index)"
        @click.right.prevent="handleCharacterRightClicked(index)"
      >
        <div v-if="character" h12 w12>
          <img :src="appStore.getCharacterAvatarUrl(character.id)" h12 w12 object-cover>
        </div>
        <div v-else h12 w12>
          <img src="https://sdfsdf.dev/50x50.jpg" h12 w12>
        </div>
      </div>
    </div>
    <TheModal v-model:show="characterSelectShow" :anchor="cardContainer">
      <template #content>
        <CharacterSelect v-model="model.characters[currentClickedCharacterIndex]" />
      </template>
    </TheModal>
  </div>
</template>

<style scoped>
</style>
