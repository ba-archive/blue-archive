<script setup lang="ts">
import ETextCore from "~/packages/eden-design/components/reusables/EdenTextCore/ETextCore.vue";
import type { ButtonProps } from "~/packages/eden-design/components/types/EdenButton/ButtonProps";
import {
  getGradientStyle,
  parseColor,
} from "~/packages/eden-design/_utils/colorUtils";

const props = withDefaults(defineProps<ButtonProps>(), {
  size: "medium",
  primary: true,
  textProps: {
    // @ts-ignore
    level: 3,
    type: "body",
  },
});

function getPresetPaletteName() {
  const keys = ["default", "brand", "danger", "success", "warning", "momotalk"];

  return keys.find(key => props[key as keyof ButtonProps]) || "default";
}

const buttonClass = computed(() => [
  "eden-ui",
  "eden-ui__button",
  "flex items-center justify-center cursor-pointer transition-all duration-300",
  `size-${props.size}`,
  `palette-${getPresetPaletteName()}`,
  {
    active: !props.disabled && props.active,
    secondary: props.secondary,
    bordered: props.bordered,
    disabled: props.disabled,
    pressed: !props.disabled && pressed.value,
    "w-full": props.wide,
  },
]);

const gradientStyle = computed(() => {
  if ("[object Object]" === Object.prototype.toString.call(props.background)) {
    const { backgroundImage } = getGradientStyle(
      props.background as {
        from: string;
        to: string;
        deg?: number | string;
      }
    );
    return { backgroundImage };
  }
});

const buttonStyle = computed(() => [
  gradientStyle.value,
  props.background &&
    "string" === typeof props.background && {
      backgroundColor: parseColor(props.background),
    },
]);

const pressed = ref(false);
const released = ref(true);

function handleMouseAction(
  action: "mousedown" | "mouseup" | "mouseenter" | "mouseleave"
) {
  switch (action) {
    case "mousedown":
      pressed.value = true;
      released.value = false;
      break;
    case "mouseup":
      pressed.value = false;
      released.value = true;
      break;
    case "mouseenter":
      if (!released.value) {
        pressed.value = true;
      }
      break;
    case "mouseleave":
      if (pressed.value && !released.value) {
        released.value = false;
      }
      pressed.value = false;
      break;
  }
}

const emits = defineEmits(["click"]);

function clickHandler() {
  if (!props.disabled) {
    emits("click");
  }
}
</script>

<template>
  <button
    :class="buttonClass"
    :style="buttonStyle"
    @mousedown="handleMouseAction('mousedown')"
    @mouseleave="handleMouseAction('mouseleave')"
    @mouseup="handleMouseAction('mouseup')"
    @mouseenter="handleMouseAction('mouseenter')"
    @click.prevent="clickHandler"
  >
    <span class="eden-ui__button--icon mr-1" v-if="useSlots().icon">
      <slot name="icon"></slot>
    </span>
    <ETextCore
      :props="{
        ...textProps,
        level: textProps.level ?? 3,
        type: textProps.type ?? 'body',
        noSelect: true,
        inheritTextColor: !textProps.color,
        noWrap: true,
      }"
    >
      <slot></slot>
    </ETextCore>
  </button>
</template>

<style scoped lang="scss">
.eden-ui__button {
  padding-left: 12px;
  padding-right: 12px;
  border-radius: 4px;
  /* reset */
  appearance: none;
  border: none;
  outline: none;
  background-color: transparent;

  &.disabled {
    cursor: not-allowed !important;
    opacity: 0.7;
  }

  &.size- {
    &small {
      padding-top: 1px;
      padding-bottom: 1px;
    }

    &medium {
      padding-top: 2px;
      padding-bottom: 2px;
    }

    &large {
      padding-top: 3px;
      padding-bottom: 3px;
    }
  }

  &.palette- {
    &default,
    &brand {
      background-color: $arona-blue-6;
      color: $fill-base;

      &:not(.disabled, .bordered):hover {
        background-color: $arona-blue-5;
      }

      &:not(.disabled, .bordered).pressed {
        background-color: $arona-blue-7 !important;
      }

      &.secondary {
        background-color: $arona-blue-2;
        color: $arona-blue-6;

        &:not(.disabled):hover {
          background-color: $arona-blue-1;
        }

        &.pressed {
          background-color: $arona-blue-3 !important;
        }
      }

      &.bordered {
        border: 1px solid $arona-blue-6;
        background-color: transparent;
        color: $arona-blue-6;

        &:not(.disabled):hover {
          border-color: $arona-blue-5;
        }

        &:not(.disabled).pressed {
          border-color: $arona-blue-7;
        }
      }
    }

    &danger {
      background-color: $danger-6;
      color: $fill-base;

      &:not(.disabled, .bordered):hover {
        background-color: $danger-5;
      }

      &:not(.disabled, .bordered).pressed {
        background-color: $danger-7 !important;
      }

      &.secondary {
        background-color: $danger-2;
        color: $danger-6;

        &:not(.disabled):hover {
          background-color: $danger-1;
        }

        &.pressed {
          background-color: $danger-3 !important;
        }
      }

      &.bordered {
        border: 1px solid $danger-6;
        background-color: transparent;
        color: $danger-6;

        &:not(.disabled):hover {
          border-color: $danger-5;
        }

        &:not(.disabled).pressed {
          border-color: $danger-7;
        }
      }
    }

    &success {
      background-color: $success-6;
      color: $fill-base;

      &:not(.disabled, .bordered):hover {
        background-color: $success-5;
      }

      &:not(.disabled, .bordered).pressed {
        background-color: $success-7 !important;
      }

      &.secondary {
        background-color: $success-2;
        color: $success-6;

        &:not(.disabled):hover {
          background-color: $success-1;
        }

        &.pressed {
          background-color: $success-3 !important;
        }
      }

      &.bordered {
        border: 1px solid $success-6;
        background-color: transparent;
        color: $success-6;

        &:not(.disabled):hover {
          border-color: $success-5;
        }

        &:not(.disabled).pressed {
          border-color: $success-7;
        }
      }
    }

    &warning {
      background-color: $warning-6;
      color: $fill-base;

      &:not(.disabled, .bordered):hover {
        background-color: $warning-5;
      }

      &:not(.disabled, .bordered).pressed {
        background-color: $warning-7 !important;
      }

      &.secondary {
        background-color: $warning-2;
        color: $warning-6;

        &:not(.disabled):hover {
          background-color: $warning-1;
        }

        &.pressed {
          background-color: $warning-3 !important;
        }
      }

      &.bordered {
        border: 1px solid $warning-6;
        background-color: transparent;
        color: $warning-6;

        &:not(.disabled):hover {
          border-color: $warning-5;
        }

        &:not(.disabled).pressed {
          border-color: $warning-7;
        }
      }
    }

    &momotalk {
      background-color: #ffffff7f;
      color: $text-5;
      padding: 6px 8px;

      &:not(.disabled):hover {
        background-color: #ffffffbf;
      }

      &.pressed {
        background-color: #f2f2f27f !important;
      }

      &.active {
        background-color: #2773e17f;
        color: #fff;

        &:hover {
          background-color: #4a91e77f;
        }

        &.pressed {
          background-color: #1857bc7f !important;
        }
      }
    }
  }
}

html.dark-mode {
  .palette-momotalk {
    background-color: #2424247f;
    color: #fff;
  }
}
</style>
