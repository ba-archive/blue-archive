<script lang="tsx" setup>
import ETextCore from "../reusables/EdenTextCore/ETextCore.vue";
import type { TextProps } from "../types/EdenTextCore/TextProps";

const slots = useSlots();

const props = withDefaults(defineProps<TextProps>(), {
  align: "left",
  level: 2,
  type: "body",
});

const elementTag = computed(() => {
  if (props.sub) return "sub";
  if (props.sup) return "sup";
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
