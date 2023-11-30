import { Animation, HandlerMap } from "@/type";
import { timelineToPauseAble } from "@/utils";
import { Spine } from "pixi-spine";
import { Application, Container, Sprite } from "pixi.js";
import { PositionOffset } from ".";
import emotionOptions from "./Options/emotionOptions";
import {
  CharacterEffectInstance,
  EmotionOptions,
  EmotionWord,
  Scale,
} from "./type";

// 获取资源
const getEmotionSprites = function (
  type: EmotionWord,
  handlerMap: HandlerMap,
  app: Application
) {
  const emotionImageSprites: Sprite[] | undefined = handlerMap.getResources(
    "emotion",
    type
  );
  if (emotionImageSprites) {
    for (const imageSprite of emotionImageSprites) {
      imageSprite.visible = false;
      app.stage.addChild(imageSprite);
    }
  }
  return emotionImageSprites;
};

/**
 * 计算图片的缩放比例
 * 事实上是一个固定值, 该函数的存在意义主要是适应以前的参数设置
 * @param img 缩放的图片
 * @param options 情绪动画设置参数
 * @returns 缩放比例绝对值
 */
function getRelativeScale(img: Sprite, options: EmotionOptions[EmotionWord]) {
  return (options.scale * 540) / img.width;
}

/**
 * 预处理表情容器, 可以是表情图片自己, 也可以是新的容器
 *
 * 将spine作为Container使用后的方法
 *
 * 计算方式不能基于spine width, 有width很大的人物特例
 *
 * 计算图片相对于入物中心的偏移值, 其中x方向减去的值为前面设置遗留的特殊值, 后面会改
 *
 * @param spine 角色对象
 * @param options 表情自己的配置信息
 * @param container 装表情的容器, 也可以是表情自己
 */
function prepareEmotionContainer(
  spine: Spine,
  options: EmotionOptions[EmotionWord],
  container?: Container | Sprite
) {
  if (!container) {
    container = new Container();
  }
  //偏移量为根据startPositionOffset计算得出的固定值, 替换前面使用的makeSpineHappyOffset
  const offsetX = (options.startPositionOffset.x - 0.8) * 540;
  const offsetY = (options.startPositionOffset.y - 1.2) * 1012;
  container.position.set(offsetX, offsetY);
  spine.addChild(container);
  return {
    offsetX,
    offsetY,
    container,
  };
}

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
 * 销毁表情图片
 * @param destroyImgs 要回首的sprite对象数组
 */
function imgFinal(destroyImgs: Sprite[] | undefined) {
  if (!destroyImgs) {
    return;
  }
  for (const img of destroyImgs) {
    img.destroy();
  }
}

/**
 * 根据相对位置计算相对位置
 * @param standard 相对位置基于的图片
 * @param relativeValue 相对值
 * @returns 绝对位置
 */
function calcRelativePosition(standard: Sprite, relativeValue: PositionOffset) {
  return {
    x: standard.x + standard.width * relativeValue.x,
    y: standard.y + standard.width * relativeValue.y,
  };
}

/**
 * 设置一个图片在另一个图片中的位置(需要该图片是另一图片的child)
 * @param childImg 设置的图片
 * @param containerImg 作为容器的图片
 * @param relativeValue 位置的相对值(相对于容器图片宽度而言)
 */
function setRelativePosition(
  childImg: Sprite,
  containerImg: Sprite,
  relativeValue: PositionOffset
) {
  childImg.position = {
    x: relativeValue.x * containerImg.width,
    y: relativeValue.y * containerImg.height,
  };
}

const Angry: Animation<{
  instance: CharacterEffectInstance | undefined;
  options: EmotionOptions["Angry"];
  app: Application;
  handlerMap: HandlerMap | undefined;
  imgs: Sprite[] | undefined;
}> = {
  args: {
    instance: undefined,
    options: emotionOptions["Angry"],
    app: new Application(),
    handlerMap: undefined,
    imgs: undefined,
  },
  runningAnimation: [],
  async animate() {
    if (!this.args.instance || !this.args.handlerMap) {
      return;
    }
    const sprites = getEmotionSprites(
      "Angry",
      this.args.handlerMap,
      this.args.app
    );
    if (!sprites) {
      return Promise.reject(`Angry没有对应的图像资源`);
    }
    const angryImgUnit = sprites[0];
    const scale = getRelativeScale(angryImgUnit, this.args.options);
    const { container } = prepareEmotionContainer(
      this.args.instance.instance,
      this.args.options
    );
    //最后用于确定动画结束的timeline
    let waitTimeLine = gsap.timeline();
    const destroyImg: Sprite[] = [];
    this.args.imgs = destroyImg;
    for (let i = 0; i < 3; ++i) {
      const uImgUnit = Sprite.from(angryImgUnit.texture);
      destroyImg.push(uImgUnit);
      uImgUnit.scale.set(scale);
      uImgUnit.anchor.set(0.35, -0.05);
      uImgUnit.angle += i * 120;
      uImgUnit.zIndex = 10;
      container.addChild(uImgUnit);
      const tl = gsap.timeline();
      waitTimeLine = tl;
      this.runningAnimation.push(timelineToPauseAble(waitTimeLine));
      tl.to(uImgUnit.scale, {
        x: scale * this.args.options.animationScale.scale,
        duration: this.args.options.animationScale.duration,
      })
        .to(uImgUnit.scale, {
          x: scale,
          duration: this.args.options.animationScale.duration,
        })
        .to(uImgUnit.scale, {
          x: scale * this.args.options.endScale.scale,
          y: scale * this.args.options.endScale.scale,
          duration: this.args.options.endScale.duration,
        });
    }
    await timelinePromise(waitTimeLine, destroyImg);
  },
  async final() {
    for (const animation of this.runningAnimation) {
      animation.pause();
    }
    imgFinal(this.args.imgs);
  },
};

