import { CheckMethod, HandlerMap, Layer, Animation } from "@/type";
import {
  otherEffectAnimations,
  wait,
  ZmcInstance,
  otherEffectCheckMethods,
} from "./effect/otherEffect";
import callableAnimations from "./callableEffect";
import { Application } from "pixi.js";
export default class EffectLayer extends Layer {
  constructor(app: Application, handlerMap: HandlerMap) {
    super(app, handlerMap);
    handlerMap.callEffect = async (effect, config) => {
      const callAnimation = Reflect.get(
        this.animations,
        `${effect}Animation`
      ) as Animation<any>;
      if (!callAnimation) {
        throw new Error("调用了不存在的effect");
      } else {
        for (const key of Object.keys(config)) {
          Reflect.set(callAnimation.args, key, Reflect.get(config, key));
        }
        await callAnimation.animate();
      }
    };
  }
  animations = { ...otherEffectAnimations, ...callableAnimations };
  instances: { zmcInstance?: ZmcInstance } = {};
  checkMethodMap = {
    wait,
    ...otherEffectCheckMethods,
  };
}
