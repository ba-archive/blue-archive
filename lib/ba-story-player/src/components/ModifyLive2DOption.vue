<script setup lang="ts">
import { computed, ref } from "vue";
import eventBus from "../../lib/eventBus";
import { changeStoryIndex } from "../../lib/layers/uiLayer/userInteract";
import { initPrivateState } from "../../lib/stores";
import { StoryUnit } from "../../lib/types/common";
import { IL2dConfig } from "../../lib/types/l2d";

const message = ref("等待资源加载...");
const messageType = ref<"info" | "error">("info");
const state = initPrivateState();
const targetIndex = ref(-1);
const currentOptions = ref<IL2dConfig[keyof IL2dConfig]>({
  name: "",
  playQue: [
    {
      name: "",
      animation: "",
      fadeTime: 0,
      secondFadeTime: 0,
      sounds: [
        {
          fileName: "",
          time: 1,
          volume: 2,
        },
      ],
      fade: false,
    },
  ],
  spineSettings: {
    "": {
      scale: 1,
    },
  },
  otherSpine: [],
});
const mapOtherSpine = computed(() => currentOptions.value.otherSpine ?? []);
// 开始加载时资源文件已经分析完毕
eventBus.on("startLoading", () => {
  targetIndex.value = (state.allStoryUnit as StoryUnit[]).findIndex(
    it => it.l2d
  );
  if (targetIndex.value !== -1) {
    message.value = "live2d块查找成功";
  } else {
    message.value = "没找到live2d块";
    messageType.value = "error";
  }
});
function skip2Live2d() {
  if (targetIndex.value !== -1) {
    changeStoryIndex(targetIndex.value);
    message.value = "快进成功";
  } else {
    message.value = "live2d块没找到, 需要在输入框手动指定index";
    messageType.value = "error";
  }
}
function resetLive2d() {
  eventBus.emit("live2dDebugDispose");
  setTimeout(() => {
    skip2Live2d();
  }, 100);
}
function outputOptions() {
  navigator.clipboard.writeText(mapOptions.value);
}
const mapOptions = computed({
  get: () => JSON.stringify(currentOptions.value, null, 2),
  set(value) {
    currentOptions.value = JSON.parse(value);
  },
});
function addOtherSpine() {
  if (currentOptions.value.otherSpine) {
    currentOptions.value.otherSpine.push("");
  } else {
    currentOptions.value.otherSpine = [""];
  }
}
function removeOtherSpine(index: number) {
  currentOptions.value.otherSpine?.splice(index, 1);
}
function addPlayeQueue() {
  if (currentOptions.value.otherSpine) {
    currentOptions.value.playQue.push({
      name: "",
      animation: "",
      fadeTime: 0,
      secondFadeTime: 0,
      sounds: [
        {
          fileName: "",
          time: 1,
          volume: 2,
        },
      ],
      fade: false,
    });
  }
}
function removePlayeQueue(index: number) {
  currentOptions.value.playQue.splice(index, 1);
}
</script>

<template>
  <div class="root">
    <div v-if="targetIndex === -1" class="mt-8">
      <div>手动指定live2d index:</div>
      <div>
        <input
          v-model.number="targetIndex"
          placeholder="手动指定live2d index"
        />
      </div>
    </div>
    <div :class="messageType" class="mt-8">{{ message }}</div>
    <div v-if="targetIndex !== -1">
      <button @click="skip2Live2d" class="mt-8">快进到live2d</button>
    </div>
    <div v-if="targetIndex !== -1">
      <button @click="resetLive2d" class="mt-8">重置live2d</button>
    </div>
    <textarea class="mt-8" v-model="mapOptions"></textarea>
    <div class="mt-8 text-left">
      <button @click="outputOptions">复制参数(可填入参数文件)</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.root {
  padding: 8px;
  text-align: center;
}
.error {
  color: red;
}
.mt-8 {
  margin-top: 8px;
}
</style>
