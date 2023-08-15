import { Sprite } from "pixi.js";
import type { IAnimationStateListener, ISkeletonData, Spine } from "pixi-spine";
import { Character, CharacterInstance } from "@/types/common";
import { ShowCharacter } from "@/types/events";

export interface ActionOptions extends BaseOptions<CharacterEffectWord> {
  a: {};
  d: {
    duration: number;
  };
  dl: {
    speed: number;
  };
  dr: {
    speed: number;
  };
  ar: {
    speed: number;
  };
  al: {
    speed: number;
  };
  hophop: {
    yOffset: number;
    duration: number;
  };
  greeting: {
    yOffset: number;
    duration: number;
  };
  shake: {
    shakeAnimation: {
      from: number;
      to: number;
      duration: number;
      repeat: number;
    };
  };
  m1: {};
  m2: {};
  m3: {};
  m4: {};
  m5: {};
  stiff: {
    shakeAnimation: {
      from: number;
      to: number;
      duration: number;
      repeat: number;
    };
  };
  closeup: {
    scale: number;
  };
  jump: {
    yOffset: number;
    duration: number;
  };
  falldownR: {
    anchor: PositionOffset;
    rightAngle: number;
    leftAngle: number;
    firstRotateDuration: number;
    leftRotationPercent: number;
    falldownDuration: number;
    xOffset: number;
  };
  falldownL: {
    anchor: PositionOffset;
    rightAngle: number;
    leftAngle: number;
    firstRotateDuration: number;
    leftRotationPercent: number;
    falldownDuration: number;
    xOffset: number;
  };
  hide: {};
}
/**
 * 所有角色特效统一接口
 */
export type BaseCharacterEffectPlayer<T extends EffectsWord> =
  CharacterEffectPlayerInterface<T> & EffectFunction<T>;
export type BaseOptions<T extends string> = Record<T, Record<string, any>>;
/**
 * 情绪动作的具体参数
 */
export interface BasicEmotionOptions extends BaseOptions<EmotionWord> {
  Heart: {
    heartImg: {
      scale: number;
      position: PositionOffset;
    };
    jumpAnimation: {
      firstScale: Scale;
      secondScale: Scale;
      duration: number;
    };
  };
  Respond: {
    flashAnimation: {
      alpha: number;
      duration: number;
    };
    perImgSetting: {
      angle: number;
      scale: number;
      anchor: PositionOffset;
    }[];
  };
  Music: {
    rotateAngle: number;
    animation: {
      offset: PositionOffset;
      duration: number;
    };
  };
  Twinkle: {
    starImgs: {
      pos: PositionOffset[];
      scale: number[];
    };
    fadeInDuration: number;
    flashAnimation: {
      scales: number[];
      duration: number[];
      totalDuration: number;
    };
  };
  Sad: {
    imageGap: number;
    moveYDistance: number;
    imgInitYPosition: [number, number, number];
  };
  Sweat: {
    smallImg: {
      scale: number;
      offset: {
        x: number;
        y: number;
      };
      dropAnimationOffset: number;
    };
    dropAnimation: {
      yOffset: number;
      duration: number;
    };
  };
  Dot: {
    dotContainerPos: PositionOffset;
    dotPos: number[];
    showAnimation: {
      showDelay: number;
      alpahaDuration: number;
    };
  };
  Chat: {
    rotateAngle: number;
    rotateTime: number;
    rotatePivot: {
      x: number;
      y: number;
    };
  };
  Exclaim: {
    scaleAnimation: {
      scale: number;
      scaleDuration: number;
      recoverScale: number;
      recoverDuration: number;
    };
    fadeOutWaitTime: number;
  };
  Angry: {
    pivotPosition: {
      x: number;
      y: number;
    };
    animationScale: {
      scale: number;
      duration: number;
    };
    endScale: {
      scale: number;
      duration: number;
    };
  };
  Surprise: {
    imgSetting: {
      angles: number[];
      questionImgPos: PositionOffset;
    };
    scaleAnimation: {
      startScale: number;
      questionImgYScale: number;
      duration: number;
      anchor: PositionOffset;
    };
    jumpAnimation: {
      xOffset: number;
      jumpYOffset: number;
      duration: number;
    };
  };
  Question: {
    scaleAnimation: {
      scale: number;
      anchor: PositionOffset;
      scaleDuration: number;
      recoverScale: number;
      recoverDuration: number;
    };
  };
  Shy: {
    shyImg: {
      anchor: PositionOffset;
      scale: number;
      position: PositionOffset;
    };
    scaleAnamation: {
      anchor: PositionOffset;
      startScale: number;
      duration: number;
    };
    shakeAnimation: {
      angleFrom: number;
      angleTo: number;
      duration: number;
      times: number;
    };
  };
  Upset: {
    upsetImgPos: PositionOffset;
    rotateAnimation: {
      angleFrom: number;
      angleTo: number;
      duration: number;
    };
    yScaleAnimation: {
      scale: number;
      duration: number;
    };
    animationTotalDuration: number;
  };
  Steam: {
    imgAngles: [number, number];
    imgPivot: PositionOffset;
    imgScaleAnimation: {
      start: number;
      end: number;
    }[];
  };
  Sigh: {
    angle: number;
    scaleAnimation: { start: number; end: number };
    anchor: PositionOffset;
  };
  Bulb: {
    dialogScaleAnimation: ScaleAnimation;
    bulbYPosition: number;
    lightYPosition: number;
    lightScale: number;
  };
  Tear: {
    positions: PositionOffset[];
    scaleAnimations: ScaleAnimation[];
    anchors: PositionOffset[];
  };
  Zzz: {
    zImageSettings: {
      position: PositionOffset;
      scale: number;
      rotate: number;
    }[];
  };
}
/**
 * CharacterEmotionPlayer使用, 提供角色spine与施加在其身上的所有特效
 */
