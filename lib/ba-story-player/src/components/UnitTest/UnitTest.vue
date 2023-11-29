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
    <div>
      <button
        @click="currentUnitTest.runTest(player)"
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
import { computed, watch } from "vue";
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
const emits = defineEmits<{
  (e: "storyNodesChange", storyNodes: StoryNode[]): void;
}>();
watch(currentUnitTest, newVal => {
  emits("storyNodesChange", newVal.getStoryNodes(cloneDeep(initStoryNodes)));
  newVal;
});
emits(
  "storyNodesChange",
  currentUnitTest.value.getStoryNodes(cloneDeep(initStoryNodes))
);
</script>
