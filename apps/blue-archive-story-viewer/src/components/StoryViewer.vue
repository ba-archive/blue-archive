<template>
  <div class="fill-screen center player-container" ref="playerContainerElement">
    <error-screen
      :route-path="route.path"
      :error-message="fetchErrorMessage"
      v-if="fetchError"
    />
    <div class="loading-container" v-if="!ready">
      <neu-progress-bar :show-percentage="true" :progress="initProgress" />
    </div>
    <div class="content-wrapper flex-vertical rounded-small">
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
          <img src="@assets/info.svg" />
        </template>
        <template #content>
          <dialog-content />
        </template>
      </neu-dialog>

      <div
        class="flex-vertical story-container"
        v-if="consentFromConfirmed && ready && !fetchError"
      >
        <div v-if="!playEnded">Story ID {{ storyId }}</div>
        <story-player
          v-if="showPlayer && !playEnded"
          :change-index="changeIndex"
          :story="story"
          class="player-container"
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
        />
        <img :src="useSuperSamplingImgPath" alt="" style="opacity: 0" />
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
        <div v-if="!playEnded" class="player-settings flex-horizontal">
          <div>
            <neu-switch :checked="useMp3" @update:value="handleUseMp3" />
            <span>{{
              getI18nString(userLanguage, "settings.useMp3Title")
            }}</span>
          </div>
          <div class="flex-horizontal">
            <neu-switch
              :checked="![undefined, false, ''].includes(useSuperSampling)"
              @update:value="handleUseSuperSampling"
            />
            <span>{{
              getI18nString(userLanguage, "settings.useSuperSamplingTitle")
            }}</span>
          </div>
          <!--          <div @click="changeIndex = 50">change index 50</div>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import StoryPlayer from "ba-story-player";
