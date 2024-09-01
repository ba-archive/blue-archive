<script setup lang="tsx">
import type { DividerProps } from "./types/EdenDivider/DividerProps";
import { computed } from "vue"; // make volar happy

const props = withDefaults(defineProps<DividerProps>(), {
  type: "solid",
  direction: "horizontal",
});

const isVertical = computed(
  () => props.direction === "vertical" || props.vertical
);

const isDashed = computed(() => props.dashed || props.type === "dashed");

const dividerClass = computed(() => [
  isVertical.value ? "vertical" : "horizontal",
  isDashed.value ? "dashed" : "solid",
]);
</script>

<template>
  <div role="separator" class="eden-ui eden-ui__divider select-none" :class="dividerClass"></div>
</template>

<style lang="scss" scoped>
@import "~/packages/eden-design/components/index.scss";

.eden-ui__divider {
  border-color: $border-3;
  border-width: 0.5px;

  &.horizontal {
    width: 100%;
    height: 0;
  }

  &.vertical {
    width: 0;
    height: 100%;
    min-height: 1rem;
  }

  &.solid {
    border-style: solid;
  }

  &.dashed {
    border-style: dashed;
  }
}
</style>
