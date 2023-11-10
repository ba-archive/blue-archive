<script setup lang="ts">
import { ref } from "vue";
import Player from "../lib/StoryPlayer.vue";
import { StoryNode, Ii8nString } from "../lib/type";
import testStory from "./testStory.json";

const storyNodes = ref<StoryNode[]>(testStory);
const flag = ref(true);
const language = ref<keyof Ii8nString>("cn");
</script>

<template>
  <button @click="flag = !flag" class="flagButton">test</button>
  <div class="playerContainer">
    <Player
      :language="language"
      :height="500"
      :width="1000"
      class="player"
      data-url="https://yuuka.cdn.diyigemt.com/image/ba-all-data"
      :story-nodes="storyNodes"
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
.flagButton {
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
