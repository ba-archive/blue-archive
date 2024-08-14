<script lang="ts" setup>
import ETextCore from "../reusables/EdenTextCore/ETextCore.vue";
import type { TextProps } from "../types/EdenTextCore/TextProps";

const props = withDefaults(defineProps<TextProps>(), {
  align: "left",
  level: 2,
  type: "ul",
});
</script>

<template>
  <ul>
    <ETextCore :props="props">
      <template #prefix>
        <slot name="prefix"></slot>
      </template>
      <slot></slot>
      <template #suffix>
        <slot name="suffix"></slot>
      </template>
    </ETextCore>
  </ul>
</template>
