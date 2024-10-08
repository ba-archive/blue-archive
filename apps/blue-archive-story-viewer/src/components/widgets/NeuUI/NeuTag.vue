<script setup lang="ts">
import { computed } from "vue";
const props = withDefaults(
  defineProps<{
    type?: "default" | "warning" | "error" | "success";
    size?: "small" | "medium" | "large";
    bordered?: boolean;
  }>(),
  {
    type: "default",
    bordered: false,
    size: "medium",
  }
);

const backgroundColor = computed(() => `var(--color-tag-fluent-${props.type})`);
const textColor = computed(() => `var(--color-text-fluent-${props.type})`);
</script>

<template>
  <div
    class="fluent-tag"
    :class="[
      type,
      `size-${size}`,
      {
        bordered: props.bordered,
      },
    ]"
  >
    <slot name="prefix"></slot>
    <slot></slot>
    <slot name="suffix"></slot>
  </div>
</template>

<style scoped lang="scss">
.fluent-tag {
  border-radius: 4px;
  background-color: v-bind(backgroundColor);
  padding: 0 8px;
  color: v-bind(textColor);
  transition: all 0.3s ease-in-out;
  white-space: nowrap;

  &.bordered {
    border: 1px solid v-bind(textColor);
  }

  &.size-small {
    padding: 0 4px;
    font-size: 14px;
  }
}
</style>
