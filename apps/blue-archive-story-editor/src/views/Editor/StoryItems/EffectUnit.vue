<template>
  <div>
    <el-form class="el-form-mb-0" inline label-position="left" label-width="100">
      <el-form-item label="类型" required>
        <el-select v-model="type">
          <el-option v-for="(e, i) in EffectUnitComponentList" :key="i" :labe="e.label" :value="e.value" />
        </el-select>
      </el-form-item>
    </el-form>
    <Component :is="EffectUnitComponent.component" class="mt-8px" />
  </div>
</template>

<script setup lang="ts">
import { Ref } from "vue";
import {
  EffectUnitComponentList,
  EffectUnitComponentMap,
  IEffectUnitComponentMap,
} from "@/views/Editor/StoryItems/EffectUnitComponents";
import { inspectFormData } from "@/views/Editor/tools";
import { EffectOnlyConfig, InternalEffectStoryUnit } from "@/views/Editor/tools/types";

const index = inject("index", ref(-1));
const storyUnit = inject<Ref<InternalEffectStoryUnit>>("storyUnit")!;
const config = ref<EffectOnlyConfig>(storyUnit.value);

provide("config", config);

const type = ref<keyof IEffectUnitComponentMap>("background");
const EffectUnitComponent = computed(() => EffectUnitComponentMap[type.value]);

inspectFormData("effectOnly", [config], index);
</script>

<style lang="scss" scoped></style>
