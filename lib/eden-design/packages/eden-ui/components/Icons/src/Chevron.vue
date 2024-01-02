<script setup lang="ts">
import { IconProps } from "../types/IconProps";

const props = withDefaults(defineProps<IconProps>(), {
  filled: false,
  size: 24,
  color: "#333",
  rotate: 0,
  spin: false,
});
</script>

<template>
  <svg
    class="eden-ui__icon"
    :width="props.size"
    :height="props.size"
    viewBox="0 0 48 48"
    :fill="filled ? color : 'none'"
    :transform="`rotate(${props.rotate})`"
  >
    <path
      d="M36 18L24 30L12 18"
      :stroke="filled ? 'none' : color"
      stroke-width="4"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>
