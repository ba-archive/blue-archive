<script setup lang="ts">
const emits = defineEmits(['click'])
</script>

<template>
  <button
    class="add-card" block
    h-14 w-sm flex items-center justify-center b-rd bg-white p-4
    shadow-md transition active:bg-gray-2 hover:bg-gray-1
    @click="emits('click')"
  >
    <i i-material-symbols-add-circle-outline text-3xl color-gray-6 />
  </button>
</template>

<style scoped>
</style>
