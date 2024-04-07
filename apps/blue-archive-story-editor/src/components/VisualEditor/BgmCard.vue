<script setup lang="ts">
import type { BgmNode } from '~/types/visual-editor'

const model = defineModel < BgmNode > ({ required: true })
const bgmId = computed({
  get: () => {
    return String(model.value.bgmId || '')
  },
  set: (value) => {
    model.value.bgmId = Number(value) || 0
  },
})
</script>

<template>
  <div class="bgm-card">
    <TheInput v-model="bgmId" label="bgmId:" />
  </div>
</template>

<style scoped>
</style>
