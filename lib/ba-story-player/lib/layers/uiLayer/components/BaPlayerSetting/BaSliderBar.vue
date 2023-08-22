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
</style>
