<script lang="tsx" setup>
import ETextCore from "../reusables/EdenTextCore/ETextCore.vue";
import type { TextProps } from "../types/EdenTextCore/TextProps";
import type { NuxtLinkProps } from "nuxt/app";

type EdenLinkProps = TextProps &
  NuxtLinkProps & { nav: boolean; underline: boolean };

const props = withDefaults(defineProps<EdenLinkProps>(), {
  to: "",
  nav: false,
  align: "left",
  level: 2,
  type: "body",
});
</script>

<template>
  <NuxtLink
    class="eden-ui__link w-[fit-content]"
    :class="{
      'nav-link': props.nav,
    }"
    :to="props.to"
    :href="props.href"
    :external="props.external"
    :target="props.target"
    :rel="props.rel"
    :no-rel="props.noRel"
    :prefetched-class="props.prefetchedClass"
    :prefetch="props.prefetch"
    :no-prefetch="props.noPrefetch"
  >
    <ETextCore
      :props="{
        ...props,
        underline: !props.nav,
        brand: !props.nav
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
  </NuxtLink>
</template>

<style lang="scss" scoped>
.eden-ui__link {
  text-decoration: none;
  cursor: pointer;

  &.nav-link {
    color: var(--color-text-5);
  }

  &:visited {
    color: var(--arona-blue-7);
  }
}
</style>
