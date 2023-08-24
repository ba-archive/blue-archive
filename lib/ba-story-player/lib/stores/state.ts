import { ref } from "vue";
import { UiState } from "@/types/state";
import { watchDebounced } from "@vueuse/core";

const VolumeKey = "volume";

const saveVolume = JSON.parse(localStorage.getItem(VolumeKey) || "{}");

const UiState: UiState = {
  autoMode: ref(false),
  tabActivated: ref(false),
  volume: ref({
    bgmVolume: saveVolume.bgmVolume || 0.3,
    sfxVolume: saveVolume.sfxVolume || 1,
    voiceVolume: saveVolume.voiceVolume || 1,
  }),
};

watchDebounced(() => UiState.volume.value, (cur) => {
  localStorage.setItem(VolumeKey, JSON.stringify(cur));
}, { debounce: 1000, deep: true });

export function useUiState() {
  return UiState;
}