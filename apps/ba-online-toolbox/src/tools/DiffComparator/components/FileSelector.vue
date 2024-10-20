<script lang="ts" setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { useDiffComparatorStore } from "../store/DiffComparatorStore";
import { Scenario } from "../../ScenarioEditor/types/content";
import { isEmpty } from "radash";
import ContentPreview from "./ContentPreview.vue";

const props = defineProps<{
  file: {
    name: string;
    content: Scenario;
  };
  index: number;
}>();

const diffComparatorStore = useDiffComparatorStore();

function dragOverHandler(event: DragEvent) {
  event.preventDefault();
}

function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

function dropHandler(event: DragEvent) {
  event.preventDefault();
  const files = event.dataTransfer?.files;
  if (files && 0 !== files.length) {
    for (let i = 0; i <= Math.min(files.length - 1, 1); i++) {
      const fileName = files[i].name as string;
      readFile(files[i])
        .then(data => {
          const dat = JSON.parse(data);
          diffComparatorStore.setFile(
            files.length === 1 ? props.index : i,
            fileName,
            dat
          );
        })
        .catch(e => {
          ElMessage.error("文件读取失败: " + e);
        });
    }
  }
}

const fileInput = ref<HTMLInputElement | null>(null);

function clickHandle() {
  fileInput.value?.click();
}

function inputHandle(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = (target.files as FileList)[0];
  if (!file) {
    return;
  }
  const fileName = file.name;
  readFile(file)
    .then(data => {
      const dat = JSON.parse(data);
      diffComparatorStore.setFile(props.index, fileName, dat);
    })
    .catch(() => {
      ElMessage.error("文件读取失败");
    });
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <input
      id="uploadFile"
      ref="fileInput"
      type="file"
      accept="application/json, application/x-yaml, text/yaml"
      style="display: none"
      @change="inputHandle($event)"
    />
    <div
      class="w-full bg-white @dark:bg-slate-800 border-solid border-1 border-blue p-4 pt-2 pb-2 rounded-lg cursor-pointer text-dark @dark:text-gray-200"
      @click="clickHandle"
    >
      {{ props.file.name }} [拖动文件至此或点击上传]
    </div>
    <div
      v-if="!!isEmpty(props.file.content)"
      class="file-upload gap-4 flex flex-col bg-white rounded-lg h-full w-[588px] max-w-[40dvw] justify-center items-center cursor-pointer"
      @dragover="dragOverHandler"
      @drop="dropHandler"
      @click="clickHandle"
    >
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
      </div>
    </div>
    <content-preview
      :content="file.content"
      @dragover="dragOverHandler"
      @drop="dropHandler"
      v-else
    />
  </div>
</template>

<style scoped lang="scss">
.file-upload {
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
</style>
