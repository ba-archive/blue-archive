<template>
  <div class="footer fixed bottom-0 shadow-xl">
    <div class="content bg-white @dark:bg-slate-800">
      <n-space class="translator">
        <n-space class="flex-horizontal">
          <n-text>我是校对</n-text>
          <n-switch
            :value="config.isProofread"
            @click="config.setProofread(!config.isProofread)"
          >
            <template #checked> 是 </template>
            <template #unchecked> 否 </template>
          </n-switch>
        </n-space>
        <n-text style="flex: 1"
          >{{ config.isProofread ? "校对" : "翻译" }}: </n-text
        ><n-input
          v-model:value="staffName"
          @input="handleStaffChange($event)"
        ></n-input
      ></n-space>
      <n-tooltip>
        <template #trigger>
          <n-button type="primary" @click="downloadHandle"
            >下载内容到本地</n-button
          >
        </template>
        文件名: {{ getFileName() }}
        <br />
        快捷键: <kbd>{{ isMac ? "⌘" : "Ctrl" }}</kbd> +
        <kbd>{{ isMac ? "S" : "S" }}</kbd>
      </n-tooltip>
      <!-- <n-button type="info" @click="handlePreviewModeRequest">{{
        isPreviewMode ? "取消预览" : "预览全文翻译"
      }}</n-button> -->
      <n-button
        v-if="!hasFileSaved"
        secondary
        type="error"
        @click="handleShowClearAllButtonRequest"
        >我已经保存了，显示清空按钮</n-button
      >
      <n-button v-if="hasFileSaved" type="error" @click="handleClearAllRequest"
        >清空全部内容</n-button
      >
    </div>
  </div>
</template>
<script setup lang="ts">
import { saveAs } from "file-saver";
import { computed, ref, onMounted, onUnmounted } from "vue";
import { useGlobalConfig } from "../store/configStore";
import { useScenarioStore } from "../store/scenarioEditorStore";
import { isMac } from "../../public/helper/isMac";

const mainStore = useScenarioStore();
const config = useGlobalConfig();
const hasFileSaved = ref(false);
const isPreviewMode = computed(() => config.getPreviewMode);

function normalizeFileId(fileId: string): string {
  const fileIdStr = fileId;
  const characterId = fileIdStr.slice(0, 5);
  const groupId = fileIdStr.slice(5);
  if (groupId.startsWith("0")) {
    return `${characterId}${groupId.slice(1)}`;
  }
  return fileIdStr;
}

function getFileName() {
  const groupId = mainStore.getGroupId.toString();
  let fileId = groupId;
  if (groupId.length > 5) {
    fileId = normalizeFileId(groupId);
  }
  return `[${config.isProofread ? "已校对" : "未校对"}]${fileId}.json`;
}

const emit = defineEmits(["downloaded"]);

function createDownload() {
  const blob = new Blob([JSON.stringify(mainStore.getScenario, null, 2)], {
    type: "text/plain;charset=utf-8",
  });
  saveAs(blob, getFileName());
  hasFileSaved.value = true;
  emit("downloaded");
}

const downloadHandle = () => {
  const defaultName = staffName.value;
  if (defaultName) {
    handleStaffChange(defaultName);
    createDownload();
    return;
  }
  const newStaffName =
    prompt(`请输入${config.isProofread ? "校对" : "翻译"}昵称`) ?? "";
  handleStaffChange(newStaffName);
  createDownload();
};

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === "s" && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    downloadHandle();
  }
}

onMounted(() => {
  document.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeyDown);
});

function handleShowClearAllButtonRequest() {
  hasFileSaved.value = true;
}

function handleClearAllRequest() {
  hasFileSaved.value = false;
  mainStore.clearAll();
  config.resetConfigState();
  config.resetTmpTranslation();
}

function handlePreviewModeRequest() {
  config.setPreviewMode(!isPreviewMode.value);
}

const isProofreaderMode = computed(() => config.isProofread);

const staffName = computed({
  get: () => {
    const isProofreader = isProofreaderMode.value;
    return isProofreader
      ? mainStore.getProofreader || config.getDefaultProofreaderName
      : mainStore.getScenario.translator || config.getDefaultTranslatorName;
  },
  set: (value: string) => {
    handleStaffChange(value);
  },
});

function handleStaffChange(event: string) {
  if (config.isProofread) {
    mainStore.setProofreader(event);
    config.setDefaultProofreaderName(event);
  } else {
    mainStore.setTranslator(event);
    config.setDefaultTranslatorName(event);
  }
}
</script>
<style scoped lang="scss">
.footer {
  width: 100vw;
  width: 100dvw;
  max-width: 1440px;
  opacity: 0.6;
  transition: opacity 0.175s ease-in-out;
  &:hover {
    opacity: 1;
  }

  .content {
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    height: 7.5vh;

    .translator {
      display: flex;
      align-items: center;
    }
  }
}

kbd {
  border: 1px solid #fff;
  border-radius: 4px;
  padding: 0 4px;
}
</style>
