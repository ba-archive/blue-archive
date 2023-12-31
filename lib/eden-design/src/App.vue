<script setup lang="ts">
import DevPanel from "@/views/DevPanel.vue";
</script>

<template>
  <e-menu>
    <template #icon>
      <img src="https://eden.blue-archive.io/eden-logo.svg" alt="Eden Logo" />
    </template>
    <template #title> Eden Design </template>
  </e-menu>
  <div class="w-full" style="margin-top: 32px">
    <dev-panel />
  </div>
</template>

<style scoped lang="scss"></style>
