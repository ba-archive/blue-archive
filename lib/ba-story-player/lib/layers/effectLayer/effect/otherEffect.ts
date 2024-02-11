import {
  CheckMethod,
  Animation,
  DefaultFinalFunction,
  ZmcInstanceArg,
  ZmcMoveArg,
} from "@/type";
import EffectLayer from "../";
import { Application, Sprite } from "pixi.js";
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
      this.runningAnimation.push({
        async pause() {
          await tl.clear();
        },
      });
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

export const otherEffectAnimations = {
  waitAnimation,
  zmcInstantAnimation,
  zmcMoveAnimation,
};

export const otherEffectCheckMethods = {
  zmc,
};
