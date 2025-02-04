<script lang="ts" setup>
import MomotalkFileLoader from "./components/MomotalkFileLoader.vue";
import { isEmpty } from "radashi";
import { ref, computed } from "vue";
import { momotalkEditorStore } from "./store/momotalkEditorStore";
import MomotalkEditorWrapper from "./components/MomotalkEditorWrapper.vue";
const useMomotalkEditorStore = momotalkEditorStore();

const isMomotalkDataEmpty = computed(() =>
  isEmpty(useMomotalkEditorStore.getMomotalkFileData)
);
</script>

<template>
  <momotalk-file-loader v-if="isMomotalkDataEmpty" />
  <momotalk-editor-wrapper v-else />
</template>

<style lang="scss" scoped></style>
