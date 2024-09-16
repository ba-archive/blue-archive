<template>
  <!-- @vue-ignore -->
  <span
    class="eden-ui eden-ui__spinner eden-ui__spinner--base items-center justify-center border-none rounded-full grid place-items-stretch"
    :style="spinnerStyle"
  >
    <!-- @vue-ignore -->
    <span
      class="eden-ui eden-ui__spinner--composer eden-ui__spinner--composer-secondary flex items-center justify-center rounded-full"
      :style="secondaryComposerStyle"
    ></span>
    <!-- @vue-ignore -->
    <span
      class="eden-ui eden-ui__spinner--composer eden-ui__spinner--composer-primary flex items-center justify-center rounded-full"
      :style="primaryComposerStyle"
    ></span>
  </span>
</template>

<script setup lang="ts">
import type { SpinnerProps } from "./types/EdenSpinner/SpinnerProps";
import { computed } from "vue";
import { parseColor } from "~/packages/eden-design/_utils/colorUtils";
import { parseSize } from "~/packages/eden-design/_utils/styleUtils";

const props = withDefaults(defineProps<SpinnerProps>(), {
  size: "16",
  baseColor: "#E8F5FF",
  primaryColor: "#2773E1",
  secondaryColor: "#96C6F3",
  strokeWidth: "3",
});

const presetColors = {
  white: {
    baseColor: "transparent",
    secondaryColor: "rgba(255, 255, 255, 0.4)",
    primaryColor: "#fff",
  },
};

const spinnerSize = computed(() => {
  const size = parseSize(props.size);
  return {
    width: size,
    height: size,
  };
});

const strokeWidth = computed(() => {
  return parseSize(props.strokeWidth);
});

const baseColor = computed(() => {
  return props.white
    ? presetColors.white.baseColor
    : parseColor(props.baseColor);
});

const secondaryColor = computed(() => {
  return props.white
    ? presetColors.white.secondaryColor
    : parseColor(props.secondaryColor);
});

const primaryColor = computed(() => {
  return props.white
    ? presetColors.white.primaryColor
    : parseColor(props.primaryColor);
});

const spinnerStyle = computed(() => {
  return {
    ...spinnerSize.value,
    boxShadow: `inset 0 0 0 ${parseSize(props.strokeWidth)} ${baseColor.value}`,
  };
});

const secondaryComposerStyle = computed(() => {
  return {
    ...spinnerSize.value,
    boxShadow: `inset 0 0 0 ${strokeWidth.value} ${secondaryColor.value}`,
  };
});

const primaryComposerStyle = computed(() => {
  return {
    ...spinnerSize.value,
    boxShadow: `inset 0 0 0 ${strokeWidth.value} ${primaryColor.value}`,
  };
});
</script>

<style scoped lang="scss">
.eden-ui__spinner {
  width: 100%;
  height: 100%;
  margin: 4px;
  grid-template-areas: "spinner";

  &--composer {
    grid-area: spinner;

    &-secondary {
      animation: rotate 1.2s linear infinite;
      mask-image: conic-gradient(#000 0deg, #000 90deg, transparent 90.2deg);
    }

    &-primary {
      animation: rotate 2s linear infinite;
      mask-image: conic-gradient(#000 0deg, #000 270deg, transparent 270.2deg);
    }
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