const Chat: Animation<{
  instance: CharacterEffectInstance | undefined;
  options: EmotionOptions["Chat"];
  app: Application;
  handlerMap: HandlerMap | undefined;
  imgs: Sprite | undefined;
}> = {
  args: {
    instance: undefined,
    options: emotionOptions["Chat"],
    app: new Application(),
    handlerMap: undefined,
    imgs: undefined,
  },
  runningAnimation: [],
  async animate() {
    if (!this.args.instance || !this.args.handlerMap) {
      return;
    }
    const sprites = getEmotionSprites(
      "Chat",
      this.args.handlerMap,
      this.args.app
    );
    if (!sprites) {
      return Promise.reject(`Chat没有对应的图像资源`);
    }
    const chatImage = sprites[0];
    prepareEmotionContainer(
      this.args.instance.instance,
      this.args.options,
      chatImage
    );
    this.args.imgs = chatImage;
    chatImage.scale.set(getRelativeScale(chatImage, this.args.options));
    chatImage.visible = true;
    chatImage.pivot.x = chatImage.width * (1 + this.args.options.rotatePivot.x);
    chatImage.pivot.y =
      chatImage.height * (1 + this.args.options.rotatePivot.y);
    chatImage.zIndex = 10;
    const tl = gsap.timeline();
    this.runningAnimation.push(timelineToPauseAble(tl));
    await tl
      .to(chatImage, {
        angle: this.args.options.rotateAngle,
        duration: this.args.options.rotateTime / 2,
      })
      .to(chatImage, { angle: 0, duration: this.args.options.rotateTime / 2 })
      .to(chatImage, { alpha: 0, duration: this.args.options.fadeOutDuration });
  },
  async final() {
    for (const animation of this.runningAnimation) {
      animation.pause();
    }
    if (this.args.imgs) {
      this.args.imgs.alpha = 0;
    }
  },
};

const Dot: Animation<{
  instance: CharacterEffectInstance | undefined;
  options: EmotionOptions["Dot"];
  app: Application;
  handlerMap: HandlerMap | undefined;
  imgs: { dialogImg: Sprite; container: Container } | undefined;
}> = {
  args: {
    instance: undefined,
    options: emotionOptions["Dot"],
    app: new Application(),
    handlerMap: undefined,
    imgs: undefined,
  },
  runningAnimation: [],
  async animate() {
    if (!this.args.instance || !this.args.handlerMap) {
      return;
    }
    const sprites = getEmotionSprites(
      "Dot",
      this.args.handlerMap,
      this.args.app
    );
    if (!sprites) {
      return Promise.reject(`Dot没有对应的图像资源`);
    }
    const dialogImg = Sprite.from(sprites[0].texture);
    prepareEmotionContainer(
      this.args.instance.instance,
      this.args.options,
      dialogImg
    );
    const dotContainer = new Container();
    this.args.imgs = {
      dialogImg: dialogImg,
      container: dotContainer,
    };
    const showTl = gsap.timeline();
    this.runningAnimation.push(timelineToPauseAble(showTl));
    for (let i = 0; i < 3; ++i) {
      const dotImg = Sprite.from(sprites[1].texture);
      dotImg.alpha = 0;
      dotImg.position = calcRelativePosition(dotImg, {
        x: this.args.options.dotPos[i],
        y: 0,
      });
      showTl.to(dotImg, {
        alpha: 1,
        duration: this.args.options.showAnimation.alpahaDuration,
        delay: this.args.options.showAnimation.showDelay,
      });
      dotContainer.addChild(dotImg);
    }
    dialogImg.addChild(dotContainer);
    dotContainer.position = {
      x: this.args.options.dotContainerPos.x * dialogImg.width,
      y: this.args.options.dotContainerPos.y * dialogImg.height,
    };
    showTl.to(dialogImg, {
      alpha: 0,
      duration: this.args.options.fadeOutDuration,
      delay: this.args.options.fadeOutPreDuration,
    });
    await timelinePromise(showTl, [
      dialogImg,
      ...(dotContainer.children as Sprite[]),
    ]);
  },
  async final() {
    for (const animation of this.runningAnimation) {
      animation.pause();
    }
    if (this.args.imgs) {
      imgFinal([
        this.args.imgs.dialogImg,
        ...(this.args.imgs.container.children as Sprite[]),
      ]);
    }
  },
};

const Exclaim: Animation<{
  instance: CharacterEffectInstance | undefined;
  options: EmotionOptions["Exclaim"];
  app: Application;
  handlerMap: HandlerMap | undefined;
  imgs: Sprite | undefined;
}> = {
  args: {
    instance: undefined,
    options: emotionOptions["Exclaim"],
    app: new Application(),
    handlerMap: undefined,
    imgs: undefined,
  },
  runningAnimation: [],
  async animate() {
    if (!this.args.instance || !this.args.handlerMap) {
      return;
    }
    const sprites = getEmotionSprites(
      "Exclaim",
      this.args.handlerMap,
      this.args.app
    );
    if (!sprites) {
      return Promise.reject(`Exclaim没有对应的图像资源`);
    }
    const surpriseImg = sprites[0];
    prepareEmotionContainer(
      this.args.instance.instance,
      this.args.options,
      surpriseImg
    );
    this.args.imgs = surpriseImg;
    const scale = getRelativeScale(surpriseImg, this.args.options);
    surpriseImg.visible = true;
    const tl = gsap.timeline();
    this.runningAnimation.push(timelineToPauseAble(tl));
    const animationScale = scale * this.args.options.scaleAnimation.scale;
    const recoverScale = scale * this.args.options.scaleAnimation.recoverScale;
    await timelinePromise(
      tl
        .to(surpriseImg.scale, {
          x: animationScale,
          y: animationScale,
          duration: this.args.options.scaleAnimation.scaleDuration,
        })
        .to(surpriseImg.scale, {
          x: recoverScale,
          y: recoverScale,
          duration: this.args.options.scaleAnimation.recoverDuration,
        })
        .to(surpriseImg, { duration: this.args.options.fadeOutWaitTime })
        .to(surpriseImg, {
          alpha: 0,
          duration: this.args.options.fadeOutDuration,
        }),
      []
    );
  },
  async final() {
    for (const animation of this.runningAnimation) {
      animation.pause();
    }
    if (this.args.imgs) {
      this.args.imgs.alpha = 0;
    }
  },
};

