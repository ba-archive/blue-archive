<template>
  <div
    class="flex flex-col flex-1 items-center justify-center w-full"
    ref="playerContainerElement"
  >
    <error-screen
      :route-path="route.path"
      :error-message="fetchErrorMessage"
      v-if="fetchError"
    />
    <div class="loading-container" v-if="!ready">
      <neu-progress-bar :show-percentage="true" :progress="initProgress" />
    </div>
    <div class="content-wrapper flex-vertical rounded-small">
      <div
        class="flex-vertical story-container"
        v-if="ready && !fetchError && !notImplementedError"
      >
        <div class="story-info flex-horizontal" v-if="!playEnded">
          <svg
            role="button"
            class="icon-back"
            @click="handleGoBack"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <!-- eslint-disable max-len -->
            <path
              d="M10.7327 19.791C11.0326 20.0766 11.5074 20.0651 11.7931 19.7652C12.0787 19.4652 12.0672 18.9905 11.7673 18.7048L5.51587 12.7502L20.25 12.7502C20.6642 12.7502 21 12.4144 21 12.0002C21 11.586 20.6642 11.2502 20.25 11.2502L5.51577 11.2502L11.7673 5.29551C12.0672 5.00982 12.0787 4.53509 11.7931 4.23516C11.5074 3.93523 11.0326 3.92369 10.7327 4.20938L3.31379 11.2761C3.14486 11.437 3.04491 11.6422 3.01393 11.8556C3.00479 11.9024 3 11.9507 3 12.0002C3 12.0498 3.00481 12.0982 3.01398 12.1451C3.04502 12.3583 3.14496 12.5634 3.31379 12.7243L10.7327 19.791Z"
            />
            <!-- eslint-enable max-len -->
          </svg>
          <neu-tag>
            {{ getI18nString(userLanguage, `storyType.${storyType}`) }}
          </neu-tag>
          <div>
            {{ summary.chapterName }}
          </div>
          <neu-tag type="warning" bordered v-if="isLLMTranslation">
            AI 翻译
          </neu-tag>
          <neu-tag type="warning" bordered v-if="!story.proofreader">
            未校对
          </neu-tag>
        </div>
        <story-player
          v-if="showPlayer && !playEnded"
          class="story-player"
          @initiated="handleInitiated"
          :change-index="changeIndex"
          :story="story"
          :width="playerWidth"
          :height="playerHeight"
          data-url="https://yuuka.cdn.diyigemt.com/image/ba-all-data"
          :language="playerLanguage"
          :userName="userName"
          :story-summary="summary"
          :start-full-screen="startFullScreen"
          :use-mp3="useMp3"
          :use-super-sampling="useSuperSampling"
          :exit-fullscreen-time-out="5000"
          @end="handleStoryEnd"
          @error="handleError()"
        />
        <img :src="useSuperSamplingImgPath" alt="" class="h-0 w-0 absolute" />
        <div v-if="!isStuStory && playEnded" class="flex-vertical">
          <div>播放已完成</div>
          <div class="flex-horizontal jump-container">
            <div
              @click="handleReplay"
              class="user-button shadow-near rounded-small"
            >
              {{ getI18nString(userLanguage, "playerControl.replay") }}
            </div>
            <a
              v-if="undefined !== findPreviousStoryId()"
              :href="`/${storyQueryType}Story/${findPreviousStoryId()}?type=${storyQueryType}`"
              class="user-button shadow-near rounded-small"
              >{{ getI18nString(userLanguage, "routes.previous") }}</a
            >
            <a
              :href="`/${storyQueryType}Story`"
              class="user-button shadow-near rounded-small"
              >{{ getI18nString(userLanguage, "routes.backToIndex") }}</a
            >
            <a
              v-if="undefined !== findNextStoryId()"
              :href="`/${storyQueryType}Story/${findNextStoryId()}?type=${storyQueryType}`"
              class="user-button shadow-near rounded-small"
              >{{ getI18nString(userLanguage, "routes.next") }}</a
            >
          </div>
        </div>
        <div v-if="!playEnded" class="player-footer flex-horizontal">
          <div class="story-info flex-horizontal">
            <div>
              <div>Story ID</div>
              <div>{{ isStuStory ? favorGroupId : storyId }}</div>
            </div>
            <div>
              <div>翻译</div>
              <div class="translator">
                {{ story.translator || "佚名" }}
              </div>
            </div>
            <div>
              <div>校对</div>
              <div class="translator">
                {{ story.proofreader || "未校对" }}
              </div>
            </div>
          </div>
          <div class="flex-horizontal player-settings">
            <div class="flex-horizontal player-settings__settings--container">
              <span>{{
                getI18nString(userLanguage, "settings.useMp3Title")
              }}</span>
              <!-- @vue-expect-error Boolean not applicable to wider type range -->
              <neu-switch :checked="useMp3" @update:value="handleUseMp3" />
            </div>
            <div class="flex-horizontal player-settings__settings--container">
              <span>{{
                getI18nString(userLanguage, "settings.useSuperSamplingTitle")
              }}</span>
              <!-- @vue-expect-error Boolean not applicable to wider type range -->
              <neu-switch
                :checked="![undefined, false, ''].includes(useSuperSampling)"
                @update:value="handleUseSuperSampling"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import StoryPlayer from "ba-story-player";
