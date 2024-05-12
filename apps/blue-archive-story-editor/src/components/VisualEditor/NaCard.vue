<script setup lang="ts">
import type {  NaNode } from '~/types/visual-editor'

const model = defineModel<NaNode>({ required: true })
</script>

<template>
  <div class="na-card">
    <TheInput v-model="model.text" label="text:" />
  </div>
</template>

<style scoped>
</style>
