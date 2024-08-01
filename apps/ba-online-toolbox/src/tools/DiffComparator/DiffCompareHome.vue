<script setup lang="ts">
import { ref } from "vue";
import DiffFileSelectView from "./components/DiffFileSelectView.vue";
import DiffCompareView from "./components/DiffCompareView.vue";
import eventBus from "./events/events";
import { useDiffComparatorStore } from "./store/DiffComparatorStore";

const shouldStartCompare = ref(false);

eventBus.on("startCompare", () => {
  shouldStartCompare.value = true;
});

eventBus.on("endCompare", () => {
  shouldStartCompare.value = false;
});

eventBus.on("startNew", () => {
  shouldStartCompare.value = false;
  useDiffComparatorStore().$reset();
});

const componentsMap = [
  {
    name: "DiffFileSelectView",
    component: DiffFileSelectView,
  },
  {
    name: "DiffFileCompareView",
    component: DiffCompareView,
  },
];
</script>

<template>
  <div
    class="w-full flex-1 max-w-[1280px] flex flex-col"
    style="height: calc(100dvh - 3rem)"
  >
    <component
      :is="
        shouldStartCompare
          ? componentsMap[1].component
          : componentsMap[0].component
      "
    />
  </div>
</template>
