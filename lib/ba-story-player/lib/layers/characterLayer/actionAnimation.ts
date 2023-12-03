import { Animation } from "@/type";
import { timelineToPauseAble, ZINDEXBASE } from "@/utils";
import { ColorOverlayFilter } from "@pixi/filter-color-overlay";
import gsap from "gsap";
import { Spine } from "pixi-spine";
import { Application, ObservablePoint } from "pixi.js";
import { calcCharacterYAndScale, getStageSize, PositionOffset } from ".";
import actionOptions from "./Options/actionOptions";
import { ActionOptions, CharacterEffectInstance } from "./type";

/**
 * 角色position x轴值相对于中心的偏移量, 单位是播放器宽度
 */
export const POS_X_CENTER_OFFSET = {
  "1": -7 / 24,
  "2": -1 / 6,
  "3": 0,
  "4": 1 / 6,
  "5": 7 / 24,
};

/**
 * 角色position对应的覆盖关系
 */
export const POS_INDEX_MAP = {
  "1": ZINDEXBASE.character + 2,
  "2": ZINDEXBASE.character + 3,
  "3": ZINDEXBASE.character + 4,
  "4": ZINDEXBASE.character + 3,
  "5": ZINDEXBASE.character + 2,
};

/**
 * 根据position: 0~5 计算出角色的原点位置
 * @param character 要显示的角色
 * @param position 角色所在位置
 */
export function calcSpineStagePosition(
  character: Spine,
  position: number,
  app: Application
): PositionOffset {
  const { screenWidth, screenHeight } = getStageSize(app);
  const center = screenWidth / 2;
  return {
    x: center + Reflect.get(POS_X_CENTER_OFFSET, position) * screenWidth,
    y: screenHeight * 0.3,
  };
}

/**
 * 初始化角色的位置, zIndex, 动画和可见性.
 * @param instance
 * @param app
 */
function initCharacter(instance: CharacterEffectInstance, app: Application) {
  const characterInstance = instance.instance;
  const { x } = calcSpineStagePosition(
    characterInstance,
    instance.position,
    app
  );
  const { y } = calcCharacterYAndScale(instance.instance, app);
  characterInstance.x = x;
  characterInstance.y = y;
  characterInstance.zIndex = Reflect.get(POS_INDEX_MAP, instance.position);
  if (characterInstance.state.hasAnimation("Idle_01")) {
    characterInstance.state.setAnimation(AnimationIdleTrack, "Idle_01", true);
  }
  characterInstance.visible = true;
  characterInstance.alpha = 1;
}

/**
 * 以px计算的移动速度
 */
export function moveSpeedPx(app: Application) {
  return (5 * app.screen.width) / 5;
}

/**
 * 将立绘移动到指定位置, 返回一个移动动画timeline
 * @param instance
 * @param position
 * @returns
 */
function moveTo(
  instance: CharacterEffectInstance,
  position: number,
  app: Application,
  tl: gsap.core.Timeline
) {
  const movePos = calcSpineStagePosition(instance.instance, position, app);
  const distance = Math.abs(instance.instance.x - movePos.x);
  const duration = distance / moveSpeedPx(app);
  instance.position = position;
  return tl.to(instance.instance, { pixi: { x: movePos.x }, duration });
}

const AnimationIdleTrack = 0; // 光环动画track index

