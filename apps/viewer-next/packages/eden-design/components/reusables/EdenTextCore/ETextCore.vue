<script lang="ts" setup>
import type { TextProps } from "../../types/EdenTextCore/TextProps";
import {
  getGradientStyle,
  parseColor,
} from "~/packages/eden-design/_utils/colorUtils";
import { parseSize } from "~/packages/eden-design/_utils/styleUtils";

const textCoreProps = defineProps<{ props: TextProps }>();

const slots = useSlots();

const gradientStyle = computed(() => {
  if (
    "[object Object]" ===
    Object.prototype.toString.call(textCoreProps.props.color)
  ) {
    return getGradientStyle(
      textCoreProps.props.color as {
        from: string;
        to: string;
        deg?: number | string;
      }
    );
  }
});

const textClass = computed(() => [
  "eden-ui eden-ui__text",
  `${textCoreProps.props.type || "body"}-${textCoreProps.props.level || 2}`,
  `align-${textCoreProps.props.align || "left"}`,
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
    "whitespace-nowrap": textCoreProps.props.noWrap,
    /* 颜色预设 */
    "color-brand": textCoreProps.props.brand,
    "color-danger": textCoreProps.props.error || textCoreProps.props.danger,
    "color-secondary": textCoreProps.props.secondary,
    "color-success": textCoreProps.props.success,
    "color-tertiary": textCoreProps.props.tertiary,
    "color-warning": textCoreProps.props.warning,
  },
]);

const textStyle = computed(() => [
  gradientStyle.value,
  textCoreProps.props.color &&
    !textCoreProps.props.inheritTextColor &&
    "string" === typeof textCoreProps.props.color && {
      color: parseColor(textCoreProps.props.color),
    },
  textCoreProps.props.inheritTextColor && {
    color: "inherit !important",
  },
  textCoreProps.props.size && {
    fontSize: parseSize(textCoreProps.props.size),
  },
]);
</script>

<template>
  <!-- @vue-ignore -->
  <span :class="textClass" :style="textStyle" v-if="!!slots.prefix">
    <slot name="prefix"></slot>
  </span>
  <!-- @vue-ignore -->
  <span :class="textClass" :style="textStyle">
    <slot></slot>
  </span>
  <!-- @vue-ignore -->
  <span :class="textClass" :style="textStyle" v-if="!!slots.suffix">
    <slot name="suffix"></slot>
  </span>
</template>

<style lang="scss" scoped>
.eden-ui {
  &__text {
    font-family: $eden-font-family;
    color: $text-5;
    transition: color 0.3s ease-in-out;

    &.font-bold {
      font-family: "Wix Madefor", "HarmonyOS Sans SC Bold", $eden-font-family;
    }

    &.color- {
      &brand {
        color: $brand-6;
      }

      &danger {
        color: $danger-6;
      }

      &secondary {
        color: $text-3;
      }

      &success {
        color: $success-6;
      }

      &tertiary {
        color: $text-2;
      }

      &warning {
        color: $warning-6;
      }
    }

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
