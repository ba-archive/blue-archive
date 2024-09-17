<script lang="ts" setup>
import ETextCore from "../reusables/EdenTextCore/ETextCore.vue";
import type { TextProps } from "../types/EdenTextCore/TextProps";
import { useSlots } from "vue";

const props = withDefaults(defineProps<TextProps>(), {
  align: "left",
  level: 1,
  type: "title",
});
</script>

<template>
  <h1 class="eden-ui">
    <ETextCore :props="props">
      <template #prefix v-if="!!useSlots().prefix">
        <slot name="prefix"></slot>
      </template>
      <slot></slot>
      <template #suffix v-if="!!useSlots().suffix">
        <slot name="suffix"></slot>
      </template>
    </ETextCore>
  </h1>
</template>
