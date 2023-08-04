import { usePlayerStore } from "@/stores";
import { Container, Sprite } from "pixijs";
import { AlphaFilter } from "pixijs";
import { emitterConfigs, emitterStarter } from "../emitterUtils";
import { getEmitterType, sprite2TransParent } from "../resourcesUtils";
import { Emitter, EmitterConfigV3 } from "@pixi/particle-emitter";

export default async function BG_Shining_L(resources: Sprite[]) {
  // 原理是波纹
  const { app } = usePlayerStore();
  const appWidth = app.view.width;
  const appHeight = app.view.height;
  // 底图
  const backSprite = resources[2];
  backSprite.x = -0.2 * appWidth;
  backSprite.y = -0.2 * appHeight;
  backSprite.width = appWidth * 1.4;
  backSprite.height = appHeight * 1.4;
  backSprite.zIndex = -1;
  // 紫色覆盖
  const alphaFilter = new AlphaFilter(0.8);
  const backPurpleSprite = resources[3];
  backPurpleSprite.tint = 0xd59ffb;
  backPurpleSprite.width = appWidth;
  backPurpleSprite.height = appHeight;
  backPurpleSprite.filters = [alphaFilter];
  backPurpleSprite.zIndex = -1;
  app.stage.addChild(backSprite);
  app.stage.addChild(backPurpleSprite);
  // 波纹特效
  const emitterContainer = new Container();
  app.stage.addChild(emitterContainer);
  emitterContainer.zIndex = -1;
  const ringConfig: EmitterConfigV3 = {
    ...(emitterConfigs("love_ring") as EmitterConfigV3),
  };
  const ringSprite = sprite2TransParent(resources[0]);
  getEmitterType(ringConfig, "textureRandom").config.textures.push(
    ringSprite.texture
  );
  getEmitterType(ringConfig, "colorStatic").config.color = "#ffffff";
  getEmitterType(ringConfig, "spawnShape").config.data.w = appWidth;
  getEmitterType(ringConfig, "spawnShape").config.data.h = appHeight;
  const ringTextureWidth = resources[0].texture.width;
  const ringBaseRatio = (0.4 * appWidth) / ringTextureWidth;
  const ringScaleConfig = getEmitterType(ringConfig, "scale").config;
  ringScaleConfig.scale.list[0].value = ringBaseRatio * 0.9;
  ringScaleConfig.scale.list[1].value = ringBaseRatio;
  const ringEmitter = new Emitter(emitterContainer, ringConfig);
  const ringRemover = emitterStarter(ringEmitter);
  const flareSprite = sprite2TransParent(resources[1]);
  const flareConfig: EmitterConfigV3 = {
    ...(emitterConfigs("shining_flare") as EmitterConfigV3),
  };
  getEmitterType(flareConfig, "textureRandom").config.textures.push(
    flareSprite.texture
  );
  getEmitterType(flareConfig, "spawnShape").config.data.w = appWidth;
  getEmitterType(flareConfig, "spawnShape").config.data.h = appHeight;
  const flareEmitter = new Emitter(emitterContainer, flareConfig);
  const flareRemover = emitterStarter(flareEmitter);
  return async () => {
    await ringRemover();
    await flareRemover();
    app.stage.removeChild(backSprite);
    app.stage.removeChild(backPurpleSprite);
  };
}
