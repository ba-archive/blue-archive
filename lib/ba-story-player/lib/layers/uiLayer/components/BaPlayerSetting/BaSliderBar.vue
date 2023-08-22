<script setup lang="ts">
import { ref } from "vue";
import ElSlider from "./slider/src/slider.vue";
import { BaSliderData } from "./BaPlayerSetting";

defineOptions({
  name: "BaSliderBar",
});
const value = ref(0);
const props = defineProps<{
  data: BaSliderData;
  unit: string;
}>();
</script>

<template>
  <div class="ba-slider">
    <div class="name">
      {{ data.name }}
    </div>
    <div class="prefix">
      <slot name="prefix" />
    </div>
    <div class="slider">
      <ElSlider v-model="value" />
    </div>
    <div class="suffix">
      <slot name="suffix" />
    </div>
    <div class="value">
      <slot name="value" :value="value"> {{ value }}{{ unit }} </slot>
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
  padding: 16px 32px 16px 16px;
  font-size: 14px;
  line-height: 32px;
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
