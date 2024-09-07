<script setup lang="ts">
import type { ImageProps } from "./types/EdenImage/ImageProps";
import { parseSize } from "~/packages/eden-design/_utils/styleUtils";
import type { Directive } from "vue";
import { clickOutside as vClickOutside } from "~/packages/eden-design/_directives/clickOutside";

const props = withDefaults(defineProps<ImageProps>(), {
  width: "200px",
  height: "200px",
  fit: "contain",
  borderRadius: 2,
  enablePreview: false,
  circle: false,
  lazy: true,
});

const isLazy = computed(() => props.lazy);

const imageLoadFailed = ref(false);

const vDetectFailure: Directive = {
  beforeMount(el) {
    const img = new Image();
    img.src = el.getAttribute("src") || "";
    img.onerror = () => {
      imageLoadFailed.value = true;
    };
  },
};

const imageClass = computed(() => [
  "eden-ui",
  "eden-ui__image",
  {
    circle: props.circle,
    "cursor-pointer": !imageLoadFailed.value && props.enablePreview,
  },
]);

const imageStyle = computed(() => {
  return {
    width: parseSize(props.width),
    height: parseSize(props.height),
    borderRadius: parseSize(props.borderRadius),
    objectFit: props.fit,
  };
});

const slots = useSlots();

const showPreviewLayer = ref(false);

function handlePreview() {
  if (!props.enablePreview || imageLoadFailed.value) return;
  showPreviewLayer.value = true;
}

function handleClosePreview() {
  showPreviewLayer.value = false;
}
</script>

<template>
  <span class="eden-ui eden-ui__image flex flex-col gap-1 items-center">
    <!-- @vue-ignore -->
    <img
      v-detect-failure
      v-if="!imageLoadFailed"
      v-bind="$attrs"
      :src="src"
      class="eden-ui__image--img"
      :class="imageClass"
      :style="imageStyle"
      :lazy="isLazy"
      @click="handlePreview"
    />
    <!-- @vue-ignore -->
    <span
      class="eden-ui eden-ui__image__fallback grid place-items-center pointer-events-none"
      v-else
      :style="imageStyle"
    >
      <slot v-if="slots.error" name="error" />
      <e-space v-else size="mini" vertical align="center">
        <span class="eden-ui eden-ui__image__fallback--icon">
          <e-icon-error size="24" color="var(--color-text-3, #7c7c7c)" />
        </span>
        <e-text level="3" secondary size="12" no-wrap no-select
          >图片加载失败</e-text
        >
      </e-space>
    </span>
    <span v-if="caption || slots.caption" class="eden-ui__image__caption">
      <e-text v-if="caption" tertiary level="3">
        {{ caption }}
      </e-text>
      <slot v-else name="caption" />
    </span>

    <Teleport to="body">
      <transition name="fade">
        <div
          v-if="showPreviewLayer"
          class="eden-ui eden-ui__image eden-ui__image__preview-layer flex items-center justify-center absolute top-0 left-0 w-full h-full"
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
  </span>
</template>

<style scoped lang="scss">
span.eden-ui__image {
  line-height: 0; // 去掉浏览器默认的 4px 尾部空间
}

.eden-ui__image {
  outline: none;

  &--img {
    display: block;
  }

  &__fallback {
    background-color: $fill-1;
  }

  &__preview-layer {
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
