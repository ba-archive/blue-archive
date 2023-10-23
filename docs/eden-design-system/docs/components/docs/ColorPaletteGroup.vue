<template>
  <div class="flex flex-col gap-8 mt-4">
    <div class="flex flex-col gap-2">
      <div class="color-group-token text-lg" v-if="props.group.token">
        {{ props.group.token }}
      </div>
      <div class="color-description" v-if="props.group.description">
        {{ props.group.description }}
      </div>
    </div>
    <div
      class="palette-container flex flex-row flex-wrap"
      :class="{ primary: props.group.primary }"
    >
      <ColorPaletteComponent
        v-for="color in colorGroup"
        :color="color.color"
        :token="color.token"
        :description="color.description"
        :primary="color.primary"
        :background="color.background"
        :key="color.token"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { PaletteGroup } from "../../types/ColorPalette";
import ColorPaletteComponent from "./ColorPalette.vue";

const props = withDefaults(
  defineProps<{
    group: PaletteGroup;
  }>(),
  {
    // @ts-ignore
    group: {
      colorSetName: "",
      token: "",
      description: "",
      palettes: [],
      primary: false,
      background: false,
    } as PaletteGroup,
  }
);

const colorGroup = computed(() => {
  return props.group.palettes.map(palette => {
    return {
      color: palette.color,
      token: palette.token,
      description: palette.description,
      primary: props.group.primary,
      background: props.group.background,
    };
  });
});
</script>

<style scoped lang="scss">
.color-group-token {
  font-family: "OPPOSans-SemiBold", var(--vp-font-family-base);
}

.palette-container {
  row-gap: 32px;

  &.primary {
    column-gap: 32px;
  }
}

.color-token,
.color-description {
  color: var(--color-text-3);
}
</style>
