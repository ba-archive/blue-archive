<script setup lang="ts">
import { ElInputNumber, ElRadio, ElRadioGroup } from "element-plus";
import { inject, ref, watch } from "vue";
import { getUiI18n } from "../../utils";
import { useUiState } from "@/stores/state";
import { Language } from "@/types/store";

const language = inject<Language>("language", "Cn");
defineOptions({
  name: "BaPlayerSettingPlaying",
});

type SpeedOption = 20 | 40 | 60 | "custom";

const state = useUiState();
const reserveValue: SpeedOption[] = [20, 40, 60];
const typingSpeed = ref(state.playing.value.typingSpeed);
const selected = ref<SpeedOption>(
  reserveValue.includes(typingSpeed.value as SpeedOption)
    ? (typingSpeed.value as SpeedOption)
    : "custom"
);
const customTips = getUiI18n(
  "playing-custom-setting-millisecond",
  language
).split("\n");

watch(
  () => selected.value,
  val => {
    if (val !== "custom") {
      typingSpeed.value = val;
    }
  }
);
watch(
  () => typingSpeed.value,
  val => {
    state.playing.value.typingSpeed = val;
  }
);
</script>

<template>
  <div class="ba-setting-section">
    <div class="title">{{ getUiI18n("playing-speed", language) }}</div>
    <div class="divider" />
    <p class="desc">{{ getUiI18n("playing-speed-desc", language) }}</p>
    <ElRadioGroup v-model="selected" class="options">
      <ElRadio :value="60">{{
        getUiI18n("playing-speed-slow", language)
      }}</ElRadio>
      <ElRadio :value="40">{{
        getUiI18n("playing-speed-normal", language)
      }}</ElRadio>
      <ElRadio :value="20">{{
        getUiI18n("playing-speed-fast", language)
      }}</ElRadio>
      <ElRadio value="custom">{{
        getUiI18n("playing-custom-setting", language)
      }}</ElRadio>
    </ElRadioGroup>
    <div v-if="selected === 'custom'" class="custom-row">
      <span>{{ customTips[0] || "" }}</span>
      <ElInputNumber
        v-model="typingSpeed"
        class="custom-input"
        :max="500"
        :min="5"
        size="small"
      />
      <span>{{ customTips[1] || "" }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
$radio-size: 16px;

.ba-setting-section {
  border-radius: 3px;
  background: white;
  padding: 14px 16px 16px;
  font-size: 14px;
}
.title {
  position: relative;
  margin: 0 0 0 8px;
  color: #2b3648;
  font-weight: bold;
  line-height: 20px;
  &::before {
    position: absolute;
    top: 2px;
    left: -8px;
    border-radius: 1.5px;
    background: #5ed2ff;
    width: 3px;
    height: 16px;
    content: "";
  }
}
.divider {
  margin: 10px 0;
  background-image: repeating-linear-gradient(
    to right,
    #c8c8c8 0,
    #c8c8c8 4px,
    transparent 4px,
    transparent 8px
  );
  height: 1px;
}
.desc {
  margin: 0 0 14px;
  color: #7a8799;
  font-size: 13px;
  line-height: 1.45;
}
.options {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 20px;
  :deep(.el-radio) {
    margin-right: 0;
    height: auto;
    .el-radio__label {
      padding-left: 6px;
      color: #c0c4cc;
      font-size: 14px;
    }
    &.is-checked .el-radio__label {
      color: #2b3648;
    }
  }
  :deep(.el-radio__input .el-radio__inner) {
    border: 1px solid #c8c8c8;
    background: transparent;
    width: $radio-size;
    height: $radio-size;
    &::after {
      display: none;
    }
  }
  :deep(.el-radio__input.is-checked .el-radio__inner) {
    border: none;
    box-shadow: none;
    background: url("../../assets/slider_point.png") center / contain no-repeat;
    background-color: transparent;
  }
}
.custom-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  color: #4a5568;
  line-height: 24px;
}
.custom-input {
  width: 100px;
}
</style>
