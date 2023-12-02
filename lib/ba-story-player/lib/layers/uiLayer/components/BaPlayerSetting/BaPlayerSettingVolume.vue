<script lang="ts" setup>
import { nextTick, ref } from "vue";
import { useUiState } from "@/stores/state";
import BaSliderBar from "./BaSliderBar.vue";
import { VolumeSetting } from "./settings";

defineOptions({
  name: "BaPlayerSettingVolume",
});
const state = useUiState();
const volume = state.volume;
function fullVolume(key: string, index: number) {
  Reflect.set(volume.value, key, 1);
  updateValue(index);
}
function mute(key: string, index: number) {
  Reflect.set(volume.value, key, 0);
  updateValue(index);
}
function updateValue(index: number) {
  update[index].value = false;
  nextTick(() => {
    update[index].value = true;
  });
}
const u0 = ref(true);
const u1 = ref(true);
const u2 = ref(true);
const update = [u0, u1, u2];
</script>
<template>
  <BaSliderBar
    :data="VolumeSetting[0]"
    unit="%"
    v-model:value="volume.bgmVolume"
    v-if="u0"
  >
    <template #prefix>
      <img
        src="../../assets/volume_mute.png"
        draggable="false"
        class="volume-img"
        alt=""
        @click="mute('bgmVolume', 0)"
      />
    </template>
    <template #suffix>
      <img
        src="../../assets/volume_full.png"
        class="volume-img volume-img-right"
        alt=""
        draggable="false"
        @click="fullVolume('bgmVolume', 0)"
      />
    </template>
  </BaSliderBar>
  <BaSliderBar
    :data="VolumeSetting[1]"
    unit="%"
    v-model:value="volume.sfxVolume"
    v-if="u1"
  >
    <template #prefix>
      <img
        src="../../assets/volume_mute.png"
        draggable="false"
        class="volume-img"
        alt=""
        @click="mute('sfxVolume', 1)"
      />
    </template>
    <template #suffix>
      <img
        src="../../assets/volume_full.png"
        class="volume-img volume-img-right"
        alt=""
        draggable="false"
        @click="fullVolume('sfxVolume', 1)"
      />
    </template>
  </BaSliderBar>
  <BaSliderBar
    :data="VolumeSetting[2]"
    unit="%"
    v-model:value="volume.voiceVolume"
    v-if="u2"
  >
    <template #prefix>
      <img
        src="../../assets/volume_mute.png"
        draggable="false"
        class="volume-img"
        alt=""
        @click="mute('voiceVolume', 2)"
      />
    </template>
    <template #suffix>
      <img
        src="../../assets/volume_full.png"
        class="volume-img volume-img-right"
        alt=""
        draggable="false"
        @click="fullVolume('voiceVolume', 2)"
      />
    </template>
  </BaSliderBar>
</template>
<style lang="scss" scoped>
.volume-img {
  vertical-align: middle;
  transform: translateY(-1.5px);
  cursor: pointer;
  height: 24px;
}
.volume-img-right {
  transform: translateY(-2px);
}
</style>