const a: Animation<{
  instance: CharacterEffectInstance | undefined;
  app: Application | undefined;
}> = {
  args: { instance: undefined, app: undefined },
  runningAnimation: [],
  async animate() {
    if (!this.args.instance || !this.args.app) {
      return;
    }
    const timeLine = gsap.timeline();
    this.runningAnimation.push(timelineToPauseAble(timeLine));
    // 获取角色spine
    const characterInstance = this.args.instance.instance;
    // 计算角色原点位置
    const { x } = calcSpineStagePosition(
      characterInstance,
      this.args.instance.position,
      this.args.app
    );
    characterInstance.x = x;
    // 获取zIndex层
    characterInstance.zIndex = Reflect.get(
      POS_INDEX_MAP,
      this.args.instance.position
    );
    if (characterInstance.state.hasAnimation("Idle_01")) {
      characterInstance.state.setAnimation(AnimationIdleTrack, "Idle_01", true);
    }
    characterInstance.alpha = 1;
    const colorFilter = characterInstance.filters?.[
      characterInstance.filters?.length - 1
    ] as ColorOverlayFilter;
    const finalAlpha = colorFilter.alpha;
    colorFilter.alpha = 1;

    await new Promise(resolve => {
      characterInstance.visible = true;
      timeLine.to(colorFilter, {
        alpha: finalAlpha,
        duration: 1,
        onComplete: resolve,
      });
    });
  },
  async final() {
    for (const animation of this.runningAnimation) {
      animation.pause();
    }
    if (this.args.instance) {
      this.args.instance.instance.alpha = 1;
    }
  },
};

const al: Animation<{
  instance: CharacterEffectInstance | undefined;
  app: Application | undefined;
}> = {
  args: { instance: undefined, app: undefined },
  runningAnimation: [],
  async animate() {
    if (!this.args.instance || !this.args.app) {
      return;
    }
    initCharacter(this.args.instance, this.args.app);
    const tl = gsap.timeline({
      defaults: {
        ease: "none",
      },
    });
    this.runningAnimation.push(timelineToPauseAble(tl));
    const initX =
      this.args.app.screen.width + this.args.instance.instance.width;
    const distance = initX - this.args.instance.instance.x;
    const duration = distance / moveSpeedPx(this.args.app);

    await tl.fromTo(
      this.args.instance.instance,
      { pixi: { x: initX } },
      { pixi: { x: this.args.instance.instance.x }, duration }
    );
  },
  // 直接移动到最后位置
  async final() {
    for (const animation of this.runningAnimation) {
      animation.pause();
    }
    if (this.args.instance && this.args.app) {
      const characterInstance = this.args.instance.instance;
      const { x } = calcSpineStagePosition(
        characterInstance,
        this.args.instance.initPosition,
        this.args.app
      );
      characterInstance.x = x;
    }
  },
};

const ar: Animation<{
  instance: CharacterEffectInstance | undefined;
  app: Application | undefined;
}> = {
  args: { instance: undefined, app: undefined },
  runningAnimation: [],
  async animate() {
    if (!this.args.instance || !this.args.app) {
      return;
    }
    initCharacter(this.args.instance, this.args.app);
    const tl = gsap.timeline({
      defaults: {
        ease: "none",
      },
    });
    this.runningAnimation.push(timelineToPauseAble(tl));
    const distance =
      this.args.instance.instance.x + this.args.instance.instance.width;
    const duration = distance / moveSpeedPx(this.args.app);
    await tl.fromTo(
      this.args.instance.instance,
      { pixi: { x: -this.args.instance.instance.width } },
      { pixi: { x: this.args.instance.instance.x }, duration }
    );
  },
  async final() {
    for (const animation of this.runningAnimation) {
      animation.pause();
    }
    if (this.args.instance && this.args.app) {
      const characterInstance = this.args.instance.instance;
      const { x } = calcSpineStagePosition(
        characterInstance,
        this.args.instance.initPosition,
        this.args.app
      );
      characterInstance.x = x;
    }
  },
};

const closeup: Animation<{
  instance: CharacterEffectInstance | undefined;
  options: ActionOptions["closeup"];
  app: Application | undefined;
}> = {
  args: { instance: undefined, options: { scale: 0 }, app: undefined },
  runningAnimation: [],
  async animate() {
    if (!this.args.instance) {
      return;
    }
    if (!this.args.instance.isCloseUp()) {
      const scale =
        this.args.instance.instance.scale.x * this.args.options.scale;
      this.args.instance.instance.scale.set(scale);
    }
  },
  async final() {
    if (!this.args.instance) {
      return;
    }
    if (!this.args.instance.isCloseUp()) {
      const scale =
        this.args.instance.instance.scale.x * this.args.options.scale;
      this.args.instance.instance.scale.set(scale);
    }
  },
};

