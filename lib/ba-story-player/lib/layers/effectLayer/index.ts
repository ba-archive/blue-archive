import { CheckMethod, Layer } from "@/type";
import {
  otherEffectAnimations,
  wait,
  ZmcInstance,
  otherEffectCheckMethods,
} from "./effect/otherEffect";

export default class EffectLayer extends Layer {
  animations = { ...otherEffectAnimations };
  instances: { zmcInstance?: ZmcInstance } = {};
  checkMethodMap = {
    wait,
    ...otherEffectCheckMethods,
  };
}
