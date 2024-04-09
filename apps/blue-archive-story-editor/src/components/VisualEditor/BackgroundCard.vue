<script setup lang="ts">
import type { BackgroundNode } from '~/types/visual-editor'

const appStore = useAppStore()
const model = defineModel<BackgroundNode>({ required: true })

const modalShow = ref(false)
</script>

<template>
  <div class="background-card">
    <div>
      背景 id: {{ model.backgroundId }}
    </div>
    <TheModal v-model:show="modalShow" anchor="body" position="center">
      <img img h16rem w-full :src="appStore.getBackgroundUrl(model.backgroundId)" @click="modalShow = true">
      <template #content>
        <BackgroundSelector v-model="model.backgroundId" />
      </template>
    </TheModal>
  </div>
</template>

<style scoped>
</style>