const d: Animation<{
  instance: CharacterEffectInstance | undefined;
  options: ActionOptions["d"];
  app: Application | undefined;
}> = {
  args: { instance: undefined, options: { duration: 0 }, app: undefined },
  runningAnimation: [],
  async animate() {
    if (!this.args.instance) {
      return;
    }
    const colorFilter = this.args.instance.instance.filters?.[
      this.args.instance.instance.filters?.length - 1
    ] as ColorOverlayFilter;
    const tl = gsap.timeline();
    this.runningAnimation.push(timelineToPauseAble(tl));
    await tl.to(colorFilter, {
      alpha: 1,
      duration: this.args.options.duration,
    });
    this.args.instance.instance.alpha = 0;
    this.args.instance.instance.visible = false;
  },
  async final() {
    for (const animation of this.runningAnimation) {
      animation.pause();
    }
    if (this.args.instance) {
      this.args.instance.instance.alpha = 0;
      this.args.instance.instance.visible = false;
    }
  },
};

const dl: Animation<{
  instance: CharacterEffectInstance | undefined;
  app: Application | undefined;
}> = {
  args: { instance: undefined, app: undefined },
  runningAnimation: [],
  async animate() {
    if (!this.args.instance || !this.args.app) {
      return;
    }
    const tl = gsap.timeline({
      defaults: {
        ease: "none",
      },
    });
    this.runningAnimation.push(timelineToPauseAble(tl));
    const distance =
      this.args.instance.instance.x + this.args.instance.instance.width;
    const duration = distance / moveSpeedPx(this.args.app);
    await tl.to(this.args.instance.instance, {
      pixi: { x: -this.args.instance.instance.width },
      duration,
    });
    this.args.instance.instance.visible = false;
  },
  async final() {
    for (const animation of this.runningAnimation) {
      animation.pause();
    }
    if (this.args.instance) {
      this.args.instance.instance.visible = false;
    }
  },
};

const dr: Animation<{
  instance: CharacterEffectInstance | undefined;
  app: Application | undefined;
}> = {
  args: { instance: undefined, app: undefined },
  runningAnimation: [],
  async animate() {
    if (!this.args.instance || !this.args.app) {
      return;
    }
    const tl = gsap.timeline({
      defaults: {
        ease: "none",
      },
    });
    this.runningAnimation.push(timelineToPauseAble(tl));
    const finalX =
      this.args.app.screen.width + this.args.instance.instance.width;
    const distance = finalX - this.args.instance.instance.x;
    const duration = distance / moveSpeedPx(this.args.app);
    await tl.to(this.args.instance.instance, { pixi: { x: finalX }, duration });
    this.args.instance.instance.visible = false;
  },
  async final() {
    for (const animation of this.runningAnimation) {
      animation.pause();
    }
    if (this.args.instance) {
      this.args.instance.instance.visible = false;
    }
  },
};

