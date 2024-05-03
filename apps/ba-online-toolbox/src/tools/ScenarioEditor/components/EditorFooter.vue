<template>
  <div class="footer">
    <div class="content">
      <n-space class="translator">
        <n-space class="flex-horizontal">
          <n-text>我是校对：</n-text>
          <n-switch
            @click="config.setProofread(!config.isProofread)"
            :value="config.isProofread"
          >
            <template #checked> 是 </template>
            <template #unchecked> 否 </template>
          </n-switch>
        </n-space>
        <span style="flex: 1">{{ config.isProofread ? "校对" : "翻译" }}: </span
        ><n-input
          v-model:value="staffName"
          @input="handleStaffChange($event)"
        ></n-input
      ></n-space>
      <n-tooltip>
        <template #trigger>
          <n-button type="primary" @click="downloadHandle">保存内容</n-button>
        </template>
        文件名: {{ getFileName() }}
      </n-tooltip>
      <n-button type="info" @click="handlePreviewModeRequest">{{
        isPreviewMode ? "取消预览" : "预览全文翻译"
      }}</n-button>
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
import { computed, ref } from "vue";
import { useGlobalConfig } from "../store/configStore";
import { useScenarioStore } from "../store/scenarioEditorStore";

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

const downloadHandle = () => {
  const blob = new Blob([JSON.stringify(mainStore.getScenario, null, 2)], {
    type: "text/plain;charset=utf-8",
  });
  saveAs(blob, getFileName());
  hasFileSaved.value = true;
};

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
  get: () =>
    isProofreaderMode.value
      ? mainStore.getProofreader
      : mainStore.getScenario.translator || "",
  set: (value: string) => {
    handleStaffChange(value);
  },
});

function handleStaffChange(event: string) {
  if (config.isProofread) {
    mainStore.setProofreader(event);
  } else {
    mainStore.setTranslator(event);
  }
}
</script>
<style scoped lang="scss">
.footer {
  grid-area: footer;
  width: 100%;

  .content {
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    background-color: #fff;
    height: 7.5vh;

    .translator {
      display: flex;
      align-items: center;
    }
  }
}
</style>
