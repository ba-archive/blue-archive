<script lang="ts" setup>
import BaButton from "@/layers/uiLayer/components/BaButton.vue";
import { computed, ref, watch } from "vue";
import BaDialog from "./components/BaDialog.vue";
import BaChatLog from "./components/BaChatLog/BaChatLog.vue";
import BaSelector from "./components/BaSelector.vue";
import eventBus from "@/eventBus";
import { Language, StorySummary } from "@/types/store";
import { effectBtnMouseDown, effectBtnMouseUp } from "./utils";
import { ShowOption } from "@/types/events";
import { usePlayerStore } from "@/stores";
import "./userInteract.ts";
import { useThrottleFn } from "@vueuse/core";
import { storyHandler } from "@/index";

let hiddenSummary = ref(true);
let hiddenStoryLog = ref(true);
let autoMode = ref(false);
let hiddenMenu = ref(true);
let hiddenSubMenu = ref(true);
const playerStore = usePlayerStore();

let props = defineProps<{
  storySummary: StorySummary;
  height: number;
  width: number;
  fullScreen: boolean;
  language: Language;
}>();

const selectOptions = ref<ShowOption[]>([]);
const emitter = defineEmits(["update:fullScreen"]);

const overrideTextContainer = computed(() =>
  [hiddenSubMenu, hiddenSummary, hiddenStoryLog].some(it => !it.value)
);

eventBus.on("hide", () => {
  hiddenSummary.value = true;
  hiddenStoryLog.value = true;
  hiddenMenu.value = true;
});
eventBus.on("showStoryLog", e => {
  hiddenStoryLog.value = !e;
});
watch(hiddenStoryLog, () => {
  eventBus.emit("isStoryLogShow", !hiddenStoryLog.value);
});
eventBus.on("hidemenu", () => {
  hiddenMenu.value = true;
});
eventBus.on("showmenu", () => {
  hiddenMenu.value = false;
});
eventBus.on("option", e => (selectOptions.value = [...e]));
eventBus.on("next", () => {
  // 如果用跳转之类的事件跳过后, 此时关闭显示 选项
  if (!selectOptions.value.length) return;
  const find = selectOptions.value.find(
    i => i.index === storyHandler.currentStoryIndex
  );
  if (!find) {
    selectOptions.value = [];
  }
});
function handleBtnFullScreen() {
  emitter("update:fullScreen", !props.fullScreen);
}
function handleBtnChatLog() {
  eventBus.emit("playOtherSounds", "select");
  refreshBtnMenuTimer();
  hiddenStoryLog.value = false;
  autoMode.value = false;
  eventBus.emit("stopAuto");
}
function handleBtnSkipSummary() {
  eventBus.emit("playOtherSounds", "select");
  refreshBtnMenuTimer();
  autoMode.value = false;
  hiddenSummary.value = false;
  eventBus.emit("stopAuto");
}

// 处理选项
function handleBaSelector(selectionGroup: number) {
  hiddenSubMenu.value = true;
  eventBus.emit("select", selectOptions.value[selectionGroup].SelectionGroup);
  usePlayerStore().updateLogText(selectOptions.value[selectionGroup]);

  selectOptions.value.length = 0;
}

function handleBtnAutoMode() {
  autoMode.value = !autoMode.value;
  if (autoMode.value) {
    eventBus.emit("auto");
  } else {
    eventBus.emit("stopAuto");
  }
}

// 计时器：当这个计时器到时间时 -- 回调函数会把 hiddenMenu 设置成 true 来影藏菜单
let btnMenuTimer: number;

function handleBtnMenu() {
  if (hiddenSubMenu.value) {
    hiddenSubMenu.value = false;
    // 一段时间后自动影藏
    clearInterval(btnMenuTimer);
    btnMenuTimer = window.setTimeout(() => {
      hiddenSubMenu.value = true;
    }, 5555);
  } else {
    hiddenSubMenu.value = true;
  }
}

const handleBtnMenuDebounced = useThrottleFn(handleBtnMenu, 200);

function refreshBtnMenuTimer() {
  if (!hiddenSubMenu.value) {
    clearTimeout(btnMenuTimer);
    btnMenuTimer = window.setTimeout(() => {
      hiddenSubMenu.value = true;
    }, 5555);
  }
}

// 子菜单按钮动画
let handleBtnMouseDown = effectBtnMouseDown();
let handleBtnMouseUp = effectBtnMouseUp();