const Heart: Animation<{
  instance: CharacterEffectInstance | undefined;
  options: EmotionOptions["Heart"];
  app: Application;
  handlerMap: HandlerMap | undefined;
  imgs: { heartImg: Sprite; dialogImg: Sprite } | undefined;
}> = {
  args: {
    instance: undefined,
    options: emotionOptions["Heart"],
    app: new Application(),
    handlerMap: undefined,
    imgs: undefined,
  },
  runningAnimation: [],
  async animate() {
    if (!this.args.instance || !this.args.handlerMap) {
      return;
    }
    const sprites = getEmotionSprites(
      "Heart",
      this.args.handlerMap,
      this.args.app
    );
    if (!sprites) {
      return Promise.reject(`Heart没有对应的图像资源`);
    }
    const dialogImg = sprites[0];
    const heartImg = sprites[1];
    const dialogScale = getRelativeScale(dialogImg, this.args.options);
    const { container } = prepareEmotionContainer(
      this.args.instance.instance,
      this.args.options
    );
    this.args.imgs = {
      heartImg: heartImg,
      dialogImg: dialogImg,
    };
    dialogImg.scale.set(dialogScale);
    heartImg.x = dialogImg.width * this.args.options.heartImg.position.x;
    heartImg.y = dialogImg.width * this.args.options.heartImg.position.y;
    const heartScale =
      (this.args.options.heartImg.scale * dialogImg.width) / heartImg.width;
    heartImg.scale.set(heartScale);
    dialogImg.zIndex = 10;
    heartImg.zIndex = 11;
    dialogImg.visible = heartImg.visible = true;
    container.addChild(dialogImg);
    container.addChild(heartImg);

    const tl = gsap.timeline();
    this.runningAnimation.push(timelineToPauseAble(tl));
    const firstScale: Scale = {
      x: this.args.options.jumpAnimation.firstScale.x * heartScale,
      y: this.args.options.jumpAnimation.firstScale.y * heartScale,
    };
    const secondScale: Scale = {
      x: this.args.options.jumpAnimation.secondScale.x * heartScale,
      y: this.args.options.jumpAnimation.secondScale.y * heartScale,
    };
    tl.to(heartImg.scale, {
      x: firstScale.x,
      y: firstScale.y,
      duration: this.args.options.jumpAnimation.duration,
    })
      .to(heartImg.scale, {
        x: heartScale,
        y: heartScale,
        duration: this.args.options.jumpAnimation.duration,
      })
      .to(heartImg.scale, {
        x: secondScale.x,
        y: secondScale.y,
        duration: this.args.options.jumpAnimation.duration,
      })
      .to(heartImg, { alpha: 0, duration: this.args.options.fadeOutDuration })
      .add("fadeOut", "<")
      .to(
        dialogImg,
        { alpha: 0, duration: this.args.options.fadeOutDuration },
        "fadeOut"
      );
    await timelinePromise(tl, []);
  },
  async final() {
    for (const animation of this.runningAnimation) {
      animation.pause();
    }
    if (this.args.imgs) {
      this.args.imgs.heartImg.alpha = 0;
      this.args.imgs.dialogImg.alpha = 0;
    }
  },
};

const Music: Animation<{
  instance: CharacterEffectInstance | undefined;
  options: EmotionOptions["Music"];
  app: Application;
  handlerMap: HandlerMap | undefined;
  imgs: Sprite | undefined;
}> = {
  args: {
    instance: undefined,
    options: emotionOptions["Music"],
    app: new Application(),
    handlerMap: undefined,
    imgs: undefined,
  },
  runningAnimation: [],
  async animate() {
    if (!this.args.instance || !this.args.handlerMap) {
      return;
    }
    const sprites = getEmotionSprites(
      "Music",
      this.args.handlerMap,
      this.args.app
    );
    if (!sprites) {
      return Promise.reject(`Music没有对应的图像资源`);
    }
    const note = sprites[0];
    const scale = getRelativeScale(note, this.args.options);
    const { container } = prepareEmotionContainer(
      this.args.instance.instance,
      this.args.options
    );
    this.args.imgs = note;
    note.scale.set(scale * 0.7);
    note.visible = true;
    container.addChild(note);
    const tl = gsap.timeline();
    this.runningAnimation.push(timelineToPauseAble(tl));
    tl.to(note.scale, { x: scale, y: scale, duration: 0.1 })
      .to(note, {
        x: note.width * this.args.options.animation.offset.x,
        duration: this.args.options.animation.duration,
      })
      .add("start", "<")
      .to(
        note,
        {
          y: note.width * this.args.options.animation.offset.y,
          angle: this.args.options.rotateAngle,
          duration: this.args.options.animation.duration * 0.3,
        },
        "start"
      )
      .to(
        note,
        {
          y: 0,
          angle: 0,
          duration: this.args.options.animation.duration * 0.3,
        },
        ">"
      )
      .to(
        note,
        {
          y: note.width * this.args.options.animation.offset.y,
          angle: this.args.options.rotateAngle,
          duration: this.args.options.animation.duration * 0.4,
        },
        ">"
      )
      .to(
        note,
        {
          y: 0,
          angle: 0,
          duration: this.args.options.animation.duration * 0.4,
        },
        ">"
      )
      .to(note, { alpha: 0, duration: this.args.options.fadeOutDuration }, ">");

    await timelinePromise(tl, []);
  },
  async final() {
    for (const animation of this.runningAnimation) {
      animation.pause();
    }
    if (this.args.imgs) {
      this.args.imgs.alpha = 0;
    }
  },
};

const Question: Animation<{
  instance: CharacterEffectInstance | undefined;
  options: EmotionOptions["Question"];
  app: Application;
  handlerMap: HandlerMap | undefined;
  imgs: Sprite | undefined;
}> = {
  args: {
    instance: undefined,
    options: emotionOptions["Question"],
    app: new Application(),
    handlerMap: undefined,
    imgs: undefined,
  },
  runningAnimation: [],
  async animate() {
    if (!this.args.instance || !this.args.handlerMap) {
      return;
    }
    const sprites = getEmotionSprites(
      "Question",
      this.args.handlerMap,
      this.args.app
    );
    if (!sprites) {
      return Promise.reject(`Question没有对应的图像资源`);
    }
    const questionImg = sprites[0];
    questionImg.visible = true;
    questionImg.zIndex = 10;
    const scale = getRelativeScale(questionImg, this.args.options);
    prepareEmotionContainer(
      this.args.instance.instance,
      this.args.options,
      questionImg
    );
    this.args.imgs = questionImg;
    questionImg.scale.set(scale);
    questionImg.anchor.set(
      this.args.options.scaleAnimation.anchor.x,
      this.args.options.scaleAnimation.anchor.y
    );
    const tl = gsap.timeline();
    this.runningAnimation.push(timelineToPauseAble(tl));
    const animationScale = scale * this.args.options.scaleAnimation.scale;
    const recoverScale = scale * this.args.options.scaleAnimation.recoverScale;
    await timelinePromise(
      tl
        .to(questionImg.scale, {
          x: animationScale,
          y: animationScale,
          duration: this.args.options.scaleAnimation.scaleDuration,
        })
        .to(questionImg.scale, {
          x: recoverScale,
          y: recoverScale,
          duration: this.args.options.scaleAnimation.recoverDuration,
        })
        .to(questionImg, { duration: this.args.options.fadeOutPreDuration! })
        .to(questionImg, {
          alpha: 0,
          duration: this.args.options.fadeOutDuration,
        }),
      []
    );
  },
  async final() {
    for (const animation of this.runningAnimation) {
      animation.pause();
    }
    if (this.args.imgs) {
      this.args.imgs.alpha = 0;
    }
  },
};

