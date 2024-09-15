<script setup lang="ts">
import EIconClose from "./icon/EIconClose.vue";
import { clickOutside as vClickOutside } from "~/packages/eden-design/_directives/clickOutside";
import { ref, onMounted } from "vue";
import type { ImagePreviewProps } from "./types/EdenImage/ImagePreviewProps";

defineProps<ImagePreviewProps>();

const emits = defineEmits<{
  (event: "close"): void;
}>();

const showPreviewLayer = ref(false);
const previewLayer = ref<HTMLDivElement | null>(null);

onMounted(() => {
  showPreviewLayer.value = true;
  document.body.style.overflow = "hidden";
});

function handleClosePreview() {
  document.body.style.overflow = "auto";
  showPreviewLayer.value = false;

  previewLayer.value?.addEventListener("transitionend", () => {
    emits("close");
  });

  setTimeout(() => {
    emits("close");
  }, 310);
}
</script>

<template>
  <Teleport to="body">
    <transition name="fade">
      <div
        class="eden-ui eden-ui__image eden-ui__image__preview-layer flex items-center justify-center fixed top-0 left-0 w-full h-full"
        ref="previewLayer"
        v-if="showPreviewLayer"
      >
        <span
          class="eden-ui eden-ui__image-preview-layer--close absolute top-2 right-2 flex items-center p-2 bg-black/50 rounded-full cursor-pointer"
          @click="handleClosePreview"
        >
          <e-icon-close size="24" color="white" />
        </span>
        <img
          class="eden-ui eden-ui__image eden-ui__image__preview-layer--img"
          :src="src"
          v-bind="$attrs"
          v-click-outside="handleClosePreview"
        />
      </div>
    </transition>
  </Teleport>
</template>

<style scoped lang="scss">
.eden-ui__image__preview-layer {
  z-index: 1000;
  background-color: #24242480;

  &--img {
    position: absolute;
    top: 50%;
    left: 50%;
    max-width: 90dvw;
    max-height: 90dvh;
    transform: translate(-50%, -50%);
    display: block;
  }
}
</style>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
