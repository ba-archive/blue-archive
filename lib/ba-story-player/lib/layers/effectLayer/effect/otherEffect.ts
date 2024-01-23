import { CheckMethod, Animation } from "@/type";
import EffectLayer from "../";

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
  async final() {
    await Promise.all(
      this.runningAnimation.map(animation => animation.pause())
    );
    this.runningAnimation = [];
  },
};

export const wait: EffectCheckMethod = async function (node) {
  if (node.effect.action) {
    if (node.effect.action.type === "wait") {
      this.animations.waitAnimation.args.waitms = node.effect.action.args;
      await this.animations.waitAnimation.animate();
    }
  }
};

export const otherEffectAnimations = {
  waitAnimation,
};
