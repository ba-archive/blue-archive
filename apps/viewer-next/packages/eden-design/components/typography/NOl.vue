<script lang="ts" setup>
import ETextCore from "../reusables/EdenTextCore/ETextCore.vue";
import type { TextProps } from "../types/EdenTextCore/TextProps";

const props = withDefaults(defineProps<TextProps>(), {
  align: "left",
  level: 2,
  type: "body",
});
</script>

<template>
  <ol class="eden-ui eden-ui--ol">
    <ETextCore :props="props">
      <template #prefix v-if="!!useSlots().prefix">
        <slot name="prefix"></slot>
      </template>
      <slot></slot>
      <template #suffix v-if="!!useSlots().suffix">
        <slot name="suffix"></slot>
      </template>
    </ETextCore>
  </ol>
</template>

<style lang="scss">
.eden-ui--ol {
  counter-reset: counter;

  .eden-ui__li {
    counter-increment: counter;
    list-style-type: none;

    &::before {
      content: counter(counter) ".";
      margin-right: 0.5rem;
    }
  }
}
</style>
