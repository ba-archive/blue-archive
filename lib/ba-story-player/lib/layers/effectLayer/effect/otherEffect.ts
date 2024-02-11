import {
  CheckMethod,
  Animation,
  DefaultFinalFunction,
  ZmcInstanceArg,
  ZmcMoveArg,
  TransitionTableItem,
} from "@/type";
import EffectLayer from "../";
import { ZINDEXBASE } from "@/utils";
import { Application, Sprite } from "pixi.js";
import { playerId, playerBackgroundId } from "../";
import { isEqual } from "lodash-es";
import gsap from "gsap";

type EffectCheckMethod = CheckMethod<InstanceType<typeof EffectLayer>>;

const waitAnimation: Animation<{ waitms: number }> = {
  runningAnimation: [],
  args: {
    waitms: 0,
  },
  async animate() {
    await new Promise<void>(resolve => {
      const waitTimeout = setTimeout(resolve, this.args.waitms);
      this.runningAnimation.push({
        async pause() {
          clearTimeout(waitTimeout);
        },
      });
    });
  },
  final: DefaultFinalFunction,
};

export const wait: EffectCheckMethod = async function (node) {
  if (node.effect.action) {
    if (node.effect.action.type === "wait") {
      this.animations.waitAnimation.args.waitms = node.effect.action.args;
      await this.animations.waitAnimation.animate();
    }
  }
};

/**
 * 根据原始的position和size参数计算出最后bgInstance的大小位置(算法原理不明)
 * @param position
 * @param inputScale
 * @param app
 * @param bgInstance
 */
function getBgInfo(
  position: [number, number],
  scaleArg: number,
  app: Application,
  bgInstance: Sprite
) {
  const rawScale = bgInstance.scale.x;
  const offsetX = position[0];
  const offsetY = position[1];
  const scale = 3150 / scaleArg;
  const finalScale = scale * rawScale;

  const viewHalfWidth = app.screen.width / 2;
  const viewHalfHeight = app.screen.height / 2;

  const finalOffsetXA = offsetX / scale;
  const finalOffsetYA = offsetY / scale;

  const finalOffsetXB = (offsetX * finalScale) / 2;
  const finalOffsetYB = (offsetY * finalScale) / 2;

  const finalOffsetX = finalOffsetXA * (1 / 5) + finalOffsetXB * (4 / 5);
  const finalOffsetY = (finalOffsetYA + finalOffsetYB) / 2;

  const afterScaleWidth = (bgInstance.width / bgInstance.scale.x) * finalScale;
  const afterScaleHalfWidth = afterScaleWidth / 2;
  const afterScaleHeight =
    (bgInstance.height / bgInstance.scale.y) * finalScale;
  const afterScaleHalfHeight = afterScaleHeight / 2;
  const finalX = -(afterScaleHalfWidth - (viewHalfWidth - finalOffsetX));
  const finalY = -(afterScaleHalfHeight - (viewHalfHeight + finalOffsetY));

  return { scale: finalScale, position: { x: finalX, y: finalY } };
}

export type ZmcInstance = {
  bgInstance: Sprite;
  position: [number, number];
  size: number;
  originScale: number;
  originPosition: { x: number; y: number };
};
/**
 * zmc动画共有参数
 */
interface ZmcAnimationCommonArg {
  bgInstance: Sprite | null;
  app: Application | null;
}
const zmcInstantAnimation: Animation<
  ZmcInstanceArg &
    ZmcAnimationCommonArg & {
      originScale: number;
      originPosition: { x: number; y: number };
    }
