<template>
  <el-form class="el-form-mb-0" inline label-position="left" label-width="100">
    <el-form-item label="主标题" required>
      <el-input v-model="title" />
    </el-form-item>
    <el-form-item label="次标题(可选)" class="mb-0">
      <el-input v-model="subTitle" />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { Ref } from "vue";
import { inspectFormData } from "@/views/Editor/tools";
import { InternalTitleStoryUnit } from "@/views/Editor/tools/types";

const index = inject("index", ref(-1));
const storyUnit = inject<Ref<InternalTitleStoryUnit>>("storyUnit")!;

const title = ref(storyUnit.value.title);
const subTitle = ref(storyUnit.value.subTitle);

inspectFormData("title", [title, subTitle], index);
</script>

<style lang="scss" scoped></style>
