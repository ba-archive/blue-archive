import { Animation, HandlerMap } from "@/type";
import { timelineToPauseAble } from "@/utils";
import { AdjustmentFilter } from "@pixi/filter-adjustment";
import { Application, Sprite } from "pixi.js";
import { getStandardWidth, PositionOffset } from ".";
import fxOptions from "./Options/fxOptions";
import { CharacterEffectInstance, FXOptions } from "./type";

/**
 * timeline执行后生成一个promise并自动回收sprite
 * @param timeLine 执行的timeline
 * @param destroyImgs 要回收的sprite对象数组
 * @returns 生成的promise
 */
function timelinePromise(timeLine: gsap.core.Timeline, destroyImgs: Sprite[]) {
  return new Promise<void>((resolve, reject) => {
    timeLine
      .then(() => {
        resolve();
        for (const img of destroyImgs) {
          img.destroy();
        }
      })
      .catch(reason => reject(reason));
  });
}

/**
 * 设置图片相对于人物位置
 * @param instance
 * @param img
 * @param pos
 * @param app
 * @returns
 */
function setPos(
  instance: CharacterEffectInstance,
  img: Sprite,
  pos: PositionOffset,
  app: Application
) {
  const standardWidth = getStandardWidth(app);
  const finalPos = {
    x: standardWidth * pos.x,
    y: standardWidth * pos.y,
  };
  img.position = finalPos;

  return pos;
}

// 获取资源
const getFXSprites = function (
  type: "shot",
  handlerMap: HandlerMap,
  app: Application
) {
  const fxImageSprites: Sprite[] | undefined = handlerMap.getResources(
    "fx",
    type
  );
  if (fxImageSprites) {
    for (const imageSprite of fxImageSprites) {
      imageSprite.visible = false;
      app.stage.addChild(imageSprite);
    }
  }
  return fxImageSprites;
};

const shot: Animation<{
  instance: CharacterEffectInstance | undefined;
  app: Application | undefined;
  options: FXOptions["shot"];
  handlerMap: HandlerMap | undefined;
  imgs: Sprite[] | undefined;
}> = {
  args: {
    instance: undefined,
    app: undefined,
    options: fxOptions["shot"],
    handlerMap: undefined,
    imgs: undefined,
  },
  runningAnimation: [],
  async animate() {
    if (!this.args.instance || !this.args.handlerMap || !this.args.app) {
      return;
    }
    const sprites = getFXSprites("shot", this.args.handlerMap, this.args.app);
    if (!sprites) {
      return Promise.reject(`FX没有shot的图像资源`);
    }
    const scale =
      (this.args.options.scale * getStandardWidth(this.args.app)) /
      sprites[0].width;

    this.args.imgs = sprites;
    const tl = gsap.timeline();
    this.runningAnimation.push(timelineToPauseAble(tl));
    for (const [index, sequence] of this.args.options.shotSequence.entries()) {
      const img = Sprite.from(sprites[sequence.startImg].texture);
      img.scale.set(scale * sequence.scale);
      img.angle = sequence.angle;
      img.zIndex = 10;
      const adjustmentFilter = new AdjustmentFilter({
        brightness: 3,
        alpha: 0.5,
      });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      img.filters = [adjustmentFilter];
      img.visible = false;
      this.args.instance.instance.addChild(img);
      setPos(this.args.instance, img, sequence.pos, this.args.app);
      tl.to(
        img,
        {
          duration: this.args.options.shotDuration,
          onComplete() {
            if (sequence.endRed) {
              adjustmentFilter.green = 0.3;
              adjustmentFilter.blue = 0;
            } else {
              img.texture = sprites[sequence.endImg!].texture;
            }
            setTimeout(() => (img.visible = false), 10);
          },
          onStart() {
            img.visible = true;
          },
        },
        index * 0.07
      );
    }

    await timelinePromise(tl, sprites);
  },
  async final() {
    for (const animation of this.runningAnimation) {
      animation.pause();
    }
    if (this.args.imgs) {
      for (const img of this.args.imgs) {
        img.destroy();
      }
    }
  },
};

export default {
  shot,
};
