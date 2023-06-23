<template>
  <textarea
    v-model="chatText"
    placeholder="请输入内容"
    id="text-input-field"
    autocomplete="off"
    ref="textAreaElement"
    :style="{ height: `${shouldTextAreaHeightToClamped}px` }"
  />
  <div
    class="text-area-size-monitor-element"
    ref="textAreaSizeMonitorElement"
    :style="{ width: `${shouldSizeMonitorElementWidthTo}px` }"
  >
    {{ chatText }}
  </div>
</template>

<script setup lang="ts">
import { Ref, computed, ref, watch } from 'vue';
import { useAronaTalkStore } from '../../store/AronaTalkStore';
import { useElementSize } from '@vueuse/core';

const aronaTalkStore = useAronaTalkStore();

const chatText: Ref<string> = ref(aronaTalkStore.getCurrentInputText);

const textAreaElement = ref(null);
const textAreaSizeMonitorElement = ref(null);

const { width: shouldSizeMonitorElementWidthTo } =
  useElementSize(textAreaElement);
const { height: shouldTextAreaHeightTo } = useElementSize(
  textAreaSizeMonitorElement
);

// 16px * 1.5 line-height + 4px padding top + 4px padding bottom
const minTextAreaHeight = 32;
// 16px * 1.5 line-height * 4 lines + 4px padding top + 4px padding bottom
const maxTextAreaHeight = 104;

const shouldTextAreaHeightToClamped = computed(
  () =>
    [
      shouldTextAreaHeightTo.value + 8,
      minTextAreaHeight,
      maxTextAreaHeight,
    ].sort((a, b) => a - b)[1]
);

watch(chatText, newChatText => {
  aronaTalkStore.setCurrentInputText(newChatText);
});

watch(
  () => aronaTalkStore.getCurrentInputText,
  newInput => {
    if (0 === newInput.length) {
      chatText.value = '';
    }
  }
);
</script>

<style scoped lang="scss">
#text-input-field {
  appearance: none;
  transition: all 0.175s ease-in-out;
  margin-right: 0.5rem;
  border: none;
  border-radius: 4px;
  background-color: var(--color-text-input-field);
  resize: none;
  font-family: var(--default-font-set);

  &:focus {
    outline: none;
  }
}

.text-area-size-monitor-element {
  position: absolute;
  top: -100px;
  visibility: hidden;
  white-space: pre-wrap;
}

#text-input-field,
.text-area-size-monitor-element {
  padding: 4px;
  font-size: 1rem;
  line-height: 1.5rem;
  font-family: var(--default-font-set);
}
</style>
