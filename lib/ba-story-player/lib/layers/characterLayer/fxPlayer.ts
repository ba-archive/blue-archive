import { usePlayerStore } from "@/stores";
import gsap from "gsap";
import { Sprite } from "pixijs";
import fxOptions from "./options/fxOptions";
import {
  CharacterEffectInstance,
  CharacterFXPlayer,
  PositionOffset,
} from "@/types/characterLayer";
import { AdjustmentFilter } from "@pixi/filter-adjustment";
import { getStandardWidth } from ".";

const CharacterFXPlayerInstance: CharacterFXPlayer = {
  init() {
    return;
  },
  dispose(): void {},
  getHandlerFunction(type) {
    return Reflect.get(this, type);
  },
  processEffect(type, instance) {
    const fn = this.getHandlerFunction(type);
    if (!fn) {
      return Promise.reject("该effect不存在或未实现");
    }
    const { fxImages, app } = usePlayerStore();
    const fxImageSprites: Sprite[] = [];
    const currentFxImgs = fxImages(type);
    if (!currentFxImgs) {
      Promise.reject(`fx中${type}对应的图像资源不存在`);
    }
    for (const imageResource of currentFxImgs!) {
      const tempSprite = Sprite.from(imageResource);
      tempSprite.visible = false;
      instance.instance.addChild(tempSprite);
      fxImageSprites.push(tempSprite);
    }
    return fn(instance, fxOptions[type], fxImageSprites) as Promise<void>;
  },
  shot(instance, options, sprites) {
    const scale = (options.scale * getStandardWidth()) / sprites[0].width;

    const tl = gsap.timeline();
    for (const [index, sequence] of options.shotSequence.entries()) {
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
      instance.instance.addChild(img);
      setPos(instance, img, sequence.pos);
      tl.to(
        img,
        {
          duration: options.shotDuration,
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

    return timelinePromise(tl, sprites);
  },
};

/**
 * 设置图片相对于人物位置
 * @param instance
 * @param img
 * @param pos
 * @returns
 */
function setPos(
  instance: CharacterEffectInstance,
  img: Sprite,
  pos: PositionOffset
) {
  const standardWidth = getStandardWidth();
  const finalPos = {
    x: standardWidth * pos.x,
    y: standardWidth * pos.y,
  };
  img.position = finalPos;

  return pos;
}

/**
 * timeline执行后生成一个promise并自动回收sprite
 * @param timeLine 执行的timeline
 * @param destroyImgs 要回收的sprite对象数组
 * @returns 生成的promise
 */
function timelinePromise(
  timeLine: gsap.core.Timeline,
  destroyImgs: Sprite[],
  callback?: () => any
) {
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

export default CharacterFXPlayerInstance;
