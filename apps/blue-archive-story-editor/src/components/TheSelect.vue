<script setup lang="ts">
const model = defineModel<string>()
</script>

<template>
  <select
    v-model="model" class="the-select"
    p="x-2 y-1"
    text="left"
    bg="transparent"
    border="~ rounded gray-200 dark:gray-700"
    outline="none active:none"
  >
    <slot />
  </select>
</template>
