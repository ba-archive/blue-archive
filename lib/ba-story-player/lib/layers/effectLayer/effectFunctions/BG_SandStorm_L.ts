import { usePlayerStore } from "@/stores";
import { filters, Sprite, TilingSprite } from "pixi.js";
import { emitterStarter } from "../emitterUtils";
import { loadSpriteSheet } from "../resourcesUtils";

export default async function BG_SandStorm_L(resources: Sprite[]) {
  // 原理是两个平铺图片不断移动
  const { app } = usePlayerStore();
  const appWidth = app.view.width;
  const appHeight = app.view.height;
  let animationsName = "sandStorm";
  let spritesheet = await loadSpriteSheet(
    resources[0],
    { x: 1, y: 4 },
    animationsName
  );
  const texture = Reflect.get(spritesheet.animations, animationsName)[3];
  const TextureTilingBack = new TilingSprite(texture);
  const TextureTilingFront = new TilingSprite(texture);
  // 算出一个当前渲染中最长的长度
  const width = Math.sqrt(appWidth * appWidth + appHeight * appHeight);
  const height = texture.height;
  const scale = appHeight / height;
  const blurFilter = new filters.BlurFilter();
  [TextureTilingBack, TextureTilingFront].forEach(i => {
    // 避免 tiling 产生的像素
    i.clampMargin = 1.5;
    i.tint = 0xb98c56;
    i.width = width;
    i.height = height;
    i.filters = [blurFilter];
    i.scale.set(scale);
    app.stage.addChild(i);
  });
  TextureTilingBack.y = appHeight * 0.4;
  TextureTilingBack.zIndex = -1;
  TextureTilingFront.tilePosition.x = appWidth * 0.05; // 错开一点
  TextureTilingFront.y = appHeight * 0.75;
  let Remover = emitterStarter({
    update: () => {
      TextureTilingBack.tilePosition.x += 1.3;
      TextureTilingFront.tilePosition.x += 1.3;
    },
    destroy: () => {
      app.stage.removeChild(TextureTilingBack);
      app.stage.removeChild(TextureTilingFront);
    },
  } as any);
  return async () => {
    await Remover();
  };
}
