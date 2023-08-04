import eventBus from "@/eventBus";
import { storyHandler } from "@/index";
import { usePlayerStore } from "@/stores";
import { wait } from "@/utils";
import gsap from "gsap";
import { Application, Sprite } from "pixijs";
import { calcBackgroundImageSize } from "@/layers/bgLayer";
import { ZmcArgs } from "@/types/common";
import { playBGEffect, removeBGEffect } from "./bgEffectHandlers";
import { emitterContainer } from "./emitterUtils";

/**
 * 初始化特效层, 订阅player的剧情信息.
 */
export function effectInit() {
  const playerStore = usePlayerStore();
  playerStore.app.stage.addChild(emitterContainer);
  eventBus.on("transitionIn", async transition => {
    let duration =
      transition.TransitionInDuration !== 1
        ? transition.TransitionInDuration
        : 1000;
    duration = storyHandler.isSkip ? 50 : duration;
    switch (transition.TransitionIn) {
      case "fade":
        await playTransition("black", duration, "in");
        break;
      case "fade_white":
        await playTransition("white", duration, "in");
        break;
      default: {
        const swipe =
          SwipeTransitionDirectionMap[transition.TransitionInResource || ""];
        if (typeof swipe === "number") {
          await playHorSwipeTransition(duration, swipe, "in");
        }
      }
    }
    eventBus.emit("transitionInDone");
  });
  eventBus.on("transitionOut", async transition => {
    let duration =
      transition.TransitionOutDuration !== 1
        ? transition.TransitionOutDuration
        : 1000;
    duration = storyHandler.isSkip ? 50 : duration;
    switch (transition.TransitionOut) {
      case "fade":
        await playTransition("black", duration, "out");
        break;
      case "fade_white":
        await playTransition("white", duration, "out");
        break;
      default: {
        const swipe =
          SwipeTransitionDirectionMap[transition.TransitionInResource || ""];
        if (typeof swipe === "number") {
          await playHorSwipeTransition(duration, swipe, "out");
        }
      }
    }
    eventBus.emit("transitionOutDone");
  });
  eventBus.on("playEffect", async effects => {
    const promiseArray: Array<Promise<any>> = [];
    for (const effect of effects.otherEffect) {
      const bgInstance = playerStore.bgInstance;
      switch (effect.type) {
        case "wait":
          promiseArray.push(wait(effect.args));
          break;
        case "bgshake":
          if (bgInstance) {
            promiseArray.push(playBgShake(bgInstance));
          }
          break;
        case "zmc":
          if (bgInstance) {
            promiseArray.push(
              zmcPlayer.playZmc(bgInstance, effect.args, playerStore.app)
            );
          }
          break;
        default:
          break;
      }
    }
    if (effects.BGEffect) {
      promiseArray.push(playBGEffect(effects.BGEffect));
    }
    await Promise.allSettled(promiseArray);
    eventBus.emit("effectDone");
  });
  eventBus.on("removeEffect", removeEffect);
}

export async function removeEffect() {
  await removeBGEffect();
  const { bgInstance } = usePlayerStore();
  zmcPlayer.removeZmc(bgInstance);
}

/**
 * 播放器渐变特效
 * @param color 渐变后的颜色
 * @param durationMs 渐变时间, 单位为ms
 * @param mode 渐变方式 in为淡入, out为淡出
 */
