<script setup lang="ts">
import { ref } from "vue";
import Player from "./player/Player.vue";
import { StoryNode, Ii8nString } from "./player/type";
import testStory from "./testStory.json";

const storyNodes = ref<StoryNode[]>(testStory);
const flag = ref(true);
const language = ref<keyof Ii8nString>("cn");
</script>

<template>
  <button @click="flag = !flag" class="flagButton">test</button>
  <Player
    :language="language"
    :height="500"
    :width="1000"
    data-url="https://yuuka.cdn.diyigemt.com/image/ba-all-data"
    :story-nodes="storyNodes"
    v-if="flag"
    :end-callback="
      () => {
        console.log('end!');
      }
    "
  />
</template>

<style scoped>
.flagButton {
  position: absolute;
  left: 1%;
  top: 3%;
}
</style>