const falldownR: Animation<{
  instance: CharacterEffectInstance | undefined;
  options: ActionOptions["falldownR"];
  orginState: { pivot: ObservablePoint<any>; y: number } | undefined;
  app: Application | undefined;
}> = {
  args: {
    instance: undefined,
    options: actionOptions["falldownR"],
    orginState: undefined,
    app: undefined,
  },
  runningAnimation: [],
  async animate() {
    if (!this.args.instance) {
      return;
    }
    const tl = gsap.timeline();
    this.runningAnimation.push(timelineToPauseAble(tl));
    const pivotOffset = {
      x:
        (this.args.instance.instance.width * this.args.options.anchor.x) /
        this.args.instance.instance.scale.x,
      y:
        (this.args.instance.instance.height * this.args.options.anchor.y) /
        this.args.instance.instance.scale.y,
    };
    this.args.orginState = {
      pivot: this.args.instance.instance.pivot.clone(),
      y: this.args.instance.instance.y,
    };
    this.args.instance.instance.pivot.x += pivotOffset.x;
    this.args.instance.instance.pivot.y += pivotOffset.y;
    this.args.instance.instance.position.set(
      this.args.instance.instance.x +
        pivotOffset.x * this.args.instance.instance.scale.x,
      this.args.instance.instance.y +
        pivotOffset.y * this.args.instance.instance.scale.x
    );
    const finalY =
      this.args.instance.instance.y +
      this.args.instance.instance.height * (this.args.options.anchor.y + 0.1);
    await tl
      .to(this.args.instance.instance, {
        pixi: { angle: this.args.options.rightAngle },
        duration: this.args.options.firstRotateDuration,
        repeat: 1,
        yoyo: true,
      })
      .to(this.args.instance.instance, {
        pixi: { y: finalY },
        duration: this.args.options.falldownDuration,
      })
      .to(
        this.args.instance.instance,
        {
          pixi: { angle: this.args.options.leftAngle },
          duration:
            this.args.options.falldownDuration *
            this.args.options.leftRotationPercent,
          repeat: 1,
          yoyo: true,
        },
        "<-=0.1"
      )
      .to(
        this.args.instance.instance,
        {
          pixi: { angle: this.args.options.rightAngle },
          duration: this.args.options.firstRotateDuration,
        },
        ">"
      )
      .to(
        this.args.instance.instance,
        {
          pixi: {
            x: `+=${
              this.args.options.xOffset * this.args.instance.instance.width
            }`,
          },
        },
        0
      );

    this.args.instance.instance.angle = 0;
    this.args.instance.instance.pivot = this.args.orginState.pivot;
    this.args.instance.instance.visible = false;
    this.args.instance.instance.y = this.args.orginState.y;
  },
  async final() {
    for (const animation of this.runningAnimation) {
      animation.pause();
    }
    if (this.args.instance) {
      this.args.instance.instance.angle = 0;
      this.args.instance.instance.visible = false;
      if (this.args.orginState) {
        this.args.instance.instance.pivot = this.args.orginState.pivot;
        this.args.instance.instance.y = this.args.orginState.y;
      }
    }
  },
};

const falldownL: Animation<{
  instance: CharacterEffectInstance | undefined;
  options: ActionOptions["falldownL"];
  orginState: { pivot: ObservablePoint<any>; y: number } | undefined;
  app: Application | undefined;
}> = {
  args: {
    instance: undefined,
    options: actionOptions["falldownL"],
    orginState: undefined,
    app: undefined,
  },
  runningAnimation: [],
  async animate() {
    if (!this.args.instance) {
      return;
    }
    const tl = gsap.timeline();
    this.runningAnimation.push(timelineToPauseAble(tl));
    const pivotOffset = {
      x:
        (this.args.instance.instance.width * this.args.options.anchor.x) /
        this.args.instance.instance.scale.x,
      y:
        (this.args.instance.instance.height * this.args.options.anchor.y) /
        this.args.instance.instance.scale.y,
    };
    this.args.orginState = {
      pivot: this.args.instance.instance.pivot.clone(),
      y: this.args.instance.instance.y,
    };
    this.args.instance.instance.pivot.x += pivotOffset.x;
    this.args.instance.instance.pivot.y += pivotOffset.y;
    this.args.instance.instance.position.set(
      this.args.instance.instance.x +
        pivotOffset.x * this.args.instance.instance.scale.x,
      this.args.instance.instance.y +
        pivotOffset.y * this.args.instance.instance.scale.x
    );
    const finalY =
      this.args.instance.instance.y +
      this.args.instance.instance.height * (this.args.options.anchor.y + 0.1);
    await tl
      .to(this.args.instance.instance, {
        pixi: { angle: this.args.options.leftAngle },
        duration: this.args.options.firstRotateDuration,
        repeat: 1,
        yoyo: true,
      })
      .to(this.args.instance.instance, {
        pixi: { y: finalY },
        duration: this.args.options.falldownDuration,
      })
      .to(
        this.args.instance.instance,
        {
          pixi: { angle: this.args.options.rightAngle },
          duration:
            this.args.options.falldownDuration *
            this.args.options.leftRotationPercent,
          repeat: 1,
          yoyo: true,
        },
        "<-=0.1"
      )
      .to(
        this.args.instance.instance,
        {
          pixi: { angle: this.args.options.leftAngle },
          duration: this.args.options.firstRotateDuration,
        },
        ">"
      )
      .to(
        this.args.instance.instance,
        {
          pixi: {
            x: `+=${
              this.args.options.xOffset * this.args.instance.instance.width
            }`,
          },
        },
        0
      );

    this.args.instance.instance.angle = 0;
    this.args.instance.instance.pivot = this.args.orginState.pivot;
    this.args.instance.instance.visible = false;
    this.args.instance.instance.y = this.args.orginState.y;
  },
  async final() {
    for (const animation of this.runningAnimation) {
      animation.pause();
    }
    if (this.args.instance) {
      this.args.instance.instance.angle = 0;
      this.args.instance.instance.visible = false;
      if (this.args.orginState) {
        this.args.instance.instance.pivot = this.args.orginState.pivot;
        this.args.instance.instance.y = this.args.orginState.y;
      }
    }
  },
};

