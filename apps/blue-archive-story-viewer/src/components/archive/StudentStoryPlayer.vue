<template>
  <div
    class="flex-vertical fill-screen player-container"
    ref="playerContainerElement"
  >
    <error-screen
      v-if="fetchError"
      :error-message="fetchErrorMessage"
      :route-path="route.path"
    />
    <div class="loading-container" v-if="!ready">
      <neu-progress-bar :show-percentage="true" :progress="initProgress" />
    </div>

    <neu-dialog
      v-if="!consentFromConfirmed && ready && !fetchError"
      title="提示"
      show-mask="false"
      shadow
      positive-text="明白"
      negative-text="不明白"
      @positiveClick="handleConsentFormConfirm"
    >
      <template #title-before>
        <img src="/src/assets/info.svg" />
      </template>
      <template #content>
        <dialog-content />
      </template>
    </neu-dialog>

    <div
      class="flex-vertical story-container"
      v-if="consentFromConfirmed && ready && !fetchError"
    >
      <div>Story ID {{ favorGroupId }}</div>
      <story-player
        v-if="showPlayer"
        :story="story"
        :width="playerWidth"
        :height="playerHeight"
        data-url="https://yuuka.cdn.diyigemt.com/image/ba-all-data"
        :language="language"
        :userName="userName"
        :story-summary="summary"
        :start-full-screen="startFullScreen"
        :use-mp3="useMp3"
        :use-super-sampling="useSuperSampling"
        @end="handleStoryEnd"
      />
      <div class="player-settings flex-horizontal">
        <div class="flex-horizontal">
          <neu-switch :checked="useMp3" @update:value="handleUseMp3" />
          <span>兼容 Apple 设备</span>
        </div>
        <div class="flex-horizontal">
          <neu-switch
            :checked="![undefined, false, ''].includes(useSuperSampling)"
            @update:value="handleUseSuperSampling"
          />
          <span>开启 2x 超分辨率</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import StoryPlayer from 'ba-story-player';
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSettingsStore } from '../../store/settings';
import { StoryAbstract, StoryContent, StoryIndex } from '../../types/StoryJson';
import DialogContent from '../widgets/DialogContent.vue';
import ErrorScreen from '../widgets/ErrorScreen.vue';
import NeuDialog from '../widgets/NeuUI/NeuDialog.vue';
import NeuProgressBar from '../widgets/NeuUI/NeuProgressBar.vue';
import NeuSwitch from '../widgets/NeuUI/NeuSwitch.vue';
import { useElementSize } from '@vueuse/core';
import 'ba-story-player/dist/style.css';

const route = useRoute();
const router = useRouter();
const settingsStore = useSettingsStore();

const ready = ref(false);
const initProgress = ref(0);
// get 请求是否出错
const fetchError = ref(false);
const fetchErrorMessage = ref({});

const studentId = computed(() => route.params.id as string);
const favorGroupId = computed(() => route.params.groupId as string);
const language = computed(
  () =>
    settingsStore.getLang.charAt(0).toUpperCase() +
    settingsStore.getLang.slice(1)
);
const showPlayer = ref(true);

function getSummaryTextByKey(summary: StoryAbstract, key: string) {
  return Reflect.get(Reflect.get(summary, key), 'Text' + language.value);
}

function handleSummaryDisplayLanguageChange() {
  const currentChapterAbstract = storyIndex.value.abstracts.find(
    abstract => abstract.groupId.toString() === favorGroupId.value
  );
  if (currentChapterAbstract) {
    const tempChapterName = getSummaryTextByKey(
      currentChapterAbstract,
      'title'
    );
    const tempSummary = getSummaryTextByKey(currentChapterAbstract, 'abstract');
    summary.value = {
      chapterName: 'string' === typeof tempChapterName ? tempChapterName : '',
      summary: 'string' === typeof tempSummary ? tempSummary : '',
    };
  }
}

watch(
  () => language.value,
  () => {
    showPlayer.value = false;
    handleSummaryDisplayLanguageChange();
    setTimeout(() => {
      showPlayer.value = true;
    }, 0);
  }
);

