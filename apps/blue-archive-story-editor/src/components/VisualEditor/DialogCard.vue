<script setup lang="ts">
import type { DialogNode } from '~/types/visual-editor.ts'

const model = defineModel<DialogNode>({ required: true })
</script>

<template>
  <div class="dialog-card">
    <div class="dialog" children:my1>
      <div>
        <TheInput v-model="model.dialog.speaker" label="speaker" type="text" />
      </div>
      <div>
        <TheInput v-model="model.dialog.group" label="group" type="text" />
      </div>
      <div>
        <TheInput v-model="model.dialog.text" label="text" type="text" />
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
