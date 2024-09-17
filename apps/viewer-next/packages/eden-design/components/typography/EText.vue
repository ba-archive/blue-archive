<script lang="tsx" setup>
import ETextCore from "../reusables/EdenTextCore/ETextCore.vue";
import type { TextProps } from "../types/EdenTextCore/TextProps";
import { useSlots, computed } from "vue";

const slots = useSlots();

const props = withDefaults(defineProps<TextProps>(), {
  align: "start",
  level: 2,
  type: "body",
});

const elementTag = computed(() => {
  return props.inline ? "span" : "p";
});

const TextElement = () => {
  return (
    <elementTag.value class="eden-ui">
      <ETextCore props={props}>
        {{
          prefix: slots.prefix,
          default: slots.default,
          suffix: slots.suffix,
        }}
      </ETextCore>
    </elementTag.value>
  );
};
</script>

<template>
  <TextElement />
</template>
