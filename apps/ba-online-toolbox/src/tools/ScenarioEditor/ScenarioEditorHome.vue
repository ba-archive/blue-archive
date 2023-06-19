<template>
  <load-file-page v-if="!mainStore.isLoadFile"></load-file-page>
  <main-page v-else></main-page>
</template>

<script setup lang="ts">
// 目前还需要处理的内容:
// 1. UI的美化(css还是要调试).
// 2. ba-story-player的使用, 看一下skip的性能, 要是不太行就直接新写一个.
// 3. 校对后的文件对于没用的内容的格式化.
import LoadFilePage from './components/LoadFilePage.vue';
import MainPage from './components/MainPage.vue';
import { useScenarioStore } from './store/scenarioEditorStore';

const mainStore = useScenarioStore();
</script>

<style scoped lang="scss"></style>
