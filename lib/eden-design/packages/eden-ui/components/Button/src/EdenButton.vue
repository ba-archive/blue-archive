<script setup lang="ts">
import { IButtonProps } from "../types/Button";
const props = withDefaults(defineProps<IButtonProps>(), {
  style: "brand",
  size: "medium",
  type: "secondary",
  loading: false,
  disabled: false,
});

const emit = defineEmits<{
  (e: "click", ev: MouseEvent): void;
}>();

function handleClick(ev: MouseEvent) {
  emit("click", ev);
}
</script>

<template>
  <button
    class="eden-ui__button"
    :class="[
      `eden-ui__button--${props.style}`,
      `eden-ui__button--${props.size}`,
      `eden-ui__button--${props.type}`,
      {
        'eden-ui__button--loading': props.loading,
        'eden-ui__button--disabled': props.disabled,
      },
    ]"
    :disabled="props.disabled"
  >
    <slot name="icon"></slot>
    <slot></slot>
  </button>
</template>

<style scoped lang="scss"></style>
