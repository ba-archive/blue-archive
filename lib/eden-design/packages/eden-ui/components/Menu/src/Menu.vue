<script setup lang="ts">
import { IMenuData } from "../types/Menu";
const props = defineProps<{
  title?: string;
  data?: IMenuData[];
}>();
</script>

<template>
  <div class="eden-ui__menu">
    <div class="eden-ui__menu__header">
      <div class="eden-ui__menu__header--logo" v-if="$slots.icon">
        <slot name="icon"></slot>
      </div>
      <div class="eden-ui__menu__header--title">
        <slot name="title"></slot>
      </div>
      <div class="eden--ui__menu__header--content" v-if="!props.data">
        <slot></slot>
      </div>
      <div class="eden--ui__menu__header--content" v-else></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.eden-ui__menu {
  font-family: var(--eden-main-font);
  width: 256px;
  padding-left: 20px;
  padding-top: 32px;
  border-right: 1px solid #00000010;
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__header {
    display: flex;
    gap: 12px;
    align-items: center;

    &--logo {
      max-width: 48px;
      max-height: 48px;
      object-fit: contain;
    }

    &--title {
      font-family: var(--eden-title-font);
      font-weight: var(--eden-title-font-weight);
    }
  }
}
</style>