> = {
  args: {
    type: "instant",
    position: [0, 0],
    size: 0,
    originScale: 1,
    originPosition: { x: 0, y: 0 },
    bgInstance: null,
    app: null,
  },
  runningAnimation: [],
  async animate() {
    const app = this.args.app;
    const bgInstance = this.args.bgInstance;
    if (!app || !bgInstance) {
      throw new Error("zmc instant参数不全");
    } else {
      const bgInfo = getBgInfo(
        this.args.position,
        this.args.size,
        app,
        bgInstance
      );
      bgInstance.scale.set(bgInfo.scale);
      bgInstance.position.set(bgInfo.position.x, bgInfo.position.y);
      this.runningAnimation.push({
        pause: async () => {
          if (this.args.bgInstance) {
            this.args.bgInstance.scale.set(this.args.originScale);
            this.args.bgInstance.position.set(
              this.args.originPosition.x,
              this.args.originPosition.y
            );
          }
        },
      });
    }
  },
  final: DefaultFinalFunction,
};
const zmcMoveAnimation: Animation<ZmcMoveArg & ZmcAnimationCommonArg> = {
  args: {
    type: "move",
    from: { size: 0, position: [0, 0] },
    to: { size: 0, position: [0, 0] },
    duration: 10,
    bgInstance: null,
    app: null,
  },
  runningAnimation: [],
  async animate() {
    const app = this.args.app;
    const bgInstance = this.args.bgInstance;
    if (!app || !bgInstance) {
      throw new Error("zmc instant参数不全");
    } else {
      const initBgInfo = getBgInfo(
        this.args.from.position,
        this.args.from.size,
        app,
        bgInstance
      );
      const finalBgInfo = getBgInfo(
        this.args.to.position,
        this.args.to.size,
        app,
        bgInstance
      );
      const tl = gsap.timeline();
      this.runningAnimation.push({
        async pause() {
          await tl.clear();
        },
      });
      await tl.fromTo(
        bgInstance,
        {
          pixi: {
            x: initBgInfo.position.x,
            y: initBgInfo.position.y,
            scale: initBgInfo.scale,
          },
        },
        {
          pixi: {
            x: finalBgInfo.position.x,
            y: finalBgInfo.position.y,
            scale: finalBgInfo.scale,
          },
          duration: this.args.duration / 1000,
          ease: "none",
        }
      );
    }
  },
  final: DefaultFinalFunction,
};
const zmc: EffectCheckMethod = async function (node, app, handlerMap) {
  if (node.effect.action?.type === "zmc") {
    const zmcArgs = node.effect.action.args;
    const bgInstance = handlerMap.getBgInstance();
    if (!bgInstance) {
      throw new Error("未找到bg实例");
    }
    if (zmcArgs.type === "instant") {
      const zmcInstance = this.instances.zmcInstance;
      //instant动画保持
      if (
        zmcInstance &&
        isEqual(zmcInstance.position, zmcArgs.position) &&
        zmcArgs.size === zmcInstance.size &&
        handlerMap.getBgInstance() === zmcInstance.bgInstance
      ) {
        return;
      } else {
        this.animations.zmcInstantAnimation.args = {
          ...zmcArgs,
          bgInstance,
          app,
          originScale: bgInstance.scale.x,
          originPosition: bgInstance.position.clone(),
        };
        await this.animations.zmcInstantAnimation.animate();
        this.instances.zmcInstance = {
          ...zmcArgs,
          bgInstance,
          originScale: bgInstance.scale.x,
          originPosition: bgInstance.position.clone(),
        };
      }
    } else if (zmcArgs.type === "move") {
      this.instances.zmcInstance = {
        ...zmcArgs.from,
        bgInstance,
        originScale: bgInstance.scale.x,
        originPosition: bgInstance.position.clone(),
      };
      this.animations.zmcMoveAnimation.args = {
        ...zmcArgs,
        app,
        bgInstance,
      };
      await this.animations.zmcMoveAnimation.animate();
    }
  } else {
    if (this.instances.zmcInstance) {
      const bgInstance = handlerMap.getBgInstance();
      if (bgInstance) {
        bgInstance.scale.set(this.instances.zmcInstance.originScale);
        const position = this.instances.zmcInstance.originPosition;
        bgInstance.position.set(position.x, position.y);
      }
      this.instances.zmcInstance = undefined;
    }
  }
};

const bgShakeAnimation: Animation<{ bgInstance?: Sprite }> = {
  args: {},
  runningAnimation: [],
  async animate() {
    const bgInstance = this.args.bgInstance;
    if (!bgInstance) {
      throw new Error("参数错误, effect: bgshake");
    }
    const tl = gsap.timeline();
    const fromX = bgInstance.width * 0.01;
    const toX = bgInstance.width * 0.01;
    this.runningAnimation.push({
      async pause() {
        await tl.clear();
      },
    });
    await tl
      .to(bgInstance, {
        pixi: { x: `+=${fromX}` },
        repeat: 1,
        yoyo: true,
        duration: 0.1,
      })
      .to(bgInstance, {
        pixi: { x: `+=${toX}` },
        repeat: 1,
        yoyo: true,
        duration: 0.1,
      })
      .repeat(1);
  },
  final: DefaultFinalFunction,
};
export const bgShake: EffectCheckMethod = async function (node, _, handlerMap) {
  if (node.effect.action?.type === "bgshake") {
    bgShakeAnimation.args.bgInstance = handlerMap.getBgInstance();
    await bgShakeAnimation.animate();
  }
};