async function playTransition(
  color: "black" | "white",
  durationMs: number,
  mode: "in" | "out"
): Promise<void> {
  const background = document.querySelector(
    "#player__background"
  ) as HTMLDivElement;
  background.style.backgroundColor = color;
  const playerMain = document.querySelector("#player__main");
  function killTransitionIn() {
    // 避免在transitionIn 动画时快进导致一直黑屏或白屏
    gsap.killTweensOf("#player__main");
    gsap.to("#player__main", { alpha: 1 });
    eventBus.off("skipping", killTransitionIn);
  }
  eventBus.on("skipping", killTransitionIn);
  switch (mode) {
    case "in":
      await gsap.fromTo(
        playerMain,
        { alpha: 1 },
        { alpha: 0, duration: durationMs / 1000 }
      );
      break;
    case "out":
      await gsap.fromTo(
        playerMain,
        { alpha: 0 },
        { alpha: 1, duration: durationMs / 1000 }
      );
      break;
  }
}

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
): Promise<void> {
  return new Promise<void>(resolve => {
    const background = document.querySelector(
      "#player__background"
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
    timeline
      .to(cover, {
        left: param.x2,
      })
      .to(
        cover,
        {
          top: param.y2,
        },
        "<"
      )
      .then(() => {
        // 延长一下, 等其他效果生效?
        setTimeout(() => {
          background.removeChild(cover);
        }, 50);
        resolve();
      });
  });
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

/**
 * 背景摇晃
 * @param bgInstance 背景图片实例
 */
async function playBgShake(bgInstance: Sprite): Promise<void> {
  const tl = gsap.timeline();
  const fromX = -bgInstance.width * 0.01;
  const toX = bgInstance.width * 0.01;
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
    .repeat(1)
    .then();
}

/**
 * 可能对同个背景图片设置多次zmc, 用默认scale判断是否已经设置图片原始尺寸
 */
const Default_Scale = 100;
const zmcPlayer = {
  bgInstanceOriginScale: Default_Scale,
  bgInstanceOriginPosition: { x: 0, y: 0 },
  onZmc: false,
  /**
   * 根据参数执行zmc效果
   * @param bgInstance 背景图片实例
   * @param args zmc参数
   * @param app pixi Application实例
   */
  async playZmc(
    bgInstance: Sprite,
    args: ZmcArgs,
    app: Application
  ): Promise<void> {
    //背景图片切换时取消zmc状态
    this.onZmc = true;
    const removeOnZmc = () => {
      this.onZmc = false;
      eventBus.off("showBg", removeOnZmc);
    };
    eventBus.on("showBg", removeOnZmc);
    if (this.bgInstanceOriginScale === Default_Scale) {
      this.bgInstanceOriginScale = bgInstance.scale.x;
      this.bgInstanceOriginPosition = bgInstance.position.clone();
    }
    const scaleArg = args.size;
    const offsetX = args.position[0];
    const offsetY = args.position[1];
    const { scale: rawScale } = calcBackgroundImageSize(bgInstance, app);
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

    const afterScaleWidth =
      (bgInstance.width / bgInstance.scale.x) * finalScale;
    const afterScaleHalfWidth = afterScaleWidth / 2;
    const afterScaleHeight =
      (bgInstance.height / bgInstance.scale.y) * finalScale;
    const afterScaleHalfHeight = afterScaleHeight / 2;
    const finalX = -(afterScaleHalfWidth - (viewHalfWidth - finalOffsetX));
    const finalY = -(afterScaleHalfHeight - (viewHalfHeight + finalOffsetY));

    switch (args.type) {
      case "instant":
        bgInstance.scale.set(finalScale);
        bgInstance.position.set(finalX, finalY);
        break;
      case "move":
        if (args.duration !== 10) {
          const timeline = gsap.timeline({
            defaults: {
              duration: args.duration / 1000,
              ease: "none",
            },
          });
          await timeline
            .to(bgInstance, {
              x: finalX,
            })
            .to(
              bgInstance,
              {
                y: finalY,
              },
              "<"
            )
            .to(
              bgInstance.scale,
              {
                x: finalScale,
              },
              "<"
            )
            .to(
              bgInstance.scale,
              {
                y: finalScale,
              },
              "<"
            );
        } else {
          bgInstance.scale.set(finalScale);
          bgInstance.position.set(finalX, finalY);
        }
    }
  },

  /**
   * 移除zmc特效
   */
  async removeZmc(bgInstance: Sprite | null) {
    if (!this.onZmc) {
      this.bgInstanceOriginScale = Default_Scale;
      return;
    }
    if (bgInstance) {
      //存有图片原始比例且当前比例不是原始比例, 判断处于zmc状态
      if (
        this.onZmc &&
        this.bgInstanceOriginScale !== Default_Scale &&
        bgInstance.scale.x !== this.bgInstanceOriginScale
      ) {
        bgInstance.scale.set(this.bgInstanceOriginScale);
        bgInstance.pivot.set(0, 0);
        bgInstance.position = this.bgInstanceOriginPosition;
        this.bgInstanceOriginScale = Default_Scale;
        this.onZmc = false;
      }
    }
  },
};
