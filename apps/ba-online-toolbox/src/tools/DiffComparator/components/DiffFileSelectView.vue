<script lang="ts" setup>
import { computed } from "vue";
import { useDiffComparatorStore } from "../store/DiffComparatorStore";
import FileSelector from "./FileSelector.vue";
const diffComparatorStore = useDiffComparatorStore();
import eventBus from "../events/events";

const files = computed(() => diffComparatorStore.getFileAll);

function handleSwap() {
  diffComparatorStore.swapFiles();
}

function handleCompare() {
  eventBus.emit("startCompare");
}

function handleReset() {
  eventBus.emit("startNew");
}
</script>

<template>
  <div class="flex gap-2 h-full w-full pt-4 pb-4">
    <file-selector :file="files[0]" :index="0" />
    <div class="m-auto flex flex-col gap-4">
      <n-button type="info" @click="handleSwap"> 交换两侧 </n-button>
      <n-button
        type="primary"
        :disabled="!diffComparatorStore.isFullyLoaded"
        @click="handleCompare"
      >
        开始比对
      </n-button>
      <div class="h-full flex-1 flex justify-center">
        <n-button class="mt-full" type="error" dashed @click="handleReset">
          重置
        </n-button>
      </div>
    </div>
    <file-selector :file="files[1]" :index="1" />
  </div>
</template>

<style lang="scss" scoped>
.file-select {
  grid-template-columns: repeat(2, 1fr);
}
</style>
