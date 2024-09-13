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
import { useData } from "vitepress";
import { computed } from "vue";
import type { PaletteProps } from "../types/ColorPalette";
import { useClipboard } from "@vueuse/core";
import { Message } from "@arco-design/web-vue";

const { isDark } = useData();

const props = withDefaults(defineProps<PaletteProps>(), {
  primary: false,
  background: false,
});

const { copy } = useClipboard({ legacy: true });

function handleCopyRequest(text: string) {
  copy(text).catch(() => {
    Message.error("复制失败，请手动复制");
  });

  Message.success(`已复制到剪贴板：${text}`);
}

const displayColor = computed(() => {
  return props.darkColor && isDark.value ? props.darkColor : props.color;
});
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
