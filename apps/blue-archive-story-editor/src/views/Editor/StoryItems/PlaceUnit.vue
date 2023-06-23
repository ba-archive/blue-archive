<template>
  <el-form class="el-form-mb-0" inline label-position="left" label-width="100">
    <el-form-item label="地点" required>
      <el-input v-model="place" />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { Ref } from "vue";
import { inspectFormData } from "@/views/Editor/tools";
import { InternalPlaceStoryUnit } from "@/views/Editor/tools/types";

const index = inject("index", ref(-1));
const storyUnit = inject<Ref<InternalPlaceStoryUnit>>("storyUnit")!;

const place = ref(storyUnit.value.place);

inspectFormData("place", [place], index);
</script>

<style lang="scss" scoped></style>
