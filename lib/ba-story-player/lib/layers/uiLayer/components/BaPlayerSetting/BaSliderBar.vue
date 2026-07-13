<script setup lang="ts">
import { inject, ref } from "vue";
import { getUiI18n } from "../../utils";
import { ElSlider } from "element-plus";
import { Language } from "@/types/store";
import { watchThrottled } from "@vueuse/core";
import { BaSliderData } from "./BaPlayerSetting";

defineOptions({
  name: "BaSliderBar",
});
const language = inject<Language>("language", "Cn");
const props = withDefaults(
  defineProps<{
    data: BaSliderData;
    unit: string;
    value: number;
  }>(),
  {
    value: 0,
  }
);
const emit = defineEmits<{
  "update:value": [value: number];
}>();
const factor = props.data.fator || 1;
const factorS = String(factor);
const ponitPos = factorS.indexOf(".");
const accurcy = ponitPos === -1 ? 0 : factorS.length - ponitPos - 1;
const internalValue = ref(props.value * factor);
watchThrottled(
  () => internalValue.value,
  cur => {
    emit("update:value", cur / factor);
  },
  { throttle: 100 }
);
</script>

<template>
  <div class="ba-slider">
    <div class="name">
      {{ getUiI18n(data.name, language) }}
    </div>
    <div class="prefix">
      <slot name="prefix" />
    </div>
    <div class="slider">
      <ElSlider
        v-model="internalValue"
        :max="data.max"
        :min="data.min"
        :step="data.step"
        :show-tooltip="false"
      />
    </div>
    <div class="suffix">
      <slot name="suffix" />
    </div>
    <div class="mute">
      <slot name="mute">
        <span class="value">
          {{ internalValue.toFixed(accurcy) }}{{ unit }}
        </span>
      </slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
$track: #c8c8c8;
$thumb-size: 16px;

.slider {
  :deep(.el-slider) {
    overflow: visible;
    height: $thumb-size;
    --el-slider-height: 2px;
    --el-slider-button-size: #{$thumb-size};
    --el-slider-button-wrapper-size: #{$thumb-size};
    --el-slider-button-wrapper-offset: -7px;
  }
  :deep(.el-slider__runway) {
    overflow: visible;
    position: relative;
    margin: 0;
    border-radius: 1px;
    background-color: $track;
    height: 2px;
    &::before,
    &::after {
      position: absolute;
      top: 50%;
      z-index: 0;
      border-radius: 50%;
      background: $track;
      width: $thumb-size;
      height: $thumb-size;
      content: "";
      transform: translateY(-50%);
      pointer-events: none;
    }
    &::before {
      left: 0;
      transform: translate(-50%, -50%);
    }
    &::after {
      right: 0;
      transform: translate(50%, -50%);
    }
  }
  :deep(.el-slider__bar) {
    background-color: transparent;
  }
  :deep(.el-slider__button-wrapper) {
    display: flex;
    justify-content: center;
    align-items: center;
    top: 50%;
    width: $thumb-size;
    height: $thumb-size;
    transform: translate(-50%, -50%);
    line-height: 0;
    font-size: 0;
  }
  :deep(.el-slider__button) {
    display: block;
    opacity: 1;
    border: none;
    box-shadow: none;
    background: url("../../assets/slider_point.png") center / contain no-repeat;
    background-color: transparent;
    width: $thumb-size;
    height: $thumb-size;
  }
}
.ba-slider {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px 16px;
  font-size: 14px;
  line-height: 24px;
  .slider {
    flex: 1;
    margin-right: 8px;
    margin-left: 8px;
  }
  .prefix,
  .suffix {
    display: flex;
    flex-shrink: 0;
    justify-content: center;
    align-items: center;
    width: 36px;
    margin: 0;
  }
  .name {
    flex-shrink: 0;
    position: relative;
    margin: 0 8px 0 8px;
    width: 72px;
    &::after {
      position: absolute;
      top: 4px;
      left: -8px;
      border-radius: 1.5px;
      background: #5ed2ff;
      width: 3px;
      height: 16px;
      content: "";
    }
  }
  .mute {
    display: flex;
    flex-shrink: 0;
    justify-content: flex-end;
    align-items: center;
    margin-left: 8px;
    min-width: 72px;
  }
  .value {
    min-width: 40px;
    text-align: right;
  }
}
</style>
