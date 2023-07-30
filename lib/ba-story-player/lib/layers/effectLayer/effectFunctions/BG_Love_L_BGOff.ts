import { usePlayerStore } from "@/stores";
import { Container, Sprite } from "pixijs";
import { emitterConfigs, emitterStarter } from "../emitterUtils";
import { getEmitterType, sprite2TransParent } from "../resourcesUtils";
import { Emitter, EmitterConfigV3 } from "@pixi/particle-emitter";

export default async function BG_Love_L_BGOff(resources: Sprite[]) {
  // 原理是波纹, 粉红爱心, 渐变背景
  const { app } = usePlayerStore();
  const appWidth = app.view.width;
  const appHeight = app.view.height;
  const backSprite = resources[2];
  backSprite.x = -0.2 * appWidth;
  backSprite.y = -0.2 * appHeight;
  backSprite.width = appWidth * 1.4;
  backSprite.height = appHeight * 1.4;
  backSprite.zIndex = -1;
  app.stage.addChild(backSprite);
  // 心心特效
  const emitterContainer = new Container();
  app.stage.addChild(emitterContainer);
  emitterContainer.zIndex = -1;
  const heartConfig: EmitterConfigV3 = {
    ...(emitterConfigs("love_heart") as EmitterConfigV3),
  };
  heartConfig.pos = {
    x: appWidth / 2,
    y: appHeight / 2,
  };
  // 塞入 texture 中
  getEmitterType(heartConfig, "textureRandom").config.textures.push(
    resources[0].texture
  );
  const heartTextureWidth = resources[0].texture.width;
  const heartBaseRatio = (0.074 * appWidth) / heartTextureWidth; // 0.074 量出来的, 此时定为emiter时会达到的最大值
  const scaleConfig = getEmitterType(heartConfig, "scale").config;
  scaleConfig.scale.list[0].value = heartBaseRatio * 0.8;
  scaleConfig.scale.list[1].value = heartBaseRatio;
  scaleConfig.scale.list[2].value = heartBaseRatio * 0.95;
  const curEmitter = new Emitter(emitterContainer, heartConfig);
  const heartRemover = emitterStarter(curEmitter);
  const ringConfig: EmitterConfigV3 = {
    ...(emitterConfigs("love_ring") as EmitterConfigV3),
  };
  const ringSprite = sprite2TransParent(resources[1]);
  getEmitterType(ringConfig, "textureRandom").config.textures.push(
    ringSprite.texture
  );
  getEmitterType(ringConfig, "spawnShape").config.data.w = appWidth;
  getEmitterType(ringConfig, "spawnShape").config.data.h = appHeight;
  getEmitterType(ringConfig, "colorStatic").config.color = "#ffe7d8";
  const ringTextureWidth = resources[1].texture.width;
  const ringBaseRatio = (0.28 * appWidth) / ringTextureWidth;
  const ringScaleConfig = getEmitterType(ringConfig, "scale").config;
  ringScaleConfig.scale.list[0].value = ringBaseRatio * 0.9;
  ringScaleConfig.scale.list[1].value = ringBaseRatio;
  const ringEmitter = new Emitter(emitterContainer, ringConfig);
  const ringRemover = emitterStarter(ringEmitter);
  return async () => {
    await heartRemover();
    await ringRemover();
  };
}
