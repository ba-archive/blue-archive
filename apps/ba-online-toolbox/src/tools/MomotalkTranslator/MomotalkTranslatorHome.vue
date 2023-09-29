<script setup lang="ts">
import { saveAs } from 'file-saver';
import jsYaml from 'js-yaml';
import {
  NButton,
  NInputGroup,
  NSpace,
  NSwitch,
  NTag,
  NTooltip,
} from 'naive-ui';
import { Ref, computed, ref, watch } from 'vue';
import TranslateUnit from './components/MessageTranslateUnit.vue';
import TitleTranslateUnit from './components/TitleTranslateUnit.vue';
import { useMainStore } from './store/mainStore';
import { FileContent } from './types/FileContent';
import { Student } from './types/Student';

const mainStore = useMainStore();
const studentName = computed(() => mainStore.getStudentName);
const studentId = computed(() => mainStore.getStudentId);
const translator = ref(mainStore.getTranslator);
const fileDownloaded = ref(false);
const proofreadMode: Ref<boolean> = ref(mainStore.getProofreadState);
const globalReferenceMode: Ref<boolean> = ref(mainStore.getGlobalReferenceMode);

watch(
  () => mainStore.getTranslator,
  newTranslator => {
    translator.value = newTranslator;
  }
);

watch(
  () => translator.value,
  newValue => {
    updateTranslator(newValue);
  }
);

function updateTranslator(translator: string) {
  mainStore.updateTranslator(translator);
}

function updateStudentName(studentId: number) {
  return new Promise<void>((resolve, reject) => {
    fetch('https://preview.blue-archive.io/config/json/students.json')
      .then(response => response.json())
      .then(data => {
        const student = data.find(
          (student: Student) => student.id === studentId
        );
        mainStore.setStudentName(student?.name.cn);
        document.title = `Rosetta - ${student?.name.cn}`;
        resolve();
      })
      .catch(e => {
        reject(e);
      });
  });
}

function readFile(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = event => {
      resolve(event.target?.result as string);
    };
    reader.onerror = error => {
      reject(error);
    };
    reader.readAsText(file);
  });
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = (target.files as FileList)[0];
  readFile(file).then(data => {
    const parsed = jsYaml.load(data) as FileContent;
    mainStore.setFileContent(parsed);
    updateStudentName(parsed.CharacterId).catch(e => {
      console.error(e);
    });
  });
}

function clearAll() {
  const inputButton = document.getElementById('file-input') as HTMLInputElement;
  inputButton.value = '';
  fileDownloaded.value = false;
  mainStore.clearAll();
  document.title = 'Rosetta';
}

function getStudentName() {
  const name = mainStore.getStudentName;
  if ([undefined, '暂无信息', '学生暂未录入', ''].includes(name)) {
    return '新增学生';
  }
  return name;
}

// return 24h hhmm format time
function getCurrentTime() {
  const date = new Date();
  const hour = date.getHours();
  const minute = date.getMinutes();
  return `${hour < 10 ? '0' + hour : hour}${
    minute < 10 ? '0' + minute : minute
  }`;
}

function handleDownload() {
  updateTranslator(translator.value);
  const fileContent = mainStore.getFileContent;
  const blob = new Blob([jsYaml.dump(fileContent, { quotingType: '"' })], {
    type: 'text/plain;charset=utf-8',
  });
  const proofreader = mainStore.getProofreader;
  const fileStatus = proofreadMode.value ? `已校-${proofreader}` : '待校';
  saveAs(
    blob,
    `${fileStatus}-${getCurrentTime()}-${getStudentName()}_${
      studentId.value
    }.yml`
  );
  fileDownloaded.value = true;
}

const proofreader = ref(mainStore.getProofreader);

watch(
  () => proofreader.value,
  newValue => {
    mainStore.updateProofreader(newValue);
  }
);

function handleUpdateProofreadMode(value: boolean) {
  mainStore.updateProofreadState(value);
}

function handleUpdateGlobalReferenceMode(value: boolean) {
  mainStore.updateGlobalReferenceMode(value);
}
</script>

