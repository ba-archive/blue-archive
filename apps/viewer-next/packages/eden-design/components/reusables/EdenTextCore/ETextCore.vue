<script lang="ts" setup>
import type { TextProps } from "../../types/EdenTextCore/TextProps";
const textCoreProps = defineProps<{ props: TextProps }>();

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
  if ("object" === typeof textCoreProps.props.color) {
    return {
      backgroundImage: `linear-gradient(${getGradientDegree(
        textCoreProps.props.color.deg
      )},${textCoreProps.props.color.from},${textCoreProps.props.color.to})`,
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      color: "transparent !important",
    };
  }
});

const textClass = computed(() => [
  "eden-ui__text",
  `${textCoreProps.props.type}-${textCoreProps.props.level}`,
  `align-${textCoreProps.props.align}`,
  {
    "font-bold":
      textCoreProps.props.bold ||
      textCoreProps.props.strong ||
      textCoreProps.props.type === "title",
    "select-none": textCoreProps.props.noSelect,
    italic: textCoreProps.props.italic,
    disabled: textCoreProps.props.disabled,
    "align-sub": textCoreProps.props.sub,
    "align-super": textCoreProps.props.sup,
    "line-through": textCoreProps.props.delete,
    underline: textCoreProps.props.underline,
  },
]);

function parseColor(color: string) {
  return color.startsWith("#") || color.startsWith("rgb")
    ? color
    : `var(${color.startsWith("--") ? color : `--${color}`})`;
}

const textStyle = computed(() => [
  gradientStyle.value,
  textCoreProps.props.color &&
    "string" === typeof textCoreProps.props.color && {
      color: parseColor(textCoreProps.props.color),
    },
]);
</script>

<template>
  <span :class="textClass" :style="textStyle">
    <slot name="prefix"></slot>
  </span>
  <span :class="textClass" :style="textStyle">
    <slot></slot>
  </span>
  <span :class="textClass" :style="textStyle">
    <slot name="suffix"></slot>
  </span>
</template>

<style lang="scss" scoped>
@import "../../index.scss";

.eden-ui {
  &__text {
    font-family: $eden-font-family;
    color: var(--color-text-5);

    &.align-left {
      text-align: left;
    }

    &.align-center {
      text-align: center;
    }

    &.align-right {
      text-align: right;
    }

    &.align-justify {
      text-align: justify;
    }

    &.body-1 {
      font-size: $eden-font-size-body-1;
      line-height: $eden-line-height-body-1;
    }

    &.body-2 {
      font-size: $eden-font-size-body-2;
      line-height: $eden-line-height-body-2;
    }

    &.body-3 {
      font-size: $eden-font-size-body-3;
      line-height: $eden-line-height-body-3;
    }

    &.display-1,
    .title-1 {
      font-size: $eden-font-size-display-1;
      line-height: $eden-line-height-display-1;
    }

    &.display-2,
    .title-2 {
      font-size: $eden-font-size-display-2;
      line-height: $eden-line-height-display-2;
    }

    &.display-3,
    .title-3 {
      font-size: $eden-font-size-display-3;
      line-height: $eden-line-height-display-3;
    }

    &.disabled {
      color: var(--color-text-3) !important;
      cursor: not-allowed;
    }
  }
}
</style>
