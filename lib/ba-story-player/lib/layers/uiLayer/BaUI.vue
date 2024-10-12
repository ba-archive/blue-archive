<script lang="ts" setup>
import eventBus from "@/eventBus";
import { storyHandler } from "@/index";
import { usePlayerStore } from "@/stores";
import gsap from "gsap";
import { computed, onMounted, provide, ref, watch } from "vue";
import BaChatLog from "./components/BaChatLog/BaChatLog.vue";
import BaPlayerSetting from "./components/BaPlayerSetting/BaPlayerSetting.vue";
import BaDialog from "./components/BaDialog.vue";
import BaSelector from "./components/BaSelector.vue";
import BaButton from "@/layers/uiLayer/components/BaButton.vue";
import { ShowOption } from "@/types/events";
import { Language, StorySummary } from "@/types/store";
import { useThrottleFn } from "@vueuse/core";
import "./userInteract";
import { useUiState } from "@/stores/state";
import { getUiI18n } from "./utils";

const showSummary = ref(false);
const showStoryLog = ref(false);
const showSetting = ref(false);
const { autoMode } = useUiState();
const showMenu = ref(false);
const forceShowMenu = ref(false);
const showSubMenu = ref(false);
const disableMenuButton = ref(false);

let props = defineProps<{
  storySummary: StorySummary;
  height: number;
  width: number;
  fullScreen: boolean;
  language: Language;
}>();

provide("language", props.language);

const selectOptions = ref<ShowOption[]>([]);
const emitter = defineEmits(["update:fullScreen"]);

const overrideTextContainer = computed(() =>
  [
    !showSubMenu.value,
    !showSummary.value,
    !showStoryLog.value,
    !showSetting.value,
  ].some(it => !it)
);

eventBus.on("hide", () => {
  showSummary.value = false;
  showStoryLog.value = false;
  showMenu.value = false;
  showSetting.value = false;
});
eventBus.on("showStoryLog", e => {
  if (showSummary.value || showSetting.value) {
    return;
  }
  showStoryLog.value = e;
});
watch(showStoryLog, () => {
  eventBus.emit("isStoryLogShow", showStoryLog.value);
});

eventBus.on("hidemenu", () => {
  showMenu.value = false;
});
eventBus.on("showmenu", () => {
  showMenu.value = true;
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
  showStoryLog.value = true;
  autoMode.value = false;
}
function handleBtnSkipSummary() {
  eventBus.emit("playOtherSounds", "select");
  refreshBtnMenuTimer();
  autoMode.value = false;
  showSummary.value = true;
}
function handleBtnSetting() {
  eventBus.emit("playOtherSounds", "select");
  refreshBtnMenuTimer();
  autoMode.value = false;
  showSetting.value = true;
}

// 处理选项
function handleBaSelector(selectionGroup: number) {
  showSubMenu.value = false;
  eventBus.emit("playOtherSounds", "select");
  eventBus.emit("select", selectOptions.value[selectionGroup].SelectionGroup);
  usePlayerStore().updateLogText(selectOptions.value[selectionGroup]);

  selectOptions.value.length = 0;
}

function handleBtnAutoMode() {
  autoMode.value = !autoMode.value;
}

// 计时器：当这个计时器到时间时 -- 回调函数会把 hiddenMenu 设置成 true 来影藏菜单
let btnMenuTimer: number;

function handleBtnMenu() {
  if (showSubMenu.value) {
    showSubMenu.value = false;
  } else {
    showSubMenu.value = true;
    // 一段时间后自动影藏
    clearInterval(btnMenuTimer);
    btnMenuTimer = window.setTimeout(() => {
      showSubMenu.value = false;
    }, 5555);
  }
}

const handleBtnMenuDebounced = useThrottleFn(handleBtnMenu, 200);

function refreshBtnMenuTimer() {
  if (showSubMenu.value) {
    clearTimeout(btnMenuTimer);
    btnMenuTimer = window.setTimeout(() => {
      showSubMenu.value = false;
    }, 5555);
  }
}

// 子菜单按钮动画
let handleBtnMouseDown = function (ev: Event) {
  gsap.to(ev.currentTarget, {
    duration: 0.15,
    scale: 0.94,
    ease: "power3.out",
    force3D: true,
  });
};
let handleBtnMouseUp = function (ev: Event) {
  gsap.to(ev.currentTarget, {
    duration: 0.3,
    scale: 1,
    force3D: true,
  });
};

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
let cursorTimer: number = window.setTimeout(() => {
  cursorStyle.value = "none";
}, hideCursorDelay);

document.addEventListener("mousemove", () => {
  cursorStyle.value = "auto";
  clearTimeout(cursorTimer);
  if (
    !showSummary.value &&
    !showStoryLog.value &&
    !showSetting.value &&
    props.fullScreen
  ) {
    cursorTimer = window.setTimeout(() => {
      cursorStyle.value = "none";
    }, hideCursorDelay);
  }
});

// 点击其他地方关闭子菜单
eventBus.on("click", function () {
  if (showSubMenu.value) {
    showSubMenu.value = false;
    return;
  }
});

// #97 UI层接收到隐藏UI事件后无法操作菜单
const rightTop = ref<HTMLElement | null>();
onMounted(() => {
  if (rightTop.value) {
    const el = rightTop.value;
    let timeout: number | undefined;

    let mouseEnter = function mouseEnter() {
      forceShowMenu.value = true;
    };
    let mouseLeave = function mouseLeave() {
      if (timeout) clearTimeout(timeout);
      timeout = window.setTimeout(() => {
        forceShowMenu.value = false;
        timeout = undefined;
      }, 1800);
    };

    el.addEventListener("mouseover", mouseEnter);
    el.addEventListener("mouseleave", mouseLeave);
    el.addEventListener(
      "click",
      () => {
        mouseEnter();
        mouseLeave();
      },
      { capture: true }
    );
  }
});
function getI18n(key: string) {
  return getUiI18n(key, props.language);
}
</script>

<template>
  <div
    class="baui"
    :class="{ 'has-menu': overrideTextContainer }"
    :style="{ 'font-size': `${bauiem}px`, cursor: cursorStyle }"
    tabindex="0"
  >
    <div
      class="right-top"
      :style="{ opacity: showMenu || forceShowMenu ? 1 : 0 }"
      ref="rightTop"
    >
      <div class="baui-button-group">
        <BaButton
          @click="handleBtnAutoMode"
          :class="{ 'ba-button-auto': true, activated: autoMode }"
          :disabled="disableMenuButton"
        >
          AUTO
        </BaButton>
        <BaButton
          @click="handleBtnMenuDebounced"
          :class="{ 'ba-button-menu': true, activated: showSubMenu }"
          :disabled="disableMenuButton"
        >
          MENU
        </BaButton>
      </div>

      <Transition>
        <div class="baui-menu-options lean-rect" v-if="showSubMenu">
          <button
            class="button-nostyle ba-menu-option"
            @click="handleBtnSetting"
            @mousedown="handleBtnMouseDown"
            @touchstart="handleBtnMouseDown"
            @touchend="handleBtnMouseUp"
            @mouseup="handleBtnMouseUp"
            @mouseleave="handleBtnMouseUp"
          >
            <img draggable="false" src="./assets/setting.svg" />
          </button>
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
      v-model:show="showSummary"
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
            @click="showSummary = false"
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
      v-model:show="showStoryLog"
    >
      <BaChatLog :show="showStoryLog" />
    </BaDialog>

    <BaDialog
      id="ba-player-setting"
      :title="getI18n('setting')"
      v-model:show="showSetting"
      width="min(580px, 80%)"
      height="min(350px, 86%)"
    >
      <BaPlayerSetting />
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
  border: none;
  background-color: initial;
  padding: 0;
  cursor: pointer;
}

