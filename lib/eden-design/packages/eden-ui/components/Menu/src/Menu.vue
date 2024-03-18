<script setup lang="tsx">
import { IMenuData } from "../types/Menu";
import SubMenu from "./SubMenu.vue";
import MenuItem from "./MenuItem.vue";
const props = defineProps<{
  title?: string;
  data?: IMenuData[];
}>();

const menuItemTriage = [
  {
    keyIs: "groupName",
    component: SubMenu,
  },
  {
    keyIs: "title",
    component: MenuItem,
  },
];
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
    </div>
    <div class="eden--ui__menu__content" v-if="!props.data">
      <slot></slot>
    </div>
    <div class="eden--ui__menu__content" v-else>
      <component
        v-for="item in props.data"
        :is="menuItemTriage.find(triage => item[triage.keyIs])?.component"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "../../../style/color.scss";

@include theme {
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
      color: themeColor("color-text-5");

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
}
</style>
