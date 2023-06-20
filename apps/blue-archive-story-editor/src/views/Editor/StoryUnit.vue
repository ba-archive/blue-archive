<template>
  <div class="story-unit-container flex flex-row">
    <div class="w-30px flex flex-col justify-center">
      <el-text>
        <el-icon><Sort class="drag-handle cursor-move" /></el-icon>
        {{ index }}
      </el-text>
    </div>
    <div class="component flex-1">
      <Component :is="StoryUnit.component" :index="index" />
    </div>
    <div class="action">
      <el-button type="danger" text @click="deleteSelf">删除</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Sort } from "@element-plus/icons-vue";
import { StoryUnitType } from "@/views/Editor/tools/types";
import { StoryRawUnitGeneratorMap, StoryUnitComponentMap } from "@/views/Editor/tools/storyUnitMap";
import { deleteStoryUnit } from "@/views/Editor/tools";
import useStoryStore from "@/views/Editor/tools/store";

const storyStore = useStoryStore();
const props = withDefaults(defineProps<IProp>(), {
  index: 0,
  type: "text",
});

const index = computed(() => props.index);

provide("index", index);

const StoryUnit = computed(() => StoryUnitComponentMap[props.type]);

const storyUnit = computed(
  () => storyStore.internalStory[index.value] || StoryRawUnitGeneratorMap[props.type].default(),
);

provide("storyUnit", storyUnit);

function deleteSelf() {
  deleteStoryUnit(props.index);
}

type IProp = {
  index: number; // 标识其在脚本array中的index
  type: StoryUnitType;
};
</script>

<style lang="scss" scoped>
.story-unit-container {
  .index {
    width: 30px;
  }
}
</style>
