<script lang="ts" setup>
import { deepCopyObject } from "@/utils";
import { computed, ref } from "vue";
import { Text } from "@/types/common";
import { ShowOption } from "@/types/events";
import { useElementSize } from "@vueuse/core";

// 选项
// const selection = ref<ShowOption[]>([]);
const props = withDefaults(defineProps<{ selection: ShowOption[] }>(), {
  selection: () => [],
});
const emit = defineEmits<{
  (ev: "select", value: number): void;
}>();

const selectionCandidate = ref(-1);
const selectedOption = ref(-1);
const isMouseDown = ref(false);
const selectorContainerElement = ref<HTMLElement | null>(null);
const selectorElement = ref<HTMLElement | null>(null);

const { height: selectorContainerHeight } = useElementSize(
  selectorContainerElement
);

const { height: selectorElementHeight } = useElementSize(selectorElement);

const selectorMarginTop = computed(
  () =>
    `${
      Math.max(0, selectorContainerHeight.value - selectorElementHeight.value) /
      3
    }px`
);

/**
 * 按钮按下特效
 * @param index 按钮位置
 */
function handleSelectMouseDown(index: number) {
  isMouseDown.value = true;
  selectionCandidate.value = index;
}

function handleMouseUp() {
  isMouseDown.value = false;
}

function handleSelectMouseEnter(index: number) {
  if (isMouseDown.value) {
    selectionCandidate.value = index;
  }
}

/**
 * 按钮松开特效
 */
function handleSelectMouseLeave() {
  if (-1 === selectionCandidate.value) {
    return;
  }
  selectionCandidate.value = -1;
}

/**
 * 选择支按钮被按下
 * @param select 选项
 */
function handleSelect(select: number) {
  selectionCandidate.value = -1;
  selectedOption.value = select;

  setTimeout(() => {
    selectedOption.value = -1;
  }, 375);

  setTimeout(() => {
    // 延后 emit 事件，在选项完全消失后再 emit 出去
    emit("select", select);
  }, 400);
}

const mapSelection = computed(() =>
  props.selection.map(it => ({
    SelectionGroup: it.SelectionGroup,
    text: it.text.map(text => parseTextEffect(text).content).join(""),
  }))
);

/**
 * 处理选项的文字特效
 */
function parseTextEffect(_text: Text) {
  const text = deepCopyObject(_text);
  const effects = text.effects;
  // 注解
  const rt = (
    effects.filter(effect => effect.name === "ruby")[0] || { value: [] }
  ).value.join("");
  const style = effects
    .filter(effect => effect.name !== "ruby")
    .map(effect => {
      const value = effect.value.join("");
      const name = effect.name;
      if (name === "color") {
        return `color: ${value}`;
      }
      return "";
    })
    .join(";");
  if (rt) {
    // eslint-disable-next-line max-len
    text.content = `<span style="${style};" class="ruby" data-content="${rt}"><span class="rb">${text.content}</span><span class="rt">${rt}</span></span>`;
  } else {
    text.content = `<span style="${style};">${text.content}</span>`;
  }
  return text;
}
</script>

<template>
  <div
    class="ba-selector-container"
    ref="selectorContainerElement"
    @mouseup="handleMouseUp"
  >
    <div
      class="ba-selector"
      ref="selectorElement"
      :style="{ marginTop: selectorMarginTop }"
    >
      <!-- 没有发生 DOM 顺序的移动，让 vue 使用就地复用策略提高效率，不需要 key -->
      <!-- eslint-disable vue/require-v-for-key -->
      <div
        v-for="(option, index) in mapSelection"
        @mousedown="handleSelectMouseDown(index)"
        @touchstart="handleSelectMouseDown(index)"
        @touchend="handleSelectMouseLeave"
        @mouseenter="handleSelectMouseEnter(index)"
        @mouseleave="handleSelectMouseLeave"
        @click="handleSelect(index)"
        role="button"
        tabindex="-1"
        class="ba-selector-list"
        :class="{
          activated: index === selectionCandidate,
          selected: index === selectedOption,
        }"
      >
        <div class="ba-selector-item">
          <div v-html="option.text"></div>
        </div>
      </div>
      <!--eslint-enable vue/require-v-for-key-->
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ba-selector-container {
  display: flex;
  position: absolute;
  flex-direction: column;
  align-items: center;
  z-index: 110;
  width: 100%;
  height: 100%;
  user-select: none;

  .ba-selector {
    $font-size: 1.5em;
    display: flex;
    flex-direction: column;
    gap: 1em;
    width: 80%;
    .ba-selector-item {
      -webkit-tap-highlight-color: transparent;
      transform: skewX(-10deg);
      transition: all 0.175s ease-in-out;
      cursor: pointer;
      border: 1px solid white;
      border-radius: 4px;
      background: linear-gradient(
          58deg,
          rgba(240, 240, 240, 0.1) 0%,
          rgba(240, 240, 240, 1) 38%,
          rgba(240, 240, 240, 0.1) 100%
        ),
        center / 100% url("../assets/UITex_BGPoliLight_1.svg") rgb(164 216 237)
          no-repeat;
      padding: 0.5em 1em;
      color: #344a6e;
      font-size: max($font-size, 14px);
      text-align: center;
      div {
        transform: skewX(10deg);
      }
      :deep(.ruby) {
        display: inline-block;
        position: relative;
        height: $font-size;
        line-height: $font-size;
        .rb {
          display: inline-block;
          height: $font-size;
          line-height: $font-size;
        }
        .rt {
          position: absolute;
          top: calc(-1 * #{$font-size} * 0.5);
          left: 0;
          width: 100%;
          font-size: calc(#{$font-size} * 0.5);
          line-height: 1;
          text-align: center;
        }
      }
    }
  }
}

.activated {
  .ba-selector-item {
    scale: 0.95;
  }
}

.selected {
  .ba-selector-item {
    scale: 1.1;
    opacity: 0;
  }
}
</style>