<template>
  <div id="proofread-container">
    <n-space vertical align="center">
      <n-space vertical align="center">
        <h3>参考模式</h3>
        <n-switch
          v-model:value="globalReferenceMode"
          @update:value="handleUpdateGlobalReferenceMode"
        >
          <template #checked>开</template>
          <template #unchecked>关</template>
        </n-switch>
      </n-space>
      <n-space vertical align="center">
        <h3>我是校对</h3>
        <n-space vertical :align="'center'">
          <n-switch
            @update:value="handleUpdateProofreadMode"
            v-model:value="proofreadMode"
          >
            <template #checked>开</template>
            <template #unchecked>关</template>
          </n-switch>
          <n-input-group :class="proofreadMode ? '' : 'hidden'">
            <n-tag type="info" :bordered="false">校对者</n-tag>
            <input
              type="text"
              id="proofreader"
              class="translator-name"
              v-model="proofreader"
            />
          </n-input-group>
        </n-space>
      </n-space>
    </n-space>
  </div>
  <n-space class="translate-app-main" vertical align="center">
    <input id="file-input" type="file" @change="handleFileChange" />
    <p>学生姓名：{{ studentName }}</p>
    <p>学生 ID：{{ studentId }}</p>
    <n-tooltip trigger="hover">
      <template #trigger>
        <n-button type="error" @click="clearAll">清除</n-button>
      </template>
      选择该选项将会清空所有信息，请谨慎使用！
    </n-tooltip>
    <n-input-group class="translator-container">
      <n-tag :bordered="false" type="info">译者</n-tag>
      <input class="translator-name" v-model="translator" />
    </n-input-group>
    <h3>标题</h3>
    <div class="vertical-grid">
      <title-translate-unit
        v-for="(content, index) in mainStore.getMomotalkTitles"
        :key="index"
        :index="index"
        :content="content"
      />
    </div>
    <h3>对话</h3>
    <div class="vertical-grid">
      <translate-unit
        v-for="(content, index) in mainStore.getMomotalkContents"
        :index="index"
        :key="content.Id"
        :content="content"
      />
    </div>
    <h3>输出</h3>
    <n-input-group class="translator-container">
      <n-tag :bordered="false" type="info">译者</n-tag>
      <input class="translator-name" v-model="translator" />
    </n-input-group>
    <n-space>
      <n-button type="info" @click="handleDownload">下载文件至本地</n-button>

      <n-tooltip trigger="hover" v-if="fileDownloaded">
        <template #trigger>
          <n-button type="error" @click="clearAll">清除</n-button>
        </template>
        选择该选项将会清空所有信息，请谨慎使用！
      </n-tooltip>
    </n-space>
  </n-space>
</template>

<style scoped lang="scss">
.translate-app-main {
  margin: 24px 0;
}

:deep(.translator-container) {
  display: flex;
  justify-content: center;
  width: 20rem;
}

:deep(.content-container) {
  grid-gap: 1rem;
  display: grid;
  grid-template-columns: 1fr min-content 1fr;
  width: 48rem;
}

:deep(.translation-area, .translator-name) {
  border-color: #e0e0e5;
  border-radius: 3px;

  &:focus {
    z-index: 999;
    outline: none;
    border: 1px solid #5bab70;
  }
}

:deep(.hidden) {
  visibility: hidden;
}

:deep(.translator-name) {
  border: 1px solid #e0e0e5;
}

:deep(.prefix-label) {
  color: #999;
}

:deep(.origin-title) {
  display: flex;
  align-items: flex-start;
}

:deep(.origin-text) {
  margin-top: 0.2rem;
}

:deep(.flex-vertical-justified) {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

#proofread-container {
  display: flex;
  position: fixed;
  top: 0;
  right: 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: fit-content;
  height: 100vh;
}

#proofreader {
  max-width: 7rem;
}

:deep(.hint-reference-mode) {
  font-size: 0.65rem;
}

:deep(.reference-row) {
  display: flex;
}
</style>
