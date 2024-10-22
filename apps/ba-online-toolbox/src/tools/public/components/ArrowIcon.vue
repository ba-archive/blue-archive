<script setup lang="ts">
import { computed } from "vue";
const props = withDefaults(
  defineProps<{
    direction: "left" | "right" | "up" | "down";
    size: number;
  }>(),
  {
    direction: "left",
    size: 24,
  }
);

const rotateAngle = computed(() => {
  switch (props.direction) {
    case "left":
      return 0;
    case "right":
      return 180;
    case "up":
      return 90;
    case "down":
      return 270;
  }
});
</script>

<template>
  <svg
    :style="{ transform: `rotate(${rotateAngle}deg)` }"
    :width="props.size"
    :height="props.size"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="white"
    class="stroke-white @dark:stroke-slate-800"
    stroke-width="4"
  >
    <path d="M20.272 11.27 7.544 23.998l12.728 12.728M43 24H8.705" />
  </svg>
</template>
