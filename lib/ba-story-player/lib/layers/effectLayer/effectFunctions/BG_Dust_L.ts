import {
  emitterConfigs,
  emitterContainer,
  emitterStarter,
} from "../emitterUtils";
import {
  getEmitterType,
  loadSpriteSheet,
  sprite2TransParent,
} from "../resourcesUtils";
import { usePlayerStore } from "@/stores";
import { EmitterConfigV3, Emitter } from "@pixi/particle-emitter";
import { Container, Sprite, TilingSprite } from "pixi.js";

export default async function BG_Dust_L(resources: Sprite[]) {
  // 原理是三个平铺图片不断移动, 加上火光粒子效果
  const { app } = usePlayerStore();
  const appWidth = app.view.width;
  const appHeight = app.view.height;
  let smokeAnimationsName = "dust_smoke";

  let smokeSpritesheet = await loadSpriteSheet(
    resources[0],
    { x: 1, y: 2 },
    smokeAnimationsName
  );
  const smokeTexture = Reflect.get(
    smokeSpritesheet.animations,
    smokeAnimationsName
  )[0];
  const smokeTextureTilingL = new TilingSprite(smokeTexture);
  const smokeTextureTilingR = new TilingSprite(smokeTexture);
  const smokeTextureTilingR1 = new TilingSprite(smokeTexture);
  // 算出一个当前渲染中最长的长度
  const smokeWidth = Math.sqrt(appWidth * appWidth + appHeight * appHeight);
  // 高度应该是当前分切图片的高度
  const smokeHeight = smokeTexture.height;
  const scale = (appHeight / smokeHeight) * 0.6;
  [smokeTextureTilingL, smokeTextureTilingR, smokeTextureTilingR1].forEach(
    i => {
      // 避免 tiling 产生的像素
      i.clampMargin = 1.5;
      i.rotation = 0.55;
      i.tint = 0x4c413f;
      i.width = smokeWidth;
      i.height = smokeHeight;
      i.scale.set(scale);
      app.stage.addChild(i);
    }
  );
  smokeTextureTilingL.x = -(appWidth * 0.01);
  smokeTextureTilingL.y = appHeight - smokeHeight * scale;
  // 放大, 避免下方出现空隙
  smokeTextureTilingR.rotation = -0.35;
  smokeTextureTilingR.scale.set(1.2 * scale);
  smokeTextureTilingR.x = appWidth / 2 - appWidth * 0.08;
  smokeTextureTilingR.y = appHeight - appHeight * 0.08;
  // 角度高一点, 错乱一点, 避免和 R 一致, R1 是后边的图, 并且R1要在人物层之后
  smokeTextureTilingR1.rotation = -0.75;
  smokeTextureTilingR1.zIndex = -1;
  smokeTextureTilingR1.x = appWidth / 2 - appWidth * 0.05;
  smokeTextureTilingR1.y = appHeight - appHeight * 0.02;
  let smokeRemover = emitterStarter({
    update: () => {
      // 向左
      smokeTextureTilingL.tilePosition.x -= 1;
      smokeTextureTilingR.tilePosition.x += 1;
      smokeTextureTilingR1.tilePosition.x += 1;
    },
    destroy: () => {
      [smokeTextureTilingL, smokeTextureTilingR, smokeTextureTilingR1].forEach(
        i => {
          app.stage.removeChild(i);
        }
      );
    },
  } as any);
  // 火光粒子特效
  let fireContainer = new Container();
  emitterContainer.addChild(fireContainer);
  fireContainer.zIndex = 100;
  const transParentSprite = resources[1];
  let fireConfig: EmitterConfigV3 = {
    ...(emitterConfigs("dust_fire") as EmitterConfigV3),
  };
  fireConfig.pos = {
    x: 30,
    y: appHeight - 20,
  };
  let fireAnimationsName = "dust_fire";
  let fireSpritesheet = await loadSpriteSheet(
    transParentSprite,
    { x: 1, y: 3 },
    fireAnimationsName
  );
  const fireTextures = Reflect.get(
    fireSpritesheet.animations,
    fireAnimationsName
  );
  // 塞入随机 texture 中
  fireConfig.behaviors[2].config.textures.push(...fireTextures);
  const baseRatio = (0.05 * appWidth) / fireTextures[0].width;
  const scaleConfig = getEmitterType(fireConfig, "scale").config;
  scaleConfig.scale.list[0].value = baseRatio;
  scaleConfig.scale.list[1].value = baseRatio * 0.8;
  scaleConfig.scale.list[2].value = baseRatio;
  const speedConfig = getEmitterType(fireConfig, "moveSpeedStatic").config;
  speedConfig.min = appHeight * 0.4;
  speedConfig.max = appHeight * 0.65;
  let fireEmitter = new Emitter(fireContainer, fireConfig);
  setTimeout(() => {
    fireEmitter.maxParticles = 15;
  }, 1500);
  let fireRemover = emitterStarter(fireEmitter);
  return async () => {
    await smokeRemover();
    await fireRemover();
  };
}
