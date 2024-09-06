<script setup lang="ts">
const size = ref(24);
const color = ref("2773E1");

function getColorHex(color: string) {
  if (color.startsWith("#")) {
    return color;
  }
  return `#${color}`;
}
</script>

<template>
  <e-h1 align="center" class="self-center mt-4">图标 / Icons</e-h1>
  <e-space vertical size="large" margin="16">
    <e-h2>基本用法</e-h2>
    <e-space>
      <e-space size="small" align="center">
        <e-text>图标尺寸</e-text>
        <e-input-number v-model="size" :min="12" :max="128" />
        <e-text>px</e-text>
      </e-space>
      <e-space size="small" align="center">
        <e-text>图标颜色</e-text>
        <e-input v-model="color" width="84">
          <template #prefix> # </template>
        </e-input>
      </e-space>
    </e-space>
    <e-space>
      <EIconAdd :size="size" :color="getColorHex(color)" />
      <EIconError :size="size" :color="getColorHex(color)" />
      <EIconSubtract :size="size" :color="getColorHex(color)" />
    </e-space>
  </e-space>
</template>
