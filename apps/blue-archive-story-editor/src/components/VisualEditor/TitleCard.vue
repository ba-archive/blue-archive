<script setup lang="ts">
import type {  TitleNode } from '~/types/visual-editor'

const model = defineModel<TitleNode>({ required: true })
</script>

<template>
  <div class="title-card">
    <TheInput v-model="model.text" label="text:" />
  </div>
</template>

<style scoped>
</style>