const story = ref<StoryContent>({} as StoryContent);
const storyIndex = ref<StoryIndex>({} as StoryIndex);
const summary = ref({
  chapterName: '序章',
  summary:
    '从奇怪的梦中醒来之后的[USERNAME]老师从联邦学生会的干部七神凛那里听到学生会长失踪的消息。由于学生会长失踪，学园城市基沃托斯陷入了混乱。为了解决这场混乱，老师和学生会的干部一同前往夏莱办公室。',
});
const userName = computed(() => settingsStore.getUsername);
const playerContainerElement = ref<HTMLElement>();
const consentFromConfirmed = ref(false);

axios
  .get(`/story/favor/${studentId.value}/${favorGroupId.value}.json`, {
    onDownloadProgress: progressEvent => {
      if (progressEvent.total) {
        initProgress.value = Math.floor(
          ((progressEvent.loaded || 0) * 100) / (progressEvent.total || 1)
        );
      } else {
        initProgress.value = Math.floor(
          ((progressEvent.loaded || 0) * 100) /
            ((progressEvent.loaded || 0) + 100)
        );
      }
    },
  })
  .then(res => {
    story.value = res.data;
  })
  .catch(err => {
    console.error(err);
    fetchError.value = true;
    fetchErrorMessage.value =
      404 === err.response.status
        ? '学生剧情目前尚未完全开放，还请期待！'
        : err;
  })
  .finally(() => {
    ready.value = true;
  });

axios
  .get(`/story/favor/${studentId.value}/index.json`)
  .then(res => {
    storyIndex.value = res.data;
    handleSummaryDisplayLanguageChange();
  })
  .catch(err => {
    console.error(err);
  });

const { width: containerWidth, height: containerHeight } = useElementSize(
  playerContainerElement
);

const playerWidth = ref(0);
const playerHeight = ref(0);
const startFullScreen = ref(document.body.clientWidth <= 425);
const useMp3 = computed(() => settingsStore.getUseMp3);
const useSuperSampling = computed(() => settingsStore.getUseSuperSampling);

/* eslint-disable indent */
watch(
  () => [containerWidth.value, containerHeight.value],
  () => {
    playerWidth.value =
      document.body.clientWidth <= 360
        ? window.screen.availWidth - 32
        : Math.min(
            containerWidth.value - 32,
            (16 * (containerHeight.value - 32)) / 9,
            768
          );
    playerHeight.value = Math.floor(
      Math.min((playerWidth.value * 9) / 16, containerHeight.value)
    );
  },
  { immediate: true }
);
/* eslint-enable indent */

// 检测浏览器是否为 webkit，如果是则使用 mp3
/* eslint-disable-next-line */
// @ts-ignore
if (typeof window.webkitConvertPointFromNodeToPage === 'function') {
  settingsStore.setUseMp3(true);
}

function handleConsentFormConfirm() {
  consentFromConfirmed.value = true;
  // 不是第一次直接刷新
  (window as any).hasStoryPlayed = true;
}
function reloadPlayer(forceReload = false) {
  if (!forceReload) {
    showPlayer.value = false;
    setTimeout(() => {
      showPlayer.value = true;
    }, 4);
    return;
  }
  setTimeout(() => {
    router.go(0);
  }, 375);
}
function handleUseMp3(value: boolean) {
  settingsStore.setUseMp3(value);
  reloadPlayer();
}
function handleUseSuperSampling(value: boolean) {
  console.log('超分选项：' + value ? '2倍' : '关闭');
  settingsStore.setUseSuperSampling(value ? '2' : '');
  reloadPlayer();
}

const shouldReturnToMomotalk = 'true' === route.query?.returnToMomotalk;

function handleStoryEnd() {
  router.push(
    shouldReturnToMomotalk
      ? `/archive/${studentId.value}/momotalk`
      : `/archive/${studentId.value}/story`
  );
}
</script>

<style scoped lang="scss">
.title {
  margin-bottom: 1rem;
}

.player-container {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
}

.story-container {
  flex: 1;
  width: 100%;

  .player-settings {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
    user-select: none;
  }
}

:deep(.pseudo-fullscreen) {
  z-index: 512 !important;
}
</style>
