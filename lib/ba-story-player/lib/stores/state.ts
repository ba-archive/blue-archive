import { ref } from "vue";
import { UiState } from "@/types/state";
import { watchDebounced } from "@vueuse/core";

const VolumeKey = "volume";
const PlayingSettingKey = "player";

const saveVolume = JSON.parse(localStorage.getItem(VolumeKey) || "{}");
const savePlayingSetting = JSON.parse(localStorage.getItem(PlayingSettingKey) || "{}");

const UiState: UiState = {
  autoMode: ref(false),
  tabActivated: ref(false),
  volume: ref({
    bgmVolume: saveVolume.bgmVolume || 0.3,
    sfxVolume: saveVolume.sfxVolume || 1,
    voiceVolume: saveVolume.voiceVolume || 1,
  }),
  playing: ref({
    typingSpeed: savePlayingSetting.typingSpeed || 40,
  }),
};

watchDebounced(() => UiState.volume.value, (cur) => {
  localStorage.setItem(VolumeKey, JSON.stringify(cur));
}, { debounce: 1000, deep: true });
watchDebounced(() => UiState.playing.value, (cur) => {
  localStorage.setItem(PlayingSettingKey, JSON.stringify(cur));
}, { debounce: 1000, deep: true });

export function useUiState() {
  return UiState;
}