/**
 * 播放器渐变特效
 * @param color 渐变后的颜色
 * @param durationMs 渐变时间, 单位为ms
 * @param mode 渐变方式 in为淡入, out为淡出
 */
function playTransition(
  color: "black" | "white",
  durationMs: number,
  mode: "in" | "out"
) {
  const background = document.querySelector(
    `#${playerBackgroundId}`
  ) as HTMLDivElement;
  background.style.backgroundColor = color;
  const playerMain = document.querySelector(`#${playerId}`);
  switch (mode) {
    case "in":
      return gsap.fromTo(
        playerMain,
        { alpha: 1 },
        { alpha: 0, duration: durationMs / 1000 }
      );
    case "out":
      return gsap.fromTo(
        playerMain,
        { alpha: 0 },
        { alpha: 1, duration: durationMs / 1000 }
      );
  }
}
const fadeAnimation: Animation<{
  color: "black" | "white";
  mode: "in" | "out";
  durationMs: number;
}> = {
  args: { color: "black", mode: "in", durationMs: 0 },
  runningAnimation: [],
  async animate() {
    console.log("args:", this.args);
    const animation = playTransition(
      this.args.color,
      this.args.durationMs,
      this.args.mode
    );
    this.runningAnimation.push({
      async pause() {
        await animation.kill();
      },
    });
    await animation;
  },
  final: DefaultFinalFunction,
};

enum SwipeTransitionDirection {
  L_TO_R,
  R_TO_L,
  T_TO_B,
  B_TO_T,
}

const SwipeTransitionDirectionMap: { [key: string]: SwipeTransitionDirection } =
  {
    "Effect/UI/BGFX/UI_FX_HorSwipe_LtoR_Out": SwipeTransitionDirection.L_TO_R,
    "Effect/UI/BGFX/UI_FX_HorSwipe_RtoL_Out": SwipeTransitionDirection.R_TO_L,
    "Effect/UI/BGFX/UI_FX_VerSwipe_BtoT_Out": SwipeTransitionDirection.B_TO_T,
    "Effect/UI/BGFX/UI_FX_VerSwipe_TtoB_Out": SwipeTransitionDirection.T_TO_B,
    "Effect/UI/BGFX/UI_FX_HorSwipe_LtoR_In": SwipeTransitionDirection.L_TO_R,
    "Effect/UI/BGFX/UI_FX_HorSwipe_RtoL_In": SwipeTransitionDirection.R_TO_L,
    "Effect/UI/BGFX/UI_FX_VerSwipe_BtoT_In": SwipeTransitionDirection.B_TO_T,
    "Effect/UI/BGFX/UI_FX_VerSwipe_TtoB_In": SwipeTransitionDirection.T_TO_B,
  };

function playHorSwipeTransition(
  duration: number,
  direction: SwipeTransitionDirection,
  type: "in" | "out"
) {
  const background = document.querySelector(
    `#${playerBackgroundId}`
  ) as HTMLDivElement;
  const backgroundStyle = getComputedStyle(background);
  const screenWidth = Number(backgroundStyle.width.replace("px", ""));
  const screenHeight = Number(backgroundStyle.height.replace("px", ""));
  const param = {
    x1: 0, // sprite起始x
    y1: 0, // sprite起始y
    x2: 0, // sprite结束x
    y2: 0, // sprite结束y
    w: screenWidth, // sprite宽
    h: screenHeight, // sprite高
  };
  // 0.1倍的宽高, 恰好是transition的渐变终点
  const width01 = screenWidth * 0.1;
  const height01 = screenHeight * 0.1;
  const durationInSecond = duration / 1000;
  switch (direction) {
    case SwipeTransitionDirection.L_TO_R: {
      param.w = screenWidth + width01;
      if (type === "in") {
        param.x1 = -param.w;
      } else {
        param.x1 = -width01;
        param.x2 = screenWidth;
      }
      break;
    }
    case SwipeTransitionDirection.R_TO_L: {
      param.w = screenWidth + width01;
      if (type === "in") {
        param.x1 = screenWidth;
        param.x2 = -width01;
      } else {
        param.x2 = -param.w;
      }
      break;
    }
    case SwipeTransitionDirection.T_TO_B: {
      param.h = screenHeight + height01;
      if (type === "in") {
        param.y1 = -param.h;
      } else {
        param.y1 = -height01;
        param.y2 = screenHeight;
      }
      break;
    }
    case SwipeTransitionDirection.B_TO_T: {
      param.h = screenHeight + height01;
      if (type === "in") {
        param.y1 = screenHeight;
        param.y2 = -height01;
      } else {
        param.y2 = -param.h;
      }
      break;
    }
  }
  const cover = createLinearGradientImageFromCanvas(
    param.w,
    param.h,
    direction
  );
  cover.style.position = "absolute";
  cover.style.left = String(param.x1) + "px";
  cover.style.top = String(param.y1) + "px";
  cover.classList.add("transition-cover");
  cover.classList.add(type);
  background.appendChild(cover);
  const timeline = gsap.timeline({
    defaults: {
      ease: "none",
      duration: durationInSecond,
    },
  });
  console.log(cover);
  return timeline
    .to(cover, {
      left: param.x2,
    })
    .to(
      cover,
      {
        top: param.y2,
      },
      "<"
    );
}

