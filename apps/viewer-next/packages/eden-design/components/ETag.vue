<script setup lang="ts">
import type { TagProps } from "~/packages/eden-design/components/types/ETag/TagProps";
import {
  getGradientStyle,
  parseColor,
} from "~/packages/eden-design/helpers/colorFunctions";
import ETextCore from "~/packages/eden-design/components/reusables/EdenTextCore/ETextCore.vue";

const props = withDefaults(defineProps<TagProps>(), {
  size: "medium",
  textProps: {
    // @ts-ignore
    level: 3,
    type: "body",
  },
});

function getPresetPaletteName() {
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
  ];

  return keys.find(key => props[key as keyof TagProps]) || "default";
}

const tagClass = computed(() => [
  "eden-ui",
  "eden-ui__tag",
  `size-${props.size}`,
  `palette-${getPresetPaletteName()}`,
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
  }
);

function clickHandler() {
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
  <span role="label" :class="tagClass" :style="tagStyle" @click="clickHandler">
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
        }"
      >
        <slot></slot>
      </ETextCore>
    </span>
  </span>
</template>

<style scoped lang="scss">
@import "~/packages/eden-design/components/index.scss";

.eden-ui__tag {
  padding-left: 8px;
  padding-right: 8px;
  border-radius: 4px;
  transition: background-color 0.175s ease-in-out;

  &.palette- {
    &default {
      color: $text-5;

      &.filled {
        background: $fill-base;
      }

      &.bordered {
        border: 1px solid $border-2;
      }

      &.active {
        background: $text-5;
        color: $fill-base;
      }
    }

    &brand {
      color: $brand-6;

      &.bordered {
        border: 1px solid $brand-6;
      }

      &.filled {
        background: $brand-1;
      }

      &.active {
        background: $brand-6;
        color: $fill-base;
      }
    }

    &gray {
      color: $text-3;

      &.bordered {
        border: 1px solid $border-2;
      }

      &.filled {
        background: $fill-1;
      }

      &.active {
        background: $fill-4;
        color: $fill-base;
      }
    }

    &striker {
      color: $danger-6;
      background-color: $fill-base;
      font-weight: 700 !important;

      &.active {
        background: $danger-6;
        color: $fill-base;
      }
    }

    &special {
      color: $warning-6;
      background-color: $fill-base;
      font-weight: 700 !important;

      &.active {
        background: $warning-6;
        color: $fill-base;
      }
    }

    &explosion {
      color: $explosion-6;
      background-color: $fill-base;
      font-weight: 700 !important;

      &.active {
        background: $explosion-6;
        color: $fill-base;
      }
    }

    &pierce {
      color: $pierce-6;
      background-color: $fill-base;
      font-weight: 700 !important;

      &.active {
        background: $pierce-6;
        color: $fill-base;
      }
    }

    &unarmed {
      color: $unarmed-6;
      background-color: $fill-base;
      font-weight: 700 !important;

      &.active {
        background: $unarmed-6;
        color: $fill-base;
      }
    }

    &vibrate {
      color: $vibrate-6;
      background-color: $fill-base;
      font-weight: 700 !important;

      &.active {
        background: $vibrate-6;
        color: $fill-base;
      }
    }
  }

  &.clickable {
    cursor: pointer;
  }

  &.disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &.size- {
    &small {
      padding-top: 1px;
      padding-bottom: 1px;
    }

    &medium {
      padding-top: 2px;
      padding-bottom: 2px;
    }

    &large {
      padding-top: 3px;
      padding-bottom: 3px;
    }
  }
}
</style>
