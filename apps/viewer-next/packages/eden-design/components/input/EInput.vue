<script lang="ts" setup>
import type { InputProps } from "../types/EdenInput/InputProps";
import { parseSize } from "../../_utils/styleFunctions";
const props = withDefaults(defineProps<InputProps>(), {
  type: "text",
  width: 200,
  size: "medium",
  value: "",
  placeholder: "Please Input...",
  min: undefined,
  max: undefined,
  step: undefined,
});

const model = defineModel<string | number>();

watch(
  () => [props.value, model.value],
  newVal => {
    model.value = newVal[0] || newVal[1] || "";
  }
);

const emits = defineEmits<{
  (e: "update:value", value: string | number): void;
}>();

const handleInput = (e: Event) => {
  const input = e.target as HTMLInputElement;
  emits("update:value", input.value);
};

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

const inputStyle = computed(() => {
  return {
    width: props.width === "auto" ? "auto" : parseSize(props.width),
  };
});
</script>

<template>
  <span
    class="eden-ui eden-ui__input rounded eden-ui__input--wrapper flex gap-2"
    :class="inputClass"
    :style="inputStyle"
  >
    <span class="eden-ui eden-ui__input--prefix flex">
      <slot name="prefix" />
    </span>
    <input
      :type="type"
      class="eden-ui eden-ui__input--input flex flex-1 items-end"
      v-model="model"
      @input="handleInput"
      :placeholder="placeholder"
      :disabled="disabled"
      :min="type === 'number' ? min : undefined"
      :max="type === 'number' ? max : undefined"
      :step="type === 'number' ? step : undefined"
    />
    <span class="eden-ui eden-ui__input--suffix flex">
      <slot name="suffix" />
    </span>
  </span>
</template>

<style scoped lang="scss">
@import "~/packages/eden-design/components/index.scss";

.eden-ui__input {
  &--wrapper {
    padding-left: 10px;
    padding-right: 10px;
    border-left: 1px solid transparent;
    border-top: 1px solid transparent;
    border-right: 1px solid transparent;
    border-bottom: 1px solid $border-3;
    font-size: 14px;
    line-height: 22px;
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
    color: $text-2;
    font-size: inherit;
    white-space: nowrap;
    line-height: 22px;
  }

  &:hover,
  &:focus,
  &:focus-within {
    border-left-color: $border-3;
    border-top-color: $border-3;
    border-right-color: $border-3;
    border-bottom-color: $arona-blue-6;
  }

  &:focus,
  &:focus-within {
    background: $fill-base;
  }

  &--input {
    border: none;
    outline: none;
    background: transparent;
    width: 100%;
    caret-color: $arona-blue-6;
    font-size: inherit;
    padding: 0 2px;
    line-height: 22px;

    &[type="number"] {
      appearance: textfield;

      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        appearance: none;
        margin: 0;
      }
    }

    &::placeholder {
      color: $text-3;
    }

    &:disabled {
      cursor: not-allowed;
      color: $text-3;

      &::placeholder {
        color: $text-3;
      }
    }
  }

  &.disabled {
    background: $fill-1;
    opacity: 0.7;
  }
}
</style>
