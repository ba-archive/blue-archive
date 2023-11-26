import * as PIXI from "pixi.js";
import eventBus from "@/eventBus";
import { storyHandler } from "@/index";
import { usePlayerStore } from "@/stores";
import gsap, { Power0 } from "gsap";
import { IAnimationState, ISkeletonData, ITrackEntry, Spine } from "pixi-spine";
import {
  CharacterEffectInstance,
  CharacterEffectPlayerInterface,
  CharacterEffectWord,
  CharacterLayer,
  EffectsWord,
  EmotionWord,
  FXEffectWord,
  ILoopAnimationStateListener,
} from "@/types/characterLayer";
import {
  Character,
  CharacterEffectType,
  CharacterInstance,
  WinkAnimationObject,
  WinkObject,
} from "@/types/common";
import { ShowCharacter } from "@/types/events";
import { AdjustmentFilter } from "@pixi/filter-adjustment";
import { ColorOverlayFilter } from "@pixi/filter-color-overlay";
import { CRTFilter } from "@pixi/filter-crt";
import { MotionBlurFilter } from "@pixi/filter-motion-blur";
import CharacterEffectPlayerInstance, {
  POS_INDEX_MAP,
  calcSpineStagePosition,
} from "./actionPlayer";
import CharacterEmotionPlayerInstance from "./emotionPlayer";
import CharacterFXPlayerInstance from "./fxPlayer";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import PixiPlugin from "./gsapPixiPlugin";

const AnimationIdleTrack = 0; // 光环动画track index
const AnimationFaceTrack = 1; // 差分切换
const AnimationWinkTrack = 1; // TODO 眨眼动画

type ICharacterEffectPlayerInterface = CharacterEffectPlayerInterface<
  EmotionWord | CharacterEffectWord | FXEffectWord
>;
type IEffectPlayerMap = {
  [key in CharacterEffectType]: ICharacterEffectPlayerInterface;
};
const EffectPlayerMap: IEffectPlayerMap = {
  action: CharacterEffectPlayerInstance,
  emotion: CharacterEmotionPlayerInstance,
  fx: CharacterFXPlayerInstance,
};

