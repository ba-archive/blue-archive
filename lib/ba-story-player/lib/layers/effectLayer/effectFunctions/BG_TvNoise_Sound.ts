import eventBus from "@/eventBus";
import { usePlayerStore } from "@/stores";
import { Container, Sprite, Texture, Graphics, filters } from "pixi.js";
import { BGEffectHandlerFunction } from "@/types/effectLayer";

const BG_TvNoise_Sound: BGEffectHandlerFunction<'BG_TvNoise_Sound'> = async () => {
  // 原理是使用噪点滤镜产生电视机雪花的效果
  const { app } = usePlayerStore();
  const { width: appWidth, height: appHeight } = app.view;

  const container = new Container();
  app.stage.addChild(container);

  // 第一层，电视雪花效果
  const screen = new Sprite(Texture.WHITE);
  screen.tint = 0x000000; // 白色开局会爆闪一下
  screen.width = appWidth;
  screen.height = appHeight;
  container.addChild(screen);

  // 第二层，渐变效果
  const mask = new Graphics();
  mask.beginFill(0x000000);
  mask.drawRect(0, 0, appWidth, appHeight / 4);
  mask.drawRect(0, 0, appWidth / 4, appHeight);
  mask.drawRect(0, appHeight * 3 / 4, appWidth, appHeight / 4);
  mask.drawRect(appWidth * 3 / 4, 0, appWidth / 4, appHeight);
  mask.endFill();
  mask.filters = [new filters.AlphaFilter(0.3), new filters.BlurFilter(50)];
  container.addChild(mask);

  // 第三层，纵向移动的黑色条纹
  const bar = new Graphics();
  bar.beginFill(0x000000);
  bar.drawRect(0, -appHeight / 2, appWidth, appHeight / 6);
  bar.drawRect(0, -appHeight * 3 / 2, appWidth, appHeight / 12);
  bar.drawRect(0, -appHeight * 5 / 2, appWidth, appHeight / 3);
  bar.endFill();
  bar.filters = [new filters.AlphaFilter(0.3), new filters.BlurFilter(5)];
  container.addChild(bar);

  let count = 0;
  const tvNoiseSpeed = 5;
  const barMoveSpeed = 20;
  const animation = (delta: number) => {
    // 每隔一段时间添加噪点滤镜
    count += delta;
    if (count > tvNoiseSpeed) {
      screen.filters = [
        new filters.NoiseFilter(5),
        new filters.BlurFilter(0.5),
        new filters.FXAAFilter(),
      ];
      count %= tvNoiseSpeed;
    }
    // 黑色条纹纵向移动
    bar.y += barMoveSpeed * delta;
    if (bar.y > appHeight * 3.5) {
      bar.y = 0;
    }
  }
  app.ticker.add(animation);

  eventBus.emit("playBgEffectSound", "BG_Flash_Sound");

  return async () => {
    app.ticker.remove(animation);
    container.destroy();
  }
}

export default BG_TvNoise_Sound;