// baui em value, 根据height width计算
const bauiem = computed(() => {
  // 1000 / 16 == 62.5, 562.5 / 16 == 35.15625  开发时基准宽高
  let minVal = Math.min(props.width / 62.5, props.height / 35.15625, 20);
  let newVal = Math.round(minVal);
  return newVal;
});

// #86 全屏时 UI 层鼠标不可见
const cursorStyle = ref("auto");
const hideCursorDelay = 3000;
let cursorTimer = window.setTimeout(() => {
  cursorStyle.value = "none";
}, hideCursorDelay);

document.addEventListener("mousemove", ev => {
  cursorStyle.value = "auto";
  clearTimeout(cursorTimer);
  if (hiddenSummary.value && hiddenStoryLog.value && props.fullScreen) {
    cursorTimer = window.setTimeout(() => {
      cursorStyle.value = "none";
    }, hideCursorDelay);
  }
});

function handleBaUIClick() {
  if (!hiddenSubMenu.value) {
    hiddenSubMenu.value = true;
    return;
  }
  eventBus.emit("click");
}

// i18n
const dict = {
  cn: {
    log: "对话记录",
    summary: "概要",
    close: "关闭",
  },
  en: {
    log: "LOG",
    summary: "Summary",
    close: "Close",
  },
  jp: {
    log: "ログ",
    summary: "あらすじ",
    close: "閉じる",
  },
  kr: {
    log: "로그",
    summary: "요약",
    close: "닫기",
  },
  tw: {
    log: "對話記錄",
    summary: "概要",
    close: "關閉",
  },
  th: {
    log: "บันทึกการสนทนา",
    summary: "สรุป",
    close: "ปิด",
  },
};

function getI18n(key: string) {
  return (
    Reflect.get(Reflect.get(dict, props.language.toLowerCase()), key) || key
  );
}
</script>

<template>
  <div
    class="baui"
    :class="{ 'has-menu': overrideTextContainer }"
    @click.self="handleBaUIClick"
    :style="{ 'font-size': `${bauiem}px`, cursor: cursorStyle }"
    tabindex="0"
  >
    <div class="right-top" v-show="!hiddenMenu">
      <div class="baui-button-group">
        <BaButton
          @click="handleBtnAutoMode"
          :class="{ 'ba-button-auto': true, activated: autoMode }"
        >
          AUTO
        </BaButton>
        <BaButton
          @click="handleBtnMenuDebounced"
          :class="{ 'ba-button-menu': true, activated: !hiddenSubMenu }"
        >
          MENU
        </BaButton>
      </div>

      <Transition>
        <div class="baui-menu-options lean-rect" v-if="!hiddenSubMenu">
          <button
            class="button-nostyle ba-menu-option"
            @click="handleBtnFullScreen"
            @mousedown="handleBtnMouseDown"
            @touchstart="handleBtnMouseDown"
            @touchend="handleBtnMouseUp"
            @mouseup="handleBtnMouseUp"
            @mouseleave="handleBtnMouseUp"
          >
            <img draggable="false" src="./assets/pan-arrow.svg" />
          </button>
          <button
            class="button-nostyle ba-menu-option"
            @click="handleBtnChatLog"
            @mousedown="handleBtnMouseDown"
            @touchstart="handleBtnMouseDown"
            @touchend="handleBtnMouseUp"
            @mouseup="handleBtnMouseUp"
            @mouseleave="handleBtnMouseUp"
          >
            <img draggable="false" src="./assets/menu.svg" />
          </button>
          <button
            class="button-nostyle ba-menu-option"
            @click="handleBtnSkipSummary"
            @mousedown="handleBtnMouseDown"
            @touchstart="handleBtnMouseDown"
            @touchend="handleBtnMouseUp"
            @mouseup="handleBtnMouseUp"
            @mouseleave="handleBtnMouseUp"
          >
            <img draggable="false" src="./assets/fast-forward.svg" />
          </button>
        </div>
      </Transition>
    </div>

    <BaSelector
      id="ba-story-selector"
      :selection="selectOptions"
      @select="handleBaSelector"
      v-if="selectOptions.length !== 0"
    />

    <BaDialog
      id="ba-story-summary"
      :title="getI18n('summary')"
      :show="!hiddenSummary"
      @close="hiddenSummary = true"
      width="70%"
      height="85%"
    >
      <div class="ba-story-summary-container">
        <h4 class="ba-story-summary-title">{{ storySummary.chapterName }}</h4>
        <p class="ba-story-summary-text">
          {{ storySummary.summary }}
        </p>
        <div class="ba-story-summary-button-group">
          <BaButton
            size="middle"
            class="polylight button-close-summary"
            @click="hiddenSummary = true"
            style="width: 96%"
          >
            {{ getI18n("close") }}
          </BaButton>
        </div>
      </div>
    </BaDialog>

    <BaDialog
      id="ba-story-log"
      :title="getI18n('log')"
      width="min(1080px, 80%)"
      height="min(650px, 86%)"
      :show="!hiddenStoryLog"
      @close="hiddenStoryLog = !hiddenStoryLog"
    >
      <BaChatLog :show="!hiddenStoryLog" />
    </BaDialog>
  </div>
