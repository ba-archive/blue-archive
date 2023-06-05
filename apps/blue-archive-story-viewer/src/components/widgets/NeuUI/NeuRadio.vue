<template>
  <div class="neu-radio__container" role="radio" tabindex="0">
    <div class="neu-radio__dot-wrapper" :class="{ activated: activated }"></div>
    <div class="neu-radio__text">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    value?: string | number | boolean;
    activated?: boolean;
    disabled?: boolean;
  }>(),
  {
    value: '',
    activated: false,
    disabled: false,
  }
);
</script>

<style scoped lang="scss">
.neu-radio {
  &__container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
    border-radius: 0.5rem;
    padding: 0.5rem 0;

    &:hover {
      .neu-radio__dot-wrapper:not(.activated) {
        &::after {
          background-color: #d3d3d3;
        }
      }
    }
  }

  &__dot-wrapper {
    display: flex;
    flex: none;
    justify-content: center;
    align-items: center;
    transition: all 0.2s ease-in-out;
    border: 1px solid #d3d3d3;
    border-radius: 50%;
    width: 1rem;
    height: 1rem;

    &::after {
      display: block;
      transition: all 0.2s ease-in-out;
      border-radius: 50%;
      width: 0.5rem;
      height: 0.5rem;
      content: '';
    }

    &.activated {
      border-color: var(--color-pallete-arona-blue);

      &::after {
        background-color: var(--color-pallete-arona-blue);
      }
    }
  }
}
</style>
