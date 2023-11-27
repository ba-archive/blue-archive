<template>
  <div>
    <div>
      <div>
        <label>测试集</label>
      </div>
      <select v-model="currentTestCatogory">
        <option
          v-for="category in Object.keys(unitTestsFilterByCategory)"
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
import { StoryNode } from "../../lib/type";
import testStoryNodes from "../testStory.json";
import { computed, watch } from "vue";
import Player from "../../lib/StoryPlayer.vue";

const props = defineProps<{
  player: InstanceType<typeof Player> | null;
  storyResourceLoaded: boolean;
}>();

const initStoryNodes = Array.from(testStoryNodes);
interface UnitTest {
  getStoryNodes: (initStoryNodes: StoryNode[]) => StoryNode[];
  runTest: (player: InstanceType<typeof Player>) => Promise<void>;
}
const unitTestsFilterByCategory: Record<string, Record<string, UnitTest>> = {
  audio: {
    changeBgm: {
      getStoryNodes(initStoryNodes) {
        initStoryNodes[0].audio.bgm = {
          url: "https://yuuka.cdn.diyigemt.com/image/ba-all-data/Audio/BGM/Theme_10.ogg",
          bgmArgs: {
            Id: 1,
            Path: "Audio/BGM/Theme_96",
            LoopStartTime: 0.3,
            LoopEndTime: 110.7,
            LoopTranstionTime: 0,
            LoopOffsetTime: 0,
          },
        };
        initStoryNodes[1].audio.bgm = {
          url: "https://yuuka.cdn.diyigemt.com/image/ba-all-data/Audio/BGM/Theme_11.ogg",
          bgmArgs: {
            Id: 1,
            Path: "Audio/BGM/Theme_96",
            LoopStartTime: 0.3,
            LoopEndTime: 110.7,
            LoopTranstionTime: 0,
            LoopOffsetTime: 0,
          },
        };

        return initStoryNodes;
      },
      async runTest(player) {
        player.storyManager.switch(1);
      },
    },
    loopBgm: {
      getStoryNodes(initStoryNodes) {
        initStoryNodes[0].audio.bgm = {
          url: "https://yuuka.cdn.diyigemt.com/image/ba-all-data/Audio/BGM/Theme_10.ogg",
          bgmArgs: {
            Id: 1,
            Path: "Audio/BGM/Theme_96",
            LoopStartTime: 0.3,
            LoopEndTime: 10,
            LoopTranstionTime: 0,
            LoopOffsetTime: 0,
          },
        };
        return initStoryNodes;
      },
      async runTest(player) {
        const bgm = player.nodePlayer.serversInstance.audio.instances.bgm;
        if (bgm) {
          bgm.seek(bgm.duration() - 10);
        }
      },
    },
  },
};

const currentTestCatogory = useLocalStorage("category", "audio");
const currentUnitTestKey = useLocalStorage("unitTest", "changeBgm");
const currentUnitTests = computed(() => {
  return unitTestsFilterByCategory[currentTestCatogory.value];
});
const currentUnitTest = computed(() => {
  return currentUnitTests.value[currentUnitTestKey.value];
});
const emits = defineEmits<{
  (e: "storyNodesChange", storyNodes: StoryNode[]): void;
}>();
watch(currentUnitTest, newVal => {
  emits("storyNodesChange", newVal.getStoryNodes(Array.from(initStoryNodes)));
  newVal;
});
emits(
  "storyNodesChange",
  currentUnitTest.value.getStoryNodes(Array.from(initStoryNodes))
);
</script>
