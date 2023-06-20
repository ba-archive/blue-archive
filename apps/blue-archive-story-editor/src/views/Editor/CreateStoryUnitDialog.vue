<template>
  <div class="story-unit-item-container grid gap-x-32px gap-y-32px grid-cols-4">
    <div
      v-for="(e, index) in StoryUnitComponentMap"
      :key="index"
      class="story-unit-item flex flex-row rounded"
      @click="onSelected(e.type)"
    >
      <div class="icon flex flex-col justify-center mr-8px"><span>图标</span></div>
      <div class="content flex flex-col flex-1">
        <div class="title">{{ e.title }}({{ e.type }})</div>
        <div class="description flex-1">{{ e.description }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { StoryType } from "ba-story-player/dist/lib/types/common";
import { StoryUnitComponentMap } from "./tools/storyUnitMap";

const emit = defineEmits<{
  (e: "choose", type: StoryType): void;
}>();

function onSelected(type: StoryType) {
  emit("choose", type);
}
</script>

<style lang="scss" scoped>
.story-unit-item-container {
  .story-unit-item {
    box-shadow: var(--el-box-shadow-lighter);
    padding: 8px;
    transition: box-shadow 0.15s ease-in-out;
    &:hover {
      cursor: pointer;
      box-shadow: var(--el-box-shadow);
    }
    .title {
      font-size: 16px;
    }
  }
}
</style>