const Respond: Animation<{
  instance: CharacterEffectInstance | undefined;
  options: EmotionOptions["Respond"];
  app: Application;
  handlerMap: HandlerMap | undefined;
  imgs: { sprites: Sprite[]; container: Container } | undefined;
}> = {
  args: {
    instance: undefined,
    options: emotionOptions["Respond"],
    app: new Application(),
    handlerMap: undefined,
    imgs: undefined,
  },
  runningAnimation: [],
  async animate() {
    if (!this.args.instance || !this.args.handlerMap) {
      return;
    }
    const sprites = getEmotionSprites(
      "Respond",
      this.args.handlerMap,
      this.args.app
    );
    if (!sprites) {
      return Promise.reject(`Respond没有对应的图像资源`);
    }
    const { instance: spine } = this.args.instance;
    const { container } = prepareEmotionContainer(spine, this.args.options);
    const scale = getRelativeScale(sprites[0], this.args.options);

    for (let i = 0; i < 3; ++i) {
      const respondImg = spine.newSprite(sprites[0].texture);
      respondImg.angle = this.args.options.perImgSetting[i].angle;
      respondImg.anchor.set(
        this.args.options.perImgSetting[i].anchor.x,
        this.args.options.perImgSetting[i].anchor.y
      );
      respondImg.scale.set(
        (scale * this.args.options.perImgSetting[i].scale) / 0.5
      );
      container.addChild(respondImg);
    }
    container.zIndex = 10;
    container.alpha = 1;
    container.visible = true;
    this.args.imgs = {
      sprites: sprites,
      container: container,
    };
    const tl = gsap.timeline();
    this.runningAnimation.push(timelineToPauseAble(tl));
    await timelinePromise(
      tl
        .to(container, {
          alpha: this.args.options.flashAnimation.alpha,
          duration: this.args.options.flashAnimation.duration,
        })
        .to(container, {
          alpha: 1,
          duration: this.args.options.fadeOutDuration,
        })
        .to(container, { duration: this.args.options.fadeOutPreDuration })
        .to(container, {
          alpha: 0,
          duration: this.args.options.fadeOutDuration,
        }),
      [...(container.children as Sprite[]), ...sprites]
    );
  },
  async final() {
    for (const animation of this.runningAnimation) {
      animation.pause();
    }
    if (this.args.imgs) {
      imgFinal([
        ...(this.args.imgs.container.children as Sprite[]),
        ...this.args.imgs.sprites,
      ]);
    }
  },
};

const Sad: Animation<{
  instance: CharacterEffectInstance | undefined;
  options: EmotionOptions["Sad"];
  app: Application;
  handlerMap: HandlerMap | undefined;
  imgs: { container: Container; sadLineImage: Sprite[] } | undefined;
}> = {
  args: {
    instance: undefined,
    options: emotionOptions["Sad"],
    app: new Application(),
    handlerMap: undefined,
    imgs: undefined,
  },
  runningAnimation: [],
  async animate() {
    if (!this.args.instance || !this.args.handlerMap) {
      return;
    }
    const sprites = getEmotionSprites(
      "Sad",
      this.args.handlerMap,
      this.args.app
    );
    if (!sprites) {
      return Promise.reject(`Sad没有对应的图像资源`);
    }
    const { container } = prepareEmotionContainer(
      this.args.instance.instance,
      this.args.options
    );
    const tl = gsap.timeline();
    this.runningAnimation.push(timelineToPauseAble(tl));
    const sadLineImages: Sprite[] = [];
    this.args.imgs = {
      container: container,
      sadLineImage: sadLineImages,
    };
    for (let i = 0; i < 3; ++i) {
      const sadLineImage = Sprite.from(sprites[0].texture);
      sadLineImages.push(sadLineImage);
      sadLineImage.alpha = 0;
      sadLineImage.scale.y = 0.5;
      sadLineImage.position.x = this.args.options.imageGap * i;
      sadLineImage.position.y = this.args.options.imgInitYPosition[i];
      container.addChild(sadLineImage);
      tl.to(sadLineImage, { pixi: { alpha: 1 }, duration: 1 / 15 }, i / 6)
        .to(sadLineImage, { pixi: { scaleY: 1 }, duration: 4 / 15 }, ">")
        .to(
          sadLineImage,
          { pixi: { positionY: `+=${this.args.options.moveYDistance}` } },
          "<"
        )
        .to(sadLineImage, { duration: 26 / 60 }, ">");
    }
    tl.to(container, { pixi: { alpha: 0 }, duration: 8 / 60 });

    await timelinePromise(tl, sadLineImages);
  },
  async final() {
    for (const animation of this.runningAnimation) {
      animation.pause();
    }
    if (this.args.imgs) {
      imgFinal(this.args.imgs.sadLineImage);
      this.args.imgs.container.alpha = 0;
    }
  },
};

const Shy: Animation<{
  instance: CharacterEffectInstance | undefined;
  options: EmotionOptions["Shy"];
  app: Application;
  handlerMap: HandlerMap | undefined;
  imgs: { shyImg: Sprite; dialogImg: Sprite } | undefined;
}> = {
  args: {
    instance: undefined,
    options: emotionOptions["Shy"],
    app: new Application(),
    handlerMap: undefined,
    imgs: undefined,
  },
  runningAnimation: [],
  async animate() {
    if (!this.args.instance || !this.args.handlerMap) {
      return;
    }
    const sprites = getEmotionSprites(
      "Shy",
      this.args.handlerMap,
      this.args.app
    );
    if (!sprites) {
      return Promise.reject(`Shy没有对应的图像资源`);
    }
    const dialogImg = sprites[0];
    const shyImg = sprites[1];
    const { container } = prepareEmotionContainer(
      this.args.instance.instance,
      this.args.options
    );
    const scale = getRelativeScale(dialogImg, this.args.options);
    dialogImg.scale.set(scale * this.args.options.scaleAnamation.startScale);
    dialogImg.anchor.set(
      this.args.options.scaleAnamation.anchor.x,
      this.args.options.scaleAnamation.anchor.y
    );
    const shyImgPos = calcRelativePosition(
      dialogImg,
      this.args.options.shyImg.position
    );
    shyImg.scale.set(
      scale *
        this.args.options.shyImg.scale *
        this.args.options.scaleAnamation.startScale
    );
    shyImg.position = shyImgPos;
    dialogImg.zIndex = 10;
    shyImg.zIndex = 11;
    const shyImgAnchor = this.args.options.shyImg.anchor;
    shyImg.anchor.set(shyImgAnchor.x, shyImgAnchor.y);
    shyImg.visible = dialogImg.visible = true;
    this.args.imgs = {
      shyImg: shyImg,
      dialogImg: dialogImg,
    };
    container.addChild(dialogImg, shyImg);
    const shakeTl = gsap.timeline({ paused: true });
    shakeTl
      .add("start")
      .to(shyImg, {
        angle: this.args.options.shakeAnimation.angleFrom,
        duration: this.args.options.shakeAnimation.duration / 2,
      })
      .to(shyImg, {
        angle: this.args.options.shakeAnimation.angleTo,
        duration: this.args.options.shakeAnimation.duration / 2,
      })
      .add("end");
    const tl = gsap.timeline();
    this.runningAnimation.push(timelineToPauseAble(tl));
    await timelinePromise(
      tl
        .to(shyImg.scale, {
          x: scale,
          y: scale,
          duration: this.args.options.scaleAnamation.duration,
        })
        .to(
          dialogImg.scale,
          {
            x: scale,
            y: scale,
            duration: this.args.options.scaleAnamation.duration,
          },
          "<"
        )
        .add(
          shakeTl.tweenFromTo("start", "end", {
            repeat: this.args.options.shakeAnimation.times - 1,
          })
        )
        .to(shyImg, { alpha: 0, duration: this.args.options.fadeOutDuration })
        .to(
          dialogImg,
          { alpha: 0, duration: this.args.options.fadeOutDuration },
          "<"
        ),
      []
    );
  },
  async final() {
    for (const animation of this.runningAnimation) {
      animation.pause();
    }
    if (this.args.imgs) {
      this.args.imgs.dialogImg.alpha = 0;
      this.args.imgs.shyImg.alpha = 0;
    }
  },
};

