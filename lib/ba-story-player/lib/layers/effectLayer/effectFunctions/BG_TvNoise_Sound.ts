import eventBus from "@/eventBus";
import { usePlayerStore } from "@/stores";
import {
  Container,
  Sprite,
  Texture,
  Graphics,
  BlurFilter,
  NoiseFilter,
  AlphaFilter,
} from "pixi.js";
import { BGEffectHandlerFunction } from "@/types/effectLayer";
import { OldFilmFilter } from "@pixi/filter-old-film";

const BG_TvNoise_Sound: BGEffectHandlerFunction<
  "BG_TvNoise_Sound"
> = async () => {
  // 原理是使用噪点滤镜产生电视机雪花的效果
  const { app } = usePlayerStore();
  const { width: appWidth, height: appHeight } = app.view;

  const container = new Container();
  app.stage.addChild(container);

  // 第一层，背景
  const bg = new Sprite(Texture.WHITE);
  bg.tint = 0x505050;
  bg.width = appWidth;
  bg.height = appHeight;
  container.addChild(bg);

  // 第二层，雪花 + 暗角遮罩
  const mask = new Sprite(Texture.WHITE);
  mask.width = appWidth;
  mask.height = appHeight;
  mask.alpha = 0.8;
  const noiseFilter = new NoiseFilter(8);
  mask.filters = [
    noiseFilter,
    new BlurFilter(0.5),
    new OldFilmFilter({
      noise: 0.47, // 不知道为什么不生效，可能 pixi 6 兼容问题？
      sepia: 0,
      noiseSize: 1.1,
      scratch: 0, // 也是不生效，但是为防诈尸先禁用
      vignetting: 0.2,
      vignettingAlpha: 0.9,
      vignettingBlur: 0.8,
    }),
  ];

  container.addChild(mask);

  // 第二层，纵向移动的黑色条纹
  const bar = new Graphics();
  bar.beginFill(0x000000);
  bar.drawRect(0, -appHeight / 2, appWidth, appHeight / 6);
  bar.drawRect(0, (-appHeight * 3) / 2, appWidth, appHeight / 12);
  bar.drawRect(0, (-appHeight * 5) / 2, appWidth, appHeight / 3);
  bar.endFill();
  bar.filters = [new AlphaFilter(0.3), new BlurFilter(5)];
  container.addChild(bar);

  let count = 0;
  const tvNoiseSpeed = 3;
  const barMoveSpeed = 20;
  const animation = (delta: number) => {
    // 每隔一段时间添加噪点滤镜
    count += delta;
    if (count > tvNoiseSpeed && !!mask.filters) {
      noiseFilter.seed = Math.random(); // 仅更新噪点滤镜
      count %= tvNoiseSpeed;
    }
    // 黑色条纹纵向移动
    bar.y += barMoveSpeed * delta;
    if (bar.y > appHeight * 3.5) {
      bar.y = 0;
    }
  };
  app.ticker.add(animation);

  eventBus.emit("playBgEffectSound", "BG_Flash_Sound");

  return async () => {
    app.ticker.remove(animation);
    container.destroy();
  };
};

export default BG_TvNoise_Sound;
