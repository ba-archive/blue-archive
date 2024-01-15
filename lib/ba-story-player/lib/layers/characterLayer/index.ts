import { AdjustmentFilter } from "@pixi/filter-adjustment";
import { ColorOverlayFilter } from "@pixi/filter-color-overlay";
import { CRTFilter } from "@pixi/filter-crt";
import { MotionBlurFilter } from "@pixi/filter-motion-blur";
import gsap, { Power0 } from "gsap";
import { IAnimationState, ITrackEntry, Spine } from "pixi-spine";
import { Application } from "pixi.js";
import { reactive } from "vue";
import { Character, CheckMethod, HandlerMap, Layer } from "../../type";
import { calcSpineStagePosition, POS_INDEX_MAP } from "./actionAnimation";
import {
  CharacterEffectInstance,
  CharacterEffectWord,
  CharacterInstance,
  EmotionWord,
  ILoopAnimationStateListener,
  WinkAnimationObject,
  WinkObject,
} from "./type";
import actionAnimation from "./actionAnimation";
import emotionAnimations from "./emotionAnimations";
import fxAnimations from "./fxAnimations";
import * as PIXI from "pixi.js";
import { PixiPlugin } from "gsap/all";
import actionOptions from "./Options/actionOptions";

// 注册gasp的pixi插件
gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

const timeline = gsap.timeline();

// 定义存储角色实例的对象类型
// 由于undefined不允许索引，为了能支持索引以及满足位置上可以没有角色先这么定义
type InstancesObj = {
  [key: number | string]: CharacterInstance | 0;
  "1": CharacterInstance | 0;
  "2": CharacterInstance | 0;
  "3": CharacterInstance | 0;
  "4": CharacterInstance | 0;
  "5": CharacterInstance | 0;
};

export interface PositionOffset {
  x: number;
  y: number;
}

const Character_Initial_Pivot_Proportion = { x: 0, y: -1 / 2 };
// 当播放器高度为PlayerHeight时角色的CharacterScale
const PlayerHeight = 550;
const CharacterScale = 0.34;
// spine在播放器之下的部分;
const spineHideRate = 0.49;

const AnimationFaceTrack = 1; // 差分切换
const AnimationIdleTrack = 0; // 光环动画track index

export class CharacterLayer extends Layer {
  currentCharacters: Character[] = [];
  constructor(app: Application, handlerMap: HandlerMap) {
    super(app, handlerMap);
    this.addCheckMethod(loadCharacter);
    app.stage.sortableChildren = true;
  }
  // 存放角色实例，包括状态和spine
  instances: InstancesObj = {
    "1": 0,
    "2": 0,
    "3": 0,
    "4": 0,
    "5": 0,
  };

  // 存放动画播放实例
  // TODO: 声音层未并入，所以还未处理声音的播放
  animations = {
    ...actionAnimation,
    ...emotionAnimations,
    ...fxAnimations,
  };

  // 由于没有characterName的属性，以下所有方法中对角色的唯一定位采用获取人物spine的url

