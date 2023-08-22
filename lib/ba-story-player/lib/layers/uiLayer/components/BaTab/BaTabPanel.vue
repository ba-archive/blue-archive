<script lang="ts" setup>
import { computed, inject } from "vue";
import { useProgress } from "./utils";

defineOptions({
  name: "BaTabPanel",
});
const props = withDefaults(
  defineProps<{
    name: string;
    label: string;
  }>(),
  {
    name: "",
    label: "",
  }
);
const uuid = inject<string>("uuid", "");
const { _ref: currentActivePanel } = useProgress(uuid);
const displayMyself = computed(() => currentActivePanel.value === props.name);
</script>

<template>
  <div class="ba-tab-panel" v-show="displayMyself">
    <div v-if="displayMyself"><slot /></div>
  </div>
</template>
