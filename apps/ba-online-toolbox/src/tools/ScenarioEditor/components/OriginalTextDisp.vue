<script setup lang="ts">
import { AnthropicStatusCode } from "../types/Semantic";
import { useTranslationStore } from "../store/translationStore";
import { computed, watch } from "vue";
import { useClipboard } from "@vueuse/core";
import { parseSemantics } from "../../public/helper/AnthropicSemanticParser";
import { ElMessage } from "element-plus";
import SemanticUnit from "./SemanticUnit.vue";

const props = defineProps<{
  text: string | undefined;
  preferSemantic: boolean;
  selectLine: number;
}>();

const useTranslationCache = useTranslationStore();

function searchSemanticDict() {
  return useTranslationCache.getSemantic(props.text);
}

async function getSemantics() {
  if (!props.text || !props.preferSemantic) {
    return;
  }
  if (searchSemanticDict()) {
    return searchSemanticDict();
  }
  return await parseSemantics(props.text).then(res => {
    if (!res) {
      ElMessage({
        message: "语义解析无结果，请告诉开发帕鲁哪句出了问题",
        type: "error",
      });
      return;
    }
    if (res.status !== AnthropicStatusCode.NORMAL) {
      ElMessage({
        message: res.message,
        type: "error",
      });
    }
    // @ts-ignore
    useTranslationCache.setSemantic(props.text, res.tokens);
  });
}

watch(
  () => [props.text, props.preferSemantic],
  () => {
    if (props.preferSemantic) {
      getSemantics();
    }
  }
);

const semantics = computed(() => {
  const semanticUnits = useTranslationCache.getSemantic(props.text);
  if (!semanticUnits) {
    return;
  }
  const indexOfAllCRLF = semanticUnits.reduce((acc, el, index) => {
    if (el.word === "\n") {
      acc.push(index);
    }
    return acc;
  }, [] as number[]);
  const result = [];
  indexOfAllCRLF.forEach((el, index) => {
    if (index === 0) {
      result.push(semanticUnits.slice(0, el));
    } else {
      result.push(semanticUnits.slice(indexOfAllCRLF[index - 1] + 1, el));
    }
  });
  result.push(
    semanticUnits.slice(indexOfAllCRLF[indexOfAllCRLF.length - 1] + 1)
  );
  return result;
});

const { copy } = useClipboard({ legacy: true });

const html = computed(() => {
  if (-1 === props.selectLine) {
    return "请选择一行";
  }
  if (!props.text) {
    return "该语言暂无翻译";
  }
  return props.text.replace("\n", "<br>");
});
</script>

<template>
  <div
    class="p-4 pt-2 pb-2 rounded-sm border-solid border-1 border-[var(--color-arona-blue)] overflow-y-scroll select-auto"
  >
    <div class="select-text" v-if="!props.preferSemantic || !searchSemanticDict()" v-html="html" />
    <div v-else class="flex flex-col gap-1">
      <div v-for="semanticLine in semantics" class="flex">
        <semantic-unit
          v-for="(semantic, index) in semanticLine"
          :key="index"
          :semantic="semantic"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
