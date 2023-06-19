<template>
  <div class="actor-lines-container rounded-medium">
    <!-- 确实找不到一个唯一的 key 作为优化手段，考虑 index？-->
    <!-- eslint-disable vue/valid-v-for -->
    <index-line
      :line="line"
      :index="index"
      @click="
        () => {
          config.setSelectLine(index);
        }
      "
      v-for="(line, index) in mainStore.getScenario.content"
    />
    <!-- eslint-enable vue/valid-v-for -->
  </div>
</template>
<script setup lang="ts">
import { useGlobalConfig } from '../store/configStore';
import { useScenarioStore } from '../store/scenarioEditorStore';
import IndexLine from './IndexLine.vue';

const mainStore = useScenarioStore();
const config = useGlobalConfig();
// const log = (data: any) => console.log(data);
</script>
<style scoped lang="scss">
.actor-lines-container {
  display: flex;
  grid-area: actor-lines;
  flex-direction: column;
  gap: 0.5rem;
  margin-left: 1rem;
  max-height: 100%;
  overflow-y: auto;
}
</style>
