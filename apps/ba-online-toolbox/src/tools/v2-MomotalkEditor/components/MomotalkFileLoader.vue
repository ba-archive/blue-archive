<template>
  <a-modal
    @ok="handlePositiveClick"
    @cancel="readAsMomotalk"
    v-model:visible="showModal"
  >
    <template #title> 检测到剧情翻译文件 </template>
    <div>
      您正在尝试上传一个剧情翻译文件。<br />
      点击"确定"跳转到剧情翻译编辑器。 <br />
      点击"取消"，我们将会尝试将文件作为 MomoTalk 文件处理。<br />
    </div>
  </a-modal>
  <div
    class="flex flex-col items-center justify-center relative flex-1 w-screen h-screen select-none"
    @drop="handleFileDrop"
    @dragover="dragOver"
  >
    <div
      class="flex flex-col items-center transition-all duration-375 cursor-pointer box-border rounded w-[480px] h-[248px] text-center hover:border-2 hover:border-dashed hover:border-[--color-arona-blue] bg-white dark:bg-slate-800 border border-solid border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-800 dark:text-slate-200"
      @click="clickHandle"
    >
      <svg
        class="mt-[10%] mb-[5%] w-[25%] h-[30%] transition-all duration-375 hover:fill-[#909399]"
        width="56"
        height="42"
        viewBox="0 0 56 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M30 42.0001V30.0001H38L28 18.0001L18 30.0001H26V42.0001H15C10.8 41.8001 7.20001 40.4001 4.40001 37.6001C1.60001 34.8001 0.200011 31.2001 1.14441e-05 27.0001C1.14441e-05 23.0001 1.40001 19.8001 3.80001 17.0001C6.20001 14.2001 9.40001 12.6001 13.2 12.2001C14 8.60006 15.6 5.60006 18.4 3.40006C21.2 1.20006 24.4 6.10352e-05 28 6.10352e-05C31.6 6.10352e-05 34.8 1.20006 37.6 3.40006C40.4 5.60006 42 8.60006 42.8 12.2001C46.6 12.6001 49.8 14.4001 52.2 17.0001C54.6 19.8001 56 23.0001 56 27.0001C55.8 31.2001 54.4 34.8001 51.6 37.6001C48.8 40.4001 45.2 41.8001 41 42.0001H30Z"
          fill="#C0C4CC"
          class="transition-all duration-375"
        />
      </svg>
      <div class="text-base">
        将文件拖拽至此或
        <span
          class="transition-all duration-375 text-[--color-arona-blue] hover:text-[#909399]"
          >点击上传</span
        >
        <input
          id="uploadFile"
          type="file"
          accept="application/json, application/x-yaml, text/yaml"
          class="hidden"
          @change="inputHandle($event)"
        />
      </div>
    </div>
    <a-button type="primary" mt-5 @click="handleImportData"
      >导入旧版翻译数据</a-button
    >
  </div>
</template>
<script setup lang="ts">
import jsYaml from "js-yaml";
import { ref } from "vue";
import { Scenario } from "../../ScenarioEditor/types/content";
import type { FileContent } from "../types/Momotalks";
import { momotalkEditorStore } from "../store/momotalkEditorStore";
import { useRouter } from "vue-router";
import { Message } from "@arco-design/web-vue";

const router = useRouter();

const useMomotalkEditorStore = momotalkEditorStore();
const tempScenarioData = ref({} as Scenario);
const tempMomotalkData = ref({} as FileContent);

const showModal = ref(false);

function handlePositiveClick() {
  showModal.value = false;
  import("../../ScenarioEditor/store/scenarioEditorStore").then(module => {
    const { useScenarioStore: callScenarioStore } = module;
    const scenarioStore = callScenarioStore();
    scenarioStore.setScenario(tempScenarioData.value);
    router.push("/editor");
  });
}

function handleFileDrop(event: DragEvent) {
  event.preventDefault();
  const files = event.dataTransfer?.files;
  if (files && 0 !== files.length) {
    handleFile(files[0]);
  }
}

const dragOver = (e: DragEvent): void => {
  e.preventDefault();
};

const inputHandle = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  const file = (target.files as FileList)[0];
  if (file) {
    handleFile(file);
  }
};

enum FileType {
  Scenario = 0,
  Momotalk = 1,
}

function checkMomotalkFileValidity(content: any) {
  if (
    content.title &&
    content.title?.length > 0 &&
    content.content &&
    content.content?.length > 0
  ) {
    return true;
  }
  return false;
}

