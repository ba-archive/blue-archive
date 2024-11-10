<script setup lang="ts">
import type { SwitchProps } from "./types/EdenSwitch/SwitchProps";
import {
  getGradientStyle,
  parseColor,
} from "~/packages/eden-design/_utils/colorUtils";

const model = defineModel<boolean>();

const props = withDefaults(defineProps<SwitchProps>(), {
  checked: false,
  size: "medium",
});

const switchState = ref(props.checked);

watch(
  () => [props.checked, model.value],
  newVal => {
    switchState.value = newVal[0] || newVal[1] || false;
  }
);

const thumbGradientStyle = computed(() => {
  if ("[object Object]" === Object.prototype.toString.call(props.thumbColor)) {
    const { backgroundImage } = getGradientStyle(
      props.thumbColor as {
        from: string;
        to: string;
        deg?: number | string;
      }
    );
    return { backgroundImage };
  }
});

const thumbStyle = computed(() => [
  thumbGradientStyle.value,
  props.thumbColor &&
    "string" === typeof props.thumbColor && {
      backgroundColor: parseColor(props.thumbColor),
    },
]);

const backgroundGradientStyle = computed(() => {
  if (
    "[object Object]" === Object.prototype.toString.call(props.backgroundColor)
  ) {
    const { backgroundImage } = getGradientStyle(
      props.backgroundColor as {
        from: string;
        to: string;
        deg?: number | string;
      }
    );
    return { backgroundImage };
  }
});

const borderStyle = computed(() => [
  backgroundGradientStyle.value,
  props.borderColor &&
    "string" === typeof props.borderColor && {
      borderColor: parseColor(props.borderColor),
    },
  props.backgroundColor &&
    "string" === typeof props.backgroundColor && {
      backgroundColor: parseColor(props.backgroundColor),
    },
]);

function getPresetPaletteName() {
  if (!!props.borderColor || !!props.thumbColor) {
    return "custom";
  }
  const keys = ["default", "brand", "danger", "success", "warning"];
  return keys.find(key => props[key as keyof SwitchProps]) || "default";
}

const switchClass = computed(() => [
  "eden-ui eden-ui__switch",
  "flex cursor-pointer rounded-full items-center",
  `palette-${getPresetPaletteName()}`,
  `size-${props.size}`,
  "transition-all duration-300 ease-in-out",
  {
    disabled: props.disabled,
    "!cursor-not-allowed": props.disabled || props.controlled,
  },
]);

const emits = defineEmits(["update:checked"]);

function handleClick() {
  if (props.disabled || props.controlled) return;
  switchState.value = !switchState.value;
  model.value = switchState.value;
  emits("update:checked", switchState.value);
}
</script>

<template>
  <button
    :disabled="props.disabled"
    class="eden-ui__switch--track"
    :class="switchClass"
    @click="handleClick"
    :style="borderStyle"
    :data-state="switchState ? 'checked' : ''"
  >
    <span
      class="eden-ui__switch--thumb flex rounded-full will-change-transform transition-all duration-300 ease-in-out"
      :style="thumbStyle"
      :data-state="switchState ? 'checked' : ''"
    />
  </button>
</template>

<style lang="scss" scoped>
@import '../_mixins/switch.scss';

.eden-ui__switch {
  margin-left: 8px;
  margin-right: 8px;
  appearance: none;
  border: 1px solid $fill-4;
  outline: none;
  background-color: transparent;

  &--thumb {
    background-color: $fill-4;
  }

  &.size- {
    @each $size, $values in $switch-sizes {
      &#{$size} {
        @include switch-size-variant(
          map-get($values, 'width'),
          map-get($values, 'height'),
          map-get($values, 'thumb-size'),
          map-get($values, 'thumb-translate'),
          map-get($values, 'padding')
        );
      }
    }
  }

  &.palette- {
    &default {
      &.eden-ui__switch {
        &--track[data-state="checked"] {
          background-color: map-get(map-get($switch-palettes, "default"), "track");
        }

        .eden-ui__switch--thumb[data-state="checked"] {
          background-color: map-get(map-get($switch-palettes, "default"), "thumb");
        }
      }
    }

    @each $name, $color in $switch-palettes {
      @if $name != "default" {
        &#{$name} {
          @include switch-palette-variant($color);
        }
      }
    }

    &brand {
      @include switch-palette-variant($brand-6);
    }
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
