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
      文字 / Text
    </e-text>
    <e-text size="display-2" underline stroke color="var(--plana-pink-6)"
      >Eden Design</e-text
    >
    <e-text size="display-3">Eden Design</e-text>
    <e-text size="title-1" type="title">Eden Design</e-text>
    <e-text size="title-2" type="title">Eden Design</e-text>
    <e-text size="title-3" type="title">Eden Design</e-text>
    <e-text size="title-1">Eden Design</e-text>
    <e-text size="title-2">Eden Design</e-text>
    <e-text size="title-3">Eden Design</e-text>
    <e-text size="body-1" type="title">Eden Design</e-text>
    <e-text size="body-2" type="title">Eden Design</e-text>
    <e-text size="body-3" type="title">Eden Design</e-text>
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
