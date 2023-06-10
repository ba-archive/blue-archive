import { CharacterInstance, StoryUnit } from "./common";
import { ShowOption, ShowText } from "./events";
import {
  BGEffectExcelTableItem,
  BGEffectType,
  BGMExcelTableItem,
  BGNameExcelTableItem,
  CharacterNameExcelTableItem,
  TransitionTableItem,
} from "./excels";
import { IL2dConfig } from "./l2d";
import { OtherSounds } from "./resources";
import { Application, Sprite } from "pixi.js";
import { Ref } from "vue";

export type Language = "Cn" | "Jp" | "En" | "Tw";

/**
 * 仅可通过函数修改的state
 */
export interface PrivateStates {
  /**
   * pixi.js app实例
   */
  app: Application | null;
  /**
   * 后端资源前缀
   */
  dataUrl: string;
  /**
   * 用户名, 如xx老师
   */
  userName: string;
  language: Language;
  /**
   * 当前故事, 由一个个单元结合而成
   */
  allStoryUnit: StoryUnit[];
  /**
   * 用于查找l2d spinedata
   */
  l2dSpineUrl: string;
  /** 当前剧情下的 l2d 特殊播放配置 */
  curL2dConfig: null | IL2dConfig[keyof IL2dConfig];

  /**
   * 译者信息, 仅在无title且无place的情况下有值
   */
  translator: string;

  //背景层
  /**
   * 背景实例
   */
  bgInstance: null | Sprite;

  //文字层
  /**
   * 已经展示过的语句的集合, 用于ui层显示日志
   */
  logText: Ref<LogText[]>;
  /**
   * 故事简要概述
   */
  storySummary: StorySummary;

  //资源管理
  /**
   * 根据BGName获取资源信息, 包括l2d和背景图片
   */
  BGNameExcelTable: Map<number, BGNameExcelTableItem>;
  /**
   * 根据CharacterName获取角色name和nickName(名字与所属)
   */
  CharacterNameExcelTable: Map<number, CharacterNameExcelTableItem>;
  /**
   * 获取BGEffect
   */
  BGEffectExcelTable: Map<number, BGEffectExcelTableItem>;

  /**
   * 根据bgm id获取bgm资源信息
   */
  BGMExcelTable: Map<number, BGMExcelTableItem>;
  /**
   * 根据transition标识获取transition相关信息
   */
  TransitionExcelTable: Map<number, TransitionTableItem>;
  /**
   * 根据emotionName获取对于英文名
   */
  EmotionExcelTable: Map<number, string>;
  /**
   * 根据emotion名获取emotion图片信息
   */
  emotionResourcesTable: Map<string, string[]>;
  fxImageTable: Map<string, string[]>;
  bgEffectImgMap: Map<string, string[]>;
}

/**
 * 可直接修改的state
 */
export interface PublicStates {
  /**
   * 人物层用于保存所有已创建的spine数据的map
   *
   * 注意, CharacterName只能唯一确定一个spine对象, 但是不能确定一个显示在player上的spine
   *
   * 在存在量产杂鱼的情况下, 需要结合initPosition来确定
   */
  currentCharacterMap: Map<number, CharacterInstance[]>;
}

export interface BasicGetters {
  app: Application;

  /**
   * 获取角色spineData
   */
  characterSpineData: (
    CharacterName: number
  ) => import("@pixi-spine/base").ISkeletonData | undefined;
  /**
   * 获取情绪图像资源
   * @param emotionName 情绪名
   * @returns 情绪资源图片url数组, 按从底而上, 从左到右排列
   */
  emotionResources: (emotionName: string) => string[] | undefined;
  /**
   * 获取fx特效图像资源
   * @param fxName
   * @returns 图像资源url数组
   */
  fxImages: (fxName: string) => string[] | undefined;

  emotionSoundUrl: (emotionName: string) => string;
  /**
   * 获取其他特效音url
   * @param type 特效音类型, 如select
   * @returns
   */
  otherSoundUrl: (type: OtherSounds) => string;
  bgEffectSoundUrl: (bgEffect: BGEffectType) => string;
  /**
   * 获取L2D资源
   */
  l2dSpineData: import("@pixi-spine/base").ISkeletonData | undefined;
}

export type GetterFunctions = {
  [Getter in keyof BasicGetters]: () => BasicGetters[Getter];
};
export type Getters = Readonly<BasicGetters>;

export interface Actions {
  setBgInstance: (sprite: Sprite) => void;
  /**
   * 更新logText的值, 即已经显示过的文字和选项
   * @param newLog 新加入log的值, 可为对话或选项
   * @returns
   */
  updateLogText: (newLog: ShowText | ShowOption) => void;
  /**
   * 设置l2d的spine数据地址便于l2d层获取spinedata
   * @param url
   * @returns
   */
  setL2DSpineUrl: (url: string) => void;
  /**
   *  设置当前l2d特殊配置
   * @param val l2dConfig
   * @returns
   */
  setL2DConfig: (val: IL2dConfig[keyof IL2dConfig]) => void;

  /**
   * 设置译者信息, 仅在无title且无place的情况下调用
   * @param translator
   */
  setTranslator(translator: string): void;
}

export interface LogText {
  /**
   * user: 用户选项
   * character: 人物对话, 有头像
   * none: 无所属对话, 此时name不存在
   */
  type: "user" | "character" | "none";
  text: string;
  /**
   * 人物名
   */
  name?: string;
  /**
   * 头像地址
   */
  avatarUrl?: string;
  /** storyUnit 位置 */
  index?: number;
}

export interface StorySummary {
  /**
   * 章节名
   */
  chapterName: string;
  /**
   * 简介
   */
  summary: string;
}
