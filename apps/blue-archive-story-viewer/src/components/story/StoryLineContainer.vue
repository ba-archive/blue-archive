<script setup lang="ts">
import { Ref, computed, onMounted, ref } from "vue";
import { Language } from "@/types/Settings";
import { StoryBriefing } from "@/types/StoryJson";
import { useSettingsStore } from "@store/settings";
import NeuTitleBar from "@widgets/NeuUI/NeuTitleBar.vue";
import StoryBriefBlock from "./StoryBriefBlock.vue";

const settingsStore = useSettingsStore();

const props = withDefaults(
  defineProps<{
    title: StoryBriefing["title"];
    avatar: StoryBriefing["avatar"];
    index: number;
    sections: StoryBriefing["sections"];
    type?: "mainStory" | "otherStory";
    totalLength?: number;
  }>(),
  {
    type: "mainStory",
  }
);

// eslint-disable-next-line vue/no-setup-props-destructure
const openChapters: Ref<number[]> = ref([(props.totalLength ?? -1) - 1]);
const language = computed(() => settingsStore.getLang);

function getTitleText(
  title: StoryBriefing["title"],
  language: Language = "cn"
) {
  return (
    Reflect.get(
      title,
      `Text${language.slice(0, 1).toUpperCase() + language.slice(1)}`
    ) || "NO TITLE"
  );
}

function handleOpenChapters(index: number) {
  if (openChapters.value.includes(index)) {
    openChapters.value = openChapters.value.filter(i => i !== index);
  } else {
    openChapters.value.push(index);
  }
}

onMounted(() => import("@/components/StoryViewer.vue"));
</script>

<template>
  <div class="story-line-container">
    <neu-title-bar
      :title="getTitleText(title, language)"
      class="title-bar gap-bottom"
      :avatar="avatar"
      :index="index"
      :is-active="openChapters.includes(index)"
      @clicked="handleOpenChapters(index)"
    />
    <router-link
      v-for="section in sections"
      :to="{
        name: `${'mainStory' === type ? 'Main' : 'Other'}StoryDetails`,
        params: { id: section.story_id },
        query: { type: 'mainStory' === type ? 'main' : 'other' },
      }"
      v-show="openChapters.includes(index)"
      :key="section.story_id"
    >
      <story-brief-block
        :title="getTitleText(section.title, language)"
        :avatar="avatar"
        :description="section.summary"
        :is-before-battle="section.is_before_battle"
        :is-after-battle="section.is_after_battle"
      />
    </router-link>
  </div>
  <router-view></router-view>
</template>

<style scoped lang="scss">
.story-line-container {
  display: grid;
  grid-auto-flow: row;
  width: 30rem;
}

.title-bar {
  position: sticky;
  top: 0;
}

.gap-bottom {
  margin-bottom: 1rem;
}

a {
  text-decoration: none;
}

@media screen and (max-width: 768px) {
  .story-line-container {
    width: calc(100vw - 2rem);
  }
}
</style>