const greeting: Animation<{
  instance: CharacterEffectInstance | undefined;
  options: ActionOptions["greeting"];
  orginState: { y: number } | undefined;
  app: Application | undefined;
}> = {
  args: {
    instance: undefined,
    options: actionOptions["greeting"],
    orginState: undefined,
    app: undefined,
  },
  runningAnimation: [],
  async animate() {
    if (!this.args.instance) {
      return;
    }
    this.args.orginState = {
      y: this.args.instance.instance.y,
    };
    const tl = gsap.timeline();
    this.runningAnimation.push(timelineToPauseAble(tl));
    const yOffset =
      this.args.options.yOffset * this.args.instance.instance.height;
    await tl.to(this.args.instance.instance, {
      pixi: { y: `-=${yOffset}` },
      repeat: 1,
      yoyo: true,
      duration: this.args.options.duration / 2,
    });
  },
  async final() {
    for (const animation of this.runningAnimation) {
      animation.pause();
    }
    if (this.args.instance && this.args.orginState) {
      this.args.instance.instance.y = this.args.orginState.y;
    }
  },
};

const hide: Animation<{
  instance: CharacterEffectInstance | undefined;
  app: Application | undefined;
}> = {
  args: { instance: undefined, app: undefined },
  runningAnimation: [],
  async animate() {
    if (!this.args.instance) {
      return;
    }
    this.args.instance.instance.visible = false;
  },
  async final() {
    if (!this.args.instance) {
      return;
    }
    this.args.instance.instance.visible = false;
  },
};

const hophop: Animation<{
  instance: CharacterEffectInstance | undefined;
  options: ActionOptions["hophop"];
  orginState: { y: number } | undefined;
  app: Application | undefined;
}> = {
  args: {
    instance: undefined,
    options: actionOptions["hophop"],
    orginState: undefined,
    app: undefined,
  },
  runningAnimation: [],
  async animate() {
    if (!this.args.instance) {
      return;
    }
    this.args.orginState = {
      y: this.args.instance.instance.y,
    };
    const tl = gsap.timeline();
    this.runningAnimation.push(timelineToPauseAble(tl));
    const yOffset =
      this.args.options.yOffset * this.args.instance.instance.height;
    await tl.to(this.args.instance.instance, {
      pixi: { y: `-=${yOffset}` },
      repeat: 3,
      yoyo: true,
      duration: this.args.options.duration / 2,
    });
  },
  async final() {
    for (const animation of this.runningAnimation) {
      animation.pause();
    }
    if (this.args.instance && this.args.orginState) {
      this.args.instance.instance.y = this.args.orginState.y;
    }
  },
};

