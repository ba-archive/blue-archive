<script setup lang="ts">
import { ElCheckbox, ElInputNumber, ElRadio, ElRadioGroup } from "element-plus";
import { inject, ref, watch } from "vue";
import { closestNumber, getUiI18n } from "../../utils";
import { useUiState } from "@/stores/state";
import { Language } from "@/types/store";

const language = inject<Language>("language", "Cn");
defineOptions({
  name: "BaPlayerSettingPlaying",
});
const state = useUiState();
const reserveValue = [20, 40, 60];
const typingSpeed = ref(state.playing.value.typingSpeed);
const customSetting = ref(!reserveValue.includes(typingSpeed.value));
const customTips = getUiI18n(
  "playing-custom-setting-millisecond",
  language
).split("\n");
watch(
  () => customSetting.value,
  val => {
    if (!val) {
      typingSpeed.value = closestNumber(typingSpeed.value, reserveValue);
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
  <div class="ba-setting-card">
    <div class="name">{{ getUiI18n("playing-speed", language) }}</div>
    <div class="body">
      <span class="slider">
        <span v-if="!customSetting">
          <ElRadioGroup v-model="typingSpeed">
            <ElRadio :value="60">{{
              getUiI18n("playing-speed-slow", language)
            }}</ElRadio>
            <ElRadio :value="40">{{
              getUiI18n("playing-speed-normal", language)
            }}</ElRadio>
            <ElRadio :value="20">{{
              getUiI18n("playing-speed-fast", language)
            }}</ElRadio>
          </ElRadioGroup>
        </span>
        <span v-else>
          <span>{{ customTips[0] || "" }}</span>
          <span style="margin: 0 8px">
            <ElInputNumber
              v-model="typingSpeed"
              :max="500"
              :min="5"
              size="small"
              style="width: 100px"
            />
          </span>
          <span>{{ customTips[1] || "" }}</span>
        </span>
      </span>
      <span class="check">
        <ElCheckbox
          v-model="customSetting"
          :label="getUiI18n('playing-custom-setting', language)"
        />
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ba-setting-card {
  display: flex;
  flex-direction: row;
  border-radius: 3px;
  background: white;
  padding: 16px 32px 16px 16px;
  font-size: 14px;
  line-height: 32px;
  & + .ba-setting-card {
    margin-top: 4px;
  }
  .body {
    display: flex;
    flex: 1;
    flex-direction: row;
    margin-right: 16px;
    margin-left: 8px;
    .slider {
      flex: 1;
    }
    .check {
      margin-left: 16px;
    }
  }

  .name {
    margin: 0 8px;
  }
  .name {
    position: relative;
    &::after {
      position: absolute;
      top: 8.5px;
      left: -8px;
      border-radius: 1.5px;
      background: #95b7f2;
      width: 3px;
      height: 16px;
      content: "";
    }
  }
}
</style>
