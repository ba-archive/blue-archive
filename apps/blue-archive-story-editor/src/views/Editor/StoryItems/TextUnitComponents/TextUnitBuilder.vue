<template>
  <el-form class="el-form-mb-0" label-position="left" label-width="120">
    <el-form-item label="类型">
      <el-select v-model="selectList" multiple>
        <el-option v-for="(e, index) in optionList" :key="index" :value="e.type" :label="e.type" />
      </el-select>
    </el-form-item>
    <el-form-item v-for="(e, index) in paramList" :key="index" :label="e.type + '的参数'">
      <el-input v-model="e.value" />
    </el-form-item>
    <el-form-item label="内容">
      <el-input v-model="value" />
    </el-form-item>
    <el-form-item label="长这样" :style="css">
      {{ renderValue }}
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { TextEffectName, Text } from "ba-story-player/dist/lib/types/common";
import { watch } from "vue";
import { debounce } from "lodash";
import { TextEffectTypeList, buildTextEffect, parseTextEffectToCss } from ".";

const emit = defineEmits<{ (event: "update", text: Text): void }>();

const optionList = ref(TextEffectTypeList.map((it) => ({ type: it, value: "" })));
const paramList = computed(() => optionList.value.filter((it) => selectList.value.includes(it.type)));
const selectList = ref<TextEffectName[]>([]);
const value = ref<string>("");
const computedEffect = computed(() => paramList.value.map((it) => buildTextEffect(it)));
const css = computed(() => parseTextEffectToCss(computedEffect.value));
const renderValue = computed(() => value.value);
watch(
  [paramList, value],
  debounce(() => {
    emit("update", {
      content: value.value,
      effects: computedEffect.value,
    });
  }, 2000),
);
</script>