/**
 * 通过canvas画图获取渐变的背景
 * @param width pixi screen宽 其他的也可以
 * @param height pixi screen高 其他的也可以
 * @param direction 方向
 */
function createLinearGradientImageFromCanvas(
  width: number,
  height: number,
  direction: SwipeTransitionDirection
) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  let linearGradient: CanvasGradient;
  switch (direction) {
    case SwipeTransitionDirection.L_TO_R: {
      linearGradient = ctx.createLinearGradient(width, 0, 0, 0);
      break;
    }
    case SwipeTransitionDirection.R_TO_L: {
      linearGradient = ctx.createLinearGradient(0, 0, width, 0);
      break;
    }
    case SwipeTransitionDirection.T_TO_B: {
      linearGradient = ctx.createLinearGradient(0, height, 0, 0);
      break;
    }
    case SwipeTransitionDirection.B_TO_T: {
      linearGradient = ctx.createLinearGradient(0, 0, 0, height);
      break;
    }
  }
  linearGradient.addColorStop(0, "transparent");
  linearGradient.addColorStop(0.09, "black");
  linearGradient.addColorStop(1, "black");
  ctx.fillStyle = linearGradient;
  ctx.fillRect(0, 0, width, height);
  return canvas;
}
const swipeAnimation: Animation<{ rawArgs?: TransitionTableItem }> = {
  args: {},
  runningAnimation: [],
  async animate() {
    if (this.args.rawArgs) {
      const rawArgs = this.args.rawArgs;
      let swipe =
        SwipeTransitionDirectionMap[rawArgs.TransitionInResource || ""];
      if (typeof swipe === "number") {
        const tl = playHorSwipeTransition(
          rawArgs.TransitionInDuration,
          swipe,
          "in"
        );
        this.runningAnimation.push({
          async pause() {
            await tl.clear();
          },
        });
        await tl;
      }
      swipe = SwipeTransitionDirectionMap[rawArgs.TransitionOutResource || ""];
      if (typeof swipe === "number") {
        const tl = playHorSwipeTransition(
          rawArgs.TransitionOutDuration,
          swipe,
          "out"
        );
        this.runningAnimation.push({
          async pause() {
            await tl.kill();
          },
        });
        await tl;
      }
    }
  },
  final: DefaultFinalFunction,
};

const transition: EffectCheckMethod = async function (node) {
  if (node.effect.action?.type === "transition") {
    const args = node.effect.action.args;
    switch (args.TransitionIn) {
      case "fade":
        fadeAnimation.args = {
          color: "black",
          durationMs: args.TransitionInDuration,
          mode: "in",
        };
        await fadeAnimation.animate();
        break;
      case "fade_white":
        fadeAnimation.args = {
          color: "white",
          durationMs: args.TransitionInDuration,
          mode: "in",
        };
        await fadeAnimation.animate();
        break;
      default: {
        swipeAnimation.args.rawArgs = args;
        await swipeAnimation.animate();
      }
    }
    switch (args.TransitionOut) {
      case "fade":
        fadeAnimation.args = {
          color: "black",
          durationMs: args.TransitionOutDuration,
          mode: "out",
        };

        console.log(args.TransitionOutDuration);
        await fadeAnimation.animate();
        break;
      case "fade_white":
        fadeAnimation.args = {
          color: "white",
          durationMs: args.TransitionOutDuration,
          mode: "out",
        };
        await fadeAnimation.animate();
        break;
    }
  }
};

export const otherEffectAnimations = {
  waitAnimation,
  zmcInstantAnimation,
  zmcMoveAnimation,
  bgShakeAnimation,
};

export const otherEffectCheckMethods = {
  zmc,
  bgShake,
  transition,
};
