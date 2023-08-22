<script setup lang="ts">
import BaSliderBar from "./BaSliderBar.vue";
import { VolumeSetting } from "./settings";
</script>

<template>
  <div id="ba-player-setting">
    <BaSliderBar :data="VolumeSetting[0]" unit="%" />
  </div>
</template>

<style scoped lang="scss"></style>
