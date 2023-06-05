<template>
  <div
    class="neu-switch"
    role="switch"
    tabindex="0"
    :aria-checked="checked"
    @click="toggleSwitch"
    @keydown.space="toggleSwitch"
    @keydown.enter="toggleSwitch"
    v-calculate-width="'track'"
    :aria-label="accessibilityLabel"
  >
    <div class="neu-switch__paddle">
      <div
        class="neu-switch__thumb"
        v-calculate-width="'thumb'"
        :style="thumbPositionStyle"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Directive, DirectiveBinding, computed, ref, watch } from 'vue';

const switchWidth = ref({
  track: 0,
  thumb: 0,
});

// 计算拨片和轨道宽度，以便计算拨片位置
const vCalculateWidth: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    if ('thumb' === binding.value) {
      switchWidth.value.thumb = el.offsetWidth;
    } else {
      switchWidth.value.track = el.offsetWidth;
    }
  },
};
const props = withDefaults(
  defineProps<{
    checked?: boolean;
    checkedValue?: boolean | string | number;
    uncheckedValue?: boolean | string | number;
    accessibilityLabel?: string;
  }>(),
  {
    checked: false,
    checkedValue: true,
    uncheckedValue: false,
    accessibilityLabel: 'Switch',
  }
);

const shouldSwitchOn = ref(props.checked || false);

// 如果 props.checked 发生变化，更新 shouldSwitchOn
watch(
  () => props.checked,
  newValue => {
    shouldSwitchOn.value = newValue || false;
  }
);

const thumbPositionStyle = computed(() => {
  const trackWidth = switchWidth.value.track;
  const thumbWidth = switchWidth.value.thumb;
  const thumbPosition = shouldSwitchOn.value ? trackWidth - thumbWidth : 0;
  return {
    transform: `translate3D(${thumbPosition}px, 0, 0)`,
  };
});

const emit = defineEmits(['update:value']);

function toggleSwitch() {
  shouldSwitchOn.value = !shouldSwitchOn.value;
  const availableEmitValues = {
    emitValueTrue: props.checkedValue ?? true,
    emitValueFalse: props.uncheckedValue ?? false,
  };
  emit(
    'update:value',
    shouldSwitchOn.value
      ? availableEmitValues.emitValueTrue
      : availableEmitValues.emitValueFalse
  );
}
</script>

<style scoped lang="scss">
.neu-switch {
  display: inline-flex;
  position: relative;
  transition: all 0.375s ease-in-out;
  cursor: pointer;
  box-shadow: var(--style-switch-track-shadow);
  border-radius: 1rem;
  background-color: var(--color-switch-track);
  min-width: 3rem;
  max-height: 1rem;

  .neu-switch__paddle {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;

    .neu-switch__thumb {
      flex: none;
      transition: all 0.375s cubic-bezier(0.85, -0.06, 0.22, 1.26);
      box-shadow: var(--style-switch-shadow);
      border-radius: 50%;
      background: var(--style-switch-texture);
      width: 1.25rem;
      height: 1.25rem;
    }
  }
}
</style>
