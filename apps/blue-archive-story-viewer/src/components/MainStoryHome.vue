<template>
  <div
    class="main-story-container fill-screen flex-vertical"
    v-if="!isStorySelected"
  >
    <story-line-container
      v-for="(story, index) in releasedStories"
      :title="story.title"
      :avatar="story.avatar"
      :index="index"
      :sections="story.sections"
      :key="index"
      :total-length="releasedStories.length"
    />
  </div>
  <router-view v-else />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import StoryLineContainer from "./story/StoryLineContainer.vue";
import { stories } from "@index/mainStoryIndex";

const route = useRoute();

const releasedStories = stories.filter(story =>
  [undefined, true].includes(story?.released)
);

const isStorySelected = computed(() => !/\/mainStory\/?$/.test(route.path));
</script>

<style scoped lang="scss">
.main-story-container {
  margin-top: 24px;
}
</style>
