<script lang="ts" setup>
import ETextCore from "../reusables/EdenTextCore/ETextCore.vue";
import type { TextProps } from "../types/EdenTextCore/TextProps";
import { useSlots } from "vue";

const props = withDefaults(defineProps<TextProps>(), {
  align: "start",
  level: 2,
  type: "title",
});
</script>

<template>
  <h2 class="eden-ui">
    <ETextCore :props="props">
      <template #prefix v-if="!!useSlots().prefix">
        <slot name="prefix"></slot>
      </template>
      <slot></slot>
      <template #suffix v-if="!!useSlots().suffix">
        <slot name="suffix"></slot>
      </template>
    </ETextCore>
  </h2>
</template>
