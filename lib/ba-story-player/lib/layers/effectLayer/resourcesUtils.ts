import { BaseTexture, ImageResource, Sprite, Spritesheet } from "pixi.js";
import { EmitterConfigV3 } from "@pixi/particle-emitter";

/**
 * 把黑白png图片的黑色转为透明度
 * https://blog.csdn.net/jdk137/article/details/106216318
 * @param img Sprite
 * @returns
 */
export function sprite2TransParent(img: Sprite) {
  // 这里的 source 代表着dom中的image节点, 所以图片加载类型不是通过url的话就不行
  const texture = img.texture.baseTexture as BaseTexture<ImageResource>;
  const { realWidth, realHeight } = img.texture.baseTexture;
  let imgSource = texture.resource.source;
  let canvas = document.createElement("canvas");
  // document.body.appendChild(canvas)
  canvas.setAttribute("width", realWidth + "");
  canvas.setAttribute("height", realHeight + "");
  let ctx = canvas.getContext("2d")!;
  ctx.drawImage(imgSource, 0, 0);

  let pixel = ctx.getImageData(0, 0, realWidth, realHeight);
  let data = pixel.data;
  for (var i = 0; i < data.length; i += 4) {
    data[i + 3] = Math.round((data[i] + data[i + 1] + data[i + 2]) / 3);
    data[i] = 255;
    data[i + 1] = 255;
    data[i + 2] = 255;
  }
  ctx.putImageData(pixel, 0, 0);
  const dataUrl = ctx.canvas.toDataURL("image/png");
  // download(dataUrl)
  const newSprite = Sprite.from(dataUrl);
  return newSprite;
}
function download(b64: string) {
  var a = document.createElement("a");
  a.href = b64;
  a.download = "result.png"; //设定下载名称
  var evt = document.createEvent("MouseEvents");
  evt.initEvent("click", true, true);
  a.dispatchEvent(evt);
}

/**
 * 根据给定的信息, 加载spriteSheet
 * @param img spriteSheet原图片Sprite
 * @param quantity x, y方向上小图片的个数
 * @param animationsName 该图片组成的动画的名字, 用于访问资源
 */
export async function loadSpriteSheet(
  img: Sprite,
  quantity: { x: number; y: number },
  animationsName: string
): Promise<Spritesheet> {
  // Create object to store sprite sheet data
  let atlasData = {
    frames: {},
    meta: {
      scale: "1",
    },
    animations: {} as Record<string, string[]>,
  };
  Reflect.set(atlasData.animations, animationsName, []);

  img.scale.set(1);
  let xNum = quantity.x;
  let yNum = quantity.y;
  let width = img.width / xNum;
  let height = img.height / yNum;
  for (let i = 0; i < xNum * yNum; ++i) {
    Reflect.set(atlasData.frames, `${animationsName}${i}`, {
      frame: {
        x: width * (i % xNum),
        y: height * Math.trunc(i / xNum),
        w: width,
        h: height,
      },
      sourceSize: { w: width, h: height },
      spriteSourceSize: { x: 0, y: 0, w: width, h: height },
    });
    atlasData.animations[animationsName].push(`${animationsName}${i}`);
  }

  // Create the SpriteSheet from data and image
  const spritesheet = new Spritesheet(img.texture, atlasData);

  // Generate all the Textures asynchronously
  await spritesheet.parse();

  return spritesheet;
}
/**
 * 获取 emitter config behaviors 中的配置
 */
export function getEmitterType(config: EmitterConfigV3, type: string) {
  return config.behaviors.find(i => {
    return i.type === type;
  })!;
}
