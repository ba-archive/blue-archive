<script setup land="ts">
import { ref } from "vue";
const shouldMenuExpand = ref(false);
import ClearLocalStorage from "./ClearLocalStorage.vue";

function handleClick() {
  shouldMenuExpand.value = !shouldMenuExpand.value;
}
</script>

<template>
  <div class="fixed right-5 bottom-5 flex flex-col items-end gap-4">
    <transition name="fab-menu-transition">
      <div v-if="shouldMenuExpand" class="flex flex-col gap-4">
        <clear-local-storage />
      </div>
    </transition>
    <div
      role="button"
      class="fab__button p-3 flex flex-col rounded-full bg-arona-6 shadow-std"
      :class="{
        activated: shouldMenuExpand,
      }"
      @click="handleClick"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        fill="none"
        version="1.1"
        width="24"
        height="24"
        viewBox="0 0 40 40"
      >
        <g>
          <g>
            <rect
              x="23"
              y="16"
              width="17"
              height="6"
              rx="0"
              fill="#FFFFFF"
              fill-opacity="1"
            />
          </g>
          <g>
            <rect
              x="17"
              y="0"
              width="6"
              height="16"
              rx="0"
              fill="#FFFFFF"
              fill-opacity="1"
            />
          </g>
          <g>
            <rect
              x="17"
              y="22"
              width="6"
              height="18"
              rx="0"
              fill="#FFFFFF"
              fill-opacity="1"
            />
          </g>
          <g>
            <path
              d="M0,16L0,22L12.75,22L17,16L0,16Z"
              fill="#FFFFFF"
              fill-opacity="1"
            />
          </g>
        </g>
      </svg>
    </div>
  </div>
</template>

<style scoped lang="scss">
.fab__button {
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:hover {
    animation: pre-rotate 0.5s ease-in-out;
  }

  &.activated {
    transform: rotate(315deg);
  }
}

.fab-menu-transition-enter-active,
.fab-menu-transition-leave-active {
  transition: all 0.3s ease-in-out;
}

.fab-menu-transition-enter-from,
.fab-menu-transition-leave-to {
  opacity: 0;
  transform: translateY(100%);
}

@keyframes pre-rotate {
  0% {
    transform: rotate(0deg);
  }
  15%,
  45% {
    transform: rotate(15deg);
  }
  30% {
    transform: rotate(10deg);
  }
}
</style>
