<template>
  <load-file-page v-if="!mainStore.isLoadFile"></load-file-page>
  <main-page v-else></main-page>
</template>

<script setup lang="ts">
import LoadFilePage from "./components/LoadFilePage.vue";
import MainPage from "./components/MainPage.vue";
import { useScenarioStore } from "./store/scenarioEditorStore";


const mainStore = useScenarioStore();
</script>

<style scoped lang="scss"></style>
