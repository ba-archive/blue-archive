<template>
  <div>
    <div>
      <label>选择测试</label>
    </div>
    <UnitTestSelect
      :unit-tests-filte-by-category="unitTestsFilteByCategory"
      v-model="currentPropertyChain"
    />
    <div v-if="currentUnitTest.select">
      <div>选项</div>
      <select v-model="rawCurrentUnitSelectValue">
        <option v-for="option in currentUnitTest.select" :key="option">
          {{ option }}
        </option>
      </select>
    </div>
    <div v-if="currentUnitTest.input">
      <div>
        <label for="testInput">{{ currentUnitTest.input }}</label>
      </div>
      <input type="text" v-model="rawCurrentUnitInputValue" />
    </div>
    <div>
      <button @click="runTest" :disabled="!storyResourceLoaded">
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
import unitTestsFilteByCategory, {
  UnitTestsFilteByCategory,
  UnitTest,
} from "./unitTests";
import { cloneDeep } from "lodash-es";
import UnitTestSelect from "./UnitTestSelect";

const props = defineProps<{
  player: InstanceType<typeof Player> | null;
  storyResourceLoaded: boolean;
}>();

const initStoryNodes: StoryNode[] = Array.from(testStoryNodes);

const currentPropertyChain = useLocalStorage<string[]>("propertyChain", []);
const currentUnitTest = computed(() => {
  let current = cloneDeep(unitTestsFilteByCategory);
  for (const property of currentPropertyChain.value) {
    if (Reflect.get(current[property], "getStoryNodes") !== undefined) {
      return current[property] as UnitTest;
    } else {
      current = current[property] as UnitTestsFilteByCategory;
    }
  }
  return {
    getStoryNodes(init) {
      return init;
    },
    async runTest() {
      console.log("init test function");
      return;
    },
  };
});

const rawCurrentUnitSelectValue = ref("");
const currentUnitSelectValue = computed(() => {
  if (currentUnitTest.value.select) {
    return rawCurrentUnitSelectValue.value;
  } else {
    return undefined;
  }
});

const rawCurrentUnitInputValue = ref("");
const currentUnitInputValue = computed(() => {
  if (currentUnitTest.value.input) {
    return rawCurrentUnitInputValue.value;
  } else {
    return undefined;
  }
});

const emits = defineEmits<{
  (e: "storyNodesChange", storyNodes: StoryNode[]): void;
}>();
watch(currentUnitTest, newVal => {
  emits("storyNodesChange", newVal.getStoryNodes(cloneDeep(initStoryNodes)));
});
emits(
  "storyNodesChange",
  currentUnitTest.value.getStoryNodes(cloneDeep(initStoryNodes))
);
function runTest() {
  if (props.player) {
    currentUnitTest.value.runTest(props.player, {
      select: currentUnitSelectValue.value,
      input: currentUnitInputValue.value,
    });
  }
}
</script>
