<script setup lang="ts">
import { ref } from "vue";
import Player from "../lib/StoryPlayer.vue";
import { StoryNode, Ii8nString } from "../lib/type";
import testStory from "./testStory.json";
import UnitTest from "./components/UnitTest.vue";

const storyNodes = ref<StoryNode[]>(testStory);
const flag = ref(true);
const language = ref<keyof Ii8nString>("cn");
const player = ref<InstanceType<typeof Player> | null>(null);
const storyResourceLoaded = ref(true);
function changeStoryNodes(newNodes: StoryNode[]) {
  storyNodes.value = newNodes;
  storyResourceLoaded.value = false;
}
function afterStoryLoaded() {
  storyResourceLoaded.value = true;
  player.value.storyManager.switch(0);
}
</script>

<template>
  <UnitTest
    :player="player"
    :story-resource-loaded="storyResourceLoaded"
    class="unitTest"
    @story-nodes-change="changeStoryNodes"
  />
  <div class="playerContainer">
    <Player
      ref="player"
      :language="language"
      :height="500"
      :width="1000"
      class="player"
      data-url="https://yuuka.cdn.diyigemt.com/image/ba-all-data"
      :story-nodes="storyNodes"
      @loaded="afterStoryLoaded"
      v-if="flag"
      :end-callback="
        () => {
          console.log('end!');
        }
      "
    />
  </div>
</template>

<style scoped>
.unitTest {
  position: absolute;
  left: 1%;
  top: 3%;
}

.playerContainer {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
