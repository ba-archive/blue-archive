<script setup lang="ts">
import type { CharacterSelect } from './CharacterSelect'
import type { CharacterNode } from '~/types/visual-editor.ts'

const model = defineModel<CharacterNode>({ required: true })
const appStore = useAppStore()

const characterSelectInstance = inject('character-select') as Ref<{ instance: CharacterSelect } | undefined>

async function handleCharacterClicked(index: number) {
  if (characterSelectInstance.value) {
    const selectedCharacter = await characterSelectInstance.value.instance.selectCharacter(model.value.characters[index])
    model.value.characters[index] = selectedCharacter
  }
}
function handleCharacterRightClicked(index: number) {
  model.value.characters[index] = null // unselect character
}
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
  </div>
</template>

<style scoped>
</style>
