import { ComputedRef, Ref } from "vue";

type RawUiState = {
  autoMode: boolean; // 是否是自动播放模式
  tabActivated: boolean; // 标签页是否处于活动状态,目前用于hack pixi-sound的bgm重合bug
}

type ToRefState<T> = {
  [key in keyof T]: Ref<T[key]>;
}

type ToComputedRefRefState<T> = {
  [key in keyof T]: ComputedRef<T[key]>;
}

export type UiState = ToRefState<RawUiState>
