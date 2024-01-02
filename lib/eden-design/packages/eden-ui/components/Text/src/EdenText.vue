<script setup lang="ts">
import { TextProps } from "../types/Text";
import { textSizeMap } from "../style/textProps";
import { computed } from "vue";
const props = withDefaults(defineProps<TextProps>(), {
  size: "body-2",
  level: 5,
  type: "text",
});

const textStyle = computed(() => {
  const sizeProps = textSizeMap
    .filter(item => item.textSize === props.size)
    .pop();
  return {
    fontSize: sizeProps?.fontSize,
    lineHeight: sizeProps?.lineHeight,
    textDecoration: [
      props.underline && "underline",
      props.stroke && "line-through",
    ].join(" "),
    color:
      props.color && "string" === typeof props.color
        ? props.color
        : `var(--color-text-${props.level}, #242424)`,
  };
});

function getGradientDegree(degree: number | string | undefined) {
  switch (typeof degree) {
    case "number":
      return `${degree}deg`;
    case "string":
      return degree;
    default:
      return "0deg";
  }
}

const gradientStyle = computed(() => {
  if ("object" === typeof props.color) {
    return {
      backgroundImage: `linear-gradient(${getGradientDegree(props.color.deg)},${
        props.color.from
      }, ${props.color.to})`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    };
  }
});
</script>

<template>
  <div
    role="text"
    :class="[
      'eden-ui__text',
      {
        'is-title': props.type === 'title' || props.size.startsWith('display'),
        'no-select': props.noSelect,
        blockquote: props.blockquote,
        disabled: props.disabled,
        strong: props.strong,
        italic: props.italic,
      },
    ]"
    :style="[textStyle, gradientStyle]"
  >
    <slot name="prefix"></slot>
    <slot></slot>
    <slot name="suffix"></slot>
  </div>
</template>

<style scoped lang="scss">
.eden-ui__text {
  width: fit-content;
  display: flex;
  align-items: center;

  &.is-title {
    font-family: var(--eden-title-font);
    font-weight: var(--eden-title-font-weight);
  }

  &.no-select {
    user-select: none;
  }

  &.disabled {
    cursor: not-allowed;
    color: var(--color-text-2);
  }

  &.strong {
    font-weight: bold;
  }

  &.italic {
    font-style: italic;
  }

  &.blockquote {
    border-left: 0.25rem solid var(--color-text-2);
    padding-left: 1rem;
  }
}
</style>
