<script setup lang="ts">
import type { TagProps } from "~/packages/eden-design/components/types/EdenTag/TagProps";
import {
  getGradientStyle,
  parseColor,
} from "~/packages/eden-design/_utils/colorUtils";
import ETextCore from "~/packages/eden-design/components/reusables/EdenTextCore/ETextCore.vue";
import { useSlots, computed, ref } from "vue";

const props = withDefaults(defineProps<TagProps>(), {
  size: "medium",
  textProps: {
    // @ts-ignore
    level: 3,
    type: "body",
  },
});

function getPresetPaletteName() {
  if (props.type) {
    return props.type;
  }

  const keys = [
    "default",
    "brand",
    "gray",
    "striker",
    "special",
    "explosion",
    "pierce",
    "unarmed",
    "vibrate",
    "selector",
  ];

  return keys.find(key => props[key as keyof TagProps]) || "default";
}

const tagClass = computed(() => [
  "eden-ui",
  "eden-ui__tag",
  `size-${props.size}`,
  `palette-${getPresetPaletteName()}`,
  "flex items-center",
  {
    active: isActive.value && !props.disabled,
    "cursor-pointer": props.clickable,
    filled: props.fill,
    bordered: props.bordered,
    disabled: props.disabled,
  },
]);

const gradientStyle = computed(() => {
  if ("[object Object]" === Object.prototype.toString.call(props.background)) {
    const { backgroundImage } = getGradientStyle(
      props.background as {
        from: string;
        to: string;
        deg?: number | string;
      }
    );
    return { backgroundImage };
  }
});

const tagStyle = computed(() => [
  gradientStyle.value,
  props.background &&
    "string" === typeof props.background && {
      backgroundColor: parseColor(props.background),
    },
]);

const emit = defineEmits(["update:active"]);

const isActive = ref(props.active ?? false);

watch(
  () => props.active,
  value => {
    isActive.value = value;
  },
  { immediate: true }
);

function clickHandler() {
  if (props.disabled || !props.clickable) return;
  isActive.value = !isActive.value;
  if (props.clickable && !props.disabled) {
    emit(
      "update:active",
      !!props.id ? { id: props.id, active: isActive.value } : isActive.value
    );
  }
}
</script>

<template>
  <span is="label" :class="tagClass" :style="tagStyle" @click="clickHandler">
    <span class="eden-ui__tag--icon mr-1" v-if="useSlots().icon">
      <slot name="icon"></slot>
    </span>
    <span class="eden-ui__tag--content">
      <ETextCore
        :props="{
          ...textProps,
          level: textProps.level ?? 3,
          type: textProps.type ?? 'body',
          noSelect: true,
          inheritTextColor: !textProps.color,
          noWrap: true,
        }"
      >
        <slot></slot>
      </ETextCore>
    </span>
  </span>
</template>

<style scoped lang="scss">
@use "sass:map";
@import "../_mixins/tag.scss";

.eden-ui__tag {
  @include tag-base-styles;

  &.palette- {
    // Handle complex palettes (default, brand, gray)
    @each $name, $values in $tag-complex-palettes {
      &#{$name} {
        @include tag-palette-variant(
          map.get($values, "color"),
          map.get($values, "bg"),
          map.get($values, "border")
        );
      }
    }

    // Handle simple palettes
    @each $name, $color in $tag-simple-palettes {
      &#{$name} {
        @include tag-simple-palette-variant($color);
      }
    }
  }

  &.clickable {
    cursor: pointer;
  }

  &.disabled {
    @include disabled-state;
  }

  &.size- {
    @each $size, $padding in $tag-sizes {
      &#{$size} {
        @include tag-size-variant($padding);
      }
    }
  }
}
</style>