import { computed, nextTick, ref, watch, ComputedRef } from "vue";
import { useRoute, useRouter } from "vue-router";
import ErrorScreen from "./widgets/ErrorScreen.vue";
import NeuProgressBar from "./widgets/NeuUI/NeuProgressBar.vue";
import NeuSwitch from "./widgets/NeuUI/NeuSwitch.vue";
import { Section, StoryContent } from "@/types/StoryJson";
import { ElMessage } from "element-plus";
import { getI18nString } from "@i18n/getI18nString";
import { useSettingsStore } from "@store/settings";
import { useElementSize } from "@vueuse/core";
import { capitalize } from "radash";
import "ba-story-player/dist/style.css";
import NeuTag from "./widgets/NeuUI/NeuTag.vue";
import NeuDialog from "./widgets/NeuUI/NeuDialog.vue";
import {
  getStoryJson,
  getStorySummary,
  type QueryType,
} from "@/util/playerUtils";

const route = useRoute();
const router = useRouter();
const storyId = computed(() => route.params.id as string);
const storyQueryType = computed(() => route.query.type ?? "main");
const story = ref<StoryContent>({} as StoryContent);
const storySummaryRaw = ref<Section | undefined>();

const settingsStore = useSettingsStore();
const userName = computed(() => settingsStore.getUsername);
const playerContainerElement = ref<HTMLElement>();
const userLanguage = computed(() => settingsStore.getLang);
const playerLanguage = computed(() =>
  capitalize(settingsStore.getLang)
) as ComputedRef<"Cn" | "Jp" | "En" | "Tw">;
const playEnded = ref(false);

const initProgress = ref(0);
const ready = ref(false);
const fetchError = ref(false);
const fetchErrorMessage = ref({
  message: "",
  response: {
    status: 0,
  },
});
const showPlayer = ref(false);

const changeIndex = ref(0);
const isLLMTranslation = ref(false);

function handleInitiated() {
  if (route.query.changeIndex) {
    const rawIndex = parseInt(route.query.changeIndex as string);
    if (!Number.isNaN(rawIndex)) {
      changeIndex.value = rawIndex;
    }
  }
}

/* eslint-disable max-len */
const summary = ref({
  chapterName: "",
  summary: "",
});
/* eslint-enable max-len */
const studentId = computed(() => route.params.id as string);
const favorGroupId = computed(() => (route.params.groupId as string) ?? "");
const shouldReturnToMomotalk = "true" === route.query?.returnToMomotalk;
const notImplementedError = computed(() => false);

// 判断是不是学生好感剧情
const isStuStory = computed(() =>
  route.name === "StudentStoryViewer" ? true : false
);

const storyType = computed(() => {
  if (isStuStory.value) {
    return "favor";
  }
  return storyQueryType.value;
});

getStoryJson(
  storyType.value as QueryType,
  {
    storyId: favorGroupId.value || storyId.value,
  },
  progressEvent => {
    const total = progressEvent.total || progressEvent.loaded + 100;
    initProgress.value = Math.floor((progressEvent.loaded * 100) / total);
  }
)
  .then(res => {
    story.value = res.story as StoryContent;
    isLLMTranslation.value = res.isAiTranslated;
    showPlayer.value = true;
  })
  .catch(err => {
    fetchError.value = true;
    fetchErrorMessage.value = err;
  })
  .finally(() => {
    ready.value = true;
  });

getStorySummary(storyType.value as QueryType, {
  directoryId: studentId.value,
  storyId: isStuStory.value ? favorGroupId.value : storyId.value,
}).then(res => {
  if (res) {
    storySummaryRaw.value = res as Section;
    updateSummary();
  }
});

function getSummaryTextByKey(summary: Section, key: string) {
  return Reflect.get(Reflect.get(summary, key), "Text" + playerLanguage.value);
}

function updateSummary() {
  if (storySummaryRaw.value) {
    summary.value.chapterName = getSummaryTextByKey(
      storySummaryRaw.value,
      "title"
    );
    summary.value.summary = getSummaryTextByKey(
      storySummaryRaw.value,
      "abstract"
    );
  }
}

