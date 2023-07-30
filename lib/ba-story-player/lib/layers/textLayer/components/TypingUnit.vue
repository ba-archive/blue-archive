<template>
  <span
    @click.stop="onUnitClick"
    class="unit"
    :style="effectCSS"
    :class="{ ruby: internalSubContent, 'has-tooltip': tooltip && !st }"
    v-click-outside="onClickOutside"
    ref="TypingContainer"
  >
    <span class="body" ref="TypingTextContainer">
      {{ internalContent }}
    </span>
    <span class="rt" v-if="internalSubContent">{{ internalSubContent }}</span>
  </span>
  <div
    class="tooltip"
    v-if="showTooltip"
    ref="TooltipContainer"
    :style="{
      '--typing-unit-width': selfWidth,
      '--typing-unit-offset-top': selfOffsetTop,
      '--typing-unit-offset-left': selfOffsetLeft,
      '--tooltip-width': tooltipWidth,
      '--tooltip-height': tooltipHeight,
      width: `${tooltipInnerWidth}px`,
    }"
  >
    <div class="tooltip-inner" ref="TooltipInner">
      <span>{{ tooltip }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import eventBus from "@/eventBus";
import {
  ComputedRef,
  Ref,
  StyleValue,
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
} from "vue";
import { BaseTypingEvent, IEventHandlerMap } from "../types";
import { collapseWhiteSpace, parseTextEffectToCss } from "../utils";
import { ClickOutside as vClickOutside } from "../utils/clickOutside";
import TypingEmitter from "../utils/typingEmitter";
import { Text } from "@/types/common";
import { useThrottleFn } from "@vueuse/core";

const props = withDefaults(defineProps<IProp>(), {
  index: "-1",
  speed: 20,
  text: () => ({
    content: "",
    waitTime: 0,
    effects: [],
  }),
  instant: false,
  title: false,
  st: false,
});
const emit = defineEmits<{ (ev: "unitClick"): void }>();
const TypingContainer = ref<HTMLElement>() as Ref<HTMLElement>;
const TooltipContainer = ref<HTMLElement>() as Ref<HTMLElement>;
const TypingTextContainer = ref<HTMLElement>() as Ref<HTMLElement>;
const TooltipInner = ref<HTMLElement>() as Ref<HTMLElement>;
const tooltipInnerWidth = ref(200);
const tooltipWidth = ref(0);
const tooltipHeight = ref(0);
const selfWidth = ref(0);
const selfOffsetTop = ref(0);
const selfOffsetLeft = ref(0);
let lineClickCache = 0; // 用于resize时确定tooltip在换行的哪个位置

const showTooltipInternal = ref(false);
const showTooltip = computed(() => showTooltipInternal.value && !props.st);
const propText = ref(props.text);
const currentContent = ref(propText.value.content);
const filterRuby = props.text.effects.filter(it => it.name === "ruby")[0] || {
  value: [],
};
const filterTooltip = props.text.effects.filter(
  it => it.name === "tooltip"
)[0] || {
  value: [],
};
const tooltip = collapseWhiteSpace(filterTooltip.value.join(""));
const currentSubContent = ref(filterRuby.value.join(""));
// const rubyMode = computed(() => currentSubContent.value !== "");
const contentPointer = ref(-1);
const subContentPointer = ref(-1);
const subPadding = ref(0);
const subContainTop = computed(() => (props.title ? "-0.45" : "-1"));
const effectCSS = computed(() => ({
  ...parseTextEffectToCss(props.text.effects),
  "--padding": subPadding.value,
  "--top-offset": subContainTop.value,
})) as unknown as ComputedRef<StyleValue[]>;
const isTypingComplete = ref(false);

if (props.instant) {
  contentPointer.value = currentContent.value.length;
  subContentPointer.value = currentSubContent.value.length;
  isTypingComplete.value = true;
}

const contentHandler = ref(0);
const subContentHandler = ref(0);


const internalContent = computed(() =>
  currentContent.value.substring(0, contentPointer.value)
);
const internalSubContent = computed(() => {
  return isTypingComplete.value ? currentSubContent.value : "";
});

const contentTypingSpeed = [
  0,
  ...Array.from({ length: currentContent.value.length }).map(() => humanizer()),
];
const subContentTypingSpeed = [0];

if (currentSubContent.value) {
  const contentSpeedSum = contentTypingSpeed.reduce((a, b) => a + b);
  const average = (contentSpeedSum / currentSubContent.value.length) * (2 / 3); // 因为humanizer结果均值是1.5倍 所以缩回去
  subContentTypingSpeed.push(
    ...Array.from({ length: currentSubContent.value.length }).map(() =>
      humanizer(average)
    )
  );
}

function doTyping() {
  if (props.instant) {
    skipTyping();
    return;
  }
  if (!currentContent.value) {
    typingComplete();
    return;
  }
  setTimeout(() => {
    doTyping0(
      contentPointer,
      currentContent,
      contentTypingSpeed,
      contentHandler
    );
  }, props.text.waitTime ?? 0);
}

function doTyping0(
  pointer: Ref<number>,
  content: Ref<string>,
  speed: number[],
  handler: Ref<number>,
  skipComplete = false
) {
  if (pointer.value === content.value.length && !skipComplete) {
    typingComplete();
    return;
  }
  pointer.value = pointer.value + 1;
  handler.value = window.setTimeout(() => {
    doTyping0(pointer, content, speed, handler, skipComplete);
  }, speed[pointer.value]);
}

function humanizer(speed: number = props.speed) {
  return Math.round((Math.random() * speed) / 2) + speed;
}

function typingComplete() {
  isTypingComplete.value = true;
  calcTooltipLocationParam();
  TypingEmitter.emit("complete", props.index);
}

function skipTyping() {
  doClearInterval();
  contentPointer.value = currentContent.value.length;
  subContentPointer.value = currentSubContent.value.length;
  nextTick(() => {
    TypingEmitter.emit("complete", props.index);
  });
}

function onUnitClick(ev: MouseEvent) {
  if (!tooltip) {
    emit("unitClick");
    return;
  }
  // 开始计算tooltip的具体位置
  showTooltipInternal.value = true;
  nextTick(() => calcTooltipLocationParam(ev));
}

function onClickOutside() {
  showTooltipInternal.value = false;
}

const onResize = useThrottleFn(() => {
  tooltipInnerWidth.value = 200;
  nextTick(() => calcTooltipLocationParam(undefined, true));
}, 50);

function calcTooltipLocationParam(ev?: MouseEvent, useCache?: boolean) {
  if (!tooltip || !showTooltip.value || !props.st) {
    return;
  }
  // 为了好看的width样式, 计算渲染的tooltip内容长度是否达到200px
  const outer = TooltipInner.value.getBoundingClientRect();
  const inner = TooltipInner.value.children[0].getBoundingClientRect();
  const diff = outer.width - inner.width > 10;
  if (diff) {
    // 判断有没有换行, 如果内部文字换行说明是中英文混排, 不管了
    const range = document.createRange();
    const textNode = TooltipInner.value.children[0].childNodes[0];
    range.setStart(textNode, 0);
    range.setEnd(textNode, tooltip.length);
    if (range.getClientRects().length === 1) {
      tooltipInnerWidth.value = Math.min(200, inner.width);
      nextTick(() => calcTooltipLocationParam(ev, useCache));
      return;
    }
  }

  const bounding = TooltipContainer.value.getBoundingClientRect();
  tooltipWidth.value = bounding.width;
  tooltipHeight.value = bounding.height;

  const range = document.createRange();
  range.setStart(TypingTextContainer.value.childNodes[0], 0);
  range.setEnd(
    TypingTextContainer.value.childNodes[0],
    internalContent.value.length
  );
  const textBounding = range.getClientRects();
  // 实际渲染的bounding多于1个, 说明换行了 计算鼠标具体点的哪个行
  if (textBounding.length > 1) {
    const dialog = document.querySelector(
      "#player__text_inner_dialog"
    ) as HTMLElement;
    const dialogBounding = dialog.getBoundingClientRect();
    let actualTextBounding: DOMRect = null as unknown as DOMRect;
    if (ev) {
      for (const index in textBounding) {
        actualTextBounding = textBounding[index];
        if (
          actualTextBounding.x < ev.x &&
          actualTextBounding.y < ev.y &&
          actualTextBounding.x + actualTextBounding.width > ev.x &&
          actualTextBounding.y + actualTextBounding.height > ev.y
        ) {
          lineClickCache = Number(index);
          break;
        }
      }
    } else if (useCache) {
      actualTextBounding = textBounding[lineClickCache] || textBounding[0];
    } else {
      actualTextBounding = textBounding[0];
    }
    selfWidth.value = actualTextBounding.width;
    selfOffsetTop.value = actualTextBounding.top - dialogBounding.top;
    selfOffsetLeft.value = actualTextBounding.left - dialogBounding.left;
  } else {
    selfWidth.value = TypingContainer.value.getBoundingClientRect().width;
    selfOffsetTop.value = TypingContainer.value.offsetTop;
    selfOffsetLeft.value = TypingContainer.value.offsetLeft;
  }
}

const EventHandlerMap: IEventHandlerMap = {
  start: doTyping,
  skip: skipTyping,
};

function eventFilter(type: BaseTypingEvent, index?: string) {
  if (!index || index === props.index) {
    const fn = EventHandlerMap[type];
    if (fn) {
      fn();
    }
  }
}

onMounted(() => {
  TypingEmitter.on("*", eventFilter);
  eventBus.on("resize", onResize);
});

onUnmounted(() => {
  dispose();
  eventBus.off("resize", onResize);
});

function dispose() {
  TypingEmitter.off("*", eventFilter);
  doClearInterval();
}

function doClearInterval() {
  clearInterval(contentHandler.value);
  clearInterval(subContentHandler.value);
}

type IProp = {
  index: string;
  text: Text;
  speed?: number;
  instant?: boolean;
  // 在title情况下(大字体)控制ruby的位置不要太过分
  title?: boolean;
  st?: boolean;
};
</script>

<style scoped lang="scss">
.unit {
  position: relative;
  height: var(--font-size);
  font-size: var(--font-size);
  line-height: var(--font-size);
  .rt {
    --local-font-size: calc(var(--font-size) * 0.6);
    position: absolute;
    top: calc(var(--local-font-size) * var(--top-offset));
    left: 50%;
    transform: translateX(-50%);
    animation: fade-in 0.25s ease-in-out;
    min-width: 100%;
    font-size: var(--local-font-size);
    line-height: 1;
    text-align: center;
    white-space: nowrap;
  }
  @keyframes fade-in {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
}
.unit.ruby {
  .body {
    display: inline-block;
  }
}
.unit.has-tooltip {
  $padding: 8px;
  z-index: 999;
  cursor: pointer;
  margin: -$padding;
  background: linear-gradient(
    transparent 90%,
    white 90%,
    white 95%,
    transparent 95%,
    transparent 100%
  );
  background-position: $padding 0;
  background-size: calc(100% - #{$padding} * 2) 100%;
  background-repeat: no-repeat;
  padding: 4px $padding;
  .rt {
    top: 0;
  }
}
.tooltip {
  $bg: #0a61e5;
  $padding: 12px;
  $max-tooltip-padding: 16px;
  --tooltip-arrow-height: 5px;
  --left: min(
    calc(
      (var(--text-dialog-width) - var(--tooltip-width)) * 1px - #{$max-tooltip-padding} -
        var(--text-dialog-padding-left)
    ),
    max(
      calc(#{$max-tooltip-padding} - var(--text-dialog-padding-left)),
      calc(
        (
            var(--typing-unit-offset-left) + var(--typing-unit-width) / 2 -
              var(--tooltip-width) / 2
          ) * 1px
      )
    )
  );
  --top: calc(
    (
        (var(--tooltip-height) - var(--typing-unit-offset-top)) * 1px + 0.25rem +
          var(--tooltip-arrow-height)
      ) * -1
  );
  --arrow-left: calc(
    (var(--typing-unit-offset-left) + var(--typing-unit-width) / 2) * 1px -
      var(--left) - #{$padding} - var(--tooltip-arrow-height) - 2.07px
  );
  position: absolute;
  top: var(--top);
  left: var(--left);
  z-index: 999;
  box-sizing: content-box !important;
  box-shadow: 0 12px 32px 4px rgba(0, 0, 0, 0.04),
    0 8px 20px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  background: $bg;
  padding: $padding;
  width: 200px;
  color: white;
  .tooltip-inner {
    --fs: max(calc(var(--font-size) * 0.8), 12px);
    position: relative;
    font-size: var(--fs);
    line-height: calc(var(--fs) * 1.2);
    &:before {
      position: absolute;
      bottom: calc(-#{$padding} - var(--tooltip-arrow-height));
      left: var(--arrow-left);
      transform: rotate(45deg);
      z-index: -1;
      border: 1px solid $bg;
      border-top-color: transparent;
      border-left-color: transparent;
      border-bottom-right-radius: 2px;
      background: $bg;
      width: 10px;
      height: 10px;
      content: " ";
    }
  }
}
.tooltip.auto-width {
  width: auto;
}
</style>
