<script setup lang="ts">
import { SemanticUnit } from "../types/Semantic";
import { computed } from "vue";
const props = defineProps<{ semantic: SemanticUnit }>();

const shouldShowKana = computed(() => {
  return props.semantic.yomi !== props.semantic.word;
});
</script>

<template>
  <div class="flex flex-col justify-end items-center">
    <span class="text-[8px]" v-if="shouldShowKana">{{ semantic.yomi }}</span>
    <n-tooltip placement="bottom">
      <template #trigger>
        <n-tag size="medium">{{ semantic.word }}</n-tag>
      </template>
      <div>品詞: {{ semantic.word_type }}</div>
      <div>基本形表記: {{ semantic.basic_form }}</div>
      <div>活用型: {{ semantic.conjugation }}</div>
    </n-tooltip>
  </div>
</template>

<style scoped lang="scss"></style>