.right-top {
  position: absolute;
  top: 0;
  right: 0;
  z-index: $right-top-menu-z-index;
  transition: opacity 0.3s ease-in-out;
  padding: 1.5%;
  user-select: none;
}

.baui {
  // position: absolute;
  // width: 100%;
  // height: 100%;
  // top: 0;
  // overflow: hidden;
  z-index: $ui-layer-z-index;
  font-family: "Resource Han Rounded CN Medium", "Microsoft YaHei",
    "PingFang SC", -apple-system, system-ui, "Segoe UI", Roboto, Ubuntu,
    Cantarell, "Noto Sans", BlinkMacSystemFont, "Helvetica Neue",
    "Hiragino Sans GB", Arial, sans-serif;

  .v-enter-active,
  .v-leave-active {
    transition: opacity 0.2s;
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }

  .baui-button-group {
    display: flex;
    flex-direction: row;
    justify-content: right;

    .ba-button {
      cursor: pointer;
      &:hover:enabled {
        background-color: #c7c8c9;
      }
    }

    .ba-button-auto:enabled.activated {
      background: no-repeat right -17% bottom/contain url(./assets/Common_Btn_Normal_Y_S_Pt.webp)
        #efe34b;
    }

    .ba-button-menu:enabled.activated {
      background-color: #707580b1;
      color: #e7e8e9;
    }
  }

  .baui-menu-options {
    $btn-size: 4;
    grid-gap: 0.5em;
    display: grid;
    grid-template-columns: repeat($btn-size, 1fr);
    margin-top: 0.56em;
    margin: 0.5em 0.5em;
    border-radius: 0.375em;
    background-color: rgba(244, 244, 244, 0.6);
    padding: 0.6em 0.6em;
    width: calc(4em * #{$btn-size});
    min-width: 8rem;
    overflow: hidden;

    .ba-menu-option {
      display: block;
      transition: background-color 0.3s ease-out;
      border-radius: 0.1875em;
      background-color: #2c4565;
      padding: 0.25em 0.5em;
      font-size: 1.5em;

      &:hover {
        background-color: #243955;
      }

      img {
        display: block;
      }
    }
  }

  #ba-story-log {
    z-index: $ba-story-summary-z-index;
    color: #32363c;
  }

  #ba-story-summary {
    z-index: $ba-story-log-z-index;
    color: #32363c;

    .ba-story-summary-container {
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
      height: 100%;
    }

    .ba-story-summary-title {
      margin: 0.4em 0;
      color: #32363c;
      font-weight: bold;
      font-size: 1.5em;
      text-align: center;
    }

    .ba-story-summary-text {
      flex: 1;
      margin: 0 1em;
      border: solid #d1d7dc 2px;
      border-radius: 0.25em;
      background-color: #f0f0f0;
      padding: 0.3125em 0.4375em;
      overflow-y: auto;
      font-size: 1.4em;
    }

    .ba-story-summary-button-group {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 1em 1em 1em;

      .button-close-summary {
        width: 50%;
        cursor: pointer;
      }
    }
  }

  #ba-player-setting {
    z-index: $ba-player-setting-z-index;
    color: #32363c;
  }
}
</style>