const Surprise: Animation<{
  instance: CharacterEffectInstance | undefined;
  options: EmotionOptions["Surprise"];
  app: Application;
  handlerMap: HandlerMap | undefined;
  imgs:
    | { container: Container; surpriseImg: Sprite; exclaimImg: Sprite }
    | undefined;
}> = {
  args: {
    instance: undefined,
    options: emotionOptions["Surprise"],
    app: new Application(),
    handlerMap: undefined,
    imgs: undefined,
  },
  runningAnimation: [],
  async animate() {
    if (!this.args.instance || !this.args.handlerMap) {
      return;
    }
    const sprites = getEmotionSprites(
      "Surprise",
      this.args.handlerMap,
      this.args.app
    );
    if (!sprites) {
      return Promise.reject(`Surprise没有对应的图像资源`);
    }
    const exclaimImg = Sprite.from(sprites[0].texture);
    const surpriseImg = Sprite.from(sprites[1].texture);
    const scale = getRelativeScale(exclaimImg, this.args.options);
    const startScale = scale * this.args.options.scaleAnimation.startScale;
    exclaimImg.scale.set(startScale);
    exclaimImg.anchor.set(
      this.args.options.scaleAnimation.anchor.x,
      this.args.options.scaleAnimation.anchor.y
    );
    surpriseImg.scale.set(
      startScale,
      startScale * this.args.options.scaleAnimation.questionImgYScale
    );
    surpriseImg.position = calcRelativePosition(
      exclaimImg,
      this.args.options.imgSetting.questionImgPos
    );
    surpriseImg.anchor.set(
      this.args.options.scaleAnimation.anchor.x,
      this.args.options.scaleAnimation.anchor.y
    );
    const { container } = prepareEmotionContainer(
      this.args.instance.instance,
      this.args.options
    );
    container.addChild(exclaimImg, surpriseImg);
    container.zIndex = 10;
    this.args.imgs = {
      container: container,
      exclaimImg: exclaimImg,
      surpriseImg: surpriseImg,
    };

    const tl = gsap.timeline();
    this.runningAnimation.push(timelineToPauseAble(tl));
    const xOffset =
      this.args.options.jumpAnimation.xOffset *
      this.args.instance.instance.width;
    const jumpYOffset =
      this.args.options.jumpAnimation.jumpYOffset *
      this.args.instance.instance.width;
    await timelinePromise(
      tl
        .to(container, {
          x: `+=${xOffset}`,
          duration: this.args.options.jumpAnimation.duration,
        })
        .to(
          container,
          {
            y: `-=${jumpYOffset}`,
            duration: this.args.options.jumpAnimation.duration / 2,
          },
          0
        )
        .to(
          container,
          {
            y: `+=${jumpYOffset}`,
            duration: this.args.options.jumpAnimation.duration / 2,
          },
          ">"
        )
        .add("jumpEnd")
        .to(
          exclaimImg.scale,
          {
            x: scale,
            y: scale,
            duration: this.args.options.scaleAnimation.duration,
          },
          0
        )
        .to(
          surpriseImg.scale,
          {
            x: scale,
            y: scale,
            duration: this.args.options.scaleAnimation.duration,
          },
          0
        )
        .to(
          container,
          { duration: this.args.options.fadeOutPreDuration },
          "jumpEnd"
        )
        .to(
          container,
          { alpha: 0, duration: this.args.options.fadeOutDuration },
          ">"
        ),
      [surpriseImg, exclaimImg]
    );
  },
  async final() {
    for (const animation of this.runningAnimation) {
      animation.pause();
    }
    if (this.args.imgs) {
      this.args.imgs.container.alpha = 0;
      imgFinal([this.args.imgs.exclaimImg, this.args.imgs.surpriseImg]);
    }
  },
};

const Sweat: Animation<{
  instance: CharacterEffectInstance | undefined;
  options: EmotionOptions["Sweat"];
  app: Application;
  handlerMap: HandlerMap | undefined;
  imgs: { dropImg: Sprite; smallDropImg: Sprite } | undefined;
}> = {
  args: {
    instance: undefined,
    options: emotionOptions["Sweat"],
    app: new Application(),
    handlerMap: undefined,
    imgs: undefined,
  },
  runningAnimation: [],
  async animate() {
    if (!this.args.instance || !this.args.handlerMap) {
      return;
    }
    const sprites = getEmotionSprites(
      "Sweat",
      this.args.handlerMap,
      this.args.app
    );
    if (!sprites) {
      return Promise.reject(`Sweat没有对应的图像资源`);
    }
    const dropImg = sprites[0];
    const smallDropImg = sprites[1];
    const { container } = prepareEmotionContainer(
      this.args.instance.instance,
      this.args.options
    );
    const scale = getRelativeScale(dropImg, this.args.options);
    dropImg.scale.set(scale);
    smallDropImg.scale.set(scale);
    const smallPosition = calcRelativePosition(
      dropImg,
      this.args.options.smallImg.offset
    );
    smallDropImg.x = smallPosition.x;
    smallDropImg.y = smallPosition.y;
    dropImg.zIndex = 10;
    smallDropImg.zIndex = 10;
    smallDropImg.visible = dropImg.visible = true;
    container.addChild(dropImg, smallDropImg);
    this.args.imgs = {
      smallDropImg: smallDropImg,
      dropImg: dropImg,
    };
    const tl = gsap.timeline();
    this.runningAnimation.push(timelineToPauseAble(tl));
    tl.to(dropImg, {
      y: dropImg.y - dropImg.width * this.args.options.dropAnimation.yOffset,
      duration: this.args.options.dropAnimation.duration,
    }).to(
      smallDropImg,
      {
        y:
          smallDropImg.y -
          this.args.options.smallImg.dropAnimationOffset * smallDropImg.width,
        duration: this.args.options.dropAnimation.duration,
      },
      "<"
    );

    await timelinePromise(tl, []);
  },
  async final() {
    for (const animation of this.runningAnimation) {
      animation.pause();
    }
    if (this.args.imgs) {
      imgFinal([this.args.imgs.dropImg, this.args.imgs.smallDropImg]);
    }
  },
};

