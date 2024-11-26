<script lang="ts" setup>
import ETextCore from "../reusables/EdenTextCore/ETextCore.vue";
import type { TextProps } from "../types/EdenTextCore/TextProps";

const props = withDefaults(defineProps<TextProps>(), {
  align: "start",
  level: 2,
  type: "body",
});
</script>

<template>
  <blockquote class="eden-ui">
    <ETextCore :props="props">
      <template #prefix>
        <slot name="prefix"></slot>
      </template>
      <slot></slot>
      <template #suffix>
        <slot name="suffix"></slot>
      </template>
    </ETextCore>
  </blockquote>
</template>

<style lang="scss" scoped>
blockquote {
  border-left: 0.25rem solid var(--color-text-2);
  padding-left: 1rem;
}
</style>
