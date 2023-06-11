import { Sprite } from "pixi.js";
import { BGEffectExcelTableItem, BGEffectType } from "./excels";

export type BGEffectImgTable = Record<BGEffectType, string[]>;

export type EffectRemoveFunction = () => Promise<void>;

export type CurrentBGEffect =
  | {
      effect: BGEffectType;
      removeFunction: EffectRemoveFunction;
      resources: Sprite[];
    }
  | undefined;

export interface BGEffectHandlerOptions {
  BG_FocusLine: {};
  "": {};
  "BG_ScrollT_0.5": {};
  BG_Filter_Red: {};
  BG_Wave_F: {};
  BG_Flash: {};
  BG_UnderFire_R: {};
  BG_Love_L: {};
  "BG_ScrollB_0.5": {};
  BG_Rain_L: {
    frequency: number;
  };
  BG_UnderFire: {};
  BG_WaveShort_F: {};
  BG_SandStorm_L: {};
  "BG_ScrollT_1.5": {};
  BG_Shining_L: {};
  "BG_ScrollB_1.0": {};
  BG_Love_L_BGOff: {};
  BG_Dust_L: {};
  "BG_ScrollL_0.5": {};
  "BG_ScrollL_1.0": {};
  BG_Ash_Black: {};
  BG_Mist_L: {};
  BG_Flash_Sound: {};
  "BG_ScrollL_1.5": {};
  "BG_ScrollR_1.5": {};
  BG_Shining_L_BGOff: {};
  "BG_ScrollT_1.0": {};
  "BG_ScrollB_1.5": {};
  BG_Filter_Red_BG: {};
  BG_Ash_Red: {};
  BG_Fireworks_L_BGOff_02: {};
  "BG_ScrollR_0.5": {};
  BG_Snow_L: {};
  BG_Fireworks_L_BGOff_01: {};
  "BG_ScrollR_1.0": {};
}

/**
 * BGEffect处理函数
 */
export type BGEffectHandlerFunction<type extends BGEffectType> = (
  resources: Sprite[],
  setting: BGEffectExcelTableItem,
  options: BGEffectHandlerOptions[type]
) => Promise<EffectRemoveFunction>;

/**
 * 类型与处理函数的对应
 */
export type BGEffectHandlers = {
  [key in BGEffectType]: BGEffectHandlerFunction<key>;
};
