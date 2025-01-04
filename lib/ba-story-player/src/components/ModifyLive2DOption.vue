<!-- eslint-disable max-len -->
<script setup lang="ts">
import { Ref, computed, ref, watch } from "vue";
import * as utils from "../../lib/utils";
import eventBus from "../../lib/eventBus";
import { checkloadAssetAlias } from "../../lib/index";
import { changeStoryIndex } from "../../lib/layers/uiLayer/userInteract";
import { initPrivateState, usePlayerStore } from "../../lib/stores";
import { StoryUnit } from "../../lib/types/common";
import { IL2dConfig } from "../../lib/types/l2d";
import { Assets } from "pixi.js";

const message = ref("等待资源加载...");
const messageType = ref<"info" | "error">("info");
const state = initPrivateState();
const targetIndex = ref(-1);
const showDialog = ref(false);
const showAnimationSelectDialog = ref(false);
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
const live2dUnit = ref<StoryUnit["l2d"]>();
// eslint-disable-next-line
const availableSpineName = computed(() => [
  currentOptions.value.name,
  ...(currentOptions.value.otherSpine ?? [])
    .filter(it => it)
    .map(it => {
      return it.substring(it.lastIndexOf("/") + 1);
    }),
]);
const selectedSpineName = ref("");
watch(
  () => selectedSpineName.value,
  cur => {
    if (!cur) {
      return;
    }
    const index = availableSpineName.value.indexOf(cur);
    if (index !== 0) {
      const url = utils.getResourcesUrl(
        "otherL2dSpine",
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-extra-non-null-assertion
        currentOptions.value.otherSpine!![index - 1]
      );
      loadAnimationNames(url);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-extra-non-null-assertion
      loadAnimationNames(live2dUnit.value!!.spineUrl);
    }
  }
);
const selectedAnimationName = ref<string>();
const availableAnimationName = ref<string[]>([]);
let proxy: { animation: string } | undefined = undefined;
// 开始加载时资源文件已经分析完毕
eventBus.on("loaded", () => {
  targetIndex.value = (state.allStoryUnit as StoryUnit[]).findIndex(
    it => it.l2d
  );
  if (targetIndex.value !== -1) {
    live2dUnit.value = state.allStoryUnit[targetIndex.value].l2d;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-extra-non-null-assertion
    loadAnimationNames(live2dUnit.value!!.spineUrl);
    if (state.curL2dConfig) {
      currentOptions.value = JSON.parse(JSON.stringify(state.curL2dConfig));
      currentOptions.value.playQue = currentOptions.value.playQue.map(it => {
        if (it.sounds) {
          it.sounds = it.sounds.map(s =>
            Object.assign({ fileName: "", time: 1, volume: 2 }, s)
          );
        }
        return Object.assign(
          {
            name: "",
            animation: "",
            fadeTime: 0,
            secondFadeTime: 0,
            fade: false,
          },
          it
        );
      });
    }
    const tmp = (live2dUnit.value?.spineUrl ?? "").split("/");
    currentOptions.value.name = tmp[tmp.length - 1].replace(".skel", "");
    message.value = "live2d块查找成功";
  } else {
    message.value = "没找到live2d块";
    messageType.value = "error";
  }
});
function loadAnimationNames(url: string) {
  const resource = usePlayerStore().l2dSpineData;
  if (resource) {
    availableAnimationName.value = resource.animations.map(
      it => `${it.name}(${it.duration}s)`
    );
    selectedAnimationName.value = "";
  } else {
    Assets.load({ src: url, alias: url }).then(resource => {
      availableAnimationName.value = resource.spineData?.animations.map(
        it => `${it.name}(${it.duration}s)`
      );
      selectedAnimationName.value = "";
    });
  }
}
function openAnimationSelect(_proxy: any) {
  proxy = _proxy;
  showAnimationSelectDialog.value = true;
}
function completeAnimationSelect() {
  if (proxy) {
    proxy.animation = selectedAnimationName.value as string;
  }
  showAnimationSelectDialog.value = false;
}
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
  eventBus.emit("clearSt");
  setTimeout(() => {
    skip2Live2d();
  }, 100);
}
function outputOptions() {
  navigator.clipboard.writeText(mapOptions.value);
}
const mapOptions = computed({
  get: () =>
    `${currentOptions.value.name}: ${JSON.stringify(
      currentOptions.value,
      null,
      2
    )}`,
  set(value) {
    currentOptions.value = JSON.parse(value);
  },
});
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion, max-len
const mapSpineSettings = computed(() =>
  Object.keys(currentOptions.value.spineSettings || {}).map(key => ({
    name: key,
    scale: currentOptions.value.spineSettings![key].scale,
  }))
);
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
function addPlayeQueueSound(index: number) {
  if (!currentOptions.value.playQue[index].sounds) {
    Reflect.set(currentOptions.value.playQue[index], "sounds", []);
  }
  currentOptions.value.playQue[index].sounds?.push({
    fileName: "",
    time: 1,
    volume: 2,
  });
}
function removePlayeQueueSound(index: number, j: number) {
  currentOptions.value.playQue[index].sounds?.splice(j, 1);
}
function addSpineSetting() {
  if (!currentOptions.value.spineSettings) {
    Reflect.set(currentOptions.value, "spineSettings", {});
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  Reflect.set(currentOptions.value.spineSettings!, "", { scale: 1 });
}
function removeSpineSetting(name: string) {
  Reflect.deleteProperty(currentOptions.value.spineSettings!, name);
}
function overrideLive2dConfig() {
  state.curL2dConfig = JSON.parse(JSON.stringify(currentOptions.value));
  if (currentOptions.value.otherSpine) {
    currentOptions.value.otherSpine.forEach(other => {
      const url = utils.getResourcesUrl("otherL2dSpine", other);
      checkloadAssetAlias(url, url);
    });
  }
}
</script>

<template>
  <div>
    <Teleport to="body">
      <div v-if="showDialog" class="live2d-dialog dialog">
        <div class="dialog-wrapper">
          <div class="close" @click="showDialog = false">关闭</div>
          <div>
            <label for="live2d-name">name</label>
            <input
              id="live2d-name"
              type="text"
              v-model="currentOptions.name"
              class="ml-4"
            />
          </div>
          <div>
            <label>playQue</label>
            <button @click="addPlayeQueue()">新增playQue</button>
          </div>
          <div class="play-que-container">
            <div
              v-for="(e, index) in currentOptions.playQue"
              :key="index"
              class="play-que"
            >
              <div>
                <label :for="'playQue-name-' + index">name</label>
                <input
                  :id="'playQue-name-' + index"
                  type="text"
                  v-model="e.name"
                  class="ml-4"
                />
              </div>
              <div>
                <label :for="'playQue-animation-' + index">animation</label>
                <input
                  :id="'playQue-animation-' + index"
                  type="text"
                  v-model="e.animation"
                  class="ml-4"
                />
                <button
                  @click="openAnimationSelect(e)"
                  v-show="
                    availableSpineName.length > 0 && availableSpineName[0]
                  "
                >
                  选择动画
                </button>
              </div>
              <div>
                <label :for="'playQue-fadeTime-' + index">fadeTime</label>
                <input
                  :id="'playQue-fadeTime-' + index"
                  type="text"
                  v-model="e.fadeTime"
                  class="ml-4"
                />
              </div>
              <div>
                <label :for="'playQue-secondFadeTime-' + index"
                  >secondFadeTime</label
                >
                <input
                  :id="'playQue-secondFadeTime-' + index"
                  type="text"
                  v-model="e.secondFadeTime"
                  class="ml-4"
                />
              </div>
              <div>
                <label :for="'playQue-fade-' + index">fade</label>
                <input
                  :id="'playQue-fade-' + index"
                  type="checkbox"
                  v-model="e.fade"
                  class="ml-4"
                />
              </div>
              <div>
                <label>Sound</label>
                <button @click="addPlayeQueueSound(index)">新增Sound</button>
              </div>
              <div v-for="(item, j) in e.sounds" :key="String(index) + j">
                <div>
                  <label :for="`playQue-sounds-${j}-fileName-${index}`"
                    >fileName</label
                  >
                  <input
                    :id="`playQue-sounds-${j}-fileName-${index}`"
                    type="text"
                    v-model="item.fileName"
                    class="ml-4"
                  />
                </div>
                <div>
                  <label :for="`playQue-sounds-${j}-time-${index}`">time</label>
                  <input
                    :id="`playQue-sounds-${j}-time-${index}`"
                    type="text"
                    v-model="item.time"
                    class="ml-4"
                  />
                </div>
                <div>
                  <label :for="`playQue-sounds-${j}-volume-${index}`"
                    >volume</label
                  >
                  <input
                    :id="`playQue-sounds-${j}-volume-${index}`"
                    type="text"
                    v-model="item.volume"
                    class="ml-4"
                  />
                </div>
                <div>
                  <button @click="removePlayeQueueSound(index, j)">
                    删除Sound
                  </button>
                </div>
              </div>
              <div>
                <button @click="removePlayeQueue(index)">删除playQue</button>
              </div>
            </div>
          </div>
          <div>
            <label>spineSettings</label>
            <button @click="addSpineSetting()">新增Setting</button>
          </div>
          <div>
            <div v-for="(e, index) in mapSpineSettings" :key="index">
              <div>
                <label :for="'spine-setting-name-' + index">name</label>
                <input
                  :id="'spine-setting-name-' + index"
                  type="text"
                  v-model="e.name"
                  class="ml-4"
                />
              </div>
              <div>
                <label :for="'spine-setting-scale-' + index">scale</label>
                <input
                  :id="'spine-setting-scale-' + index"
                  type="text"
                  v-model="e.scale"
                  class="ml-4"
                />
              </div>
              <div>
                <button @click="removeSpineSetting(e.name)">删除Setting</button>
              </div>
            </div>
          </div>
          <div>
            <label>otherSpines</label>
            <button @click="addOtherSpine()">新增OtherSpine</button>
          </div>
          <div>
            <div v-for="(e, index) in currentOptions.otherSpine" :key="index">
              <div>
                <input
                  type="text"
                  :value="e"
                  @input="(e) => currentOptions.otherSpine![index] = e.target.value"
                  style="width: 200px"
                />
                <button @click="removeOtherSpine(index)">删除OtherSpine</button>
              </div>
            </div>
          </div>
          <div>
            <button @click="showDialog = false">关闭窗口</button>
            <button @click="outputOptions">复制参数(可填入参数文件)</button>
          </div>
        </div>
      </div>
    </Teleport>
    <Teleport to="body">
      <div v-if="showAnimationSelectDialog" class="animation-dialog dialog">
        <div class="dialog-wrapper">
          <div class="close" @click="completeAnimationSelect">关闭</div>
          <div class="mt-8">
            <div>选择spine</div>
            <div class="mt-8">
              <select v-model="selectedSpineName">
                <option
                  v-for="(name, index) in availableSpineName"
                  :key="index"
                >
                  {{ name }}
                </option>
              </select>
            </div>
          </div>
          <div class="mt-8">
            <div>选择animation</div>
            <div class="mt-8">
              <select v-model="selectedAnimationName">
                <option
                  v-for="(name, index) in availableAnimationName"
                  :key="index"
                >
                  {{ name }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
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
      <div class="mt-8">
        <button @click="overrideLive2dConfig" class="mt-8">
          将编辑好的参数替换目前参数
        </button>
      </div>
      <div class="mt-8 text-left">
        <button @click="outputOptions">复制参数(可填入参数文件)</button>
      </div>
      <div class="mt-8 text-left">
        <button @click="showDialog = true">打开配置窗口</button>
      </div>
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
.ml-4 {
  margin-left: 4px;
}
.dialog {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3000;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.12);
  border-radius: 3px;
  background-color: #fff;
  padding: 1rem;
  :deep(.mt-8) {
    margin-top: 8px;
  }
}
.live2d-dialog {
  top: 15dvh;
  transform: translateX(-50%);
  width: 50dvw;
  :deep(.dialog-wrapper) {
    position: relative;
    .close {
      position: absolute;
      top: 0;
      right: 0;
      cursor: pointer;
    }
  }
  :deep(.play-que-container) {
    display: flex;
    flex-direction: row;
    gap: 16px;
    overflow-x: scroll;
    > div {
      border: 1px solid black;
      border-radius: 3px;
      padding: 4px;
    }
  }
}
.animation-dialog {
  position: absolute;
  z-index: 3001;
  width: 300px;
  :deep(.dialog-wrapper) {
    position: relative;
    .close {
      position: absolute;
      top: 0;
      right: 0;
      cursor: pointer;
    }
  }
}
</style>
