<template>
  <n-modal
    v-model:show="showModal"
    preset="dialog"
    :style="{ width: '600px' }"
    size="huge"
    :bordered="false"
    to="body"
    positive-text="确定"
    negative-text="取消"
    @positive-click="handlePositiveClick"
  >
    <template #header> MomoTalk 文件 </template>

    您正在尝试上传一个 MomoTalk 文件。<br />
    点击“确定”跳转到 MomoTalk 编辑器。
  </n-modal>
  <div
    class="loadFile flex-vertical center fill-screen"
    @drop="dragHandle"
    @dragover="dragOver"
  >
    <div class="upload-pane" @click="clickHandle">
      <svg
        class="uploadIMG"
        width="56"
        height="42"
        viewBox="0 0 56 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <!-- eslint-disable max-len -->
        <path
          d="M30 42.0001V30.0001H38L28 18.0001L18 30.0001H26V42.0001H15C10.8 41.8001 7.20001 40.4001 4.40001 37.6001C1.60001 34.8001 0.200011 31.2001 1.14441e-05 27.0001C1.14441e-05 23.0001 1.40001 19.8001 3.80001 17.0001C6.20001 14.2001 9.40001 12.6001 13.2 12.2001C14 8.60006 15.6 5.60006 18.4 3.40006C21.2 1.20006 24.4 6.10352e-05 28 6.10352e-05C31.6 6.10352e-05 34.8 1.20006 37.6 3.40006C40.4 5.60006 42 8.60006 42.8 12.2001C46.6 12.6001 49.8 14.4001 52.2 17.0001C54.6 19.8001 56 23.0001 56 27.0001C55.8 31.2001 54.4 34.8001 51.6 37.6001C48.8 40.4001 45.2 41.8001 41 42.0001H30Z"
          fill="#C0C4CC"
        />
        <!-- eslint-enable max-len -->
      </svg>
      <div class="tips" style="font-size: 16px">
        将文件拖拽至此或
        <span class="pseudo-link">点击上传</span>
        <input
          id="uploadFile"
          type="file"
          accept="application/json, application/x-yaml, text/yaml"
          style="display: none"
          @change="inputHandle($event)"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import jsYaml from "js-yaml";
import { useScenarioStore } from "../store/scenarioEditorStore";
import { Scenario } from "../types/content";
import { ref } from "vue";
import { FileContent as MomotalkFileContent } from "../../MomotalkTranslator/types/FileContent";
import { useRouter } from "vue-router";

const router = useRouter();

const mainStore = useScenarioStore();

const dragHandle = (event: DragEvent) => {
  event.preventDefault();
  const files = event.dataTransfer?.files;
  if (files && 0 !== files.length) {
    fileHandle(files[0]);
  }
};

const dragOver = (e: DragEvent): void => {
  e.preventDefault();
};

const inputHandle = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  const file = (target.files as FileList)[0];
  fileHandle(file);
};

const showModal = ref(false);
const tempMomotalkData = ref({} as MomotalkFileContent);

function handlePositiveClick() {
  import("../../MomotalkTranslator/store/mainStore").then(module => {
    const { useMainStore: callMomotalkStore } = module;
    const momotalkStore = callMomotalkStore();
    momotalkStore.setFileContent(tempMomotalkData.value);
    router.push("/momotalk");
  });
}

const fileHandle = (file: File): void => {
  mainStore.setTitle(file.name);
  readFile(file).then(data => {
    let parsed: Scenario = {} as Scenario;
    try {
      if (file.name.endsWith(".json")) {
        parsed = JSON.parse(data) as Scenario;
        mainStore.setScenario(parsed);
      } else if (file.name.endsWith(".yaml") || file.name.endsWith(".yml")) {
        showModal.value = true;
        tempMomotalkData.value = jsYaml.load(data) as MomotalkFileContent;
      }
    } catch (e) {
      console.error(e);
      alert("文件格式错误");
      return;
    }
  });
};

const clickHandle = (): void => {
  const fileInput = document.getElementById("uploadFile") as HTMLInputElement;
  fileInput.click();
};

const readFile = (file: File): Promise<string> => {
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
};
</script>
<style scoped lang="scss">
#tips {
  position: relative;
  z-index: 1;
}

//noinspection CssOverwrittenProperties
.loadFile {
  display: flex;
  position: relative;
  flex: 1;
  width: 100vw;
  width: 100dvw;
  height: calc(100vh - 48px);
  height: calc(100dvh - 48px);
  user-select: none;
}

.upload-pane {
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.375s ease-in-out;
  cursor: pointer;
  box-sizing: border-box;
  border: 1px dashed #e4e7ed;
  border-radius: 4px;
  background: #ffffff;
  width: 30vw;
  height: 15vw;
  text-align: center;

  .pseudo-link {
    transition: all 0.375s ease-in-out;
    color: var(--color-arona-blue);
  }

  &:hover {
    border: 2px dashed var(--color-arona-blue);
    background-color: #ecf5ff;
    color: #909399;

    .pseudo-link {
      color: #909399;
    }

    svg {
      path {
        fill: #909399;
      }
    }
  }
}

.uploadIMG {
  margin-top: 10%;
  margin-bottom: 5%;
  width: 25%;
  height: 30%;
}

path {
  transition: all 0.375s ease-in-out;
}
</style>
