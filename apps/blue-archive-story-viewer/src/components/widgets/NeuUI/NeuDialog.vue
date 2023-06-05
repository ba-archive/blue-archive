<template>
  <div
    class="neu-dialog__mask flex-vertical center"
    :class="{
      'mask-enabled': ['true', true].includes(showMask),
    }"
  >
    <div
      class="neu-dialog__card rounded-medium flex-vertical"
      :class="{ 'shadow-far': ['true', true].includes(shadow) }"
    >
      <div
        class="neu-dialog__title"
        :class="{
          smaller: ['true', true].includes(smallerTitle),
        }"
      >
        <span class="title-text-before" v-if="$slots['title-before']">
          <slot name="title-before"></slot>
        </span>
        <slot name="title-text" v-if="$slots['title-text']"></slot>
        <span class="title-text" v-else>{{ title }}</span>
      </div>
      <div class="neu-dialog__content">
        <slot name="content" v-if="$slots.content"></slot>
        <div v-else>{{ content }}</div>
      </div>
      <div class="neu-dialog__actions">
        <div
          v-if="undefined !== negativeText"
          class="neu-dialog__actions__button rounded-small"
          role="button"
          @click="$emit('negativeClick')"
          tabindex="0"
        >
          {{ negativeText }}
        </div>
        <div
          class="neu-dialog__actions__button confirm-button rounded-small"
          role="button"
          @click="$emit('positiveClick')"
          tabindex="0"
        >
          {{ positiveText }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string;
    smallerTitle?: boolean | 'true' | 'false';
    content?: string;
    showMask?: boolean | 'true' | 'false';
    shadow?: boolean | 'true' | 'false';
    negativeText?: string;
    positiveText?: string;
  }>(),
  {
    title: 'Dialog',
    smallerTitle: false,
    showMask: true,
    shadow: false,
    positiveText: 'OK',
  }
);
</script>

<style scoped lang="scss">
.neu-dialog__mask.mask-enabled {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
}

.neu-dialog__card {
  gap: 1rem;
  transition: background-color 0.375s ease-in-out;
  background-color: var(--color-card-background);
  padding: 1rem;
  width: 30rem;

  .neu-dialog__title {
    display: flex;
    align-items: center;
    width: 100%;
    font-weight: 500;
    font-size: 1.25rem;

    &.smaller {
      font-size: 1.05rem;

      .title-text-before {
        margin-right: 0.25rem;
      }
    }

    .title-text-before {
      margin-right: 0.5rem;
      :deep(img, svg) {
        vertical-align: -0.15em;
        height: 1em;
      }
    }

    .title-text {
      transition: color 0.375s ease-in-out;
    }
  }

  .neu-dialog__content {
    transition: color 0.375s ease-in-out;
    width: 100%;

    :deep(p:not(:last-child)) {
      margin-bottom: 0.5rem;
    }
  }

  .neu-dialog__actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    width: 100%;
    user-select: none;

    .neu-dialog__actions__button {
      transition: all 0.375s ease-in-out;
      cursor: pointer;
      border: 1px solid var(--color-text-glass-panel);
      padding: 0.25rem 0.75rem;

      &.confirm-button {
        border: none;
        background-color: var(--color-primary-button);
        color: #fff;
      }
    }
  }
}

@media (max-width: 768px) {
  .neu-dialog__card {
    width: calc(100% - 2rem);
  }
}
</style>
