<script lang="ts" setup>
import ETextCore from "../reusables/EdenTextCore/ETextCore.vue";
import type { TextProps } from "../types/EdenTextCore/TextProps";
import {
  getGradientStyle,
  parseColor,
} from "~/packages/eden-design/_utils/colorUtils";
import { useSlots, computed } from "vue";

const props = withDefaults(defineProps<TextProps>(), {
  align: "start",
  level: 2,
  type: "body",
});

const markerGradientStyle = computed(() => {
  const { backgroundImage, backgroundClip, WebkitBackgroundClip, color } =
    getGradientStyle(
      props.color as { from: string; to: string; deg?: number | string }
    );

  return {
    backgroundImage,
    backgroundClip,
    WebkitBackgroundClip,
    color,
  };
});

const markerColor = computed(() => {
  if (markerGradientStyle.value.color) {
    return markerGradientStyle.value.color;
  }
  return "string" === typeof props.color ? parseColor(props.color) : "inherit";
});

const liClass = computed(() => [
  "eden-ui",
  "eden-ui__li flex items-start",
  // FIXME: 从子组件暴露的 class 是 undefined，暂时没找到原因
  {
    "color-brand": props.brand,
    "color-danger": props.danger,
    "color-secondary": props.secondary,
    "color-success": props.success,
    "color-tertiary": props.tertiary,
    "color-warning": props.warning,
  },
]);
</script>

<template>
  <li :class="liClass">
    <ETextCore :props="props">
      <template #prefix v-if="!!useSlots().prefix">
        <slot name="prefix"></slot>
      </template>
      <slot></slot>
      <template #suffix v-if="!!useSlots().suffix">
        <slot name="suffix"></slot>
      </template>
    </ETextCore>
  </li>
</template>

<style lang="scss" scoped>
.eden-ui__li {
  list-style-type: none;

  &::before {
    content: "•";
    margin-right: 4px;
    color: v-bind("markerColor");
    vertical-align: text-bottom;
    background-image: v-bind("markerGradientStyle.backgroundImage");
    background-clip: v-bind("markerGradientStyle.backgroundClip");
    -webkit-background-clip: v-bind("markerGradientStyle.WebkitBackgroundClip");
  }

  &.color- {
    &brand::before {
      color: $brand-6;
    }
    &danger::before {
      color: $danger-6;
    }
    &secondary::before {
      color: $text-3;
    }
    &success::before {
      color: $success-6;
    }
    &tertiary::before {
      color: $text-2;
    }
    &warning::before {
      color: $warning-6;
    }
  }
}
</style>
