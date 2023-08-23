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
    <div class="ba-tab-panel__inner" v-if="displayMyself"><slot /></div>
  </div>
</template>

<style lang="scss" scoped>
.ba-tab-panel {
  border-radius: 3px;
  background-color: #f0f0f0;
  padding: 4px;
  height: calc(100% - 8px);

  &__inner {
    height: 100%;
  }
}
</style>