  createCharacterInstance(
    character: Character,
    handlerMap: HandlerMap
  ): CharacterInstance {
    const newCharacterSpine = handlerMap.getResources<"character">(
      "character",
      character.CharacterSpine
    );
    if (!newCharacterSpine) {
      throw new Error("获取character失败");
    } else {
      const newCharacter: CharacterInstance = {
        // 状态信息应该支持响应，大概，能这么做？
        status: reactive({
          position: character.initPosition,
          initPosition: character.initPosition,
          currentFace: character.face,
          currentState: character.state,
          characterSpine: character.CharacterSpine,
        }),
        instance: newCharacterSpine,
        isOnStage() {
          return Boolean(this.instance.parent);
        },
        isShow() {
          return this.isOnStage() && this.instance.alpha !== 0;
        },
        isHeightLight() {
          return this.isOnStage() && this.instance.alpha !== 0;
        },
      };
      return newCharacter;
    }
  }
  // 将node节点中的Character实例化到当前类的instances中
  // 类似原架构beforeProcessShowCharacterAction方法
  // 认为每个位置上同时只存在一个角色，新角色会覆盖掉旧的
  addCharacter(character: Character, handlerMap: HandlerMap, app: Application) {
    const curCharacter = this.createCharacterInstance(character, handlerMap);
    this.removeCharacterInstance(
      this.instances[curCharacter.status.initPosition],
      app
    );
    this.instances[curCharacter.status.initPosition] = curCharacter;
    this.putCharacterOnStage(app, curCharacter);
  }
  // 从instances中获取角色实例
  getCharacterInstance(position: number | string): CharacterInstance | 0 {
    switch (position) {
      case 1:
        return this.instances[1];
      case 2:
        return this.instances[2];
      case 3:
        return this.instances[3];
      case 4:
        return this.instances[4];
      case 5:
        return this.instances[5];
    }
    return 0;
  }
  putCharacterOnStage(
    app: Application,
    characterInstance: CharacterInstance
  ): boolean {
    wink(characterInstance);
    const spine = characterInstance.instance;
    if (!spine) {
      return false;
    }
    // spine如果是新建的，初始化数据
    if (spine.position.y === 0) {
      // 供特效使用
      const { scale, y } = calcCharacterYAndScale(spine, app);
      // 设置x轴初始位置
      const { x } = calcSpineStagePosition(
        spine,
        characterInstance.status.position,
        app
      );
      // 设置锚点到左上角
      spine.pivot = {
        x: Character_Initial_Pivot_Proportion.x * spine.width,
        y: Character_Initial_Pivot_Proportion.y * spine.height,
      };
      spine.scale.set(scale);
      // 设置spine在播放器的y轴坐标
      spine.position.set(x, y);
    }
    // 这里暂时跳过了“关于跳过”的设置
    // if (storyHandler.isSkip) {
    //   const { y } = calcCharacterYAndScale(spine);
    //   spine.position.y = y;
    // }
    // 不显示
    spine.alpha = 0;
    app.stage.addChild(spine);
    return true;
  }
  // 建立特效实例
  // 原架构中此方法data包含了所有要展示的角色数据，
  // 此处由currentCharacters包含需要展示的角色
  buildCharacterEffectInstance(
    row: Character[],
    app: Application
  ): CharacterEffectInstance[] {
    return row.map(item => {
      // 所有character数组中的角色已经在instances里实例化，所以断言为CharacterInstance
      const curCharacter = this.instances[
        item.initPosition
      ] as CharacterInstance;
      return {
        ...item,
        position: item.initPosition,
        instance: curCharacter.instance,
        isCloseUp() {
          // 供特效使用
          const { scale } = calcCharacterYAndScale(this.instance, app);
          return Math.abs(scale - this.instance.scale.x) >= 0.05;
        },
      };
    });
  }
  // 隐藏角色
  hideCharacter(app: Application) {
    for (const key in this.instances) {
      const character = this.instances[key];
      if (!character) {
        continue;
      }
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
      // 设置缩放比例
      const { scale: defaultScale } = calcCharacterYAndScale(
        character.instance,
        app
      );
      character.instance.scale.set(defaultScale);
    }
  }
  // 展示角色
  // 原架构中此方法data包含了所有要展示的角色数据，
  // 此处由currentCharacters包含需要展示的角色
  showCharacter(app: Application, handlerMap: HandlerMap) {
    const mapList = this.buildCharacterEffectInstance(
      this.currentCharacters,
      app
    );
    // 将currentCharacter没有但是显示着的角色取消highlight
    for (const key in this.instances) {
      const character = this.instances[key];
      if (
        character &&
        character.instance.visible &&
        !this.currentCharacters.some(
          value =>
            value.CharacterSpine.common ===
            character.status.characterSpine.common
        )
      ) {
        // 避免ts对非空断言报警告，采用?.，实际上一定非空
        const colorFilter = character.instance.filters?.[
          character.instance.filters?.length - 1
        ] as ColorOverlayFilter;
        colorFilter.alpha = 0.3;
      }
    }

    // 当目前显示的角色没有新的表情动作(且和现有角色的position冲突)时隐藏
    // 括号中为原架构注释，但是目前看来新架构下应该不会出现要展示的角色间还有
    // position的冲突吧(冲突是否会被拆成新的node)，所以此处略去position判断
    const filterEmotion = this.currentCharacters.filter(it =>
      it.effects.some(ef => ef.type === "emotion")
    );
    const showUrl = filterEmotion.map(it => it.CharacterSpine.common);
    for (const key in this.instances) {
      const character = this.instances[key];
      if (
        character &&
        character.isOnStage() &&
        character.isShow() &&
        !showUrl.includes(character.status.characterSpine.common)
      ) {
        character.instance.visible = false;
        character.instance.alpha = 0;
        // 清除closeUp特效
        const { scale } = calcCharacterYAndScale(character.instance, app);
        character.instance.scale.set(scale);
        this.instances[key] = 0;
      }
    }

    // 处理sync情况
    Promise.all(
      mapList.map(character =>
        this.showOneCharacter(character, app, handlerMap)
      )
    )
      .then(/* 暂时空着 */)
      .catch(reason => {
        if (reason.some((it: unknown) => it)) {
          console.log(reason);
        }
      });
    return true;
  }

