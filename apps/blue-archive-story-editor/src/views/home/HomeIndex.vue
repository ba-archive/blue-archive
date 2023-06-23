<template>
  <div class="home">
    <StoryEditor />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import StoryEditor from "@/views/Editor/StoryEditor.vue";

// eslint-disable-next-line @typescript-eslint/no-empty-function
onMounted(() => {});
</script>

<style lang="scss" scoped>
.home {
  width: 100dvw;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  padding: 8px;
}
</style>