const Twinkle: Animation<{
  instance: CharacterEffectInstance | undefined;
  options: EmotionOptions["Twinkle"];
  app: Application;
  handlerMap: HandlerMap | undefined;
  imgs: { container: Container; starImgs: Sprite[] } | undefined;
}> = {
  args: {
    instance: undefined,
    options: emotionOptions["Twinkle"],
    app: new Application(),
    handlerMap: undefined,
    imgs: undefined,
  },
  runningAnimation: [],
  async animate() {
    if (!this.args.instance || !this.args.handlerMap) {
      return;
    }
    const sprites = getEmotionSprites(
      "Twinkle",
      this.args.handlerMap,
      this.args.app
    );
    if (!sprites) {
      return Promise.reject(`Twinkle没有对应的图像资源`);
    }
    const { container } = prepareEmotionContainer(
      this.args.instance.instance,
      this.args.options
    );

    const scale = getRelativeScale(sprites[0], this.args.options) / 0.5;
    const starImgs: Sprite[] = [];
    const starImgScales: number[] = [];
    this.args.imgs = {
      container: container,
      starImgs: starImgs,
    };
    for (let i = 0; i < 3; ++i) {
      starImgScales.push(scale * this.args.options.starImgs.scale[i]);
    }
    for (let i = 0; i < 3; ++i) {
      const starImg = Sprite.from(sprites[0].texture);
      starImgs.push(starImg);
      starImg.anchor.set(0.5);
      starImg.scale.set(starImgScales[i]);
      starImg.position = calcRelativePosition(
        starImgs[0],
        this.args.options.starImgs.pos[i]
      );
      container.addChild(starImg);
    }
    container.alpha = 0;

    const flashTlMaster = gsap.timeline({ paused: true });
    for (let i = 0; i < 3; ++i) {
      const flashTl = gsap.timeline();
      flashTl.to(
        starImgs[i],
        {
          pixi: {
            scale:
              this.args.options.flashAnimation.scales[i] * starImgScales[i],
          },
          duration: this.args.options.flashAnimation.duration[i] / 2,
          repeat: -1,
          yoyo: true,
        },
        0
      );
      flashTlMaster.add(flashTl, 0);
    }

    const tl = gsap.timeline();
    this.runningAnimation.push(timelineToPauseAble(tl));
    await timelinePromise(
      tl
        .to(container, { alpha: 1, duration: this.args.options.fadeInDuration })
        .add(
          flashTlMaster.tweenFromTo(
            0,
            this.args.options.flashAnimation.totalDuration
          )
        )
        .to(
          container,
          { alpha: 0, duration: this.args.options.fadeOutDuration },
          `>-=${this.args.options.fadeOutPreDuration}`
        ),
      [...starImgs]
    );
  },
  async final() {
    for (const animation of this.runningAnimation) {
      animation.pause();
    }
    if (this.args.imgs) {
      imgFinal([...this.args.imgs.starImgs]);
      this.args.imgs.container.alpha = 0;
    }
  },
};

const Upset: Animation<{
  instance: CharacterEffectInstance | undefined;
  options: EmotionOptions["Upset"];
  app: Application;
  handlerMap: HandlerMap | undefined;
  imgs: { upsetImg: Sprite; dialogImg: Sprite } | undefined;
}> = {
  args: {
    instance: undefined,
    options: emotionOptions["Upset"],
    app: new Application(),
    handlerMap: undefined,
    imgs: undefined,
  },
  runningAnimation: [],
  async animate() {
    if (!this.args.instance || !this.args.handlerMap) {
      return;
    }
    const sprites = getEmotionSprites(
      "Upset",
      this.args.handlerMap,
      this.args.app
    );
    if (!sprites) {
      return Promise.reject(`Upset没有对应的图像资源`);
    }
    const dialogImg = sprites[0];
    const upsetImg = Sprite.from(sprites[1].texture);
    prepareEmotionContainer(
      this.args.instance.instance,
      this.args.options,
      dialogImg
    );
    upsetImg.anchor.set(0.5, 0.5);
    dialogImg.addChild(upsetImg);
    dialogImg.visible = true;
    setRelativePosition(upsetImg, dialogImg, this.args.options.upsetImgPos);
    this.args.imgs = {
      dialogImg: dialogImg,
      upsetImg: upsetImg,
    };

    const animationTl = gsap.timeline({ paused: true });
    animationTl
      .fromTo(
        upsetImg,
        { pixi: { angle: this.args.options.rotateAnimation.angleFrom } },
        {
          pixi: { angle: this.args.options.rotateAnimation.angleTo },
          duration: this.args.options.rotateAnimation.duration,
          repeat: -1,
          yoyo: true,
        }
      )
      .to(upsetImg, {
        pixi: { scaleY: this.args.options.yScaleAnimation.scale },
        duration: this.args.options.yScaleAnimation.duration,
        repeat: -1,
        yoyo: true,
      });

    const tl = gsap.timeline();
    this.runningAnimation.push(timelineToPauseAble(tl));
    await timelinePromise(
      tl
        .add(
          animationTl.tweenFromTo(0, this.args.options.animationTotalDuration)
        )
        .to(dialogImg, {
          pixi: { alpha: 0 },
          duration: this.args.options.fadeOutDuration,
        }),
      [upsetImg]
    );
  },
  async final() {
    for (const animation of this.runningAnimation) {
      animation.pause();
    }
    if (this.args.imgs) {
      imgFinal([this.args.imgs.upsetImg]);
      this.args.imgs.dialogImg.alpha = 0;
    }
  },
};

