<script lang="ts" setup>
import type { InputProps } from "../types/EdenInput/InputProps";
import { parseSize } from "../../_utils/styleFunctions";
const props = withDefaults(defineProps<InputProps>(), {
  type: "text",
  width: 200,
  size: "medium",
  value: "",
  placeholder: "Please Input...",
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
    class="eden-ui eden-ui__input rounded eden-ui__input--wrapper"
    :class="inputClass"
    :style="inputStyle"
  >
    <span class="eden-ui eden-ui__input--prefix flex items-center">
      <slot name="prefix" />
    </span>
    <input
      :type="type"
      class="eden-ui eden-ui__input--input flex flex-1 items-center"
      v-model="model"
      @input="handleInput"
      :placeholder="placeholder"
      :disabled="disabled"
    />
    <span class="eden-ui eden-ui__input--suffix flex items-center">
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
  }

  &--prefix {
    margin-right: 8px;
  }
  &--suffix {
    margin-left: 8px;
  }

  &:focus-within {
    border-left: 1px solid $border-3;
    border-top: 1px solid $border-3;
    border-right: 1px solid $border-3;
    border-bottom: 1px solid $arona-blue-6;

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
