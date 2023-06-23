<template>
  <div class="player-pane">
    <div class="player-container rounded-medium" ref="playerContainerElement">
      <ba-story-player
        class="player-body rounded-small"
        v-if="showPlayer"
        :story="mainStore.getScenario"
        :change-index="targetIndex"
        :language="playerLanguage"
        :width="playerContainerWidth - 24"
        :height="playerContainerHeight - 24"
        :user-name="mainStore.getScenario.translator ?? 'Sensei'"
        :story-summary="{ chapterName: '', summary: '' }"
        data-url="https://yuuka.cdn.diyigemt.com/image/ba-all-data"
      >
      </ba-story-player>
    </div>
  </div>
</template>
<script setup lang="ts">
import BaStoryPlayer from 'ba-story-player';
// import { PlayerProps } from 'ba-story-player';
import { computed, ref, watch } from 'vue';
import { useGlobalConfig } from '../store/configStore';
import { useScenarioStore } from '../store/scenarioEditorStore';
import { Language } from '../types/content';
import { useElementSize } from '@vueuse/core';
import 'ba-story-player/dist/style.css';

const mainStore = useScenarioStore();
const config = useGlobalConfig();
const playerContainerElement = ref<HTMLElement>();

const { width: playerContainerWidth, height: playerContainerHeight } =
  useElementSize(playerContainerElement);

// const playerLanguage = computed(() => config.getTargetLang.slice(4));

const targetIndex = computed(() => config.getSelectLine);

const isPreviewMode = computed(() => config.getPreviewMode);
const targetLanguage = computed(() => config.getTargetLang);
const showPlayer = ref(true);
const playerLanguage = ref('Jp');

const previewConfig = computed(() => {
  return {
    isPreviewMode: isPreviewMode.value,
    targetLanguage: targetLanguage.value,
  };
});

function getFormattedTargetLanguage(language: Language) {
  return language.slice(4);
}

function refreshPlayer() {
  showPlayer.value = false;
  setTimeout(() => {
    showPlayer.value = true;
  }, 1);
}

watch(
  () => previewConfig.value,
  newValue => {
    if (!newValue.isPreviewMode && 'Jp' !== playerLanguage.value) {
      playerLanguage.value = 'Jp';
      refreshPlayer();
      return;
    }

    playerLanguage.value = getFormattedTargetLanguage(newValue.targetLanguage);
    refreshPlayer();
  },
  { immediate: true }
);
</script>
<style scoped lang="scss">
.player-pane {
  grid-area: player;
  padding-right: 1rem;
  width: 100%;
  height: 100%;
}

.player-container {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
  width: 100%;
  height: 100%;

  .player-body {
    overflow: hidden;
  }
}
</style>