const Steam: Animation<{
  instance: CharacterEffectInstance | undefined;
  options: EmotionOptions["Steam"];
  app: Application;
  handlerMap: HandlerMap | undefined;
  imgs: { steamImage1: Sprite; steamImage2: Sprite } | undefined;
}> = {
  args: {
    instance: undefined,
    options: emotionOptions["Steam"],
    app: new Application(),
    handlerMap: undefined,
    imgs: undefined,
  },
  runningAnimation: [],
  async animate() {
    if (!this.args.instance || !this.args.handlerMap) {
      return;
    }
    const sprites = getEmotionSprites(
      "Steam",
      this.args.handlerMap,
      this.args.app
    );
    if (!sprites) {
      return Promise.reject(`Steam没有对应的图像资源`);
    }
    const { container } = prepareEmotionContainer(
      this.args.instance.instance,
      this.args.options
    );
    const steamImage1 = Sprite.from(sprites[0].texture);
    steamImage1.angle = this.args.options.imgAngles[0];
    steamImage1.anchor.set(
      this.args.options.imgPivot.x,
      this.args.options.imgPivot.y
    );
    steamImage1.scale.set(this.args.options.imgScaleAnimation[0].start);

    const steamImage2 = Sprite.from(sprites[0].texture);
    steamImage2.angle = this.args.options.imgAngles[1];
    steamImage2.anchor.set(
      this.args.options.imgPivot.x,
      this.args.options.imgPivot.y
    );
    steamImage2.scale.set(this.args.options.imgScaleAnimation[1].start);
    steamImage2.visible = false;
    container.addChild(steamImage2);
    container.addChild(steamImage1);
    this.args.imgs = {
      steamImage1: steamImage1,
      steamImage2: steamImage2,
    };

    const tl = gsap.timeline();
    this.runningAnimation.push(timelineToPauseAble(tl));
    tl.to(steamImage1, {
      pixi: { scale: this.args.options.imgScaleAnimation[0].end },
      duration: 14 / 60,
    })
      .addLabel("image2Start")
      .to(steamImage1, { pixi: { alpha: 0 }, duration: 12 / 60 })
      .to(
        steamImage2,
        {
          pixi: { scale: this.args.options.imgScaleAnimation[1].end },
          duration: 21 / 60,
          onStart() {
            steamImage2.visible = true;
          },
        },
        "image2Start"
      )
      .to(steamImage2, { pixi: { alpha: 0 }, duration: 8 / 60 }, ">");

    await timelinePromise(tl, [steamImage1, steamImage2]);
  },
  async final() {
    for (const animation of this.runningAnimation) {
      animation.pause();
    }
    if (this.args.imgs) {
      imgFinal([this.args.imgs.steamImage1, this.args.imgs.steamImage2]);
    }
  },
};

const Sigh: Animation<{
  instance: CharacterEffectInstance | undefined;
  options: EmotionOptions["Sigh"];
  app: Application;
  handlerMap: HandlerMap | undefined;
  imgs: { sighImage: Sprite } | undefined;
}> = {
  args: {
    instance: undefined,
    options: emotionOptions["Sigh"],
    app: new Application(),
    handlerMap: undefined,
    imgs: undefined,
  },
  runningAnimation: [],
  async animate() {
    if (!this.args.instance || !this.args.handlerMap) {
      return;
    }
    const sprites = getEmotionSprites(
      "Sigh",
      this.args.handlerMap,
      this.args.app
    );
    if (!sprites) {
      return Promise.reject(`Sigh没有对应的图像资源`);
    }
    const { container } = prepareEmotionContainer(
      this.args.instance.instance,
      this.args.options
    );
    const sighImage = Sprite.from(sprites[0].texture);
    sighImage.alpha = 0;
    sighImage.angle = this.args.options.angle;
    sighImage.anchor.set(
      this.args.options.anchor.x,
      this.args.options.anchor.y
    );
    sighImage.scale.set(this.args.options.scaleAnimation.start);
    container.addChild(sighImage);
    this.args.imgs = {
      sighImage: sighImage,
    };

    const tl = gsap.timeline();
    this.runningAnimation.push(timelineToPauseAble(tl));
    tl.to(sighImage, { pixi: { alpha: 1 }, duration: 2 / 60 })
      .to(sighImage, {
        pixi: { scale: this.args.options.scaleAnimation.end },
        ease: Power4.easeOut,
        duration: 33 / 60,
      })
      .to(
        sighImage,
        { pixi: { alpha: 0 }, duration: 11 / 60 },
        `>+=${12 / 60}`
      );

    await timelinePromise(tl, [sighImage]);
  },
  async final() {
    for (const animation of this.runningAnimation) {
      animation.pause();
    }
    if (this.args.imgs) {
      imgFinal([this.args.imgs.sighImage]);
    }
  },
};

const Bulb: Animation<{
  instance: CharacterEffectInstance | undefined;
  options: EmotionOptions["Bulb"];
  app: Application;
  handlerMap: HandlerMap | undefined;
  imgs:
    | { bulbImage: Sprite; lightImage: Sprite; container: Container }
    | undefined;
}> = {
  args: {
    instance: undefined,
    options: emotionOptions["Bulb"],
    app: new Application(),
    handlerMap: undefined,
    imgs: undefined,
  },
  runningAnimation: [],
  async animate() {
    if (!this.args.instance || !this.args.handlerMap) {
      return;
    }
    const sprites = getEmotionSprites(
      "Bulb",
      this.args.handlerMap,
      this.args.app
    );
    if (!sprites) {
      return Promise.reject(`Bulb没有对应的图像资源`);
    }
    const dialogImg = Sprite.from(sprites[0].texture);
    const { container } = prepareEmotionContainer(
      this.args.instance.instance,
      this.args.options,
      dialogImg
    );
    container.alpha = 0;

    const bulbImage = Sprite.from(sprites[1].texture);
    bulbImage.anchor.set(0.5, 0.5);
    bulbImage.position.set(
      dialogImg.width / 2,
      this.args.options.bulbYPosition
    );
    bulbImage.visible = false;
    container.addChild(bulbImage);

    const lightImage = Sprite.from(sprites[2].texture);
    lightImage.anchor.set(0.5, 0.5);
    lightImage.position.set(
      dialogImg.width / 2,
      this.args.options.lightYPosition
    );
    lightImage.scale.set(this.args.options.lightScale);
    lightImage.visible = false;
    container.addChild(lightImage);
    this.args.imgs = {
      lightImage: lightImage,
      bulbImage: bulbImage,
      container: container,
    };

    const tl = gsap.timeline();
    this.runningAnimation.push(timelineToPauseAble(tl));
    tl.to(container, { pixi: { alpha: 1 }, duration: 6 / 60 })
      .to(container, {
        onStart() {
          bulbImage.visible = lightImage.visible = true;
        },
        duration: 6 / 60,
      })
      .to(container, {
        onStart() {
          (bulbImage.visible = true), (lightImage.visible = false);
        },
        duration: 7 / 60,
      })
      .to(container, {
        onStart() {
          bulbImage.visible = lightImage.visible = true;
        },
        duration: 52 / 60,
        onComplete() {
          container.visible = false;
        },
      });

    await timelinePromise(tl, [bulbImage, lightImage]);
  },
  async final() {
    for (const animation of this.runningAnimation) {
      animation.pause();
    }
    if (this.args.imgs) {
      imgFinal([this.args.imgs.bulbImage, this.args.imgs.lightImage]);
      this.args.imgs.container.visible = false;
    }
  },
};

