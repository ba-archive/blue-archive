<template>
  <div>
    <label>测试集合名</label>
    <select v-model="currentCollectionName">
      <option v-for="name in collectionNames">{{ name }}</option>
    </select>
    <label>单元测试名</label>
    <select v-model="currentRunUnitTestName">
      <option v-for="name in currentUnitTestNames">{{ name }}</option>
    </select>
    <button @click="requestCapture">{{ authButtonText }}</button>
    <button @click="createScreenCapture" :disabled="!canCapture">截图</button>
    <button :disabled="!canCapture">录屏(to do)</button>
    <button @click="runTest">run test</button>
    <label>结果(to do)</label>
    <input type="checkbox" />
    <label>comment</label>
    <textarea></textarea>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useStorage } from "@vueuse/core";
import unitTestCollections from "./unitTests";

const collectionNames = unitTestCollections.map(collection => collection.name);
const currentCollectionName = useStorage("collectionName", "");
const canCapture = ref(false);
const authButtonText = computed(() =>
  canCapture.value ? "停止截图录屏" : "授权截图录屏"
);
const currentUnitTests = computed(() => {
  return (
    unitTestCollections.find(
      collection => collection.name === currentCollectionName.value
    ) || {
      name: "null",
      tests: [],
    }
  ).tests;
});
const currentUnitTestNames = computed(() => {
  return currentUnitTests.value.map(unitTest => unitTest.name);
});
const currentRunUnitTestName = useStorage("runUnitTest", "");
const currentRunUnitTest = computed(() => {
  return currentUnitTests.value.find(
    unitTest => unitTest.name === currentRunUnitTestName.value
  );
});
function runTest() {
  if (currentRunUnitTest.value) {
    currentRunUnitTest.value.command();
  }
}
// eslint-disable-next-line no-undef
let video: HTMLElementTagNameMap["video"];
// eslint-disable-next-line no-undef
let canvas: HTMLElementTagNameMap["canvas"];
let context: CanvasRenderingContext2D;
let media: MediaStream | null;
function requestCapture() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  if (!video) {
    video = document.createElement("video");
    canvas = document.createElement("canvas");
    context = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      navigator.mediaDevices
        .getDisplayMedia({
          preferCurrentTab: true,
          audio: false,
        })
        .then(_media => {
          video.srcObject = _media;
          video.play();
          media = _media;
          canCapture.value = true;
        });
    } catch (err) {
      console.error("Error: " + err);
    }
  } else {
    canCapture.value = false;
    video.pause();
    media.getTracks().forEach(track => track.stop());
    video = null;
    context = null;
    canvas = null;
    media = null;
  }
}
function createScreenCapture() {
  if (video && media.getTracks()[0].readyState !== "ended") {
    context.drawImage(video, 0, 0, window.innerWidth, window.innerHeight);
    canvas.toBlob(blob => {
      downloadBrowserFile(blob, "screenshot.png");
    });
  } else {
    requestCapture();
  }
}

function downloadBrowserFile(file: Blob, fileName = "file") {
  const a = document.createElement("a");
  a.style.display = "none";
  document.body.appendChild(a);
  const url = URL.createObjectURL(file);
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
</script>
