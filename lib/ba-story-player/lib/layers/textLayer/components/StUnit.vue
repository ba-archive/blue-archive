<template>
  <div :style="effectCSS" ref="stOutput" class="st-text-container">
    <TypingUnit
      v-for="(e, i) in textList"
      :index="index + '-' + i"
      :key="i"
      :text="e"
      :instant="instant"
    />
  </div>
</template>

<script setup lang="ts">
import gsap from "gsap";
import { StyleValue, computed, onMounted, onUnmounted, ref } from "vue";
import { BaseTypingEvent, IEventHandlerMap } from "../types";
import { parseStEffectToCss } from "../utils";
import TypingEmitter from "../utils/typingEmitter";
import { StText } from "@/types/events";
import TypingUnit from "./TypingUnit.vue";

const props = withDefaults(defineProps<IProps>(), {
  index: "-1",
  config: () => ({
    text: [],
    stArgs: [[0, 0], "instant", 0],
    middle: false,
  }),
});
const effectCSS = parseStEffectToCss(props.config) as StyleValue;
const textList = computed(() => props.config.text);
const instant = computed(() => props.config.stArgs[1] !== "serial");
const maxIndex = computed(
  () => `${props.index}-${Math.max(0, props.config.text.length - 1)}`
);
const stOutput = ref<HTMLElement>();
function doTyping(index?: string) {
  if (index && index !== props.index) {
    return;
  }
  const type = props.config.stArgs[1];
  if (type === "smooth") {
    const _stOutput = stOutput.value as HTMLElement;
    const timeline = gsap.timeline();
    timeline
      .fromTo(
        _stOutput,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 1.5,
        }
      )
      .then(() => {
        notifyComplete();
      });
  }
  TypingEmitter.emit("start", props.index + "-0");
}

function onChildrenComplete(index = "-1") {
  if (index === maxIndex.value && props.config.stArgs[1] !== "smooth") {
    notifyComplete();
  } else {
    TypingEmitter.emit(
      "start",
      props.index + "-" + (Number(index.split("-")[1] || 0) + 1)
    );
  }
}

function eventFilter(type: BaseTypingEvent, index?: string) {
  if (
    !index ||
    (index >= props.index && index <= maxIndex.value) ||
    index === props.index
  ) {
    const fn = EventHandlerMap[type];
    if (fn) {
      fn(index);
    }
  }
}

function notifyComplete() {
  TypingEmitter.emit("stComplete", props.index);
}

function dispose() {
  TypingEmitter.off("*", eventFilter);
}

onMounted(() => {
  TypingEmitter.on("*", eventFilter);
});

onUnmounted(() => {
  dispose();
});

const EventHandlerMap: IEventHandlerMap = {
  start: doTyping,
  complete: onChildrenComplete,
};

type IProps = {
  index: string;
  config: StText;
};
</script>

<style scoped lang="scss">
.st-text-container {
  --font-size: max(
    calc(
      (
          var(--param-font-size) / var(--standard-unity-font-size) *
            var(--standard-font-size)
        ) * 1rem
    ),
    var(--minimum-fs)
  );
  --left: calc(
    (var(--st-width-half) + var(--st-x)) * var(--st-pos-bounds-x) * 1px
  );
  --top: calc(
    (var(--st-height-half) - var(--st-y)) * var(--st-pos-bounds-y) * 1px
  );
  display: inline-block;
  top: calc(var(--top) - var(--font-size) / 2);
  left: var(--left);
  font-size: var(--font-size);
  line-height: var(--font-size);
}
</style>
