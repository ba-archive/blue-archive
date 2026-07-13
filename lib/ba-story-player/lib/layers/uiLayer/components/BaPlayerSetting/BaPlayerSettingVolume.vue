<script lang="ts" setup>
import { inject, nextTick, reactive, ref } from "vue";
import { ElCheckbox } from "element-plus";
import { useUiState } from "@/stores/state";
import { Language } from "@/types/store";
import { getUiI18n } from "../../utils";
import BaSliderBar from "./BaSliderBar.vue";
import { MasterVolumeSetting, VolumeSetting } from "./settings";
import type { BaSliderData } from "./BaPlayerSetting";

defineOptions({
  name: "BaPlayerSettingVolume",
});

type VolumeKey =
  | "masterVolume"
  | "bgmVolume"
  | "sfxVolume"
  | "voiceVolume";
type ChannelKey = "bgmVolume" | "sfxVolume" | "voiceVolume";

const language = inject<Language>("language", "Cn");
const state = useUiState();
const volume = state.volume;
const lastVolume = reactive({
  masterVolume: volume.value.masterVolume || 1,
  bgmVolume: volume.value.bgmVolume || 1,
  sfxVolume: volume.value.sfxVolume || 1,
  voiceVolume: volume.value.voiceVolume || 1,
});

const channelRows: { key: ChannelKey; data: BaSliderData }[] = [
  { key: "bgmVolume", data: VolumeSetting[0] },
  { key: "sfxVolume", data: VolumeSetting[1] },
  { key: "voiceVolume", data: VolumeSetting[2] },
];

const showMaster = ref(true);
const showChannel = reactive<Record<ChannelKey, boolean>>({
  bgmVolume: true,
  sfxVolume: true,
  voiceVolume: true,
});

function setMuted(key: VolumeKey, muted: boolean) {
  if (muted) {
    if (volume.value[key] > 0) {
      lastVolume[key] = volume.value[key];
    }
    Reflect.set(volume.value, key, 0);
  } else {
    Reflect.set(volume.value, key, lastVolume[key] || 1);
  }
  remount(key);
}
function onVolumeUpdate(key: VolumeKey, value: number) {
  Reflect.set(volume.value, key, value);
  if (value > 0) {
    lastVolume[key] = value;
  }
}
function remount(key: VolumeKey) {
  if (key === "masterVolume") {
    showMaster.value = false;
    nextTick(() => {
      showMaster.value = true;
    });
    return;
  }
  showChannel[key] = false;
  nextTick(() => {
    showChannel[key] = true;
  });
}
</script>
<template>
  <div class="volume-panel">
    <div class="volume-block">
      <BaSliderBar
        v-if="showMaster"
        :data="MasterVolumeSetting"
        unit="%"
        :value="volume.masterVolume"
        @update:value="onVolumeUpdate('masterVolume', $event)"
      >
        <template #prefix>
          <img
            src="../../assets/volume_mute.png"
            draggable="false"
            class="volume-img"
            alt=""
          />
        </template>
        <template #suffix>
          <img
            src="../../assets/volume_full.png"
            class="volume-img"
            alt=""
            draggable="false"
          />
        </template>
        <template #mute>
          <ElCheckbox
            class="mute-check"
            :model-value="volume.masterVolume === 0"
            @update:model-value="
              setMuted('masterVolume', $event as boolean)
            "
          >
            {{ getUiI18n("volume-mute", language) }}
          </ElCheckbox>
        </template>
      </BaSliderBar>
    </div>

    <div class="volume-list">
      <template v-for="row in channelRows" :key="row.key">
        <BaSliderBar
          v-if="showChannel[row.key]"
          :data="row.data"
          unit="%"
          :value="volume[row.key]"
          @update:value="onVolumeUpdate(row.key, $event)"
        >
          <template #prefix>
            <img
              src="../../assets/volume_mute.png"
              draggable="false"
              class="volume-img"
              alt=""
            />
          </template>
          <template #suffix>
            <img
              src="../../assets/volume_full.png"
              class="volume-img"
              alt=""
              draggable="false"
            />
          </template>
          <template #mute>
            <ElCheckbox
              class="mute-check"
              :model-value="volume[row.key] === 0"
              @update:model-value="setMuted(row.key, $event as boolean)"
            >
              {{ getUiI18n("volume-mute", language) }}
            </ElCheckbox>
          </template>
        </BaSliderBar>
      </template>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.volume-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.volume-block,
.volume-list {
  border-radius: 3px;
  background: white;
  overflow: hidden;
}
.volume-list {
  :deep(.ba-slider + .ba-slider) {
    position: relative;
    &::before {
      position: absolute;
      top: 0;
      right: 16px;
      left: 16px;
      background: #e6e6e6;
      height: 1px;
      content: "";
    }
  }
}
.volume-img {
  display: block;
  pointer-events: none;
  height: 20px;
}
.mute-check {
  display: inline-flex;
  flex-direction: row-reverse;
  align-items: center;
  height: auto;
  margin-right: 0;
  :deep(.el-checkbox__label) {
    padding-right: 6px;
    padding-left: 0;
    color: #4a5568;
    font-size: 14px;
    line-height: 24px;
    white-space: nowrap;
  }
}
</style>
