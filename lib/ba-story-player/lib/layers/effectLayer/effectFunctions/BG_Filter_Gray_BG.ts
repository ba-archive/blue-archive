import { usePlayerStore } from "@/stores";
import { Sprite } from "pixi.js";

export default async function BG_Filter_Gray_BG(resources: Sprite[]) {
  // 两种思路，一种是用社区的老电影滤镜，可定制程度更高
  // 另一种是参考 BG_Shining_L_BGOff 实现，给背景遮罩asset换色，不用带脑子
  // 虽然两种都很简单，但后者更符合游戏内表现并且不用引入新依赖和新asset，暂时使用后者
  const { app } = usePlayerStore();
  const appWidth = app.view.width;
  const appHeight = app.view.height;

  // 加载资源，加入 tinting
  const graySprite = resources[0];
  graySprite.width = appWidth;
  graySprite.height = appHeight;

  graySprite.tint = 0x000000;
  graySprite.alpha = 0.8;
  // 挂载
  app.stage.addChild(graySprite);

  // 提供销毁特效的回调函数
  return async () => {
    app.stage.removeChild(graySprite);
  };
}
