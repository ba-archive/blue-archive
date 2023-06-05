<template>
  <div
    class="neu-radio-group"
    :class="{
      vertical: 'vertical' === direction,
      horizontal: 'horizontal' === direction,
    }"
  >
    <div class="neu-radio-group__title">
      <slot name="title"></slot>
    </div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    direction?: 'horizontal' | 'vertical';
  }>(),
  {
    direction: 'horizontal',
  }
);
</script>

<style scoped lang="scss">
.neu-radio-group {
  display: flex;
  gap: 1rem;
  &.horizontal {
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  &.vertical {
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }

  &__title {
    margin-bottom: 0.5rem;
    color: #666;
    font-size: 0.8rem;
  }
}
</style>