const Tear: Animation<{
  instance: CharacterEffectInstance | undefined;
  options: EmotionOptions["Tear"];
  app: Application;
  handlerMap: HandlerMap | undefined;
  imgs: { smallTearImage: Sprite; largeTearImage: Sprite } | undefined;
}> = {
  args: {
    instance: undefined,
    options: emotionOptions["Tear"],
    app: new Application(),
    handlerMap: undefined,
    imgs: undefined,
  },
  runningAnimation: [],
  async animate() {
    if (!this.args.instance || !this.args.handlerMap) {
      return;
    }
    const sprites = getEmotionSprites(
      "Tear",
      this.args.handlerMap,
      this.args.app
    );
    if (!sprites) {
      return Promise.reject(`Tear没有对应的图像资源`);
    }
    const { container } = prepareEmotionContainer(
      this.args.instance.instance,
      this.args.options
    );

    const largeTearImage = Sprite.from(sprites[0].texture);
    largeTearImage.position = this.args.options.positions[0];
    largeTearImage.anchor.set(
      this.args.options.anchors[0].x,
      this.args.options.anchors[0].y
    );
    largeTearImage.scale.set(this.args.options.scaleAnimations[0].start);
    container.addChild(largeTearImage);
    largeTearImage.alpha = 0;

    const smallTearImage = Sprite.from(sprites[1].texture);
    smallTearImage.position = this.args.options.positions[1];
    smallTearImage.anchor.set(
      this.args.options.anchors[1].x,
      this.args.options.anchors[1].y
    );
    smallTearImage.scale.set(this.args.options.scaleAnimations[1].start);
    container.addChild(smallTearImage);
    smallTearImage.alpha = 0;
    this.args.imgs = {
      smallTearImage: smallTearImage,
      largeTearImage: largeTearImage,
    };

    const tl = gsap.timeline();
    this.runningAnimation.push(timelineToPauseAble(tl));
    tl.to(smallTearImage, { pixi: { alpha: 1 }, duration: 7 / 60 })
      .to(smallTearImage, {
        pixi: { scale: this.args.options.scaleAnimations[0].end },
        ease: Power4.easeOut,
        duration: 12 / 60,
      })
      .to(
        smallTearImage,
        { pixi: { alpha: 0 }, duration: 15 / 60 },
        `>+=${13 / 60}`
      )
      .to(largeTearImage, { pixi: { alpha: 1 }, duration: 3 / 60 }, 12 / 60)
      .to(
        largeTearImage,
        {
          pixi: { scale: this.args.options.scaleAnimations[1].end },
          ease: Power4.easeOut,
          duration: 13 / 60,
        },
        "<"
      )
      .to(
        largeTearImage,
        { pixi: { alpha: 0 }, ease: Power4.easeOut, duration: 4 / 60 },
        `>+=${32 / 60}`
      );

    await timelinePromise(tl, [smallTearImage, largeTearImage]);
  },
  async final() {
    for (const animation of this.runningAnimation) {
      animation.pause();
    }
    if (this.args.imgs) {
      imgFinal([this.args.imgs.smallTearImage, this.args.imgs.largeTearImage]);
    }
  },
};

const Zzz: Animation<{
  instance: CharacterEffectInstance | undefined;
  options: EmotionOptions["Zzz"];
  app: Application;
  handlerMap: HandlerMap | undefined;
  imgs: Sprite[] | undefined;
}> = {
  args: {
    instance: undefined,
    options: emotionOptions["Zzz"],
    app: new Application(),
    handlerMap: undefined,
    imgs: undefined,
  },
  runningAnimation: [],
  async animate() {
    if (!this.args.instance || !this.args.handlerMap) {
      return;
    }
    const sprites = getEmotionSprites(
      "Zzz",
      this.args.handlerMap,
      this.args.app
    );
    if (!sprites) {
      return Promise.reject(`Zzz没有对应的图像资源`);
    }
    const { container } = prepareEmotionContainer(
      this.args.instance.instance,
      this.args.options
    );
    const zImages: Sprite[] = [];
    for (let index = 0; index < 3; ++index) {
      const imageSetting = this.args.options.zImageSettings[index];
      const zImage = Sprite.from(sprites[0].texture);
      zImage.scale.set(imageSetting.scale);
      zImage.position = imageSetting.position;
      zImage.angle = imageSetting.rotate;
      zImage.visible = false;
      zImages.push(zImage);
      container.addChild(zImage);
    }
    this.args.imgs = zImages;

    const tl = gsap.timeline();
    this.runningAnimation.push(timelineToPauseAble(tl));
    tl.to(container, {
      onStart: () => {
        zImages[0].visible = true;
      },
      duration: frameToS(53),
    })
      .to(container, {
        onStart: () => {
          zImages[1].visible = true;
        },
        duration: frameToS(48),
      })
      .to(container, {
        onStart: () => {
          zImages[2].visible = true;
        },
        duration: frameToS(40),
      });

    await timelinePromise(tl, zImages);
  },
  async final() {
    for (const animation of this.runningAnimation) {
      animation.pause();
    }
    if (this.args.imgs) {
      imgFinal(this.args.imgs);
    }
  },
};

/**
 * 将帧数转化为秒, 在每秒60帧的前提下计算
 * @param frameNumber
 */
function frameToS(frameNumber: number) {
  return frameNumber / 60;
}

export default {
  Angry,
  Chat,
  Dot,
  Exclaim,
  Heart,
  Music,
  Question,
  Respond,
  Sad,
  Shy,
  Surprise,
  Sweat,
  Twinkle,
  Upset,
  Steam,
  Sigh,
  Bulb,
  Tear,
  Zzz,
};