export interface CharacterEffectInstance extends Character {
  instance: Spine;
  isCloseUp: () => boolean;
}
/**
 * 人物特效处理
 */
export interface CharacterEffectPlayer
  extends BaseCharacterEffectPlayer<CharacterEffectWord> {
  /**
   * 获取特效处理函数
   * @param type 人物特效类型
   */
  getHandlerFunction(type: CharacterEffectWord): EffectFunctionUnit;
}
/**
 * 所有角色特效基础接口
 */
export interface CharacterEffectPlayerInterface<
  T extends EmotionWord | CharacterEffectWord | FXEffectWord
> {
  /**
   * 初始化函数, player初始化时调用
   */
  init(): void;
  /**
   * 播放对应特效
   */
  processEffect(type: T, instance: CharacterEffectInstance): Promise<void>;
  /**
   * 销毁函数, player退出时调用, 取消对事件总线的监听
   */
  dispose(): void;
}
/**
 * 人物特效定义
 */
export type CharacterEffectWord =
  | "a"
  | "d"
  | "dl"
  | "dr"
  | "ar"
  | "al"
  | "hophop"
  | "greeting"
  | "shake"
  | "m1"
  | "m2"
  | "m3"
  | "m4"
  | "m5"
  | "stiff"
  | "closeup"
  | "jump"
  | "falldownR"
  | "falldownL"
  | "hide";
type Options = EmotionOptions & ActionOptions & FXOptions;
type EffectFunctionUnit = (
  instance: CharacterEffectInstance,
  options: any,
  sprites: Sprite[]
) => Promise<void> | undefined;
/**
 * 对话特效处理
 */
export interface CharacterEmotionPlayer
  extends BaseCharacterEffectPlayer<EmotionWord> {
  /**
   * 获取特效处理函数
   * @param type 角色特效类型
   */
  getHandlerFunction(type: EmotionWord): EffectFunctionUnit;
}
type DescriptionUnit<T> = {
  [key in keyof T]: {
    [option in keyof T[key]]: string;
  };
};
/**
 * 人物fx特效处理
 */
export interface CharacterFXPlayer
  extends BaseCharacterEffectPlayer<FXEffectWord> {
  /**
   * 获取特效处理函数
   * @param type 人物特效类型
   */
  getHandlerFunction(type: FXEffectWord): EffectFunctionUnit;
}
/**
 * 角色层定义
 */
