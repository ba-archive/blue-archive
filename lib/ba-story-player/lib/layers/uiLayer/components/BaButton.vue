<script setup lang="ts">
import eventBus from "@/eventBus";
import { PropType, Ref, onMounted, ref } from "vue";
import { buttonAnimation } from "../utils";

const props = defineProps({
  bgcolor: String,
  size: {
    type: String as PropType<"large" | "middle" | "small">,
    default: "small",
  },
  disabled: Boolean,
});

const emit = defineEmits<{
  (ev: "click", event: Event): void;
}>();

const button = ref(null) as unknown as Ref<Element>;

function handleClick(ev: Event) {
  emit("click", ev);
  eventBus.emit("playOtherSounds", "select");
}

onMounted(() => {
  buttonAnimation({ elem: button.value });
});
</script>

<template>
  <button
    :class="['ba-button', size]"
    ref="button"
    @click="handleClick"
    tabindex="-1"
    :disabled="disabled"
  >
    <slot></slot>
  </button>
</template>

<style lang="scss" scoped>
.ba-button {
  position: relative;
  transform: skew(-10deg);
  transition: background-color 0.3s;
  margin: 0 0.4em 0 0.4em;
  box-shadow: #2c3f4a 0 1px 2px;
  border: none;
  border-radius: 0.3125em;
  background-color: #f3f5f6;
  padding: 0.375em 1em;
  color: #2d4665;
  font-weight: bold;
  font-size: 1.2em;

  &.large {
    border-radius: 0.625em;
    padding: 0.5em 4.25em;
    font-size: 1.5625em;
  }

  &.middle {
    border-radius: 0.3em;
    padding: 0.32em 4em;
    font-size: 1.3em;
  }

  &.polylight {
    background: no-repeat center/contain
        linear-gradient(
          145deg,
          rgba(255, 255, 255, 0) 0%,
          rgba(227, 247, 255, 0.9) 20%,
          rgba(227, 247, 255, 0.9) 60%,
          rgba(255, 255, 255, 0) 100%
        ),
      url(../assets/UITex_BGPoliLight_1.svg) rgb(128, 208, 255);
  }

  &.polydark {
    background: no-repeat center/contain
        linear-gradient(
          145deg,
          rgba(255, 255, 255, 0) 0%,
          rgb(117, 218, 248, 0.9) 20%,
          rgba(117, 218, 248, 0.9) 60%,
          rgba(255, 255, 255, 0) 100%
        ),
      url(../assets/UITex_BGPoliLight_1.svg) rgb(106, 224, 251);
  }

  &[class*="poly"] {
    box-shadow: #98c0d7 0 1px 2px;
    background-position: -15px 72%;
    background-size: 140%;
  }
}
</style>
