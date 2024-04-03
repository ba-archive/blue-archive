<script setup lang="ts">
import type { GNode } from '~/types/visual-editor.ts'

const model = defineModel<GNode>({ required: true })
</script>

<template>
  <div class="conversation-card" block w-sm b-rd bg-white p-4 shadow-md>
    <div>
      id: {{ model.id }}
    </div>
    <div class="characters" flex justify-between>
      <div v-for="character in model.characters" :key="character?.name" class="character" h15 w15>
        <img src="https://sdfsdf.dev/50x50.jpg" h15 w15>
        <!-- {{ character?.name }} -->
      </div>
    </div>
    <div class="dialog">
      <div>
        text: <input v-model="model.dialog.text" type="text">
      </div>
      <div>
        speaker: <input v-model="model.dialog.speaker" type="text">
      </div>
      <div>
        group: <input v-model="model.dialog.group" type="text">
      </div>
    </div>
  </div>
</template>

<style scoped>
.conversation-card {
  padding: 5px;
}
</style>
