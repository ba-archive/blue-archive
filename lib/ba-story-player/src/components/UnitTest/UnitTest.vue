<template>
  <div>
    <div>
      <div>
        <label>测试集</label>
      </div>
      <select v-model="currentTestCatogory">
        <option
          v-for="category in Object.keys(unitTestsFilteByCategory)"
          :key="category"
        >
          {{ category }}
        </option>
      </select>
    </div>
    <div>
      <div>
        <label>测试</label>
      </div>
      <select v-model="currentUnitTestKey">
        <option
          v-for="unitTestKey in Object.keys(currentUnitTests)"
          :key="unitTestKey"
        >
          {{ unitTestKey }}
        </option>
      </select>
    </div>
    <div v-if="currentUnitTest.select">
      <div>选项</div>
      <select v-model="rawCurrentUnitSelectValue">
        <option v-for="option in currentUnitTest.select" :key="option">
          {{ option }}
        </option>
      </select>
    </div>
    <div>
      <button
        @click="
          currentUnitTest.runTest(player, { select: currentUnitSelectValue })
        "
        :disabled="!storyResourceLoaded"
      >
        run test
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLocalStorage } from "@vueuse/core";
import { StoryNode } from "../../../lib/type";
import testStoryNodes from "../../testStory.json";
import { computed, ref, watch } from "vue";
import Player from "../../../lib/StoryPlayer.vue";
import unitTestsFilteByCategory from "./unitTests";
import { cloneDeep } from "lodash-es";

const props = defineProps<{
  player: InstanceType<typeof Player> | null;
  storyResourceLoaded: boolean;
}>();

const initStoryNodes: StoryNode[] = Array.from(testStoryNodes);

const currentTestCatogory = useLocalStorage("category", "audio");
const currentUnitTestKey = useLocalStorage("unitTest", "changeBgm");
const currentUnitTests = computed(() => {
  return unitTestsFilteByCategory[currentTestCatogory.value];
});
const currentUnitTest = computed(() => {
  return currentUnitTests.value[currentUnitTestKey.value];
});
const rawCurrentUnitSelectValue = ref("");
const currentUnitSelectValue = computed(() => {
  if (currentUnitTest.value.select) {
    return rawCurrentUnitSelectValue.value;
  } else {
    return undefined;
  }
});
const emits = defineEmits<{
  (e: "storyNodesChange", storyNodes: StoryNode[]): void;
}>();
watch(currentUnitTest, newVal => {
  const unitTestkeys = Object.keys(currentUnitTests.value);
  if (!unitTestkeys.includes(currentUnitTestKey.value)) {
    currentUnitTestKey.value = unitTestkeys[0];
    return;
  }
  emits("storyNodesChange", newVal.getStoryNodes(cloneDeep(initStoryNodes)));
  newVal;
});
emits(
  "storyNodesChange",
  currentUnitTest.value.getStoryNodes(cloneDeep(initStoryNodes))
);
</script>
