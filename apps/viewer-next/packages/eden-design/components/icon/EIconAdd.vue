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
      d="M11.883 3.007 12 3a1 1 0 0 1 .993.883L13 4v7h7a1 1 0 0 1 .993.883L21 12a1 1 0 0 1-.883.993L20 13h-7v7a1 1 0 0 1-.883.993L12 21a1 1 0 0 1-.993-.883L11 20v-7H4a1 1 0 0 1-.993-.883L3 12a1 1 0 0 1 .883-.993L4 11h7V4a1 1 0 0 1 .883-.993L12 3l-.117.007Z"
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