function readAsMomotalk() {
  // 检测是否有 title，content 键
  if (checkMomotalkFileValidity(tempScenarioData.value)) {
    useMomotalkEditorStore.setMomotalkFileData(
      tempScenarioData.value as unknown as FileContent
    );
  } else {
    Message.error("文件不是有效的 MomoTalk 数据文件");
  }
}

function handleFile(file: File) {
  filePreProcessor(file).then(result => {
    if (result.type === FileType.Scenario) {
      tempScenarioData.value = result.content as Scenario;
      showModal.value = true;
    } else {
      tempMomotalkData.value = result.content as FileContent;
      if (checkMomotalkFileValidity(tempMomotalkData.value)) {
        useMomotalkEditorStore.setMomotalkFileData(tempMomotalkData.value);
        useMomotalkEditorStore.setFilename(file.name);
        if (inferProofread()) {
          useMomotalkEditorStore.setProofreaderMode(true);
        }
      } else {
        Message.error("文件不是有效的 MomoTalk 数据文件");
      }
    }
  });
}

function filePreProcessor(file: File): Promise<{
  type: FileType;
  content: Scenario | FileContent;
}> {
  const fileExtension = file.name.split(".").pop()?.toLowerCase();
  if (fileExtension === "json") {
    // 是 Scenario 文件
    return readFile(file).then(data => {
      try {
        const parsed = JSON.parse(data) as Scenario;
        return {
          type: FileType.Scenario,
          content: parsed,
        };
      } catch (e) {
        throw new Error("文件已损坏，请联系管理员处理");
      }
    });
  } else {
    return readFile(file).then(data => {
      try {
        const parsed = jsYaml.load(data) as FileContent;
        return {
          type: FileType.Momotalk,
          content: parsed,
        };
      } catch (e) {
        throw new Error("文件已损坏，请联系管理员处理");
      }
    });
  }
}

function inferProofread(): boolean {
  const fileName = useMomotalkEditorStore.getFilename ?? "";
  const content = useMomotalkEditorStore.getMomotalkFileData ?? {};
  // 根据内容，推断是否进入校对模式
  // 去除后缀的文件名包含"已翻"，返回 true
  // title / content 中某一条目的 unsure flag 为 true，返回 true
  // title / content 中 TextCn / MessageCN 有内容的条目占比超过 90%，返回 true
  // 否则返回 false
  const fileNameWithoutSuffix = fileName.replace(/\.[^/.]+$/, "");
  if (fileNameWithoutSuffix.includes("已翻")) {
    console.log("文件名带有已翻字样");
    return true;
  }
  // @ts-expect-error
  if (!content || !content.title || !content.content) {
    return false;
  }
  // @ts-ignore
  const titleUnits = (content as FileContent).title;
  // @ts-ignore
  const messageUnits = (content as FileContent).content;
  const merged = [...titleUnits, ...messageUnits];
  const unsureCount = merged.filter(unit => unit.unsure).length;
  if (unsureCount > 0) {
    console.log("文件中含有unsure flag");
    return true;
  }

  const textCnCount = titleUnits.filter(
    unit => unit.TextCn && unit.TextCn.length > 0
  ).length;
  const messageCnCount = messageUnits.filter(
    unit =>
      (unit.ImagePath && unit.ImagePath.length > 0) ||
      (unit.MessageCN && unit.MessageCN.length > 0)
  ).length;
  console.log("textCnCount", textCnCount);
  if (textCnCount + messageCnCount > merged.length * 0.9) {
    console.log("文本翻译条目占比超过90%");
    return true;
  }
  return false;
}

const clickHandle = (): void => {
  const fileInput = document.getElementById("uploadFile") as HTMLInputElement;
  fileInput.click();
};

function readFile(file: File): Promise<string> {
  return new Promise<string>(function (resolve, reject) {
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

function handleImportData() {
  const oldData = localStorage.getItem("translation");

  if (oldData) {
    try {
      useMomotalkEditorStore.reset();
      const newData = JSON.parse(oldData);
      useMomotalkEditorStore.setMomotalkFileData(newData.fileContent);
      if (inferProofread()) {
        useMomotalkEditorStore.setProofreaderMode(true);
      }
    } catch (e) {
      alert("错误：" + e);
    }
  } else {
    Message.info("没有找到旧版翻译数据");
  }
}
</script>
