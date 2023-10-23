<template>
  <div
    class="flex flex-col gap-5"
    :class="{ primary: props.primary, 'solid-background': props.background }"
  >
    <div
      class="color-card cursor-pointer"
      :style="{ backgroundColor: displayColor }"
      @click="handleCopyRequest(displayColor)"
    />
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <div
          class="color-token cursor-pointer"
          v-if="props.token"
          @click="handleCopyRequest(props.token)"
        >
          {{ props.token }}
        </div>
        <div class="color-description" v-if="props.description">
          {{ props.description }}
        </div>
      </div>
      <div
        class="color-value cursor-pointer font-semibold"
        @click="handleCopyRequest(displayColor)"
      >
        {{ displayColor }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import colorString from "color-string";
import { computed } from "vue";
import { PaletteProps } from "../../types/ColorPalette";
import { Message } from "@arco-design/web-vue";
import { useClipboard } from "@vueuse/core";

const props = withDefaults(defineProps<PaletteProps>(), {
  primary: false,
  background: false,
});

const { copy } = useClipboard({ legacy: true });

function handleCopyRequest(text) {
  copy(text).catch(() => {
    Message.error("复制失败，请手动复制");
  });

  Message.success(`已复制到剪贴板：${text}`);
}

// @ts-ignore
const displayColor = computed(() =>
  colorString.to.hex(colorString.get.rgb(props.color))
);
</script>

<style scoped lang="scss">
.color-card {
  width: 160px;
  height: 56px;
}

.primary {
  .color-card {
    width: 120px;
    height: 100px;
  }
}

.color-token,
.color-value {
  color: var(--color-text-3);
}

.color-description {
  color: var(--color-text-5);
  font-family: "OPPOSans-SemiBold", var(--vp-font-family-base);
}
</style>
