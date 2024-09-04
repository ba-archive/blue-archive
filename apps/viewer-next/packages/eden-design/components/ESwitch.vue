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

const borderGradientStyle = computed(() => {
  if ("[object Object]" === Object.prototype.toString.call(props.borderColor)) {
    const { backgroundImage } = getGradientStyle(
      props.borderColor as {
        from: string;
        to: string;
        deg?: number | string;
      }
    );
    return { borderImage: backgroundImage };
  }
});

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
  borderGradientStyle.value,
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
    "!cursor-not-allowed": props.disabled,
  },
]);

const emits = defineEmits(["update:checked"]);

function handleClick() {
  if (props.disabled) return;
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
    &mini {
      width: 24px;
      height: 12px;

      &.eden-ui__switch--track {
        padding-left: 1px;
        padding-right: 1px;
      }

      .eden-ui__switch--thumb {
        width: 8px;
        height: 8px;

        &[data-state="checked"] {
          transform: translate3d(12px, 0, 0);
        }
      }
    }

    &small {
      width: 32px;
      height: 16px;

      &.eden-ui__switch--track {
        padding-left: 2px;
        padding-right: 2px;
      }

      .eden-ui__switch--thumb {
        width: 11px;
        height: 11px;

        &[data-state="checked"] {
          transform: translate3d(15px, 0, 0);
        }
      }
    }

    &medium {
      width: 40px;
      height: 20px;

      &.eden-ui__switch--track {
        padding-left: 2px;
        padding-right: 2px;
      }

      .eden-ui__switch--thumb {
        width: 14px;
        height: 14px;

        &[data-state="checked"] {
          transform: translate3d(20px, 0, 0);
        }
      }
    }

    &large {
      width: 48px;
      height: 24px;

      &.eden-ui__switch--track {
        padding-left: 2px;
        padding-right: 2px;
      }

      .eden-ui__switch--thumb {
        width: 18px;
        height: 18px;

        &[data-state="checked"] {
          transform: translate3d(24px, 0, 0);
        }
      }
    }
  }

  &.palette- {
    &default {
      &.eden-ui__switch {
        &--track[data-state="checked"] {
          background-color: $fill-4;
        }

        .eden-ui__switch--thumb[data-state="checked"] {
          background-color: $fill-base;
        }
      }
    }

    &brand {
      &.eden-ui__switch {
        &--track[data-state="checked"] {
          background-color: $brand-6;
          border-color: $brand-6;
        }
      }

      .eden-ui__switch--thumb[data-state="checked"] {
        background-color: $fill-base;
      }
    }

    &danger {
      &.eden-ui__switch {
        &--track[data-state="checked"] {
          background-color: $danger-6;
          border-color: $danger-6;
        }
      }

      .eden-ui__switch--thumb[data-state="checked"] {
        background-color: $fill-base;
      }
    }

    &success {
      &.eden-ui__switch {
        &--track[data-state="checked"] {
          background-color: $success-6;
          border-color: $success-6;
        }
      }

      .eden-ui__switch--thumb[data-state="checked"] {
        background-color: $fill-base;
      }
    }

    &warning {
      &.eden-ui__switch {
        &--track[data-state="checked"] {
          background-color: $warning-6;
          border-color: $warning-6;
        }
      }

      .eden-ui__switch--thumb[data-state="checked"] {
        background-color: $fill-base;
      }
    }
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
