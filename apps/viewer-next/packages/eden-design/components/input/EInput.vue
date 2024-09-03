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
  align: "left",
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

const slots = useSlots();
</script>

<template>
  <span
    class="eden-ui eden-ui__input--outline rounded overflow-clip border-1 border-solid border-transparent"
  >
    <span
      class="eden-ui eden-ui__input eden-ui__input--wrapper rounded flex gap-1"
      :class="inputClass"
      :style="inputStyle"
    >
      <span class="eden-ui eden-ui__input--prefix flex" v-if="slots.prefix">
        <slot name="prefix" />
      </span>
      <input
        :type="type"
        class="eden-ui eden-ui__input--input flex flex-1 items-end"
        :style="{
          textAlign: align,
        }"
        v-model="model"
        @input="handleInput"
        :placeholder="placeholder"
        :disabled="disabled"
        :min="type === 'number' ? min : undefined"
        :max="type === 'number' ? max : undefined"
        :step="type === 'number' ? step : undefined"
      />
      <span class="eden-ui eden-ui__input--suffix flex" v-if="slots.suffix">
        <slot name="suffix" />
      </span>
    </span>
  </span>
</template>

<style scoped lang="scss">
@import "~/packages/eden-design/components/index.scss";

.eden-ui__input {
  &--wrapper {
    border-left: 1px solid transparent;
    border-top: 1px solid transparent;
    border-right: 1px solid transparent;
    border-bottom: none;
    padding-left: 10px;
    padding-right: 10px;
    font-size: 14px;
    line-height: 22px;
    filter: blur(0); // stacking context

    &::after {
      content: "";
      position: absolute;
      left: -1px;
      bottom: 0;
      width: calc(100% + 2px);
      height: 1px;
      background: $border-3;
      transition: all 0.3s ease-in-out;
    }

    &:hover,
    &:focus,
    &:focus-within {
      border-left-color: $border-3;
      border-top-color: $border-3;
      border-right-color: $border-3;

      &::after {
        background: $arona-blue-6;
      }
    }

    &:focus,
    &:focus-within {
      background: $fill-base;
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
    color: $text-2;
    font-size: inherit;
    white-space: nowrap;
    line-height: 22px;
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
