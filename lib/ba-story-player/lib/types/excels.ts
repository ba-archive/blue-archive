/* eslint-disable sort-exports/sort-exports */
export interface BGEffectExcelTableItem {
  Name: number;
  Effect: BGEffectType;
  Scroll: "None" | "Vertical" | "Horizontal";
  ScrollTime: number;
  ScrollFrom: number;
  ScrollTo: number;
}

export type BGEffectType =
  | "BG_ScrollT_0.5"
  | "BG_Filter_Red"
  | "BG_Wave_F"
  | "BG_Flash"
  | "BG_UnderFire_R"
  | "BG_Love_L"
  | "BG_ScrollB_0.5"
  | "BG_Rain_L"
  | "BG_UnderFire"
  | "BG_WaveShort_F"
  | "BG_SandStorm_L"
  | ""
  | "BG_ScrollT_1.5"
  | "BG_Shining_L"
  | "BG_ScrollB_1.0"
  | "BG_Love_L_BGOff"
  | "BG_Dust_L"
  | "BG_ScrollL_0.5"
  | "BG_ScrollL_1.0"
  | "BG_Ash_Black"
  | "BG_Mist_L"
  | "BG_Flash_Sound"
  | "BG_ScrollL_1.5"
  | "BG_FocusLine"
  | "BG_ScrollR_1.5"
  | "BG_Shining_L_BGOff"
  | "BG_ScrollT_1.0"
  | "BG_ScrollB_1.5"
  | "BG_Filter_Red_BG"
  | "BG_Ash_Red"
  | "BG_Fireworks_L_BGOff_02"
  | "BG_ScrollR_0.5"
  | "BG_Snow_L"
  | "BG_Fireworks_L_BGOff_01"
  | "BG_ScrollR_1.0";

export enum Nation {
  None = 0,
  All = 1,
  JP = 2,
  GL = 3,
  KR = 4,
}

export interface BGMExcelTableItem {
  Id: number;
  Nation?: Nation[];
  Path?: string[] | string;
  Volume?: number[] | number;
  LoopStartTime?: number[] | number;
  LoopEndTime?: number[] | number;
  LoopTranstionTime?: number[] | number;
  LoopOffsetTime?: number[] | number;
}

export interface BGNameExcelTableItem {
  Name: number;
  ProductionStep: string;
  BGFileName: string;
  BGType: "Spine" | "Image";
  AnimationRoot: string;
  AnimationName: string;
  SpineScale: number;
  SpineLocalPosX: number;
  SpineLocalPosY: number;
}

export interface CharacterNameExcelTableItem {
  CharacterName: number;
  ProductionStep: string;
  NameKR: string;
  NameJP: string;
  NameCN?: string;
  NameEN?: string;
  NameTW?: string;
  NameTH?: string;
  NicknameKR: string;
  NicknameJP: string;
  NicknameCN?: string;
  NicknameEN?: string;
  NicknameTW?: string;
  NicknameTH?: string;
  Shape: string;
  SpinePrefabName: string;
  SmallPortrait: string;
}

export interface TransitionTableItem {
  Name: number;
  TransitionOut: TransitionTypes;
  TransitionOutDuration: number;
  TransitionOutResource: null | string;
  TransitionIn: TransitionTypes;
  TransitionInDuration: number;
  TransitionInResource: null | string;
}

export type TransitionTypes = "bgoverlap" | "fade" | "fade_white" | string;
