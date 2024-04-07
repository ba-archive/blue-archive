<script setup lang="ts">
defineProps<{
  title?: string
  width?: string
  height?: string
  x?: string
  y?: string
}>()
const show = defineModel<boolean>('show')
</script>

<template>
  <Teleport to="body">
    <div
      v-show="show" class="the-modal" :class="{ 'pos-center': !(x && y) }"
      :style="{ width, height, top: y, left: x }"
      absolute card
    >
      <div class="header" flex="~ justify-between">
        <h1 class="title" inline>
          {{ title || '' }}
        </h1>
        <button i-material-symbols:cancel-outline-rounded icon-btn @click="show = false" />
      </div>
      <div class="container">
        <slot />
      </div>
    </div>
  </Teleport>
</template>
