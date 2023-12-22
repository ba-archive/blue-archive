<script setup lang="ts">
import { useData } from "vitepress";
import { nextTick, onBeforeMount, provide } from "vue";
import DefaultTheme from "vitepress/theme-without-fonts";

const { isDark } = useData();

const enableTransitions = () =>
  "startViewTransition" in document &&
  window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

provide("toggle-appearance", async ({ clientX: x, clientY: y }: MouseEvent) => {
  if (!enableTransitions()) {
    isDark.value = !isDark.value;
    return;
  }

  await document.startViewTransition(async () => {
    isDark.value = !isDark.value;
    await nextTick();
  }).ready;

  document
    .querySelector("body")
    .setAttribute("arco-theme", isDark.value ? "dark" : "");

  document.documentElement.animate(
    { opacity: isDark.value ? [1, 0] : [0, 1] },
    {
      duration: 300,
      easing: "ease-in-out",
      pseudoElement: `::view-transition-${isDark.value ? "old" : "new"}(root)`,
    }
  );
});

onBeforeMount(() => {
  document
    .querySelector("body")
    .setAttribute("arco-theme", isDark.value ? "dark" : "");
});
</script>

<template>
  <DefaultTheme.Layout />
</template>

<style>
::view-transition-old(root),
::view-transition-new(root) {
  mix-blend-mode: normal;
  animation: none;
}

::view-transition-old(root),
.dark::view-transition-new(root) {
  z-index: 1;
}

::view-transition-new(root),
.dark::view-transition-old(root) {
  z-index: 9999;
}
</style>
