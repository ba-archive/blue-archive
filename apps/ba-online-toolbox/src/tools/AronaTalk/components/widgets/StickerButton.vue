<template>
  <div
    class="sticker-container"
    v-show="showStickerPicker"
    :style="{
      left: `${stickerButtonLeft}px`,
      transform: `translateY(calc(-50% - ${stickerContainerOffset}px))`,
    }"
  >
    <div class="sticker-scroll">
      <img
        class="sticker"
        v-for="sticker in stickerList"
        :src="getStickerUrl(sticker.filename)"
        :key="sticker.filename"
        :alt="sticker.filename"
        @click="handleStickerSelect(sticker.filename)"
      />
    </div>
  </div>

  <div
    class="button-container"
    ref="stickerButtonPositionElement"
    :style="{
      paddingLeft: props.paddingLeft,
      paddingRight: props.paddingRight,
    }"
    @click="handleStickerButtonClick"
  >
    <svg
      class="sticker-button"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 512 512"
    >
      <!-- eslint-disable max-len -->
      <path
        d="m437,75C388.7,26.6,324.4,0,256,0S123.3,26.6,75,75C26.6,123.3,0,187.6,0,256s26.6,132.7,75,181c48.4,48.4,112.6,75,181,75s132.7-26.6,181-75c48.4-48.4,75-112.6,75-181s-26.6-132.7-75-181Zm-181,397c-119.1,0-216-96.9-216-216S136.9,40,256,40s216,96.9,216,216-96.9,216-216,216Z"
      />
      <path
        d="m386.05,291.32c-9.26-3-19.36,1.1-23.86,9.73-4.03,7.73-9.98,17.5-18.19,27.15-22.6,26.4-51.3,39.8-85.6,39.8s-64.2-13.6-88.3-40.3c-8.87-9.85-15.42-19.82-19.89-27.64-4.84-8.49-15.16-12.17-24.31-8.75h-.03c-11.56,4.33-16.46,17.97-10.35,28.69,5.48,9.61,13.3,21.47,23.78,33.3,31.7,35.8,72.9,54.7,119.1,54.7s86.9-19.1,117.1-55.2c9.83-11.77,17.06-23.56,22.09-33.17,5.75-10.98.25-24.5-11.54-28.32h0Z"
      />
      <!-- eslint-disable max-len -->
      <circle cx="168" cy="180.1" r="32" />
      <circle cx="344" cy="180.1" r="32" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { computed, ref } from 'vue';
import { Sticker } from '../../types/Sticker';
import { useElementBounding } from '@vueuse/core';

const props = withDefaults(
  defineProps<{
    paddingLeft?: string;
    paddingRight?: string;
  }>(),
  {
    paddingLeft: '0.5rem',
    paddingRight: '0.5rem',
  }
);

const stickerButtonPositionElement = ref<HTMLElement>();

const { left: stickerButtonLeft, height: stickerButtonHeight } =
  useElementBounding(stickerButtonPositionElement);

const stickerContainerOffset = computed(() => stickerButtonHeight.value + 8);

const showStickerPicker = ref(false);
function handleStickerButtonClick() {
  showStickerPicker.value = !showStickerPicker.value;
}

const stickerList = ref<Sticker[]>([]);

axios
  .get('/config/json/sticker_list.json')
  .then(response => {
    stickerList.value = response.data;
  })
  .catch(error => {
    console.error(error);
  });

function getStickerUrl(stickerName: string) {
  return `https://yuuka.cdn.diyigemt.com/image/ba-all-data/UIs/01_Common/31_ClanEmoji/${stickerName}.png`;
}

function handleStickerSelect(stickerName: string) {
  console.log(stickerName);
}
</script>

<style scoped lang="scss">
.button-container {
  display: flex;
  flex: 0;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.sticker-button {
  fill: var(--color-text-main);
  width: 1.5rem;
  height: 1.5rem;
}

//noinspection CssOverwrittenProperties
.sticker-container {
  position: fixed;
  filter: drop-shadow(0 0 0.25rem rgba(0, 0, 0, 0.12));
  border-radius: 4px;
  background-color: var(--color-sticker-panel);
  padding: 0.5rem 0;

  .sticker-scroll {
    content-visibility: auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(4rem, 1fr));
    gap: 0.25rem;
    padding: 0 0.5rem;
    max-width: 80vw;
    max-width: 80dvw;
    max-height: 50vh;
    max-height: 50dvh;
    overflow-y: auto;

    .sticker {
      width: 4rem;
      height: 4rem;
    }
  }

  &::after {
    position: absolute;
    bottom: 0;
    left: 0.5rem;
    transform: translateY(100%);
    border-width: 8px 8px 0 8px;
    border-style: solid;
    border-color: var(--color-sticker-panel) transparent transparent transparent;
    width: 0;
    height: 0;
    content: '';
  }
}
</style>
