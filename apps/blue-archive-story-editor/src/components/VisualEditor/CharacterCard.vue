<script setup lang="ts">
import type { CharacterNode } from '~/types/visual-editor.ts'

const model = defineModel<CharacterNode>({ required: true })

function getCharacterAvatarImg(id: string) {
  return 'https://sdfsdf.dev/50x50.jpg'
}
</script>

<template>
  <div class="character-card">
    <div class="characters">
      <template v-for="character in model.characters">
        <div v-if="character" :key="character.id" class="character" h12 w12>
          <img :src="getCharacterAvatarImg(character.id)" h12 w12>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
</style>
