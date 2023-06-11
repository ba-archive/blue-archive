<script setup lang="ts">
import { ref } from "vue";
import { BaRadioData } from "./BaPlayerSetting";

const props = defineProps<{
  data: BaRadioData;
}>();
</script>

<template>
  <div class="ba-radio">
    <div>
      {{ data.tip }}
    </div>
    <template
      v-for="(option, index) in props.data.options"
      :key="option.id + index"
    >
      <input
        type="radio"
        :name="props.data.name"
        :value="option.value"
        :id="option.id"
      />
      <label :for="option.id">{{ option.label }}</label>
    </template>
  </div>
</template>

<style scoped lang="scss"></style>