</template>

<style lang="scss" scoped>
// #86 全部元素继承 cursor 属性
* {
  cursor: inherit;
}

.lean-rect {
  transform: skew(-10deg);
}

.button-nostyle {
  margin: 0;
  padding: 0;
  border: none;
  background-color: initial;
}

.right-top {
  position: absolute;
  top: 0;
  right: 0;
  padding: 1.5%;
  user-select: none;
  z-index: 110;
}

.baui {
  position: absolute;
  z-index: $ui-layer-z-index;
  width: 100%;
  height: 100%;
  top: 0;
  overflow: hidden;
  font-family: "TJL", "Microsoft YaHei", "PingFang SC", -apple-system, system-ui,
    "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", BlinkMacSystemFont,
    "Helvetica Neue", "Hiragino Sans GB", Arial, sans-serif;

  .v-enter-active,
  .v-leave-active {
    transition: opacity 0.2s;
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }

  .baui-button-group {
    display: grid;
    grid-template-columns: repeat(2, 1fr);

    .ba-button {
      &:hover {
        background-color: #c7c8c9;
      }
    }

    .ba-button-auto.activated {
      background: no-repeat right -17% bottom/contain url(./assets/Common_Btn_Normal_Y_S_Pt.webp)
        #efe34b;
    }

    .ba-button-menu.activated {
      color: #e7e8e9;
      background-color: #707580b1;
    }
  }

  .baui-menu-options {
    display: grid;
    grid-gap: 0.5em;
    grid-template-columns: repeat(3, 1fr);
    margin-top: 0.56em;
    padding: 0.6em 0.6em;
    margin: 0.5em 0.5em;
    border-radius: 0.375em;
    background-color: rgba(244, 244, 244, 0.6);
    overflow: hidden;

    .ba-menu-option {
      display: block;
      font-size: 1.5em;
      background-color: #2c4565;
      border-radius: 0.1875em;
      padding: 0.25em 0.5em;
      transition: background-color 0.3s ease-out;

      &:hover {
        background-color: #243955;
      }

      img {
        display: block;
      }
    }
  }

  #ba-story-log {
    color: #32363c;
    z-index: 110;
  }

  #ba-story-summary {
    color: #32363c;

    .ba-story-summary-container {
      height: 100%;
      display: flex;
      flex-flow: nowrap column;
      background: center/contain
          linear-gradient(
            130deg,
            rgba(240, 240, 240, 1) 0%,
            rgba(240, 240, 240, 0.9) 65%,
            rgba(240, 240, 240, 0.6) 70%,
            rgba(240, 240, 240, 0) 100%
          ),
        80px 45% url(./assets/UITex_BGPoliLight_1.svg) rgb(164 216 237);
      background-size: 100%;
    }

    .ba-story-summary-title {
      margin: 0.4em 0;
      text-align: center;
      color: #32363c;
      font-size: 1.5em;
      font-weight: bold;
    }

    .ba-story-summary-text {
      flex: 1;
      border: solid #d1d7dc 2px;
      margin: 0 1em;
      border-radius: 0.25em;
      overflow-y: auto;
      padding: 0.3125em 0.4375em;
      background-color: #f0f0f0;
      font-size: 1.4em;
    }

    .ba-story-summary-button-group {
      display: flex;
      margin: 1em 1em 1em;
      justify-content: center;
      align-items: center;

      .button-close-summary {
        width: 50%;
      }
    }
  }
}
</style>
