<script setup lang="ts">
import {
  computed,
  useTemplateRef,
  onMounted,
  onUnmounted,
  onActivated,
  onDeactivated,
} from "vue";
import { momotalkEditorStore } from "../store/momotalkEditorStore";
import MomotalkContainer from "./MomotalkContainer.vue";
import { useElementBounding } from "@vueuse/core";
import EInput from "./widgets/EInput.vue";
import type { Language } from "../types/Momotalks";
import { isMac } from "../../public/helper/isMac";
import { saveAs } from "file-saver";
import { dump } from "js-yaml";
import { useRouter } from "vue-router";
import { Message } from "@arco-design/web-vue";
import "@arco-design/web-vue/es/button/style/css.js";

const router = useRouter();
const useMomotalkEditorStore = momotalkEditorStore();

const mmtList = computed(() => useMomotalkEditorStore.getMomotalkTitle);
const mmtListLength = computed(() => mmtList.value.length);

const titleElementRef = useTemplateRef("titleElement");
const { height: titleElementHeight } = useElementBounding(titleElementRef);

const containerHeight = computed(() => {
  return `calc(100dvh - ${titleElementHeight.value}px)`;
});

const isDownloaded = computed(() => useMomotalkEditorStore.getIsDownloaded);
const isProofreaderMode = computed({
  get: () => useMomotalkEditorStore.getProofreaderMode,
  set: mode => useMomotalkEditorStore.setProofreaderMode(mode),
});

const translationLabel: Array<{
  label: "简体中文" | "繁体中文" | "日文" | "韩文" | "英文" | "泰文";
  value: Language;
}> = [
  {
    label: "简体中文",
    value: "Cn",
  },
  {
    label: "繁体中文",
    value: "Tw",
  },
  {
    label: "日文",
    value: "Jp",
  },
  {
    label: "韩文",
    value: "Kr",
  },
  {
    label: "英文",
    value: "En",
  },
  {
    label: "泰文",
    value: "Th",
  },
];

enum StaffRole {
  Translator = 0,
  Proofreader = 1,
}

const staffLabel: Array<{
  label: "翻译" | "校对";
  value: StaffRole;
}> = [
  { label: "翻译", value: StaffRole.Translator },
  { label: "校对", value: StaffRole.Proofreader },
];

const staffRoleLabel = computed({
  get: () => {
    const role = useMomotalkEditorStore.getProofreaderMode;
    return role ? StaffRole.Proofreader : StaffRole.Translator;
  },
  set: (value: StaffRole) => {
    useMomotalkEditorStore.setProofreaderMode(value === StaffRole.Proofreader);
  },
});

const staffName = computed({
  get: () =>
    isProofreaderMode.value
      ? useMomotalkEditorStore.getProofreader
      : useMomotalkEditorStore.getTranslator,
  set: (value: string) => {
    isProofreaderMode.value
      ? useMomotalkEditorStore.setProofreader(value)
      : useMomotalkEditorStore.setTranslator(value);
  },
});

const selectedTranslation = computed({
  get: () => useMomotalkEditorStore.getSelectedTranslation,
  set: translation =>
    useMomotalkEditorStore.setSelectedTranslation(translation),
});

const targetTranslation = computed({
  get: () => useMomotalkEditorStore.getTargetTranslation,
  set: translation => useMomotalkEditorStore.setTargetTranslation(translation),
});

function handleDownload() {
  const readyData = useMomotalkEditorStore.getDownloadReadyFileData(
    isProofreaderMode.value
  );
  if (!readyData) {
    Message.error("无法获取文件内容，请联系管理员");
    return;
  }
  switch (isProofreaderMode.value) {
    case true:
      if (!readyData?.proofreader || !readyData?.proofreader.length) {
        if (useMomotalkEditorStore.getProofreader) {
          readyData.proofreader = useMomotalkEditorStore.getProofreader;
        } else {
          Message.error("请先填写校对名称");
          return;
        }
      }
      break;
    case false:
      if (!readyData?.translator || !readyData?.translator.length) {
        if (useMomotalkEditorStore.getTranslator) {
          readyData.translator = useMomotalkEditorStore.getTranslator;
        } else {
          Message.error("请先填写翻译名称");
          return;
        }
      }
      break;
  }
  const studentId = readyData?.CharacterId ?? 0;
  const blob = new Blob(
    [dump(readyData, { quotingType: '"', forceQuotes: true })],
    {
      type: "application/yaml",
    }
  );
  saveAs(blob, `已${isProofreaderMode.value ? "校" : "翻"}-${studentId}.yml`);
  useMomotalkEditorStore.setIsDownloaded(true);
}

