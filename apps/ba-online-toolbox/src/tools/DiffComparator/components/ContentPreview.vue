<script setup lang="ts">
import { computed } from "vue";
import { Scenario } from "../../ScenarioEditor/types/content";
const props = defineProps<{
  content: Scenario;
}>();

const content = computed(() => JSON.stringify(props.content, null, 2));
</script>

<template>
  <div
    class="flex flex-col w-full overflow-y-auto max-w-[40dvw] bg-white @dark:bg-slate-800 text-dark @dark:text-gray-200 border-solid border-blue border-1 rounded-lg"
  >
    <div class="content-preview">
      <pre class="p-4 whitespace-pre-wrap">{{ content }}</pre>
  </div>
</div>
</template>

<style scoped lang="scss"></style>
