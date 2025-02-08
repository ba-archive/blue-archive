<script setup lang="ts">
import { ref } from "vue";
const props = withDefaults(
  defineProps<{
    icon: "flag" | "flag-filled" | "translate";
    size?: "mini" | "default";
    disabled?: boolean;
    tabSelectable?: boolean;
  }>(),
  {
    size: "default",
    disabled: false,
    tabSelectable: true,
  }
);

const isPressed = ref(false);

const emit = defineEmits<{
  (e: "click"): void;
}>();

function handleClick() {
  if (props.disabled) return;
  emit("click");
}

function handleMouseDown() {
  if (props.disabled) return;
  isPressed.value = true;
}

function handleMouseUp() {
  if (props.disabled) return;
  isPressed.value = false;
}

function handleMouseLeave() {
  if (props.disabled) return;
  isPressed.value = false;
}
</script>

<template>
  <button
    p-1
    pb-0.5
    border-none
    bg-transparent
    rounded-sm
    transition-colors
    duration-300
    cursor-pointer
    :tabindex="tabSelectable ? 0 : -1"
    class="@hover:bg-gray-200 @dark:@hover:bg-gray-800"
    :class="{
      'opacity-50 cursor-not-allowed': disabled,
      '!bg-gray-300 @dark:!bg-gray-700': isPressed,
    }"
    @click="handleClick"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
    @mouseleave="handleMouseLeave"
  >
    <transition name="flip">
      <i-icon-park-outline-flag
        v-if="icon === 'flag'"
        h-4
        w-4
        color-gray-400
        class="@dark:color-gray-600"
      />
    </transition>
    <transition name="flip">
      <svg
        v-if="icon === 'flag-filled'"
        w-4
        h-4
        color-gray-400
        class="@dark:color-gray-600"
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 48 48"
      >
        <g
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="4"
        >
          <path d="M8 44H12H16" />
          <path d="M12 44V4" />
          <path fill="currentColor" d="M40 6H12V22H40L36 14L40 6Z" />
        </g>
      </svg>
    </transition>
    <svg
      w-4
      h-4
      color-gray-400
      class="@dark:color-gray-600"
      v-if="icon === 'translate'"
      viewBox="0 0 48 48"
      fill="none"
      stroke-width="4"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
    >
      <path
        d="M42 25c0 9.941-8.059 18-18 18-6.867 0-12.836-3.845-15.87-9.5M28.374 27 25 18h-2l-3.375 9m8.75 0L31 34m-2.625-7h-8.75m0 0L17 34M6 25c0-9.941 8.059-18 18-18 6.867 0 12.836 3.845 15.87 9.5M43 25h-2l1-1 1 1ZM5 25h2l-1 1-1-1Z"
      ></path>
    </svg>
  </button>
</template>

<style lang="scss" scoped>
.flip-enter-active {
  transition: transform 0.125s ease-in-out;
}
.flip-leave-active {
  transition: transform 0.125s ease-in-out;
}

.flip-enter-from,
.flip-leave-to {
  position: absolute;
  transform: scaleX(0);
  transform-origin: bottom;
}
</style>
