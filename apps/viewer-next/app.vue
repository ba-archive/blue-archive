<script lang="ts" setup></script>

<template>
  <div class="flex flex-col">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style lang="scss">
@import "./packages/eden-design/components/index.scss";
@import "@unocss/reset/normalize.css";

html {
  background: $fill-base;
}
</style>
