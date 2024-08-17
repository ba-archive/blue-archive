<script setup lang="ts">
import type { AvatarProps } from "~/packages/eden-design/components/types/EdenAvatar/AvatarProps";
import {
  getGradientStyle,
  parseColor,
} from "~/packages/eden-design/helpers/colorFunctions";
import type { Directive } from "vue";

const props = withDefaults(defineProps<AvatarProps>(), {
  size: "medium",
  alt: "",
  borderWidth: "1px",
});

const avatarSizeType = computed(
  () =>
    `size-${
      ["mini", "small", "medium", "large", "xlarge", "auto"].includes(
        props.size + ""
      )
        ? props.size
        : "custom"
    }`
);

// noinspection JSUnusedGlobalSymbols
const customSize = computed(() => {
  return /^(\d+)(px|rem|em|d?vw|d?vh)$/.test(props.size + "")
    ? props.size
    : props.size + "px";
});

const avatarClass = computed(() => [
  "eden-ui",
  "eden-ui__avatar",
  "grid place-items-center select-none",
  avatarSizeType.value,
  {
    circle: !props.squared,
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

const avatarStyle = computed(() => [
  gradientStyle.value,
  props.background &&
    "string" === typeof props.background && {
      backgroundColor: parseColor(props.background),
    },
  (props.bordered || props.borderColor) && {
    border: `${
      /^(\d+)(px|rem|em|d?vw|d?vh)$/.test(props.borderWidth + "")
        ? props.borderWidth
        : props.borderWidth + "px"
    } solid ${parseColor(props.borderColor ?? "arona-blue-6")}`,
  },
]);

const vFallback: Directive = {
  mounted(el, binding) {
    const fallbackSrc = binding.value;
    if (!fallbackSrc) {
      return;
    }
    const img = new Image();
    img.src = el.getAttribute("src") || "";
    img.onerror = () => {
      el.setAttribute("src", fallbackSrc);
    };
  },
};
</script>

<template>
  <span
    :class="avatarClass"
    class="eden-ui__avatar--wrapper"
    :style="avatarStyle"
  >
    <img
      v-fallback="props.fallbackSrc"
      class="eden-ui__avatar eden-ui__avatar--image"
      :class="avatarSizeType"
      v-if="props.src"
      :src="props.src"
      :alt="props.alt"
    />
    <span class="eden-ui__avatar--slot">
      <slot></slot>
    </span>
  </span>
</template>

<style scoped lang="scss">
.eden-ui__avatar {
  &--wrapper {
    grid-template-areas: "avatar";
    border-radius: 4px;
    overflow: hidden;

    &.circle {
      border-radius: 100%;
    }
  }

  &--image,
  &--slot {
    grid-area: avatar;
  }

  &.size- {
    &mini {
      width: 24px;
      height: 24px;
    }

    &small {
      width: 32px;
      height: 32px;
    }

    &medium {
      width: 48px;
      height: 48px;
    }

    &large {
      width: 56px;
      height: 56px;
    }

    &xlarge {
      width: 84px;
      height: 84px;
    }

    &auto {
      width: auto;
      height: auto;
    }

    &custom {
      width: v-bind("customSize");
      height: v-bind("customSize");
    }
  }
}
</style>