export interface CharacterLayer {
  /**
   * 初始化函数, player初始化时调用, 向事件总线注册事件处理函数
   * @return 初始化成功: true, 初始化失败: false
   */
  init(): boolean;
  /**
   * 销毁函数, player退出时调用, 取消对事件总线的监听
   */
  dispose(): void;
  /**
   * 判断当前显示在player中的角色sprite/spine是否有给定的characterNumber对应的角色
   * @param characterNumber 要判断的角色
   * @param initPosition nx脚本里spine的初始位置
   * @return 具有对应的角色: true
   */
  hasCharacterInstance(characterNumber: number, initPosition: number): boolean;
  /**
   * 根据给定的characterNumber获取对应的角色实例
   * @param characterNumber  要获取的角色
   * @param initPosition nx脚本里spine的初始位置
   * @return 创建好的实例, 不存在时undefined
   */
  getCharacterInstance(
    characterNumber: number,
    initPosition: number
  ): CharacterInstance | undefined;
  /**
   * 根据给定的characterNumber获取对应的角色spine实例
   * @param characterNumber  要获取的角色
   * @param initPosition nx脚本里spine的初始位置
   * @return 创建好的spine实例, 不存在时undefined
   */
  getCharacterSpineInstance(
    characterNumber: number,
    initPosition: number
  ): Spine | undefined;
  /**
   * 主处理函数, 作为事件监听器监听事件总线中的"showCharacter"事件并完成角色层的工作
   * @param data 要处理的数据
   * @return 事件响应成功: true
   */
  showCharacter(data: ShowCharacter): boolean;
  /**
   * 单独一个角色的处理函数, 接收showCharacter方法传入的单个信息并作处理, 返回Promise用以标识全部处理完毕
   * @param data 要处理的数据
   * @return resolve :该角色的特效全部处理完毕
   */
  showOneCharacter(data: CharacterEffectInstance): Promise<void>;
  /**
   * 隐藏当前所有角色
   */
  hideCharacter(): void;
  /**
   * 所有人物特效已处理完成时调用, 向总线发送characterDone事件
   */
  characterDone(): void;
  /**
   * 从打包好的spine数据中创建pixi-spine对象
   * @param character 要创建的角色的character信息
   * @param spineData 打包好的spine数据
   * @return 创建出的pixi-spine对象
   */
  createSpineFromSpineData(
    character: Character,
    spineData: ISkeletonData
  ): Spine;
  /**
   * 执行showCharacter函数时检查所需资源是否已经创建, 若没有创建则调用createSpineFromSpineData进行创建
   * @param characterMap 需要处理的资源
   * @return 创建过程顺利: true
   */
  beforeProcessShowCharacterAction(characterMap: Character[]): boolean;
  /**
   * 为特效层构建特效操作实例
   * @param row 传递给showCharacter的原始数据
   */
  buildCharacterEffectInstance(row: ShowCharacter): CharacterEffectInstance[];
  /**
   * 将角色spine放到app的stage中, 并修改对应的状态
   * @param characterNumber 要放置的角色的characterNumber
   * @return 放置成功: true
   */
  putCharacterOnStage(character: Character): boolean;
  /**
   * document resize事件监听器, 在大小变换时同时修改所有spine/sprite的缩放比列
   */
  onWindowResize(): void;
}
export type EffectFunction<T extends EffectsWord> = {
  [key in T]: (
    instance: CharacterEffectInstance,
    options: Options[key],
    sprites: Sprite[]
  ) => Promise<void>;
};
export type EffectsWord = EmotionWord | CharacterEffectWord | FXEffectWord;
export type EmotionOptions = {
  [Option in keyof BasicEmotionOptions]: BasicEmotionOptions[Option] &
    GlobalEmotionOptions;
};
/**
 * 对话特效定义
 */
export type EmotionWord =
  | "Heart"
  | "Respond"
  | "Music"
  | "Twinkle"
  | "Sad"
  | "Sweat"
  | "Dot"
  | "Chat"
  | "Exclaim"
  | "Angry"
  | "Surprise"
  | "Question"
  | "Shy"
  | "Upset"
  | "Steam"
  | "Sigh"
  | "Bulb"
  | "Tear"
  | "Zzz";
/**
 * fx特效定义
 */
export type FXEffectWord = "shot";
export interface FXOptions extends BaseOptions<FXEffectWord> {
  shot: {
    scale: number;
    shotDuration: number;
    shotSequence: {
      startImg: number;
      endImg?: number;
      endRed: boolean;
      pos: PositionOffset;
      scale: number;
      angle: number;
    }[];
  };
}
/**
 * emotion情绪动画共有的参数
 */
export interface GlobalEmotionOptions {
  startPositionOffset: { x: number; y: number };
  scale: number;
  fadeOutPreDuration?: number;
  fadeOutDuration: number;
}
export interface ILoopAnimationStateListener extends IAnimationStateListener {
  key: string;
}
export type OptionDescriptions = {
  emotion: {
    globalOptions: {
      [key in keyof GlobalEmotionOptions]: string;
    };
  } & DescriptionUnit<BasicEmotionOptions>;
  action: DescriptionUnit<ActionOptions>;
  fx: DescriptionUnit<FXOptions>;
};
/**
 * 位置标识
 */
export interface PositionOffset {
  x: number;
  y: number;
}
/**
 * 在x, y方向各自的缩放
 */
export interface Scale {
  x: number;
  y: number;
}
export type ScaleAnimation = {
  start: number;
  end: number;
};
/**
 * signal特效定义
 */
export type SignalEffectWord = "signal";
export type SignalOptions = BaseOptions<SignalEffectWord>;
