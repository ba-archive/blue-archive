<template>
  <el-form class="el-form-mb-0" inline label-position="left" label-width="100">
    <el-form-item label="类型" required>
      <el-select-v2 v-model="config.background" :options="list" />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { Ref } from "vue";
import { ExcelTable } from "@/views/Editor/tools/store";
import { EffectOnlyConfig } from "@/views/Editor/tools/types";
import { OptionItem } from "@/types";

const list = ref<OptionItem[]>([]);
const config = inject<Ref<EffectOnlyConfig>>("config") as Ref<EffectOnlyConfig>;

ExcelTable.background.then((data) => {
  list.value = [...data.values()].map((it) => ({
    label: it.BGFileName.slice(it.BGFileName.lastIndexOf("/") + 1),
    value: it.Name,
  }));
  if (!config.value.background) {
    config.value.background = list.value[0].value as number;
  }
});
</script>

<style scoped lang="scss"></style>