const jump: Animation<{
  instance: CharacterEffectInstance | undefined;
  options: ActionOptions["hophop"];
  orginState: { y: number } | undefined;
  app: Application | undefined;
}> = {
  args: {
    instance: undefined,
    options: actionOptions["jump"],
    orginState: undefined,
    app: undefined,
  },
  runningAnimation: [],
  async animate() {
    if (!this.args.instance) {
      return;
    }
    this.args.orginState = {
      y: this.args.instance.instance.y,
    };
    const tl = gsap.timeline();
    this.runningAnimation.push(timelineToPauseAble(tl));
    const yOffset =
      this.args.options.yOffset * this.args.instance.instance.height;
    await tl.to(this.args.instance.instance, {
      pixi: { y: `-=${yOffset}` },
      repeat: 1,
      yoyo: true,
      duration: this.args.options.duration / 2,
    });
  },
  async final() {
    for (const animation of this.runningAnimation) {
      animation.pause();
    }
    if (this.args.instance && this.args.orginState) {
      this.args.instance.instance.y = this.args.orginState.y;
    }
  },
};

const m1: Animation<{
  instance: CharacterEffectInstance | undefined;
  app: Application | undefined;
}> = {
  args: { instance: undefined, app: undefined },
  runningAnimation: [],
  async animate() {
    if (!this.args.instance || !this.args.app) {
      return;
    }
    const tl = gsap.timeline();
    this.runningAnimation.push(timelineToPauseAble(tl));
    await moveTo(this.args.instance, 1, this.args.app, tl);
  },
  async final() {
    for (const animation of this.runningAnimation) {
      animation.pause();
    }
    if (this.args.instance && this.args.app) {
      this.args.instance.position = 1;
      const movePos = calcSpineStagePosition(
        this.args.instance.instance,
        1,
        this.args.app
      );
      this.args.instance.instance.x = movePos.x;
    }
  },
};

const m2: Animation<{
  instance: CharacterEffectInstance | undefined;
  app: Application | undefined;
}> = {
  args: { instance: undefined, app: undefined },
  runningAnimation: [],
  async animate() {
    if (!this.args.instance || !this.args.app) {
      return;
    }
    const tl = gsap.timeline();
    this.runningAnimation.push(timelineToPauseAble(tl));
    await moveTo(this.args.instance, 2, this.args.app, tl);
  },
  async final() {
    for (const animation of this.runningAnimation) {
      animation.pause();
    }
    if (this.args.instance && this.args.app) {
      this.args.instance.position = 2;
      const movePos = calcSpineStagePosition(
        this.args.instance.instance,
        2,
        this.args.app
      );
      this.args.instance.instance.x = movePos.x;
    }
  },
};

const m3: Animation<{
  instance: CharacterEffectInstance | undefined;
  app: Application | undefined;
}> = {
  args: { instance: undefined, app: undefined },
  runningAnimation: [],
  async animate() {
    if (!this.args.instance || !this.args.app) {
      return;
    }
    const tl = gsap.timeline();
    this.runningAnimation.push(timelineToPauseAble(tl));
    await moveTo(this.args.instance, 3, this.args.app, tl);
  },
  async final() {
    for (const animation of this.runningAnimation) {
      animation.pause();
    }
    if (this.args.instance && this.args.app) {
      this.args.instance.position = 3;
      const movePos = calcSpineStagePosition(
        this.args.instance.instance,
        3,
        this.args.app
      );
      this.args.instance.instance.x = movePos.x;
    }
  },
};

const m4: Animation<{
  instance: CharacterEffectInstance | undefined;
  app: Application | undefined;
}> = {
  args: { instance: undefined, app: undefined },
  runningAnimation: [],
  async animate() {
    if (!this.args.instance || !this.args.app) {
      return;
    }
    const tl = gsap.timeline();
    this.runningAnimation.push(timelineToPauseAble(tl));
    await moveTo(this.args.instance, 4, this.args.app, tl);
  },
  async final() {
    for (const animation of this.runningAnimation) {
      animation.pause();
    }
    if (this.args.instance && this.args.app) {
      this.args.instance.position = 4;
      const movePos = calcSpineStagePosition(
        this.args.instance.instance,
        4,
        this.args.app
      );
      this.args.instance.instance.x = movePos.x;
    }
  },
};

