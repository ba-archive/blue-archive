<template>
  <el-row :gutter="16" class="flex-1">
    <el-col :span="12" class="flex-1 flex-col" style="display: flex">
      <CardContainer title="实时预览" class="flex-1">
        <div ref="StoryPlayerContainerEl" class="h-full w-full">
          <story-player
            :story="storyItem"
            :width="playerContainerWidth - 24"
            :height="playerContainerHeight - 24"
            :change-index="targetIndex"
            :story-summary="{ chapterName: '', summary: '' }"
            language="Cn"
            data-url="https://yuuka.cdn.diyigemt.com/image/ba-all-data"
            user-name="sensei"
          />
        </div>
      </CardContainer>
      <CardContainer title="资源列表" class="flex-1">
        <h1>这是资源列表</h1>
        <el-button type="danger" @click="clear">清空缓存</el-button>
      </CardContainer>
    </el-col>
    <el-col :span="12" class="flex-1 h-full">
      <CardContainer title="剧情脚本" class="flex-1 h-full">
        <div class="h-full flex flex-col">
          <el-row class="mb-16px">
            <el-button type="primary" class="w-full" @click="createStoryUnit">新增</el-button>
          </el-row>
          <el-row class="flex-1">
            <el-scrollbar class="w-full">
              <VueDraggable v-model="story" :animation="150" handle=".drag-handle" @update="update">
                <StoryUnit
                  v-for="(e, index) in story"
                  :key="index"
                  class="mb-16px"
                  :type="e.type"
                  :index="Number(index)"
                />
              </VueDraggable>
            </el-scrollbar>
          </el-row>
        </div>
      </CardContainer>
    </el-col>
  </el-row>
  <el-dialog v-model="createDialogVisible" align-center>
    <CreateStoryUnitDialog @choose="onConfirmStoryUnitType" />
  </el-dialog>
</template>

<script setup lang="ts">
import StoryPlayer from "ba-story-player";
import { StoryType, TranslatedStoryUnit } from "ba-story-player/dist/lib/types/common";
import "ba-story-player/dist/style.css";
import { VueDraggable } from "vue-draggable-plus";
import { SortableEvent } from "sortablejs";
import CreateStoryUnitDialog from "@/views/Editor/CreateStoryUnitDialog.vue";
import useStoryStore from "@/views/Editor/tools/store";
import { buildDefaultStoryRawUnit } from "@/views/Editor/tools";
import StoryUnit from "@/views/Editor/StoryUnit.vue";

const StoryPlayerContainerEl = ref<HTMLElement>();
const storyStore = useStoryStore();
const { width: playerContainerWidth, height: playerContainerHeight } = useElementSize(StoryPlayerContainerEl);
const story = computed(() => storyStore.story);
const storyItem = computed<TranslatedStoryUnit>(() => ({
  GroupId: 0,
  translator: "",
  content: story.value,
}));
const targetIndex = ref(0);
const createDialogVisible = ref(false);

function createStoryUnit() {
  createDialogVisible.value = true;
}
function onConfirmStoryUnitType(type: StoryType) {
  storyStore.insertStoryUnit(buildDefaultStoryRawUnit({ type }));
  createDialogVisible.value = false;
}

function update(event: SortableEvent) {
  storyStore.updateInternalIndex(event.newIndex!, event.oldIndex!);
}

function clear() {
  storyStore.clearCache();
}
</script>

<style scoped lang="scss"></style>
