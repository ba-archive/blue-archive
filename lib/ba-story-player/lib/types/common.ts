import type { Spine } from "@esotericsoftware/spine-pixi-v7";
import {
  PlayAudio,
  PlayEffect,
  ShowOption,
  ShowText,
  ShowTitleOption,
  StArgs,
} from "./events";
import { TransitionTableItem } from "./excels";
import { Language, StorySummary } from "./store";

export interface Character {
  /**
   * 人物位置
   */
  position: number;
  /**
   * 人物CharacterName, 请通过它获取人物spinedata
   */
  CharacterName: number;
  /**
   * 人物spinedata的url
   */
  spineUrl: string;
  /**
   * 人物表情
   */
  face: string;
  /**
   * 人物是否高亮
   */
  highlight: boolean;
  /**
   * 人物是否是全息投影状态
   */
  signal: boolean;
  /**
   * 人物特效
   */
  effects: CharacterEffect[];
}
export interface CharacterEffect {
  type: CharacterEffectType;
  effect: string;
  async: boolean;
  arg?: string;
}
export type CharacterEffectType = "emotion" | "action" | "fx";
export interface CharacterInstance {
  CharacterName: number;
  /**
   * 角色当前所在位置 1,2,3,4,5
   *
   * 会根据m1m2m3m4m5动态更新
   */
  position: number;
  /**
   * nx脚本里那个初始位置, 永远不会改变
   *
   * 配合CharacterName唯一确定一个spine
   */
  initPosition: number;
  /**
   * 当前人物表情
   *
   * 用来判断是否触发眨眼动画
   */
  currentFace: string;
  /**
   * 眨眼定时器的handler
   */
  winkObject?: WinkObject;
  instance: Spine;
  isShow: () => boolean;
  isOnStage: () => boolean;
  isHeightLight: () => boolean;
}
export type Dict<T> = {
  [key: string]: T;
};
export type Effect =
  | {
      type: "wait";
      /**
       * 单位为ms
       */
      args: number;
    }
  | {
      type: "zmc";
      args: ZmcArgs;
    }
  | {
      type: "bgshake";
    };
export interface Option {
  SelectionGroup: number;
  text: {
    TextJp: string;
    TextCn?: string;
    TextTw?: string;
    TextEn?: string;
  };
}
export type PlayOptions = {
  url: string;
  config: {
    volume: number; // 0 - 1
  };
};
export type PlayerConfigs = PlayerProps & { height: number };
export type PlayerProps = {
  story: TranslatedStoryUnit;
  dataUrl: string;
  width: number;
  height: number;
  language: Language;
  userName: string;
  storySummary: StorySummary;
  startFullScreen?: boolean;
  useMp3?: boolean;
  useSuperSampling?: "2" | "4" | "";
  /** 跳转至传入的 index */
  changeIndex?: number;
};
export interface Speaker {
  /**
   * 人物姓名
   */
  name: string;
  /**
   * 人物所属
   */
  nickName: string;
}
export interface StoryRawUnit {
  GroupId: number;
  SelectionGroup: number;
  BGMId: number;
  Sound: string;
  Transition: number;
  BGName: number;
  BGEffect: number;
  PopupFileName: string;
  ScriptKr: string;
  TextJp: string;
  TextCn?: string;
  TextTw?: string;
  TextEn?: string;
  VoiceJp: string;
}
export type StoryType =
  | "title"
  | "place"
  | "text"
  | "option"
  | "st"
  | "effectOnly"
  | "continue"
  | "nextEpisode";
export interface StoryUnit {
  //rawUnit中的属性
  GroupId: number;
  SelectionGroup: number;
  PopupFileName: string;
  type: StoryType;
  audio?: PlayAudio;
  /**
   * 渐变
   */
  transition?: TransitionTableItem;
  /**
   * 背景图片
   */
  bg?: {
    url: string;
    /**
     * 以覆盖原来背景的方式显示, 值为渐变时间
     */
    overlap?: number;
  };
  l2d?: {
    spineUrl: string;
    animationName: string;
  };
  effect: PlayEffect;
  characters: Character[];
  /**
   * 文字相关的属性, 包括选项, 对话, st文字, 章节名, 人物名
   */
  textAbout: {
    options?: ShowOption[];
    /**
     * 地点, 标题, 章节名, 第一个地点下面的译者信息(如果有)
     */
    titleInfo?: ShowTitleOption;
    /**
     * 显示的对话文字
     */
    showText: ShowText;
    st?: {
      stArgs?: StArgs;
      clearSt?: boolean;
      middle?: boolean;
    };
  };
  fight?: number;
  hide?: "menu" | "all";
  show?: "menu";
  video?: {
    videoPath: string;
    soundPath: string;
  };
}
export interface Text {
  /**
   * 文本
   */
  content: string;
  /**
   * 显示文本前等待的时间
   */
  waitTime?: number;
  /**
   * 文字特效
   */
  effects: TextEffect[];
}

export interface TextEffect {
  name: TextEffectName;
  /**
   * 特效参数
   */
  value: string[];
}
/**
 * 文字特效类型,
 * `color`颜色
 * `fontsize` 字体大小
 * `ruby` 日文注音
 * `log` 大概没啥用
 */
export type TextEffectName =
  | "color"
  | "fontsize"
  | "ruby"
  | "log"
  | "tooltip"
  | "b";
export type TranslatedStoryUnit = {
  GroupId: number;
  translator: string;
  content: StoryRawUnit[];
};
export interface WinkAnimationObject {
  _pause: boolean;
  start(): void;
  pause(): void;
}

export interface WinkObject {
  handler: number;
  animationObject?: WinkAnimationObject;
}

/**
 * zmc参数, 当duration为10时代表是move起始
 */
export type ZmcArgs =
  | {
      type: "move";
      position: [number, number];
      size: number;
      duration: number;
    }
  | {
      type: "instant";
      position: [number, number];
      size: number;
    };
