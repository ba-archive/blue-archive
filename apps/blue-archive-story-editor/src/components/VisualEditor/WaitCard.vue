<script setup lang="ts">
import type {  WaitNode } from '~/types/visual-editor'

const model = defineModel<WaitNode>({ required: true })
const milliSecond = computed({
  get: () => {
    return String(model.value.milliSecond || '')
  },
  set: (value) => {
    model.value.milliSecond = Number(value) || 0
  },
})
</script>

<template>
  <div class="wait-card">
    <TheInput v-model="milliSecond" label="毫秒:" />
  </div>
</template>

<style scoped>
</style>
