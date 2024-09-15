<script setup lang="ts">
import type { SliderProps } from "./types/EdenSlider/SliderProps";
import { toNumber } from "../_utils/numberUtils";
import { parseSize } from "../_utils/styleUtils";
import { parseColor, getGradientStyle } from "../_utils/colorUtils";
import { useElementBounding } from "@vueuse/core";
import { onMounted } from "vue";

const props = withDefaults(defineProps<SliderProps>(), {
  min: 0,
  max: 100,
  step: 1,
  width: 200,
});

const sliderInstance = ref<HTMLSpanElement>();
const { left, right } = useElementBounding(sliderInstance);

const emits = defineEmits<{
  (event: "update:value", value: number): void;
}>();

function getRatioByPosition(
  elementLeftBounding: number,
  elementRightBounding: number,
  mouseX: number
) {
  if (mouseX < elementLeftBounding) {
    return 0;
  }

  if (mouseX > elementRightBounding) {
    return 1;
  }

  return (
    (mouseX - elementLeftBounding) /
    (elementRightBounding - elementLeftBounding)
  );
}

function updateValue(
  elementLeftBounding: number,
  elementRightBounding: number,
  mouseX: number
) {
  const ratio = getRatioByPosition(
    elementLeftBounding,
    elementRightBounding,
    mouseX
  );
  const value = ratio * (props.max - props.min) + props.min;
  // snap to nearest step
  model.value = Math.round(value / props.step) * props.step;
}

const model = defineModel<number>();

watch(
  () => model.value,
  newVal => {
    if (props.disabled) return;
    emits("update:value", toNumber(newVal));
  }
);

watch(
  () => props.value,
  newVal => {
    model.value = newVal;
  }
);

function getPresetPaletteName() {
  const keys = ["default", "brand", "danger", "success", "warning"];

  return keys.find(key => props[key as keyof SliderProps]) || "default";
}

const sliderClass = computed(() => {
  return [
    "eden-ui eden-ui__slider select-none",
    `palette-${getPresetPaletteName()}`,
    "ml-[10px] mr-[10px] mt-[10px] mb-[10px]",
    props.disabled || props.controlled
      ? "cursor-not-allowed"
      : "cursor-pointer",
    {
      disabled: props.disabled,
    },
  ];
});

const sliderStyle = computed(() => {
  return {
    width: props.width === "auto" ? "auto" : parseSize(props.width),
  };
});

const slots = useSlots();

const gradientStyle = computed(() => {
  if (
    "[object Object]" ===
    Object.prototype.toString.call(props.traveledBackground)
  ) {
    const { backgroundImage } = getGradientStyle(
      props.traveledBackground as {
        from: string;
        to: string;
        deg?: number | string;
      }
    );
    return { backgroundImage };
  }
});

const traveledDistancePercentage = computed(() => {
  // @ts-ignore
  return ((model.value - props.min) / (props.max - props.min)) * 100;
});

const sliderBackgroundTraveledStyle = computed(() => [
  gradientStyle.value,
  props.traveledBackground &&
    "string" === typeof props.traveledBackground && {
      backgroundColor: parseColor(props.traveledBackground),
    },
  {
    width: `${traveledDistancePercentage.value}%`,
  },
]);

const sliderThumbStyle = computed(() => [
  {
    left: `${traveledDistancePercentage.value}%`,
  },
  !!props.thumbBorderColor && { borderColor: parseColor(props.thumbBorderColor) },
]);

const triggered = ref(false);

function edenSliderGlobalMouseUpTrigger() {
  handleMouseUp();
}

function edenSliderGlobalMouseMoveTrigger(event: MouseEvent) {
  handleMouseMove(event);
}

function handleMouseDown(event: MouseEvent) {
  if (props.disabled || props.controlled) return;

  triggered.value = true;
  updateValue(left.value, right.value, event.clientX);

  // ssr compatible - window is not defined on server side
  window?.addEventListener("mouseup", edenSliderGlobalMouseUpTrigger);
  window?.addEventListener("mousemove", edenSliderGlobalMouseMoveTrigger);
}

function handleMouseUp() {
  if (props.disabled || props.controlled) return;
  triggered.value = false;

  // ssr compatible - window is not defined on server side
  window?.removeEventListener("mouseup", edenSliderGlobalMouseUpTrigger);
  window?.removeEventListener("mousemove", edenSliderGlobalMouseMoveTrigger);
}

function handleMouseMove(event: MouseEvent) {
  if (props.disabled || props.controlled) return;
  if (triggered.value) {
    updateValue(left.value, right.value, event.clientX);
  }
}

onMounted(() => {
  if (props.value) {
    model.value = props.value;
  }
});
</script>

<template>
  <!--@vue-ignore-->
  <span
    class="eden-ui eden-ui__slider"
    :class="sliderClass"
    :style="sliderStyle"
  >
    <span v-if="slots.prefix" class="eden-ui eden-ui__slider--prefix">
      <slot name="prefix" />
    </span>
    <span
      class="eden-ui eden-ui__slider--track h-2 rounded-full flex relative items-center"
      ref="sliderInstance"
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
    >
      <span
        class="eden-ui eden-ui__slider--track-traveled h-2 rounded-full"
        :style="sliderBackgroundTraveledStyle"
      />
      <span
        class="eden-ui eden-ui__slider--thumb h-5 w-5 rounded-full border-2 border-solid absolute translate-x-[-50%]"
        :style="sliderThumbStyle"
      />
    </span>
    <span v-if="slots.suffix" class="eden-ui eden-ui__slider--suffix">
      <slot name="suffix" />
    </span>
  </span>
</template>

<style scoped lang="scss">
.eden-ui__slider {
  &--track {
    background-color: $fill-2;
  }

  &--thumb {
    background-color: $fill-base;
  }

  &.palette- {
    &brand,
    &default {
      .eden-ui__slider--track-traveled {
        background-color: $arona-blue-6;
      }

      .eden-ui__slider--thumb {
        border-color: $arona-blue-6;
      }
    }

    &danger {
      .eden-ui__slider--track-traveled {
        background-color: $danger-6;
      }

      .eden-ui__slider--thumb {
        border-color: $danger-6;
      }
    }

    &success {
      .eden-ui__slider--track-traveled {
        background-color: $success-6;
      }

      .eden-ui__slider--thumb {
        border-color: $success-6;
      }
    }

    &warning {
      .eden-ui__slider--track-traveled {
        background-color: $warning-6;
      }

      .eden-ui__slider--thumb {
        border-color: $warning-6;
      }
    }
  }

  &.disabled {
    opacity: 0.7;
  }
}
</style>
