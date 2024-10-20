<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useDiffComparatorStore } from "../store/DiffComparatorStore";
import * as Diff from "diff";
import { Diff2HtmlUI } from "diff2html/lib/ui/js/diff2html-ui-slim.js";
import eventBus from "../events/events";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import { ElMessage } from "element-plus";
import { useColorMode } from '@vueuse/core'

const mode = useColorMode();

import "highlight.js/styles/github.css";
import "diff2html/bundles/css/diff2html.min.css";

const diffCompareStore = useDiffComparatorStore();
// @ts-ignore
const file1 = diffCompareStore.getFile(0);
// @ts-ignore
const file2 = diffCompareStore.getFile(1);

const diffElement = ref<HTMLElement | null>(null);

const diff = Diff.createTwoFilesPatch(
  file1.name,
  file2.name,
  JSON.stringify(file1.content, null, 2),
  JSON.stringify(file2.content, null, 2),
  undefined,
  undefined,
  {
    // @ts-ignore
    stripTrailingCr: true,
  }
);

onMounted(() => {
  if (!diffElement.value) {
    return;
  }
  const diff2htmlUi = new Diff2HtmlUI(diffElement.value, diff, {
    drawFileList: false,
    fileListToggle: false,
    highlight: true,
    fileListStartVisible: false,
    fileContentToggle: false,
    matching: "words",
    outputFormat: "line-by-line",
    // @ts-ignore
    colorScheme: "auto",
  });

  diff2htmlUi.draw();
  diff2htmlUi.highlightCode();
});

function handleReturn() {
  eventBus.emit("endCompare");
}

function handleNew() {
  eventBus.emit("startNew");
}

function handleDownload() {
  (diffElement.value as HTMLElement).style.position = "absolute";
  html2canvas(diffElement.value as HTMLElement).then(canvas => {
    canvas.toBlob(blob => {
      if (!blob) {
        ElMessage.error("生成图片失败");
        (diffElement.value as HTMLElement).style.position = "static";
        return;
      }
      (diffElement.value as HTMLElement).style.position = "static";

      saveAs(blob, `diff-${new Date().getTime()}.png`);
    });
  });
}
</script>

<template>
  <div class="flex gap-4 h-full w-full">
    <div ref="diffElement" class="w-full bg-white mt-4 mb-4 max-w-[1080px]" />
  </div>
  <div
    class="fixed flex flex-col gap-4 left-1 top-[50%] transform -translate-y-1/2"
  >
    <n-button type="info" @click="handleReturn">返回</n-button>
    <n-button type="info" dashed @click="handleDownload">下载对比图片</n-button>
    <n-button type="error" @click="handleNew" dashed>开始新对比</n-button>
  </div>
</template>

<style scoped lang="scss"></style>
