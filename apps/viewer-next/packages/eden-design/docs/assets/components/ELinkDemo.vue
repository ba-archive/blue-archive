<script lang="tsx" setup>
import ETextCore from "@eden-design/components/reusables/EdenTextCore/ETextCore.vue";
import type { TextProps } from "../../../components/types/EdenTextCore/TextProps";
import type { NuxtLinkProps } from "nuxt/app";
import { useSlots } from "vue";

type EdenLinkProps = TextProps &
  NuxtLinkProps & { nav?: boolean; underline?: boolean };

const props = withDefaults(defineProps<EdenLinkProps>(), {
  to: "",
  nav: false,
  align: "start",
  level: 2,
  type: "body",
});
</script>

<template>
  <a
    class="eden-ui eden-ui__link w-[fit-content] flex items-center"
    :class="{
      'nav-link': props.nav,
    }"
    :to="props.to"
    :href="props.href || props.to"
    :external="props.external"
    :target="props.target"
    :rel="props.rel"
    :no-rel="props.noRel"
    :prefetched-class="props.prefetchedClass"
    :prefetch="props.prefetch"
  >
    <ETextCore
      :props="{
        ...props,
        underline: !props.nav,
        brand: !props.nav,
      }"
    >
      <template #prefix v-if="!!useSlots().prefix">
        <slot name="prefix"></slot>
      </template>
      <slot></slot>
      <template #suffix v-if="!!useSlots().suffix">
        <slot name="suffix"></slot>
      </template>
    </ETextCore>
  </a>
</template>

<style lang="scss" scoped>
.eden-ui__link {
  text-decoration: none;
  cursor: pointer;

  &.nav-link {
    color: var(--color-text-5);

    &::before {
      content: "";
      position: absolute;
      background-color: transparent;
      width: 3px;
      height: 16px;
      border-radius: 4px;
      transform: translate3d(-8px, 0, 0);
      transition: background-color 0.175s ease-in-out;
    }

    &.router-link-active::before {
      background-color: var(--arona-blue-6);
    }

    &:not(.router-link-active):hover::before {
      background-color: var(--color-text-2);
    }
  }

  &:visited {
    color: var(--arona-blue-7);
  }
}
</style>
