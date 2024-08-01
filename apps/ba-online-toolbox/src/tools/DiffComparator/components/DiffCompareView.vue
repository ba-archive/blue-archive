<script setup lang="ts">
import { useDiffComparatorStore } from "../store/DiffComparatorStore";
import * as Diff from "diff";
import * as Diff2Html from "diff2html";
import eventBus from "../events/events";

import "highlight.js/styles/github.css";
import "diff2html/bundles/css/diff2html.min.css";

const diffCompareStore = useDiffComparatorStore();

const file1 = diffCompareStore.getFile(0);
const file2 = diffCompareStore.getFile(1);

const diff = Diff.createTwoFilesPatch(
  file1.name,
  file2.name,
  JSON.stringify(file1.content, null, 2),
  JSON.stringify(file2.content, null, 2)
);

const outputHtml = Diff2Html.html(diff, {
  matching: "words",
  outputFormat: "line-by-line",
});

function handleReturn() {
  eventBus.emit("endCompare");
}
</script>

<template>
  <div class="flex gap-4 h-full w-full">
    <div v-html="outputHtml" class="w-full bg-white mt-4 mb-4" />
  </div>
  <div class="fixed left-0 top-[50%] transform -translate-y-1/2">
    <n-button type="info" @click="handleReturn">返回</n-button>
  </div>
</template>

<style scoped lang="scss"></style>
