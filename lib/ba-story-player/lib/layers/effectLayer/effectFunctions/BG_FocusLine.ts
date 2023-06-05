import eventBus from "@/eventBus";
import { usePlayerStore } from "@/stores";
import { Emitter, EmitterConfigV3, Particle } from "@pixi/particle-emitter";
import { BehaviorOrder } from "@pixi/particle-emitter/lib/behaviors";
import { Container, Sprite } from "pixi.js";
import { emitterConfigs, emitterStarter } from "../emitterUtils";
import { getEmitterType, sprite2TransParent } from "../resourcesUtils";

export default async function BG_FocusLine(resources: Sprite[]) {
  // 原理是线条 emitter
  eventBus.emit("playBgEffectSound", "BG_FocusLine");
  const { app } = usePlayerStore();
  const appWidth = app.view.width;
  const appHeight = app.view.height;
  let emitterContainer = new Container();
  app.stage.addChild(emitterContainer);
  emitterContainer.zIndex = -1;
  const centerPoint = [appWidth / 2, appHeight / 2].map(i => parseInt(i + ""));
  class FocusLine {
    public static type = "focusLine";
    public order = 5; // 代表延迟执行, 可能是 emitter 包的问题, 引入定义报错
    /** 第一个点是两条线段的连接点 */
    getAngle = (pointArr: { x: number; y: number }[]) => {
      const [p1, p2, p3] = pointArr;
      const x1 = p2.x - p1.x;
      const x2 = p3.x - p1.x;
      const y1 = p2.y - p1.y;
      const y2 = p3.y - p1.y;
      const dot = x1 * x2 + y1 * y2;
      const det = x1 * y2 - y1 * x2;
      const angle = (Math.atan2(det, dot) / Math.PI) * 180;
      return (angle + 360) % 360;
    };
    initParticles(first: Particle): void {
      let next = first;
      while (next) {
        const { x, y } = next;
        const angle = this.getAngle([
          { x, y },
          { x: 1, y },
          { x: centerPoint[0], y: centerPoint[1] },
        ]);
        let transAngle = 0; // 最左边不用转
        if (x > 0 && y === 0) {
          transAngle = 180;
        }
        if (x > 0 && y === appHeight) {
          transAngle = 180;
        }
        if (x === appWidth && y > 0) {
          transAngle = 180;
        }
        next.angle = angle - transAngle;
        next.width =
          Math.random() * (appWidth * (0.24 - 0.037)) + appWidth * 0.037; // 0.037 - 0.24 之间
        next = next.next;
      }
    }
  }
  Emitter.registerBehavior(FocusLine);
  let emitterConfig: EmitterConfigV3 = {
    ...(emitterConfigs("focusline") as EmitterConfigV3),
  };
  const sprite = sprite2TransParent(resources[0]);
  getEmitterType(emitterConfig, "textureRandom").config.textures.push(
    sprite.texture
  );
  const shapeData = getEmitterType(emitterConfig, "spawnShape").config.data[0];
  shapeData[1].y = appHeight;
  shapeData[2].x = appWidth;
  shapeData[2].y = appHeight;
  shapeData[3].x = appWidth;
  const ringEmitter = new Emitter(emitterContainer, emitterConfig);
  const ringRemover = emitterStarter(ringEmitter);
  return async () => {
    await ringRemover();
  };
}