import { computed, ref, watch } from "vue";
import { nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import DialogContent from "./widgets/DialogContent.vue";
import ErrorScreen from "./widgets/ErrorScreen.vue";
import NeuDialog from "./widgets/NeuUI/NeuDialog.vue";
import NeuProgressBar from "./widgets/NeuUI/NeuProgressBar.vue";
import NeuSwitch from "./widgets/NeuUI/NeuSwitch.vue";
import {
  CommonStoryTextObject,
  Section,
  StoryAbstract,
  StoryContent,
  StoryIndex,
} from "@/types/StoryJson";
import { getI18nString } from "@i18n/getI18nString";
import { stories } from "@index/mainStoryIndex";
import { stories as OtherStories } from "@index/otherStoryIndex";
import { useSettingsStore } from "@store/settings";
import { getAllFlattenedStoryIndex } from "@util/getAllFlattenedStoryIndex";
import { useElementSize } from "@vueuse/core";
import "ba-story-player/dist/style.css";

const changeIndex = ref(0);

const route = useRoute();
const router = useRouter();
const storyId = computed(() => route.params.id);
const storyQueryType = computed(() => route.query.type ?? "main");
const consentFromConfirmed = ref(false);
const story = ref<StoryContent>({} as StoryContent);
const storyIndex = ref<StoryIndex>({} as StoryIndex);

const settingsStore = useSettingsStore();
const userName = computed(() => settingsStore.getUsername);
const playerContainerElement = ref<HTMLElement>();
const userLanguage = computed(() => settingsStore.getLang);
const playerLanguage = computed(
  () =>
    settingsStore.getLang.charAt(0).toUpperCase() +
    settingsStore.getLang.slice(1)
);
const playEnded = ref(false);

const initProgress = ref(0);
const ready = ref(false);
const fetchError = ref(false);
const fetchErrorMessage = ref({});
/* eslint-disable max-len */
const summary = ref({
  chapterName: "序章",
  summary:
    "从奇怪的梦中醒来之后的[USERNAME]老师从联邦学生会的干部七神凛那里听到学生会长失踪的消息。由于学生会长失踪，学园城市基沃托斯陷入了混乱。为了解决这场混乱，老师和学生会的干部一同前往夏莱办公室。",
});
/* eslint-enable max-len */
const studentId = computed(() => route.params.id as string);
const favorGroupId = computed(() => (route.params.groupId as string) ?? "");
const shouldReturnToMomotalk = "true" === route.query?.returnToMomotalk;
// 存储故事类型并以此生成请求url
const isStuStory = computed(() =>
  route.name === "StudentStoryViewer" ? true : false
);
const queryUrl = isStuStory.value
  ? `/story/favor/${studentId.value}/${favorGroupId.value}.json`
  : `/story/${storyQueryType.value}/${storyId.value}.json`;
axios
  .get(queryUrl, {
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
    fetchError.value = true;
    if (!isStuStory.value) {
      fetchErrorMessage.value =
        route.params.id.toString() === "11000"
          ? err
          : "该剧情目前尚未开放，敬请期待！";
    } else {
      fetchErrorMessage.value =
        404 === err.response.status
          ? {
              message: "Story not found",
              response: {
                status: 1919,
              },
            }
          : err;
    }
  })
  .finally(() => {
    ready.value = true;
  });

const { width: containerWidth, height: containerHeight } = useElementSize(
  playerContainerElement
);
const playerWidth = ref(0);
const playerHeight = ref(0);
const startFullScreen = ref(document.body.clientWidth < 425);
const useMp3 = computed(() => settingsStore.getUseMp3);
const useSuperSampling = computed(() => settingsStore.getUseSuperSampling);
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

/* eslint-disable indent */
watch(
  () => containerWidth.value,
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

function handleConsentFormConfirm() {
  consentFromConfirmed.value = true;
}

const showPlayer = ref(true);

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

const allStoryIndex = getAllFlattenedStoryIndex(stories).concat(
  getAllFlattenedStoryIndex(OtherStories)
);

const currentStoryIndexUnit: Section | undefined = allStoryIndex.find(
  story => story.story_id === parseInt(storyId.value as string)
);

function getTextByLanguage(textObject: CommonStoryTextObject | undefined) {
  if (!textObject) {
    return "No corresponding text found / 未找到对应文本";
  }
  return (
    Reflect.get(
      textObject,
      `Text${
        userLanguage.value.slice(0, 1).toUpperCase() +
        userLanguage.value.slice(1)
      }`
    ) || "No corresponding text found / 未找到对应文本"
  );
}

// 学生故事模式下获取 summary 的方法
function getSummaryTextByKey(summary: StoryAbstract, key: string) {
  return Reflect.get(Reflect.get(summary, key), "Text" + playerLanguage.value);
}

function handleSummaryDisplayLanguageChange() {
  if (isStuStory.value) {
    const currentChapterAbstract = storyIndex.value.abstracts.find(
      abstract => abstract.groupId.toString() === favorGroupId.value
    );
    if (currentChapterAbstract) {
      const tempChapterName = getSummaryTextByKey(
        currentChapterAbstract,
        "title"
      );
      const tempSummary = getSummaryTextByKey(
        currentChapterAbstract,
        "abstract"
      );
      summary.value = {
        chapterName: "string" === typeof tempChapterName ? tempChapterName : "",
        summary: "string" === typeof tempSummary ? tempSummary : "",
      };
    }
  } else {
    summary.value = {
      chapterName: getTextByLanguage(currentStoryIndexUnit?.title),
      summary: getTextByLanguage(currentStoryIndexUnit?.summary),
    };
  }
}

watch(
  () => userLanguage.value,
  async () => {
    handleSummaryDisplayLanguageChange();
    await reloadPlayer();
  }
);

// 在学生故事模式下通过 axios 获取 summary
if (!isStuStory.value) {
  handleSummaryDisplayLanguageChange();
} else {
  axios
    .get(`/story/favor/${studentId.value}/index.json`)
    .then(res => {
      storyIndex.value = res.data;
      handleSummaryDisplayLanguageChange();
    })
    .catch(err => {
      console.error(err);
    });
}

async function handleUseMp3(value: boolean) {
  settingsStore.setUseMp3(value);
  await reloadPlayer();
}

async function handleUseSuperSampling(value: boolean) {
  settingsStore.setUseSuperSampling(value ? "2" : "");
  await reloadPlayer();
}

function findPreviousStoryId(): number | undefined {
  if (currentStoryIndexUnit?.previous) {
    return currentStoryIndexUnit.previous;
  }
  return undefined;
}

function findNextStoryId(): number | undefined {
  if (currentStoryIndexUnit?.next) {
    return currentStoryIndexUnit.next;
  }
  return undefined;
}

function handleStoryEnd() {
  console.log("剧情结束");
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
</script>

<style scoped lang="scss">
.story-container {
  .player-settings {
    margin-top: 1rem;
    user-select: none;
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

.player-container {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
}

:deep(.pseudo-fullscreen) {
  z-index: 512 !important;
}
</style>
