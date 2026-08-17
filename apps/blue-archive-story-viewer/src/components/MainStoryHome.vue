<template>
  <div
    v-if="!isStorySelected"
    class="main-story-container fill-screen flex-vertical"
  >
    <story-line-container
      v-for="(story, index) in releasedStories"
      :key="index"
      :title="story.title"
      :avatar="story.avatar"
      :index="index"
      :sections="story.sections"
      :total-length="releasedStories.length"
    />
  </div>
  <router-view v-else />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import StoryLineContainer from "./story/StoryLineContainer.vue";
import { getReleasedStories } from "@/util/playerUtils";

const route = useRoute();
const releasedStories = getReleasedStories("main");
const isStorySelected = computed(() => !/\/mainStory\/?$/.test(route.path));
</script>

<style scoped lang="scss">
.main-story-container {
  margin-top: 24px;
}
</style>
