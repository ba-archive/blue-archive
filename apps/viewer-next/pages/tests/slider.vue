<script lang="ts" setup>
import { ref } from "vue";
const value = ref(50);

function handleChange(value: number) {
  console.log(value);
}
</script>

<template>
  <e-h1 align="center" class="self-center mt-4">滑块 / Slider</e-h1>
  <e-space vertical size="large" margin="16">
    <e-space
      vertical
      size="large"
      class="rounded-md border-1 border-solid border-[var(--arona-blue-6)] p-4"
    >
      <e-input-number v-model="value" @update:value="handleChange" />
      <e-space vertical :size="24">
        <e-h2>基本用法</e-h2>
        <e-slider v-model="value" />
        <e-slider v-model="value" danger />
        <e-slider v-model="value" success />
        <e-slider v-model="value" warning />
        <e-slider
          v-model="value"
          :traveled-background="{
            from: 'var(--plana-pink-6)',
            to: 'var(--arona-blue-6)',
            deg: 45,
          }"
        />
      </e-space>
      <e-space vertical :size="24">
        <e-h2>禁用状态</e-h2>
        <e-slider v-model="value" disabled />
      </e-space>
    </e-space>
  </e-space>
</template>

<style scoped lang="scss"></style>
