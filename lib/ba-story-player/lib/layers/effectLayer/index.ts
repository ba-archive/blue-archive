import { CheckMethod, Layer } from "@/type";
import { otherEffectAnimations, wait } from "./effect/otherEffect";

export default class EffectLayer extends Layer {
  animations = { ...otherEffectAnimations };
  checkMethodMap: Record<string | "wait", CheckMethod<this>> = {
    wait,
  };
}
