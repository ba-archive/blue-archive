<script lang="ts" setup>
import { watch, computed, useSlots, useTemplateRef } from "vue";
import { useElementSize } from "@vueuse/core";
import { toInt, clamp } from "radashi";

export type InputProps = {
  align?: "left" | "center" | "right";
  value?: string | number;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  disabled?: boolean;
  size?: "mini" | "small" | "medium" | "large";
  width?: string | number | "auto";
  minWidth?: string | number;
  maxWidth?: string | number;
  type?: "text" | "textarea" | "number" | "password" | "email" | "tel" | "url";
  textWhite?: boolean;

  /* methods */
  focus?: () => void;
  blur?: () => void;
};

const props = withDefaults(defineProps<InputProps>(), {
  type: "text",
  width: 200,
  size: "medium",
  value: "",
  placeholder: "Please Input...",
  align: "left",
});

function parseSize(size: string | number | undefined) {
  if (!size) return null;

  if (typeof size === "number") {
    return size + "px";
  }

  return /^(\d+\.?\d*)$/.test(size + "") ? size + "px" : size;
}

const model = defineModel<string | number>();

watch(
  () => [props.value, model.value],
  newVal => {
    model.value = newVal[0] || newVal[1] || "";
  }
);

const emits = defineEmits<{
  (e: "update:value", value: string | number): void;
  (e: "input", value: string | number): void;
}>();

const handleValueUpdate = (value: string | number | undefined) => {
  if (value === undefined) return;
  emits("update:value", value);
};

const handleInput = (e: Event) => {
  const input = e.target as HTMLInputElement;
  emits("input", input.value);
};

watch(
  () => model.value,
  newVal => {
    handleValueUpdate(newVal);
  }
);

const inputClass = computed(() => {
  return [
    "eden-ui eden-ui__input flex items-center",
    `size-${props.size}`,
    "transition-all duration-300 ease-in-out",
    {
      disabled: props.disabled,
      "!cursor-not-allowed": props.disabled,
    },
  ];
});

const slots = useSlots();

// exposed methods
const inputRef = useTemplateRef("inputRef");
const prefixRef = useTemplateRef("prefixRef");
const suffixRef = useTemplateRef("suffixRef");

const { width: inputWidth } = useElementSize(inputRef);
const { width: prefixWidth } = useElementSize(prefixRef);
const { width: suffixWidth } = useElementSize(suffixRef);

const widthIfAuto = computed(
  () => inputWidth.value + prefixWidth.value + suffixWidth.value
);

const inputStyle = computed(() => {
  return {
    width:
      props.width === "auto"
        // ? `${clamp(toInt(props.minWidth ?? 0), widthIfAuto.value, toInt(props.maxWidth ?? 9999))}px`
        ? "auto"
        : parseSize(props.width),
    minWidth: props.minWidth ? parseSize(props.minWidth) : null,
    maxWidth: props.maxWidth ? parseSize(props.maxWidth) : null,
  };
});

const focus = () => {
  inputRef.value?.focus();
};

const blur = () => {
  inputRef.value?.blur();
};

defineExpose({
  focus,
  blur,
});
</script>

<template>
  <!-- @vue-ignore -->
  <span
    rounded
    flex
    gap-1
    overflow-clip
    class="eden-ui eden-ui__input eden-ui__input--wrapper"
    :class="inputClass"
    :style="inputStyle"
    z-0
  >
    <span
      flex
      class="eden-ui eden-ui__input--prefix"
      ref="prefixRef"
      v-if="slots.prefix || prefix"
    >
      <slot name="prefix" v-if="slots.prefix" />
      <span v-else-if="prefix">
        {{ prefix }}
      </span>
    </span>
    <input
      :type="type"
      flex
      flex-1
      items-end
      class="eden-ui eden-ui__input--input @dark:color-[#e0e0e0]"
      :class="{
        'text-white': textWhite,
      }"
      :style="{
        textAlign: align,
      }"
      v-model="model"
      @input="handleInput"
      :placeholder="placeholder"
      :disabled="disabled"
      ref="inputRef"
    />
    <span
      class="eden-ui eden-ui__input--suffix flex"
      v-if="slots.suffix || suffix"
      ref="suffixRef"
    >
      <slot name="suffix" v-if="slots.suffix" />
      <span v-else-if="suffix">
        {{ suffix }}
      </span>
    </span>
  </span>
</template>

<style scoped lang="scss">
.eden-ui__input {
  $border-width: 1px;
  // position: relative;

  &--wrapper {
    will-change: background-color, box-shadow;
    border-bottom: none;
    font-size: 14px;
    line-height: 22px;
    position: relative; // stacking context

    &::before,
    &::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0px;
      width: 100%;
      height: $border-width;
      transition: all 0.3s ease-in-out;

      @apply bg-[#e0e0e0] @dark:bg-[#37373a];
    }

    &::after {
      will-change: transform;
      height: 2 * $border-width;
      transform: rotate3d(0, 1, 0, 90deg);

      @apply bg-[#2773e1]! @dark:bg-[#4b91e7]!;
    }

    &:focus,
    &:focus-within {
      &::after {
        transform: rotate3d(0, 1, 0, 0deg);
      }
    }
  }

  &.size- {
    &mini {
      height: 20px;
    }
    &small {
      height: 24px;
    }
    &medium {
      height: 32px;
    }
    &large {
      height: 40px;
    }
  }

  &--prefix,
  &--suffix {
    @apply text-gray-300 @dark:text-gray-500
    font-size: inherit;
    white-space: nowrap;
    line-height: 22px;
  }

  &--input {
    border: none;
    outline: none;
    background: transparent;
    width: 100%;
    font-size: inherit;
    padding: 0 2px;
    line-height: 22px;
    @apply color-[#2E2E2E] @dark:color-[#E0E0E0]


    &[type="number"] {
      appearance: textfield;

      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        appearance: none;
        margin: 0;
      }
    }

    &::placeholder {
      @apply text-gray-300 @dark:text-gray-500;
    }

    &:disabled {
      cursor: not-allowed;
      user-select: none;

      @apply text-gray-300 @dark:text-gray-500

      &::placeholder {
        @apply text-gray-300 @dark:text-gray-500;
      }
    }
  }

  &.disabled {
    @apply bg-[#f2f2f2] @dark:bg-[#37373a]
    opacity: 0.7;
  }
}
</style>
