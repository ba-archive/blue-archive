<script setup lang="ts">
const testString = "段落测试".repeat(30);
</script>

<template>
  <div class="flex flex-col" style="gap: 12px">
    <e-text
      size="display-1"
      :color="{
        from: 'var(--plana-pink-6)',
        to: 'var(--plana-pink-2)',
        deg: 45,
      }"
      disabled
      no-select
    >
      <template #prefix>
        <div class="flex flex-col">
          <img
            style="width: 36px"
            src="https://blue-archive.io/favicon/android-chrome-192x192.png"
          />
          <span style="font-size: 12px; line-height: 12px">prefix</span>
        </div>
      </template>
      <template #suffix>
        <div class="flex flex-col">
          <img
            style="width: 36px"
            src="https://blue-archive.io/favicon/android-chrome-192x192.png"
          />
          <span style="font-size: 12px; line-height: 12px">suffix</span>
        </div>
      </template>
      文字 / Text / display-1
    </e-text>
    <e-text size="display-2" underline stroke color="var(--plana-pink-6)"
      >display-2</e-text
    >
    <e-text size="display-3">display-3</e-text>
    <e-text size="title-1" type="title">title-1 / title</e-text>
    <e-text size="title-2" type="title">title-2 / title</e-text>
    <e-text size="title-3" type="title">title-3 / title</e-text>
    <e-text size="title-1">title-1</e-text>
    <e-text size="title-2">title-2</e-text>
    <e-text size="title-3">title-3</e-text>
    <e-text size="body-1" type="title">body-1 / title</e-text>
    <e-text size="body-2" type="title">body-2 / title</e-text>
    <e-text size="body-3" type="title">body-3 / title</e-text>
    <e-text
      size="body-1"
      :color="{
        from: 'var(--arona-blue-6)',
        to: 'var(--arona-blue-2)',
        deg: 45,
      }"
      >{{ testString }}</e-text
    >
    <e-text size="body-2">{{ testString }}</e-text>
    <e-text size="body-3">{{ testString }}</e-text>
    <e-text size="body-1" blockquote>{{ testString }}</e-text>
    <e-text size="body-2" blockquote>{{ testString }}</e-text>
    <e-text size="body-3" blockquote>{{ testString }}</e-text>
  </div>
</template>

<style scoped lang="scss"></style>
