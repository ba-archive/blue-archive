import {
  Animation,
  DefaultFinalFunction,
  CallalbeEffectConfigMap,
} from "@/type";
import EffectLayer from ".";
import gsap from "gsap";

export const playerId = "d2f8a8415469eb47477";
const fadeAnimation: Animation<CallalbeEffectConfigMap["fade"]> = {
  args: {
    color: "white",
    toSolidDuration: 1,
    solidStateDuration: 1.3,
    toNormalDuration: 0.8,
  },
  runningAnimation: [],
  async animate() {
    const player = document.querySelector(`#${playerId}`) as HTMLDivElement;
    const playerCanvas = document.querySelector(
      `#${playerId} canvas`
    ) as HTMLCanvasElement;
    if (!player || !playerCanvas) {
      throw new Error("找不到canvas,effect:fade");
    }

    player.style.backgroundColor = this.args.color;
    const tl = gsap.timeline();
    this.runningAnimation.push({
      async pause() {
        await tl.kill();
        playerCanvas.style.opacity = "1";
      },
    });
    await tl
      .to(playerCanvas, {
        alpha: 0,
        duration: this.args.toSolidDuration,
      })
      .to(playerCanvas, {
        alpha: 1,
        duration: this.args.toNormalDuration,
      });
  },
  final: DefaultFinalFunction,
};

export default { fadeAnimation };
