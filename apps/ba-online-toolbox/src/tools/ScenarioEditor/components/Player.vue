<template>
  <div class="player-pane">
    <div class="player-container rounded-medium" ref="playerContainerElement">
      <ba-story-player
        class="player-body rounded-small"
        v-if="showPlayer"
        @initiated="handlePlayerInit"
        :story="mainStore.getScenario"
        :language="playerLanguage"
        :width="playerContainerWidth - 24"
        :height="playerContainerHeight - 24"
        :user-name="mainStore.getScenario.translator ?? 'Sensei'"
        :story-summary="{ chapterName: '', summary: '' }"
        data-url="https://yuuka.cdn.diyigemt.com/image/ba-all-data"
        ref="StoryPlayer"
      >
      </ba-story-player>
    </div>
  </div>
</template>
<script setup lang="ts">
import BaStoryPlayer from 'ba-story-player';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import eventBus from '../eventsSystem/eventBus';
import { useGlobalConfig } from '../store/configStore';
import { useScenarioStore } from '../store/scenarioEditorStore';
import { Language } from '../types/content';
import { useElementSize, watchDebounced } from '@vueuse/core';
import 'ba-story-player/dist/style.css';
import {
  StoryRawUnit,
  TranslatedStoryUnit,
} from 'ba-story-player/lib/types/common';

const mainStore = useScenarioStore();
const config = useGlobalConfig();
const playerContainerElement = ref<HTMLElement>();
const StoryPlayer = ref<{
  hotReplaceStoryUnit(
    unit: StoryRawUnit | StoryRawUnit[] | TranslatedStoryUnit,
    index: number,
    textOnly?: boolean
  ): void;
  resetLive2d(): void; // 将live2d重置为初始状态并且重新播放live2d
}>();

onMounted(() => {
  eventBus.on('resetLive2d', () => {
    StoryPlayer.value && StoryPlayer.value.resetLive2d();
  });
  eventBus.on('refreshPlayer', () => {
    refreshPlayer();
  });
});

onUnmounted(() => {
  eventBus.off('resetLive2d');
  eventBus.off('refreshPlayer');
});

const { width: playerContainerWidth, height: playerContainerHeight } =
  useElementSize(playerContainerElement);

// const playerLanguage = computed(() => config.getTargetLang.slice(4));
let lastLine = config.getSelectLine;
watchDebounced(
  () =>
    mainStore.getScenario.content[config.getSelectLine][config.getTargetLang],
  () => {
    const currentLine = config.getSelectLine;
    let textOnly = lastLine === currentLine;
    if (!textOnly) {
      lastLine = currentLine;
    }
    StoryPlayer.value &&
      StoryPlayer.value.hotReplaceStoryUnit(
        mainStore.getScenario.content[config.getSelectLine],
        config.getSelectLine,
        textOnly
      );
  },
  {
    debounce: 200,
  }
);

function handlePlayerInit() {
  StoryPlayer.value &&
    StoryPlayer.value.hotReplaceStoryUnit(
      mainStore.getScenario.content[config.getSelectLine],
      config.getSelectLine
    );
}

const isPreviewMode = computed(() => config.getPreviewMode);
const targetLanguage = computed(() => config.getTargetLang);
const showPlayer = ref(true);
const playerLanguage = ref<"Cn" | "Jp" | "En" | "Tw">('Jp');

const previewConfig = computed(() => {
  return {
    isPreviewMode: isPreviewMode.value,
    targetLanguage: targetLanguage.value,
  };
});

function getFormattedTargetLanguage(language: Language) {
  return language.slice(4) as "Cn" | "Jp" | "En" | "Tw";
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
