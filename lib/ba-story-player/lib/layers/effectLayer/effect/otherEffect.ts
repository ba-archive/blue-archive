import { CheckMethod, Animation, DefaultFinalFunction } from "@/type";
import EffectLayer from "../";
import { Application, Sprite } from "pixi.js";
import { isEqual } from "lodash-es";

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

type ZmcInstantArg = {
  position: [number, number];
  size: number;
  originScale: number;
  originPosition: { x: number; y: number };
  bgInstance: Sprite | null;
  app: Application | null;
};
export type ZmcInstance = {
  bgInstance: Sprite;
  position: [number, number];
  size: number;
  originScale: number;
  originPosition: { x: number; y: number };
};
const zmcInstantAnimation: Animation<ZmcInstantArg> = {
  args: {
    position: [0, 0],
    size: 0,
    originScale: 1,
    originPosition: { x: 0, y: 0 },
    bgInstance: null,
    app: null,
  },
  runningAnimation: [],
  async animate() {
    const scaleArg = this.args.size;
    const offsetX = this.args.position[0];
    const offsetY = this.args.position[1];
    const rawScale = this.args.originScale;
    const scale = 3150 / scaleArg;
    const finalScale = scale * rawScale;
    if (!this.args.app || !this.args.bgInstance) {
      throw new Error("zmc instant参数不全");
    }
    const app = this.args.app;
    const bgInstance = this.args.bgInstance;

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

    bgInstance.scale.set(finalScale);
    bgInstance.position.set(finalX, finalY);
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
  },
  final: DefaultFinalFunction,
};
const zmc: EffectCheckMethod = async function (node, app, handlerMap) {
  if (node.effect.action?.type === "zmc") {
    const zmcArgs = node.effect.action.args;
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
        const bgInstance = handlerMap.getBgInstance();
        if (!bgInstance) {
          throw new Error("未找到bg实例");
        }
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
    }
  } else {
    if (this.instances.zmcInstance) {
      await this.animations.zmcInstantAnimation.final();
      this.instances.zmcInstance = undefined;
    }
  }
};

export const otherEffectAnimations = {
  waitAnimation,
  zmcInstantAnimation,
};

export const otherEffectCheckMethods = {
  zmc,
};
