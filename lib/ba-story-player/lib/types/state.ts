import { ComputedRef, Ref } from "vue";

type Volume = {
  bgmVolume: number; // bgm音量大小
  sfxVolume: number; // sfx音量大小
  voiceVolume: number; // 语音音量大小
}

type RawUiState = {
  autoMode: boolean; // 是否是自动播放模式
  tabActivated: boolean; // 标签页是否处于活动状态,目前用于hack pixi-sound的bgm重合bug
  volume: Volume;
}

type ToRefState<T> = {
  [key in keyof T]: Ref<T[key]>;
}

type ToComputedRefRefState<T> = {
  [key in keyof T]: ComputedRef<T[key]>;
}

export type UiState = ToRefState<RawUiState>
