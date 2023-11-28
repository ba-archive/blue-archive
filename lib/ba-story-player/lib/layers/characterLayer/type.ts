import { Character, HandlerMap, SpineUrls } from "@/type";
import { Spine } from "pixi-spine";
import { Application, Sprite } from "pixi.js";
import { PositionOffset } from ".";

export interface CharacterInstance {
  status: {
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
    currentState: "highlight" | "signal" | "closeup" | null;
    characterSpine: SpineUrls;
    winkObject?: WinkObject;
  };
  instance: Spine;
  isShow: () => boolean;
  isOnStage: () => boolean;
  isHeightLight: () => boolean;
}

export interface WinkObject {
  handler: number;
  animationObject?: WinkAnimationObject;
}

export interface WinkAnimationObject {
  _pause: boolean;
  start(): void;
  pause(): void;
}

export interface CharacterEffectInstance extends Character {
  position: number;
  instance: Spine;
  isCloseUp: () => boolean;
}

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

export type EffectsWord = EmotionWord | CharacterEffectWord | FXEffectWord;

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
  processEffect(
    type: T,
    instance: CharacterEffectInstance,
    app: Application,
    handlerMap: HandlerMap
  ): Promise<void>;
  /**
   * 销毁函数, player退出时调用, 取消对事件总线的监听
   */
  dispose(): void;
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

export type CharacterEffectType = "emotion" | "action" | "fx";

type Options = EmotionOptions & ActionOptions & FXOptions;

export type BaseOptions<T extends string> = Record<T, Record<string, any>>;

type EffectFunctionUnit = (
  instance: CharacterEffectInstance,
  options: any,
  sprites: Sprite[]
) => Promise<void> | undefined;

/**
 * emotion情绪动画共有的参数
 */
export interface GlobalEmotionOptions {
  startPositionOffset: { x: number; y: number };
  scale: number;
  fadeOutPreDuration?: number;
  fadeOutDuration: number;
}

export type EmotionOptions = {
  [Option in keyof BasicEmotionOptions]: BasicEmotionOptions[Option] &
    GlobalEmotionOptions;
};

// 修改{}为NonNullable<unknown>
export interface ActionOptions extends BaseOptions<CharacterEffectWord> {
  a: NonNullable<unknown>;
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
  m1: NonNullable<unknown>;
  m2: NonNullable<unknown>;
  m3: NonNullable<unknown>;
  m4: NonNullable<unknown>;
  m5: NonNullable<unknown>;
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
  hide: NonNullable<unknown>;
}

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

// 添加app参数用于声明当前播放用的app
export type EffectFunction<T extends EffectsWord> = {
  [key in T]: (
    instance: CharacterEffectInstance,
    app: Application,
    options: Options[key],
    sprites: Sprite[]
  ) => Promise<void>;
};

/**
 * 所有角色特效统一接口
 */
export type BaseCharacterEffectPlayer<T extends EffectsWord> =
  CharacterEffectPlayerInterface<T> & EffectFunction<T>;

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
