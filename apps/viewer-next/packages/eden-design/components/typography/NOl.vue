<script lang="ts" setup>
import ETextCore from "../reusables/EdenTextCore/ETextCore.vue";
import type { TextProps } from "../types/EdenTextCore/TextProps";

const props = withDefaults(defineProps<TextProps>(), {
  align: "left",
  level: 2,
  type: "ol",
});
</script>

<template>
  <ol>
    <ETextCore :props="props">
      <template #prefix>
        <slot name="prefix"></slot>
      </template>
      <slot></slot>
      <template #suffix>
        <slot name="suffix"></slot>
      </template>
    </ETextCore>
  </ol>
</template>
