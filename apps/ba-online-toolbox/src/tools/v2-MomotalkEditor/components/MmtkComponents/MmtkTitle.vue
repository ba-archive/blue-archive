<script setup lang="ts">
import EInput from "../widgets/EInput.vue";
import type { Title, Language } from "../../types/Momotalks";
import { IconTranslate } from "@arco-design/web-vue/es/icon";
const props = defineProps<{
  title: Title;
  from: Language;
  to: Language;
  idx: number;
  total: number;
}>();
</script>

<template>
  <div
    flex
    flex-col
    gap-2
    flex-1
    items-center
    p-5
    shadow-sm
    sticky
    top-0
    bg-white
    class="@dark:bg-slate-700"
    z-999
  >
    <h3 flex items-center content-between gap-2 class="@dark:text-gray-100">
      {{ props.title[`Text${props.from}`] }}
      <a-tag size="mini">{{ props.idx + 1 }}/{{ props.total }}</a-tag>
    </h3>
    <div w-full gap-1 flex flex-1 justify-between items-end>
      <EInput
        v-model="props.title[`Text${props.to}`]"
        width="100%"
        align="center"
        placeholder="输入标题翻译"
      >
        <!-- <template #suffix>
          <a-button type="text" size="small"><icon-translate /></a-button>
        </template> -->
      </EInput>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
