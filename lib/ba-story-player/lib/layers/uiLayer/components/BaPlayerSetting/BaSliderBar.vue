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
    <div class="value">
      <slot name="value" :value="value">
        {{ internalValue.toFixed(accurcy) }}{{ unit }}
      </slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.slider {
  :deep(.el-slider__button) {
    opacity: 1;
    border: 1px solid #629bed;
    background: linear-gradient(135deg, #b2cffa 14%, #65a0f5 85%);
  }
}
.ba-slider {
  display: flex;
  flex-direction: row;
  border-radius: 3px;
  background: white;
  padding: 16px 32px 16px 16px;
  font-size: 14px;
  line-height: 32px;
  & + .ba-slider {
    margin-top: 4px;
  }
  .slider {
    flex: 1;
    margin-right: 16px;
    margin-left: 8px;
  }
  .prefix,
  .suffix,
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
  .value {
    min-width: 40px;
    text-align: right;
  }
}
</style>