function handleReset(gotoTranslation = false) {
  useMomotalkEditorStore.setIsDownloaded(false);
  useMomotalkEditorStore.reset();
  if (gotoTranslation) {
    router.push("/editor");
  }
}

function handleKeyboardEvent(event: KeyboardEvent) {
  type ModifierKey = "metaKey" | "ctrlKey";
  type ShortcutKey = "KeyS";

  const shortcuts: Record<
    ShortcutKey,
    {
      modifiers: ModifierKey[];
      action: () => void;
    }
  > = {
    KeyS: {
      modifiers: isMac ? ["metaKey"] : ["ctrlKey"],
      action: handleDownload,
    },
  };
  const shortcut = shortcuts[event.code as ShortcutKey];
  if (shortcut && shortcut.modifiers.every(mod => event[mod])) {
    event.preventDefault();
    shortcut.action();
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleKeyboardEvent);
});
onActivated(() => {
  window.addEventListener("keydown", handleKeyboardEvent);
});

onDeactivated(() => {
  window.removeEventListener("keydown", handleKeyboardEvent);
});
onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyboardEvent);
});
</script>

<template>
  <div
    w-screen
    h-screen
    flex
    flex-col
    items-center
    justify-start
    overflow-hidden
    bg-gray-100
    class="@dark:bg-slate-800"
  >
    <div flex flex-col w-screen items-center pt-5 ref="titleElement">
      <a-space align="center" size="mini">
        <template #split>
          <a-divider direction="vertical" />
        </template>

        <EInput v-model="staffName" :width="200">
          <template #prefix>
            <a-select :options="staffLabel" v-model="staffRoleLabel" />
          </template>
        </EInput>
        <a-space size="mini">
          <a-select v-model="selectedTranslation" :options="translationLabel" />
          <span class="text-gray-600 @dark:text-gray-300">翻译为</span>
          <a-select
            v-model="targetTranslation"
            :options="translationLabel"
            :style="{ width: '106px' }"
          />
        </a-space>
        <span
          v-if="!isDownloaded"
          class="text-gray-600 @dark:text-gray-300 text-xs"
        >
          使用 <kbd>{{ isMac ? "⌘" : "Ctrl" }}</kbd> + <kbd>S</kbd> 下载文件
        </span>
        <a-dropdown-button
          v-if="isDownloaded"
          status="danger"
          @click="handleReset(false)"
        >
          清空
          <template #content>
            <a-doption @click="handleReset(true)">清空并前往剧情翻译</a-doption>
          </template>
        </a-dropdown-button>
      </a-space>
      <a-divider />
    </div>

    <div
      w-screen
      pl-5
      pr-5
      overflow-x-scroll
      :style="{
        height: containerHeight,
        overscrollBehaviorX: 'contain',
      }"
    >
      <a-space
        size="mini"
        align="start"
        class="mmt-container"
        :style="{
          height: containerHeight,
        }"
      >
        <template #split>
          <a-divider
            direction="vertical"
            :style="{ height: containerHeight }"
          />
        </template>
        <MomotalkContainer
          v-for="(mmt, idx) in mmtList"
          :key="mmt.GroupId"
          :title="mmt"
          :idx="idx"
          :total="mmtListLength"
        />
      </a-space>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.mmt-container .arco-space-item) {
  @apply h-full overflow-y-scroll !items-start;
}

kbd {
  @apply px-1 py-0.5 text-xs rounded-sm border-1 border-gray-300 border-solid;
}
</style>
