import { PlayOptions } from "@pixi/sound";
import { Character, Effect, Speaker, Text } from "./common";
import {
  BGEffectExcelTableItem,
  BGEffectType,
  BGMExcelTableItem,
  TransitionTableItem,
} from "./excels";
import { OtherSounds } from "./resources";

export interface BgParams {
  /**
   * 背景图片 url
   */
  url: string;
  /**
   * 以覆盖原来背景的方式显示新背景, 值为渐变时间
   */
  overlap?: number;
}

export type Events = {
  //通用
  /**
   * 清除当前内容
   */
  hide: undefined;
  /**
   * 参数是原来的宽度大小
   */
  resize: number;
  /**
   * 注销
   */
  dispose: undefined;
  /**
   * 暂停
   */
  stop: undefined;
  /**
   * 继续播放bgm
   */
  continue: undefined;

  //特效层

  /**
   * 播放特效
   */
  playEffect: PlayEffect;
  /**
   * 移除当前特效
   */
  removeEffect: undefined;
  effectDone: undefined;
  transitionIn: TransitionTableItem;
  transitionInDone: undefined;
  transitionOut: TransitionTableItem;
  transitionOutDone: undefined;

  //人物层
  /**
   * 展示人物
   */
  showCharacter: ShowCharacter;
  /**
   * 隐藏角色
   */
  hideCharacter: undefined;
  /**
   * 人物已处理完毕
   */
  characterDone: undefined;
  /**
   * l2d 动画播放状态, 当前动画是否播放完成
   */
  l2dAnimationDone: { done: boolean; animation: string };

  //背景层
  /**
   * 展示背景图片
   */
  showBg: BgParams;
  /**
   * bgOverLap已完成
   */
  bgOverLapDone: undefined;

  /**
   * 播放bgm, sound或voiceJP
   */
  playAudio: PlayAudio;
  /**
   * 播放人物情绪动作特效音
   */
  playEmotionAudio: string;
  /**
   * 播放选项选择特效音
   */
  playOtherSounds: OtherSounds;
  playBgEffectSound: BGEffectType;
  /**
   * 播放voiceJP结束提示
   */
  playVoiceJPDone: string;
  /**
   * 根据指定的设置播放sound
   */
  playAudioWithConfig: {
    url: string;
    config: PlayOptions;
  };

  //UI层
  /**
   * 跳过剧情
   */
  skip: undefined;
  /** 按contrl时跳过剧情 */
  skipping: undefined;
  /**
   * 自动模式
   */
  auto: undefined;
  /**
   * 停止自动模式
   */
  stopAuto: undefined;
  /**
   * 隐藏对话框
   */
  hideDialog: undefined;
  hidemenu: undefined;
  showmenu: undefined;
  // 显示历史
  showStoryLog: boolean;
  // 当前历史log是否显示
  isStoryLogShow: boolean;

  //文字层
  /**
   * 展示标题
   */
  showTitle: ShowTitleOption;
  /**
   * 标题展示完成
   */
  titleDone: undefined;
  /**
   * 展示地点
   */
  showPlace: string;
  /**
   * 展示在地点下方的译者信息
   */
  showPlaceTranslator: string;
  /**
   * 显示普通对话框文字
   */
  showText: ShowText;
  /**
   * 显示无对话框文字
   */
  st: StText;
  /**
   * 清除无对话框文字和对话框
   */
  clearSt: undefined;
  /**
   * st动画播放完成
   */
  stDone: undefined;
  /**
   * 对话框内容播放完成
   * **实际上st动画播放完成也会触发**
   */
  textDone: undefined;
  /**
   * 显示选项
   */
  option: ShowOption[];
  /**
   * 进入下一剧情语句
   */
  next: undefined;
  /**
   * 根据选项加入下一剧情语句
   */
  select: number;
  /**
   * 弹出图片, 参数是图片url
   */
  popupImage: string;
  /**
   * 弹出视频, 参数是视频url
   */
  popupVideo: string;
  /**
   * 隐藏popup
   */
  hidePopup: undefined;

  /**
   * 显示未完待续
   */
  toBeContinue: undefined;
  toBeContinueDone: undefined;
  /**
   * 显示下章节
   */
  nextEpisode: ShowTitleOption;
  nextEpisodeDone: undefined;

  //L2D层
  /**
   * 加载L2D
   */
  playL2D: undefined;
  /**
   * 更换动画
   */
  changeAnimation: string;
  /**
   * 结束l2d播放
   */
  endL2D: undefined;

  /**
   * 用户点击
   */
  click: undefined;
  /**
   * 开始播放加载动画
   * @param LoadingImageUrl 资源地址
   */
  startLoading: LoadingImageUrl;
  /**
   * 某个资源加载完成或失败
   */
  oneResourceLoaded: ResourceLoadState;
  /**
   * 所有资源加载完成
   */
  loaded: undefined;
  /**
   * 播放完成
   */
  end: undefined;
};

/**
 * url: 资源地址
 * restrict: 是否唯一 true时只加载url, 否则加载以url为基址的随机loading图片
 */
export type LoadingImageUrl = {
  url: string;
  restrict?: boolean;
}

export interface PlayAudio {
  bgm?: {
    url: string;
    bgmArgs: BGMExcelTableItem;
  };
  soundUrl?: string;
  voiceJPUrl?: string;
}

export interface PlayEffect {
  BGEffect?: BGEffectExcelTableItem;
  otherEffect: Effect[];
}


export type ResourceLoadState = {
  type: "success" | "fail";
  resourceName: string;
}


export interface ShowCharacter {
  /**
   * 角色列表
   */
  characters: Character[];
  /**
   * 角色特效
   */
  // characterEffects: CharacterEffect[]
}


export interface ShowOption {
  /**
   * 剧情原始结构SelectionGroup, 请作为next的参数
   */
  SelectionGroup: number;
  /**
   * 选项文本
   */
  text: Text[];
  /** 当前剧情进度 */
  index: number;
}


export interface ShowText {
  /**
   * 文本
   */
  text: Text[];
  /**
   * 说话的人, 包括名字和所属
   */
  speaker?: Speaker;
  /**
   * 人物头像, 填logText时使用
   */
  avatarUrl?: string;
  /** storyUnit 位置 */
  index?: number;
}


export interface ShowTitleOption {
  title: Text[];
  subtitle?: string;
  translator?: string;
}

/**
 * st特效参数, 第一个为位置, 第二个为显示效果
 */
export type StArgs = [number[], "serial" | "instant" | "smooth", number];

export interface StText {
  /**
   * 文本
   */
  text: Text[];
  /**
   * st的参数, 目前只需要注意第二个参数, serial打字机效果, instant立即全部显示.
   */
  stArgs: StArgs;
  middle: boolean;
}