  // 处理一个角色的展示
  showOneCharacter(
    data: CharacterEffectInstance,
    app: Application,
    handlerMap: HandlerMap
  ): Promise<void> {
    // 当人物没有closeUp时取消closeup
    // state为closeup时设置closeup
    if (data.isCloseUp()) {
      // 这里的data.effects.effect仍然存储closeup吗，还是说由state来存储了
      // 这里先采用后者
      if (!(data.state === "closeup")) {
        const { scale } = calcCharacterYAndScale(data.instance, app);
        data.instance.scale.set(scale);
      }
    } else if (data.state === "closeup") {
      const scale = data.instance.scale.x * actionOptions["closeup"].scale;
      data.instance.scale.set(scale);
    }

    // 表情
    if (data.instance.state.hasAnimation(data.face)) {
      data.instance.state.setAnimation(AnimationFaceTrack, data.face, true);
    }
    data.instance.filters = [];

    // 处理全息状态，此处转为state存储各种人物状态
    if (data.state === "signal") {
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
      // 此处时间轴设置是否正确
      timeline
        .to(motionBlurFilter.velocity, {
          x: 5,
          duration: 0.1,
          repeat: 1,
          yoyo: true,
        })
        .to(motionBlurFilter.velocity, {
          x: -5,
          duration: 0.1,
          repeat: 1,
          yoyo: true,
        });
      timeline.repeat(-1);
      timeline.repeatDelay(3);
    }

    const colorFilter = new ColorOverlayFilter([0, 0, 0], 0);
    //处理人物高光
    if (!(data.state === "highlight")) {
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
      chara.zIndex = Reflect.get(POS_INDEX_MAP, data.initPosition);
      //当人物被移出画面时重设为初始位置
      if (!chara.visible) {
        const { x } = calcSpineStagePosition(chara, data.initPosition, app);
        chara.x = x;
        chara.zIndex = Reflect.get(POS_INDEX_MAP, data.initPosition);
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
        // 玩不转类型了，这里就先复杂一下吧o(╥﹏╥)o
        if (effect.type === "action") {
          const animate = this.animations[effect.effect as CharacterEffectWord];
          animate.args.instance = data;
          animate.args.app = app;
          if (effect.async) {
            // 如果角色有位置移动，更新instances中角色位置
            if (["m1", "m2", "m3", "m4", "m5"].includes(effect.effect)) {
              if (data.position === parseInt(effect.effect[1])) {
                continue;
              }
              data.position = parseInt(effect.effect[1]);
              this.removeCharacterInstance(
                this.instances[effect.effect[1]],
                app
              );
              this.instances[effect.effect[1]] = this.instances[data.position];
            }
            await animate.animate();
          } else {
            if (["m1", "m2", "m3", "m4", "m5"].includes(effect.effect)) {
              effectPromise.push(
                new Promise<void>(resolve => {
                  if (data.position === parseInt(effect.effect[1])) {
                    return resolve();
                  }
                  data.position = parseInt(effect.effect[1]);
                  this.removeCharacterInstance(
                    this.instances[effect.effect[1]],
                    app
                  );
                  this.instances[effect.effect[1]] =
                    this.instances[data.position];
                  animate.animate().then(() => {
                    resolve();
                  });
                })
              );
            } else {
              effectPromise.push(animate.animate());
            }
          }
        } else if (effect.type === "emotion" || effect.type === "fx") {
          const animate =
            this.animations[effect.effect as EmotionWord | "shot"];
          animate.args.instance = data;
          animate.args.handlerMap = handlerMap;
          animate.args.app = app;
          if (effect.async) {
            await animate.animate();
          } else {
            effectPromise.push(animate.animate());
          }
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
  }

  // 将角色从instances数组中和app.stage中删除
  removeCharacterInstance(
    characterInstance: CharacterInstance | 0,
    app: Application
  ) {
    if (characterInstance === 0) {
      return;
    }
    const position = characterInstance.status.position;
    app.stage.removeChild(characterInstance.instance);
    characterInstance.instance.destroy();
    this.instances[position] = 0;
  }
}

// 监听node的character数组，保证角色同步
const loadCharacter: CheckMethod<CharacterLayer> = async function (
  node,
  app,
  handlerMap
) {
  if (node.characters) {
    for (let i = 1; i <= 5; i++) {
      node.characters.forEach(character => {
        if (character.initPosition === i) {
          this.addCharacter(character, handlerMap, app);
        }
      });
    }
    this.currentCharacters = node.characters;
    this.showCharacter(app, handlerMap);
  } else {
    for (let i = 1; i <= 5; i++) {
      this.removeCharacterInstance(this.instances[i], app);
    }
  }
  return;
};

export function calcCharacterYAndScale(spine: Spine, app: Application) {
  const { screenHeight } = getStageSize(app);
  const scale = (screenHeight / PlayerHeight) * CharacterScale;
  const spineHeight = (spine.height / spine.scale.y) * scale;
  return {
    scale,
    y: screenHeight - spineHeight * (1 - spineHideRate),
  };
}

export function getStageSize(app: Application) {
  const screen = app.screen;
  const screenWidth = screen.width;
  const screenHeight = screen.height;
  return {
    screenWidth,
    screenHeight,
  };
}

function loopCRtAnimation(crtFilter: CRTFilter) {
  gsap
    .to(crtFilter, { time: "+=10", duration: 1, ease: Power0.easeNone })
    .then(() => loopCRtAnimation(crtFilter));
}

/**
 * 标准宽度基于的播放器宽度的相对值
 * 标准宽度用于计算图片缩放比例
 */
const Standard_Width_Relative = 0.3;

/**
 * 获取用于计算图片缩放比例的标准宽度
 */
export function getStandardWidth(app: Application) {
  return app.screen.width * Standard_Width_Relative;
}

const AnimationWinkTrack = 1;

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
  const face = instance.status.currentFace;
  const spine = instance.instance;
  clearWinkHandler(instance.status.winkObject);
  if (face !== "01") {
    return;
  }
  const winkTimeout = Math.floor(Math.random() * 1000) + 3500;
  instance.status.winkObject = {
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
  instance.status.winkObject.animationObject = winkAnimationObject;
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
