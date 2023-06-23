<template>
  <el-form label-position="left" label-width="100">
    <el-form-item label="谁说的" required>
      <el-select-v2
        v-model="config.characterName"
        :options="characterList"
        filterable
        clearable
        placeholder="留空默认无立绘"
      />
    </el-form-item>
    <el-form-item label="什么表情" class="mb-0">
      <el-select v-model="config.face" filterable clearable placeholder="留空默认无立绘">
        <el-option v-for="(e, i) in characterFaceList" :key="i" :label="e" :value="e" />
      </el-select>
    </el-form-item>
    <el-form-item label="站哪" class="mb-0">
      <el-select v-model="config.position" filterable clearable placeholder="留空默认无立绘">
        <el-option v-for="(e, i) in characterPositionList" :key="i" :label="e" :value="e" />
      </el-select>
    </el-form-item>
    <el-form-item label="说什么" class="mb-0">
      <TextUnitBuilder @update="onTextUpdate" />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { Ref } from "vue";
import { Text } from "ba-story-player/dist/lib/types/common";
import { inspectFormData } from "@/views/Editor/tools";
import { InternalTextStoryUnit } from "@/views/Editor/tools/types";
import { ExcelTable } from "@/views/Editor/tools/store";
import { OptionItem } from "@/types";
import TextUnitBuilder from "./TextUnitComponents/TextUnitBuilder.vue";

const index = inject("index", ref(-1));
const config = inject<Ref<InternalTextStoryUnit>>("storyUnit")!;

const characterList = ref<OptionItem[]>([]);
const characterPositionList = ref([1, 2, 3, 4, 5]);
const characterFaceList = ref(Array.from({ length: 30 }).map((_, idx) => (idx < 10 ? `0${idx}` : String(idx))));
ExcelTable.character.then((data) => {
  characterList.value = [...data.values()].map((it) => {
    const nickName = it.NicknameCN || it.NicknameJP;
    const name = (it.NameCN || it.NameJP) + (nickName ? `(${nickName})` : "");
    Reflect.set(it, "name", name);
    return {
      label: name,
      value: it.CharacterName,
    };
  });
  if (!config.value.characterName) {
    config.value.characterName = characterList.value[0].value as number;
  }
});

function onTextUpdate(text: Text) {
  config.value.text = [text];
}

inspectFormData("text", [config], index);
</script>

<style lang="scss" scoped></style>
