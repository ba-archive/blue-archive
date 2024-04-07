<script setup lang="ts">
import type { BackgroundNode } from '~/types/visual-editor'

const model = defineModel<BackgroundNode>({ required: true })
const backgroundId = computed({
  get: () => {
    return String(model.value.backgroundId || '')
  },
  set: (value) => {
    model.value.backgroundId = Number(value) || 0
  },
})
</script>

<template>
  <div class="background-card">
    <TheInput v-model="backgroundId" label="背景 id:" />
  </div>
</template>

<style scoped>
</style>