const m5: Animation<{
  instance: CharacterEffectInstance | undefined;
  app: Application | undefined;
}> = {
  args: { instance: undefined, app: undefined },
  runningAnimation: [],
  async animate() {
    if (!this.args.instance || !this.args.app) {
      return;
    }
    const tl = gsap.timeline();
    this.runningAnimation.push(timelineToPauseAble(tl));
    await moveTo(this.args.instance, 5, this.args.app, tl);
  },
  async final() {
    for (const animation of this.runningAnimation) {
      animation.pause();
    }
    if (this.args.instance && this.args.app) {
      this.args.instance.position = 5;
      const movePos = calcSpineStagePosition(
        this.args.instance.instance,
        5,
        this.args.app
      );
      this.args.instance.instance.x = movePos.x;
    }
  },
};

const shake: Animation<{
  instance: CharacterEffectInstance | undefined;
  options: ActionOptions["shake"];
  orginState: { x: number } | undefined;
  app: Application | undefined;
}> = {
  args: {
    instance: undefined,
    options: actionOptions["shake"],
    orginState: undefined,
    app: undefined,
  },
  runningAnimation: [],
  async animate() {
    if (!this.args.instance) {
      return;
    }
    this.args.orginState = {
      x: this.args.instance.instance.x,
    };
    const tl = gsap.timeline();
    this.runningAnimation.push(timelineToPauseAble(tl));
    const fromX =
      this.args.options.shakeAnimation.from * this.args.instance.instance.width;
    const toX =
      this.args.options.shakeAnimation.to * this.args.instance.instance.width;
    await tl
      .to(this.args.instance.instance, {
        pixi: { x: `+=${fromX}` },
        repeat: 1,
        yoyo: true,
        duration: this.args.options.shakeAnimation.duration / 2,
      })
      .to(this.args.instance.instance, {
        pixi: { x: `+=${toX}` },
        repeat: 1,
        yoyo: true,
        duration: this.args.options.shakeAnimation.duration / 2,
      })
      .repeat(this.args.options.shakeAnimation.repeat - 1);
  },
  async final() {
    for (const animation of this.runningAnimation) {
      animation.pause();
    }
    if (this.args.instance && this.args.orginState) {
      this.args.instance.instance.x = this.args.orginState.x;
    }
  },
};

const stiff: Animation<{
  instance: CharacterEffectInstance | undefined;
  options: ActionOptions["stiff"];
  orginState: { x: number } | undefined;
  app: Application | undefined;
}> = {
  args: {
    instance: undefined,
    options: actionOptions["stiff"],
    orginState: undefined,
    app: undefined,
  },
  runningAnimation: [],
  async animate() {
    if (!this.args.instance) {
      return;
    }
    this.args.orginState = {
      x: this.args.instance.instance.x,
    };
    const tl = gsap.timeline();
    this.runningAnimation.push(timelineToPauseAble(tl));
    const fromX =
      this.args.options.shakeAnimation.from * this.args.instance.instance.width;
    const toX =
      this.args.options.shakeAnimation.to * this.args.instance.instance.width;
    await tl
      .to(this.args.instance.instance, {
        pixi: { x: `+=${fromX}` },
        repeat: 1,
        yoyo: true,
        duration: this.args.options.shakeAnimation.duration / 2,
      })
      .to(this.args.instance.instance, {
        pixi: { x: `+=${toX}` },
        repeat: 1,
        yoyo: true,
        duration: this.args.options.shakeAnimation.duration / 2,
      })
      .repeat(this.args.options.shakeAnimation.repeat - 1);
  },
  async final() {
    for (const animation of this.runningAnimation) {
      animation.pause();
    }
    if (this.args.instance && this.args.orginState) {
      this.args.instance.instance.x = this.args.orginState.x;
    }
  },
};

export default {
  a,
  ar,
  al,
  closeup,
  d,
  dl,
  dr,
  falldownR,
  falldownL,
  greeting,
  hide,
  hophop,
  jump,
  m1,
  m2,
  m3,
  m4,
  m5,
  shake,
  stiff,
};
