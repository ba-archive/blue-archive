<template>
  <svg
    :width="size"
    :height="size"
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    :style="{
      transform: `rotate(${rotate}deg)`,
    }"
  >
    <path
      d="M3.997 13H20a1 1 0 1 0 0-2H3.997a1 1 0 1 0 0 2Z"
      :fill="parseColor(color)"
      :stroke-width="strokeWidth"
    />
  </svg>
</template>

<script setup lang="ts">
import type { IconProps } from "../types/EdenIcon/IconProps";
import { parseColor } from "../../_utils/colorUtils";

withDefaults(defineProps<IconProps>(), {
  size: "16",
  color: "#616161",
  strokeWidth: "1.5",
  fill: false,
  rotate: 0,
});
</script>