export const CharacterLayerInstance: CharacterLayer = {
  init() {
    const { app, currentCharacterMap } = usePlayerStore();
    // 将stage的sort设置为true,此时sprite将按照zIndex属性进行显示的排序,而是不按照children array的顺序
    app.stage.sortableChildren = true;
    document.addEventListener("resize", this.onWindowResize);
    eventBus.on("showCharacter", showCharacter);
    eventBus.on("hide", () => Reflect.apply(this.hideCharacter, this, []));
    eventBus.on("hideCharacter", () =>
      Reflect.apply(this.hideCharacter, this, [])
    );
    eventBus.on("resize", originWidth => {
      characterMapListForeach(character => {
        const instance = character.instance;
        if (instance.visible) {
          instance.x *= app.screen.width / originWidth;
        }
      });
    });
    Object.keys(EffectPlayerMap).forEach(key => {
      const player = Reflect.get(
        EffectPlayerMap,
        key
      ) as ICharacterEffectPlayerInterface;
      player && player.init();
    });
    return true;
  },
  dispose(): boolean {
    document.removeEventListener("resize", this.onWindowResize);
    eventBus.off("showCharacter", showCharacter);
    // 删除眨眼的handler
    characterMapListForeach(it => clearWinkHandler(it.winkObject));
    //TODO 销毁各种sprite,spine实体
    return true;
  },
  hasCharacterInstance(characterNumber: number, initPosition: number): boolean {
    return Boolean(
      getCharacterInstanceByCharacterNameAndInitPosition(
        characterNumber,
        initPosition
      )
    );
  },
  getCharacterInstance(
    characterNumber: number,
    initPosition: number
  ): CharacterInstance | undefined {
    return getCharacterInstanceByCharacterNameAndInitPosition(
      characterNumber,
      initPosition
    );
  },
  getCharacterSpineInstance(
    characterNumber: number,
    initPosition: number
  ): Spine | undefined {
    return this.getCharacterInstance(characterNumber, initPosition)?.instance;
  },
  beforeProcessShowCharacterAction(characterMap: Character[]): boolean {
    const { characterSpineData } = usePlayerStore();
    for (const item of characterMap) {
      const characterName = item.CharacterName;
      if (!this.hasCharacterInstance(characterName, item.position)) {
        const spineData = characterSpineData(characterName, item.spineUrl);
        if (!spineData) {
          return false;
        }
        this.createSpineFromSpineData(item, spineData);
      }
      this.putCharacterOnStage(item);
    }
    return true;
  },
  createSpineFromSpineData(
    character: Character,
    spineData: ISkeletonData
  ): Spine {
    const instance = new Spine(spineData);
    instance.sortableChildren = true;
    const id = character.CharacterName;
    const { currentCharacterMap } = usePlayerStore();
    const characterInstance: CharacterInstance = {
      CharacterName: id,
      position: character.position,
      initPosition: character.position,
      currentFace: character.face,
      instance,
      isOnStage() {
        return Boolean(instance.parent);
      },
      isShow() {
        return this.isOnStage() && instance.alpha !== 0;
      },
      isHeightLight() {
        return this.isOnStage() && instance.alpha !== 0;
      },
    };
    const existList = currentCharacterMap.get(id) || [];
    existList.push(characterInstance);
    currentCharacterMap.set(id, existList);
    return instance;
  },
  putCharacterOnStage(character: Character): boolean {
    const { app } = usePlayerStore();
    const instance = this.getCharacterInstance(
      character.CharacterName,
      character.position
    )!;
    instance.position = character.position;
    instance.currentFace = character.face;
    wink(instance);
    const spine = instance.instance;
    if (!spine) {
      return false;
    }
    // spine如果是新建的, 初始化数据
    if (spine.position.y === 0) {
      // 供特效使用
      const { scale, y } = calcCharacterYAndScale(spine);
      //设置x轴初始位置
      const { x } = calcSpineStagePosition(spine, character.position);

      // 设置锚点到左上角
      spine.pivot = {
        x: Character_Initial_Pivot_Proportion.x * spine.width,
        y: Character_Initial_Pivot_Proportion.y * spine.height,
      };
      spine.scale.set(scale);
      // 设置spine在播放器的y轴坐标
      spine.position.set(x, y);
    }
    // 跳过时设置为初始的高度, 可以优化为跳过时缩短 duration 为 200 以下,
    // 但是现在看起来没啥问题先不改了, action那边 duration 有点多
    if (storyHandler.isSkip) {
      const { y } = calcCharacterYAndScale(spine);
      spine.position.y = y;
    }
    // 不显示
    spine.alpha = 0;
    //这样会导致基于visible的判断失效
    // spine.visible = false;
    app.stage.addChild(spine);
    return true;
  },
  buildCharacterEffectInstance(row: ShowCharacter): CharacterEffectInstance[] {
    return row.characters.map(item => {
      return {
        ...item,
        instance: this.getCharacterSpineInstance(
          item.CharacterName,
          item.position
        )!,
        isCloseUp() {
          // 供特效使用
          const { scale } = calcCharacterYAndScale(this.instance);
          return Math.abs(scale - this.instance.scale.x) >= 0.05;
        },
      };
    });
  },
  hideCharacter() {
    characterMapListForeach(character => {
      character.instance.visible = false;
      character.instance.scale.set(1);
      // 设置锚点到左上角
      character.instance.pivot = {
        x:
          Character_Initial_Pivot_Proportion.x *
          (character.instance.width / character.instance.scale.x),
        y:
          Character_Initial_Pivot_Proportion.y *
          (character.instance.height / character.instance.scale.y),
      };
      // 设置缩放比列
      const { scale: defaultScale } = calcCharacterYAndScale(
        character.instance
      );
      character.instance.scale.set(defaultScale);
    });
  },
  showCharacter(data: ShowCharacter): boolean {
    if (!this.beforeProcessShowCharacterAction(data.characters)) {
      return false;
    }
    const { currentCharacterMap } = usePlayerStore();
    const mapList = this.buildCharacterEffectInstance(data);
    //将data没有但显示着的角色取消highlight
    characterMapListForeach(character => {
      if (
        character.instance.visible &&
        !data.characters.some(
          value => value.CharacterName === character.CharacterName
        )
      ) {
        const colorFilter = character.instance.filters![
          character.instance.filters!.length - 1
        ] as ColorOverlayFilter;
        colorFilter.alpha = 0.3;
      }
    });

    // 当目前显示的角色没有新的表情动作且和现有角色的position冲突时隐藏
    const filterEmotion = data.characters.filter(it =>
      it.effects.some(ef => ef.type === "emotion")
    );
    const showName = filterEmotion.map(it => it.CharacterName);
    const showPosition = data.characters.map(it => it.position);
    const filterHide = characterMapFlatList().filter(it => {
      return (
        it.isOnStage() &&
        it.isShow() &&
        !showName.includes(it.CharacterName) &&
        showPosition.includes(it.position)
      );
    });
    filterHide.forEach(chara => {
      chara.instance.visible = false;
      chara.instance.alpha = 0;
      // 清除closeup特效
      const { scale } = calcCharacterYAndScale(chara.instance);
      chara.instance.scale.set(scale);
    });

    // 处理sync情况
    Promise.all(mapList.map(character => this.showOneCharacter(character)))
      .then(this.characterDone)
      .catch(reason => {
        if (reason.some((it: unknown) => it)) {
          console.log(reason);
        }
        this.characterDone();
      });
    return true;
  },
  showOneCharacter(data: CharacterEffectInstance): Promise<void> {
    // 当人物没有closeup时取消closeup
    if (data.isCloseUp()) {
      if (!data.effects.some(effect => effect.effect === "closeup")) {
        const { scale } = calcCharacterYAndScale(data.instance);
        data.instance.scale.set(scale);
      }
    }

    // 表情
    if (data.instance.state.hasAnimation(data.face))
      data.instance.state.setAnimation(AnimationFaceTrack, data.face, true);
    data.instance.filters = [];

    //处理全息状态
    if (data.signal) {
      const crtFilter = new CRTFilter({
        lineWidth: data.instance.width * 0.005,
        time: 0,
      });
      const adjustmentFilter = new AdjustmentFilter({
        gamma: 1.3,
        red: 1,
        green: 1.1,
        blue: 1.15,
      });
      const motionBlurFilter = new MotionBlurFilter();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      data.instance.filters.push(crtFilter, adjustmentFilter, motionBlurFilter);
      loopCRtAnimation(crtFilter);
      const tl = gsap.timeline();
      tl.to(motionBlurFilter.velocity, {
        x: 5,
        duration: 0.1,
        repeat: 1,
        yoyo: true,
      }).to(motionBlurFilter.velocity, {
        x: -5,
        duration: 0.1,
        repeat: 1,
        yoyo: true,
      });
      tl.repeat(-1);
      tl.repeatDelay(3);
    }

    const colorFilter = new ColorOverlayFilter([0, 0, 0], 0);
    // TODO highlight
    //处理人物高光
    if (!data.highlight) {
      colorFilter.alpha = 0.3;
    } else if (data.effects.some(effect => effect.effect === "black")) {
      data.effects = data.effects.filter(effect => effect.effect !== "black");
      colorFilter.alpha = 1;
    }
    if (
      data.effects.some(
        it => it.type === "action" && ["a", "al", "ar"].includes(it.effect)
      )
    ) {
      // 有淡入效果, 交给特效控制器
      //不要改变color filter的alpha, 会导致a最后的alpha出错
    } else {
      // 没有淡入效果, 直接显示
      const chara = data.instance;
      //当人物被移出画面时重设为初始位置
      if (!chara.visible) {
        const { x } = calcSpineStagePosition(chara, data.position);
        chara.x = x;
        chara.zIndex = Reflect.get(POS_INDEX_MAP, data.position);
        if (chara.state.hasAnimation("Idle_01")) {
          chara.state.setAnimation(AnimationIdleTrack, "Idle_01", true);
        }
      }
      chara.alpha = 1;
      chara.visible = true;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    data.instance.filters.push(colorFilter);

    // eslint-disable-next-line no-async-promise-executor
    return new Promise<void>(async (resolve, reject) => {
      const effectListLength = data.effects.length;
      if (effectListLength === 0) {
        resolve();
      }

      const reasons: any[] = [];
      const effectPromise: Array<Promise<void>> = [];
      for (const index in data.effects) {
        const effect = data.effects[index];
        const effectPlayer = getEffectPlayer(effect.type);
        if (!effectPlayer) {
          // TODO error handle
          reject(`获取特效类型{${effect.type}}对应的播放器时失败`);
          return;
        }
        if (effect.async) {
          await effectPlayer
            .processEffect(effect.effect as EffectsWord, data)
            .then()
            .catch(err => {
              reasons.push(err);
              reject(reasons);
            });
        } else {
          effectPromise.push(
            effectPlayer.processEffect(effect.effect as EffectsWord, data)
          );
          // .then(resolveHandler)
          // .catch((err) => {
          //   reason.push(err);
          //   resolveHandler();
          // })
        }
      }
      const results = await Promise.allSettled(effectPromise);
      for (const result of results) {
        if (result.status === "rejected") {
          reasons.push(result.reason);
        }
      }
      if (reasons.length !== 0) {
        reject(reasons);
      } else {
        resolve();
      }
    });
  },
  characterDone() {
    eventBus.emit("characterDone");
  },
  //TODO 根据角色是否已经缩放(靠近老师)分类更新
  onWindowResize() {},
};
/**
 * 标准宽度基于的播放器宽度的相对值
 * 标准宽度用于计算图片缩放比例
 */
const Standard_Width_Relative = 0.3;

/**
 * 角色初始的pivot相对与长宽的比例, 当前值代表左上角
 */
export const Character_Initial_Pivot_Proportion = { x: 0, y: -1 / 2 };

PixiPlugin.registerPIXI(PIXI);
gsap.registerPlugin(PixiPlugin);

export function calcCharacterYAndScale(spine: Spine) {
  const { screenHeight } = getStageSize();
  const scale = (screenHeight / PlayerHeight) * CharacterScale;
  const spineHeight = (spine.height / spine.scale.y) * scale;
  return {
    scale,
    y: screenHeight - spineHeight * (1 - spineHideRate),
  };
}

function showCharacter(data: ShowCharacter) {
  CharacterLayerInstance.showCharacter(data);
}

export function characterInit(): boolean {
  return CharacterLayerInstance.init();
}

function loopCRtAnimation(crtFilter: CRTFilter) {
  gsap
    .to(crtFilter, { time: "+=10", duration: 1, ease: Power0.easeNone })
    .then(() => loopCRtAnimation(crtFilter));
}

function getEffectPlayer(type: CharacterEffectType) {
  return Reflect.get(EffectPlayerMap, type) as ICharacterEffectPlayerInterface;
}
/**
 * 眨眼
 *
 * 至少游戏里只会眨一次或者两次
 *
 * 固定只有01表情时才会眨眼
 * @param instance 要眨眼的角色结构体
 * @param first 是否为改变表情时的初始化
 */
function wink(instance: CharacterInstance, first = true) {
  //只在有眨眼动画时起作用
  if (!instance.instance.state.hasAnimation("Eye_Close_01")) {
    return;
  }
  const face = instance.currentFace;
  const spine = instance.instance;
  clearWinkHandler(instance.winkObject);
  if (face !== "01") {
    return;
  }
  const winkTimeout = Math.floor(Math.random() * 1000) + 3500;
  instance.winkObject = {
    handler: window.setTimeout(wink, winkTimeout, instance, false),
  };
  if (first) {
    return;
  }
  const loopTime = Math.floor(Math.random() * 2) + 1;
  const winkAnimationObject = loopAnimationTime(
    spine.state,
    AnimationWinkTrack,
    "Eye_Close_01",
    "eye",
    loopTime
  );
  instance.winkObject.animationObject = winkAnimationObject;
  winkAnimationObject.start();
}

/**
 * 指定循环次数的播放循环动画
 *
 * 通过AnimationStateListener在每次播放结束后判断播放次数,
 *
 * 如果没有达到次数就继续播放
 * @param state spine的state对象
 * @param trackIndex 动画的trackIndex
 * @param animationName 动画的animationName
 * @param id 用于标识loop handler的key
 * @param loop 循环次数
 */
function loopAnimationTime<AnimationState extends IAnimationState>(
  state: AnimationState,
  trackIndex: number,
  animationName: string,
  id: string,
  loop: number
): WinkAnimationObject {
  return {
    _pause: false,
    start() {
      const controller = state.listeners.filter(
        it => Reflect.get(it, "complete") && Reflect.get(it, "key") === id
      );
      if (controller.length !== 0) {
        state.removeListener(controller[0]);
      }
      let loopCount = 1;
      const listener: ILoopAnimationStateListener = {
        complete: (entry: ITrackEntry) => {
          if (entry.trackIndex !== trackIndex) {
            return;
          }
          if (loopCount < loop && !this._pause) {
            loopCount++;
            state.setAnimation(trackIndex, animationName, false);
          }
        },
        key: id,
      };
      state.addListener(listener);
      state.setAnimation(trackIndex, animationName, false);
    },
    pause() {
      this._pause = true;
    },
  };
}

function clearWinkHandler(winkObject?: WinkObject) {
  if (!winkObject) {
    return;
  }
  if (winkObject.handler) {
    window.clearTimeout(winkObject.handler);
    winkObject.handler = 0;
  }
  winkObject.animationObject?.pause();
}

// 当播放器高度为PlayerHeight时角色的CharacterScale
const PlayerHeight = 550;
const CharacterScale = 0.34;
// spine在播放器之下的部分;
const spineHideRate = 0.49;

/**
 * 获取显示区域的大小
 * @return screenWidth 容器的宽 screenHeight 容器的高
 */
export function getStageSize() {
  const { app } = usePlayerStore();
  const screen = app.screen;
  const screenWidth = screen.width;
  const screenHeight = screen.height;
  return {
    screenWidth,
    screenHeight,
  };
}

/**
 * 获取用于计算图片缩放比例的标准宽度
 */
export function getStandardWidth() {
  return usePlayerStore().app.screen.width * Standard_Width_Relative;
}

function characterMapFlatList() {
  const { currentCharacterMap } = usePlayerStore();
  return [...currentCharacterMap.values()].flat();
}

function characterMapListForeach(
  block: (character: CharacterInstance) => void
) {
  const { currentCharacterMap } = usePlayerStore();
  currentCharacterMap.forEach(list => list.forEach(it => block(it)));
}

function getCharacterMapListByCharacterName(characterName: number) {
  const { currentCharacterMap } = usePlayerStore();
  return currentCharacterMap.get(characterName);
}

function getCharacterInstanceByCharacterNameAndInitPosition(
  characterName: number,
  initPosition: number
) {
  const list = getCharacterMapListByCharacterName(characterName);
  return (list || []).filter(it => it.initPosition === initPosition)[0];
}
