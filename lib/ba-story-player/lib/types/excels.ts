/* eslint-disable sort-exports/sort-exports */
export interface BGEffectExcelTableItem {
  Name: number;
  Effect: BGEffectType;
  Scroll: "None" | "Vertical" | "Horizontal";
  ScrollTime: number;
  ScrollFrom: number;
  ScrollTo: number;
}

export type BGEffectType = string;

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