const { width: containerWidth, height: containerHeight } = useElementSize(
  playerContainerElement
);
const playerWidth = ref(0);
const playerWidthWithUnit = computed(() => playerWidth.value + "px");
const playerHeight = ref(0);
const startFullScreen = ref(
  document.body.clientWidth < 425 || settingsStore.getInitWithFullscreen
);
const useMp3 = computed(() => settingsStore.getUseMp3);
const useSuperSampling = computed(() => settingsStore.getUseSuperSampling);
// 超分埋点
const useSuperSamplingImgPath = computed(
  () =>
    `https://yuuka.cdn.diyigemt.com/image/ba-all-data/${
      useSuperSampling.value ? "use" : "noUse"
    }SuperSampling.gif`
);

// 检测浏览器是否为 webkit，如果是则使用 mp3
if (typeof window.webkitConvertPointFromNodeToPage === "function") {
  settingsStore.setUseMp3(true);
}

const appHeight = computed(() => settingsStore.getAppSize.height);
const appWidth = computed(() => settingsStore.getAppSize.width);

/* eslint-disable indent */
watch(
  () => [containerWidth.value, containerHeight.value],
  () => {
    playerWidth.value = Math.ceil(
      document.body.clientWidth <= 360
        ? window.screen.availWidth - 32
        : Math.min(
            containerWidth.value * 0.8,
            (16 * (appHeight.value - 256)) / 9,
            appWidth.value - 64
          )
    );
    playerHeight.value = Math.floor(
      Math.min((playerWidth.value * 9) / 16, appHeight.value - 256)
    );
  },
  { immediate: true }
);
async function reloadPlayer(forceReload = false) {
  if (!forceReload) {
    showPlayer.value = false;
    await nextTick();
    showPlayer.value = true;
    return;
  }
  setTimeout(() => {
    router.go(0);
  }, 375);
}

watch(
  () => playerLanguage.value,
  () => {
    updateSummary();
    reloadPlayer();
  }
);

async function handleUseMp3(value: boolean) {
  settingsStore.setUseMp3(value);
  await reloadPlayer();
}

async function handleUseSuperSampling(value: boolean) {
  settingsStore.setUseSuperSampling(value ? "2" : "");
  await reloadPlayer();
}

function findPreviousStoryId(): number | undefined {
  if (storySummaryRaw.value?.previous) {
    return storySummaryRaw.value.previous;
  }
  return undefined;
}

function findNextStoryId(): number | undefined {
  if (storySummaryRaw.value?.next) {
    return storySummaryRaw.value.next;
  }
  return undefined;
}

function handleStoryEnd() {
  if (isStuStory.value) {
    router.push(
      shouldReturnToMomotalk
        ? `/archive/${studentId.value}/momotalk`
        : `/archive/${studentId.value}/story`
    );
  } else {
    setTimeout(
      () => (playEnded.value = true),
      "main" === storyQueryType.value ? 4000 : 4
    );
  }
}

async function handleReplay() {
  playEnded.value = false;
  await reloadPlayer();
}

function handleGoBack() {
  router.go(-1);
}

function handleError(message = "播放可能失败，请刷新页面重试") {
  ElMessage.error({
    message: message,
    center: true,
    showClose: true,
  });
}
</script>

<style scoped lang="scss">
.story-container {
  gap: 0.5rem;

  .story-info {
    gap: 0.5rem;
    width: 100%;

    .icon-back {
      cursor: pointer;
      width: 24px;
      height: 24px;
      path {
        fill: var(--color-text-main);
      }
    }
  }

  .player-footer {
    justify-content: space-between;
    gap: 1rem;
    width: 100%;
    user-select: none;

    .story-info {
      gap: 1rem;

      .translator {
        font-weight: bold;
      }
    }

    .player-settings {
      gap: 0.5rem;

      span {
        white-space: nowrap;
      }

      &__settings--container {
        gap: 0.5rem;
      }
    }
  }
}

.jump-container {
  gap: 1rem;
  margin-top: 1rem;

  .user-button {
    cursor: pointer;
    background-color: var(--color-option-button);
    padding: 0.5rem;
    width: fit-content;
    color: var(--color-text-ingame);
    text-decoration: none;
  }
}

.story-player {
  border-radius: 6px;
  overflow: hidden;
}

:deep(.pseudo-fullscreen) {
  z-index: 512 !important;
}

@media screen and (max-width: 650px) {
  .story-container {
    .story-info {
      flex-wrap: wrap;
      width: v-bind(playerWidthWithUnit);
    }
  }

  .player-footer {
    flex-direction: column;
    width: v-bind(playerWidthWithUnit);

    .story-info {
      flex-wrap: wrap;
      width: v-bind(playerWidthWithUnit);
      justify-content: space-between;
    }

    .player-settings {
      flex-wrap: wrap;
      align-items: flex-start;
      width: v-bind(playerWidthWithUnit);
    }
  }
}
</style>
