<template>
  <div class="action-bar">
    <image-button padding-left="0.5rem" padding-right="0.25rem" />
    <sticker-button padding-left="0.25rem" padding-right="0.5rem" />
    <text-input-field />
    <div class="button rounded-small" @click="handleSendButtonClick">
      <svg
        class="send-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 261.52 261.52"
      >
        <!-- eslint-disable max-len -->
        <path
          d="m133.26,159.29l22.18,55.81L226.78,34.74,46.42,106.07l55.81,22.17,48.89-35.31c4.98-3.59,11.82-3.04,16.16,1.3,4.34,4.34,4.89,11.18,1.3,16.16l-35.32,48.89h0Zm22.2,102.23c-5.12,0-9.72-3.13-11.62-7.89l-36.34-91.49c-.98-2.45-1.14-5.11-.52-7.6-2.49.62-5.15.46-7.6-.52L7.89,117.68c-4.77-1.9-7.89-6.51-7.89-11.63,0-5.13,3.14-9.73,7.9-11.62L244.42.88c4.63-1.83,9.91-.74,13.44,2.78,3.52,3.53,4.61,8.81,2.78,13.44l-93.57,236.51c-1.88,4.77-6.48,7.9-11.61,7.91h-.01,0Z"
        />
        <!-- eslint-enable max-len -->
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAronaTalkStore } from '../store/AronaTalkStore';
import ImageButton from './widgets/ImageButton.vue';
import StickerButton from './widgets/StickerButton.vue';
import TextInputField from './widgets/TextInputField.vue';

const aronaTalkStore = useAronaTalkStore();

function handleSendButtonClick() {
  aronaTalkStore.sendCurrentInputAstToStore();
}
</script>

<style scoped lang="scss">
.action-bar {
  display: grid;
  position: fixed;
  bottom: 0;
  left: 0;
  grid-template-columns: max-content max-content auto max-content;
  align-items: center;
  background-color: var(--color-bottom-action-bar);
  padding: 0.5rem 0.5rem 0.5rem 0;
  width: 100vw;
}

.button {
  padding: 0 1rem;
  height: 100%;
}

.send-icon {
  fill: #fff;
  filter: drop-shadow(-1px 3px 0 #006fed);
  width: 1.25rem;
  height: 1.25rem;
}
</style>
