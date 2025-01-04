import eventBus from "@/eventBus";
import { usePlayerStore } from "@/stores";
import gsap, { Power4 } from "gsap";
import { Spine } from "@esotericsoftware/spine-pixi-v7";
import { Container, Sprite } from "pixi.js";
import emotionOptions from "./options/emotionOptions";
import {
  CharacterEffectInstance,
  CharacterEmotionPlayer,
  EmotionOptions,
  EmotionWord,
  PositionOffset,
  Scale,
} from "@/types/characterLayer";

const CharacterEmotionPlayerInstance: CharacterEmotionPlayer = {
  init() {
    return;
  },
  dispose(): void {},
  getHandlerFunction(type: EmotionWord) {
    return Reflect.get(this, type);
  },
  processEffect(
    type: EmotionWord,
    instance: CharacterEffectInstance
  ): Promise<void> {
    const fn = this.getHandlerFunction(type);
    if (!fn) {
      return Promise.reject(`不支持的特效类型: ${type}`);
    }
    const { emotionResources, app } = usePlayerStore();
    const emotionImageSprites: Sprite[] = [];
    const emotionImgs = emotionResources(type);
    if (!emotionImgs) {
      return Promise.reject(`${type}没有对应的图像资源`);
    }
    for (const imageResource of emotionImgs) {
      const tempSprite = Sprite.from(imageResource);
      tempSprite.visible = false;
      app.stage.addChild(tempSprite);
      emotionImageSprites.push(tempSprite);
    }
    eventBus.emit("playEmotionAudio", type);
    return fn(instance, emotionOptions[type], emotionImageSprites)?.then(() => {
      for (const sprite of emotionImageSprites) {
        sprite.destroy();
      }
    }) as Promise<void>;
  },
  Angry(
    instance: CharacterEffectInstance,
    options: EmotionOptions["Angry"],
    sprites: Sprite[]
  ): Promise<void> {
    const angryImgUnit = sprites[0];
    const scale = getRelativeScale(angryImgUnit, options);
    const { container } = prepareEmotionContainer(instance.instance, options);
    //最后用于确定动画结束的timeline
    let waitTimeLine = gsap.timeline();
    const destroyImg: Sprite[] = [];
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
      tl.to(uImgUnit.scale, {
        x: scale * options.animationScale.scale,
        duration: options.animationScale.duration,
      })
        .to(uImgUnit.scale, {
          x: scale,
          duration: options.animationScale.duration,
        })
        .to(uImgUnit.scale, {
          x: scale * options.endScale.scale,
          y: scale * options.endScale.scale,
          duration: options.endScale.duration,
        });
    }

    return timelinePromise(waitTimeLine, destroyImg);
  },
  Chat(
    instance: CharacterEffectInstance,
    options: EmotionOptions["Chat"],
    sprites: Sprite[]
  ): Promise<void> {
    const chatImage = sprites[0];
    prepareEmotionContainer(instance.instance, options, chatImage);

    chatImage.scale.set(getRelativeScale(chatImage, options));
    chatImage.visible = true;
    chatImage.pivot.x = chatImage.width * (1 + options.rotatePivot.x);
    chatImage.pivot.y = chatImage.height * (1 + options.rotatePivot.y);
    chatImage.zIndex = 10;
    const tl = gsap.timeline();
    tl.to(chatImage, {
      angle: options.rotateAngle,
      duration: options.rotateTime / 2,
    })
      .to(chatImage, { angle: 0, duration: options.rotateTime / 2 })
      .to(chatImage, { alpha: 0, duration: options.fadeOutDuration });

    return timelinePromise(tl, []);
  },
  Dot(
    instance: CharacterEffectInstance,
    options: EmotionOptions["Dot"],
    sprites: Sprite[]
  ): Promise<void> {
    const dialogImg = Sprite.from(sprites[0].texture);
    prepareEmotionContainer(instance.instance, options, dialogImg);
    const dotContainer = new Container();
    const showTl = gsap.timeline();
    for (let i = 0; i < 3; ++i) {
      const dotImg = Sprite.from(sprites[1].texture);
      dotImg.alpha = 0;
      dotImg.position = calcRelativePosition(dotImg, {
        x: options.dotPos[i],
        y: 0,
      });
      showTl.to(dotImg, {
        alpha: 1,
        duration: options.showAnimation.alpahaDuration,
        delay: options.showAnimation.showDelay,
      });
      dotContainer.addChild(dotImg);
    }
    dialogImg.addChild(dotContainer);
    dotContainer.position = {
      x: options.dotContainerPos.x * dialogImg.width,
      y: options.dotContainerPos.y * dialogImg.height,
    };
    showTl.to(dialogImg, {
      alpha: 0,
      duration: options.fadeOutDuration,
      delay: options.fadeOutPreDuration,
    });
    return timelinePromise(showTl, [
      dialogImg,
      ...(dotContainer.children as Sprite[]),
    ]);
  },
  Exclaim(
    instance: CharacterEffectInstance,
    options,
    sprites: Sprite[]
  ): Promise<void> {
    const surpriseImg = sprites[0];
    prepareEmotionContainer(instance.instance, options, surpriseImg);
    const scale = getRelativeScale(surpriseImg, options);
    surpriseImg.visible = true;
    const tl = gsap.timeline();
    const animationScale = scale * options.scaleAnimation.scale;
    const recoverScale = scale * options.scaleAnimation.recoverScale;
    return timelinePromise(
      tl
        .to(surpriseImg.scale, {
          x: animationScale,
          y: animationScale,
          duration: options.scaleAnimation.scaleDuration,
        })
        .to(surpriseImg.scale, {
          x: recoverScale,
          y: recoverScale,
          duration: options.scaleAnimation.recoverDuration,
        })
        .to(surpriseImg, { duration: options.fadeOutWaitTime })
        .to(surpriseImg, { alpha: 0, duration: options.fadeOutDuration }),
      []
    );
  },
  Heart(
    instance: CharacterEffectInstance,
    options: EmotionOptions["Heart"],
    sprites: Sprite[]
  ): Promise<void> {
    const dialogImg = sprites[0];
    const heartImg = sprites[1];
    const dialogScale = getRelativeScale(dialogImg, options);
    const { container } = prepareEmotionContainer(instance.instance, options);

    dialogImg.scale.set(dialogScale);
    heartImg.x = dialogImg.width * options.heartImg.position.x;
    heartImg.y = dialogImg.width * options.heartImg.position.y;
    const heartScale =
      (options.heartImg.scale * dialogImg.width) / heartImg.width;
    heartImg.scale.set(heartScale);
    dialogImg.zIndex = 10;
    heartImg.zIndex = 11;
    dialogImg.visible = heartImg.visible = true;
    container.addChild(dialogImg);
    container.addChild(heartImg);

    const tl = gsap.timeline();
    const firstScale: Scale = {
      x: options.jumpAnimation.firstScale.x * heartScale,
      y: options.jumpAnimation.firstScale.y * heartScale,
    };
    const secondScale: Scale = {
      x: options.jumpAnimation.secondScale.x * heartScale,
      y: options.jumpAnimation.secondScale.y * heartScale,
    };
    tl.to(heartImg.scale, {
      x: firstScale.x,
      y: firstScale.y,
      duration: options.jumpAnimation.duration,
    })
      .to(heartImg.scale, {
        x: heartScale,
        y: heartScale,
        duration: options.jumpAnimation.duration,
      })
      .to(heartImg.scale, {
        x: secondScale.x,
        y: secondScale.y,
        duration: options.jumpAnimation.duration,
      })
      .to(heartImg, { alpha: 0, duration: options.fadeOutDuration })
      .add("fadeOut", "<")
      .to(
        dialogImg,
        { alpha: 0, duration: options.fadeOutDuration },
        "fadeOut"
      );
    return timelinePromise(tl, []);
  },
  Music(
    instance: CharacterEffectInstance,
    options: EmotionOptions["Music"],
    sprites: Sprite[]
  ) {
    const note = sprites[0];
    const scale = getRelativeScale(note, options);
    const { container } = prepareEmotionContainer(instance.instance, options);
    note.scale.set(scale * 0.7);
    note.visible = true;
    container.addChild(note);
    const tl = gsap.timeline();
    tl.to(note.scale, { x: scale, y: scale, duration: 0.1 })
      .to(note, {
        x: note.width * options.animation.offset.x,
        duration: options.animation.duration,
      })
      .add("start", "<")
      .to(
        note,
        {
          y: note.width * options.animation.offset.y,
          angle: options.rotateAngle,
          duration: options.animation.duration * 0.3,
        },
        "start"
      )
      .to(
        note,
        { y: 0, angle: 0, duration: options.animation.duration * 0.3 },
        ">"
      )
      .to(
        note,
        {
          y: note.width * options.animation.offset.y,
          angle: options.rotateAngle,
          duration: options.animation.duration * 0.4,
        },
        ">"
      )
      .to(
        note,
        { y: 0, angle: 0, duration: options.animation.duration * 0.4 },
        ">"
      )
      .to(note, { alpha: 0, duration: options.fadeOutDuration }, ">");

    return timelinePromise(tl, []);
  },
  Question(
    instance: CharacterEffectInstance,
    options: EmotionOptions["Question"],
    sprites: Sprite[]
  ): Promise<void> {
    const questionImg = sprites[0];
    questionImg.visible = true;
    questionImg.zIndex = 10;
    const scale = getRelativeScale(questionImg, options);
    prepareEmotionContainer(instance.instance, options, questionImg);

    questionImg.scale.set(scale);
    questionImg.anchor.set(
      options.scaleAnimation.anchor.x,
      options.scaleAnimation.anchor.y
    );
    const tl = gsap.timeline();
    const animationScale = scale * options.scaleAnimation.scale;
    const recoverScale = scale * options.scaleAnimation.recoverScale;
    return timelinePromise(
      tl
        .to(questionImg.scale, {
          x: animationScale,
          y: animationScale,
          duration: options.scaleAnimation.scaleDuration,
        })
        .to(questionImg.scale, {
          x: recoverScale,
          y: recoverScale,
          duration: options.scaleAnimation.recoverDuration,
        })
        .to(questionImg, { duration: options.fadeOutPreDuration! })
        .to(questionImg, { alpha: 0, duration: options.fadeOutDuration }),
      []
    );
  },
  Respond(
    instance: CharacterEffectInstance,
    options: EmotionOptions["Respond"],
    sprites: Sprite[]
  ): Promise<void> {
    const { instance: spine } = instance;
    const { container } = prepareEmotionContainer(spine, options);
    const scale = getRelativeScale(sprites[0], options);

    for (let i = 0; i < 3; ++i) {
      const respondImg = new Sprite(sprites[0].texture);
      respondImg.angle = options.perImgSetting[i].angle;
      respondImg.anchor.set(
        options.perImgSetting[i].anchor.x,
        options.perImgSetting[i].anchor.y
      );
      respondImg.scale.set((scale * options.perImgSetting[i].scale) / 0.5);
      container.addChild(respondImg);
    }
    container.zIndex = 10;
    container.alpha = 1;
    container.visible = true;
    const tl = gsap.timeline();
    return timelinePromise(
      tl
        .to(container, {
          alpha: options.flashAnimation.alpha,
          duration: options.flashAnimation.duration,
        })
        .to(container, { alpha: 1, duration: options.fadeOutDuration })
        .to(container, { duration: options.fadeOutPreDuration })
        .to(container, { alpha: 0, duration: options.fadeOutDuration }),
      [...(container.children as Sprite[]), ...sprites]
    );
  },
  Sad(
    instance: CharacterEffectInstance,
    options: EmotionOptions["Sad"],
    sprites: Sprite[]
  ): Promise<void> {
    const { container } = prepareEmotionContainer(instance.instance, options);
    const tl = gsap.timeline();
    const sadLineImages: Sprite[] = [];
    for (let i = 0; i < 3; ++i) {
      const sadLineImage = Sprite.from(sprites[0].texture);
      sadLineImages.push(sadLineImage);
      sadLineImage.alpha = 0;
      sadLineImage.scale.y = 0.5;
      sadLineImage.position.x = options.imageGap * i;
      sadLineImage.position.y = options.imgInitYPosition[i];
      container.addChild(sadLineImage);
      tl.to(sadLineImage, { pixi: { alpha: 1 }, duration: 1 / 15 }, i / 6)
        .to(sadLineImage, { pixi: { scaleY: 1 }, duration: 4 / 15 }, ">")
        .to(
          sadLineImage,
          { pixi: { positionY: `+=${options.moveYDistance}` } },
          "<"
        )
        .to(sadLineImage, { duration: 26 / 60 }, ">");
    }
    tl.to(container, { pixi: { alpha: 0 }, duration: 8 / 60 });

    return timelinePromise(tl, sadLineImages);
  },
  Shy(
    instance: CharacterEffectInstance,
    options: EmotionOptions["Shy"],
    sprites: Sprite[]
  ): Promise<void> {
    const dialogImg = sprites[0];
    const shyImg = sprites[1];
    const { container } = prepareEmotionContainer(instance.instance, options);
    const scale = getRelativeScale(dialogImg, options);
    dialogImg.scale.set(scale * options.scaleAnamation.startScale);
    dialogImg.anchor.set(
      options.scaleAnamation.anchor.x,
      options.scaleAnamation.anchor.y
    );
    const shyImgPos = calcRelativePosition(dialogImg, options.shyImg.position);
    shyImg.scale.set(
      scale * options.shyImg.scale * options.scaleAnamation.startScale
    );
    shyImg.position = shyImgPos;
    dialogImg.zIndex = 10;
    shyImg.zIndex = 11;
    const shyImgAnchor = options.shyImg.anchor;
    shyImg.anchor.set(shyImgAnchor.x, shyImgAnchor.y);
    shyImg.visible = dialogImg.visible = true;
    container.addChild(dialogImg, shyImg);
    const shakeTl = gsap.timeline({ paused: true });
    shakeTl
      .add("start")
      .to(shyImg, {
        angle: options.shakeAnimation.angleFrom,
        duration: options.shakeAnimation.duration / 2,
      })
      .to(shyImg, {
        angle: options.shakeAnimation.angleTo,
        duration: options.shakeAnimation.duration / 2,
      })
      .add("end");
    const tl = gsap.timeline();
    return timelinePromise(
      tl
        .to(shyImg.scale, {
          x: scale,
          y: scale,
          duration: options.scaleAnamation.duration,
        })
        .to(
          dialogImg.scale,
          { x: scale, y: scale, duration: options.scaleAnamation.duration },
          "<"
        )
        .add(
          shakeTl.tweenFromTo("start", "end", {
            repeat: options.shakeAnimation.times - 1,
          })
        )
        .to(shyImg, { alpha: 0, duration: options.fadeOutDuration })
        .to(dialogImg, { alpha: 0, duration: options.fadeOutDuration }, "<"),
      []
    );
  },
  Surprise(
    instance: CharacterEffectInstance,
    options: EmotionOptions["Surprise"],
    sprites: Sprite[]
  ): Promise<void> {
    const exclaimImg = Sprite.from(sprites[0].texture);
    const surpriseImg = Sprite.from(sprites[1].texture);
    const scale = getRelativeScale(exclaimImg, options);
    const startScale = scale * options.scaleAnimation.startScale;

    exclaimImg.scale.set(startScale);
    exclaimImg.anchor.set(
      options.scaleAnimation.anchor.x,
      options.scaleAnimation.anchor.y
    );
    surpriseImg.scale.set(
      startScale,
      startScale * options.scaleAnimation.questionImgYScale
    );
    surpriseImg.position = calcRelativePosition(
      exclaimImg,
      options.imgSetting.questionImgPos
    );
    surpriseImg.anchor.set(
      options.scaleAnimation.anchor.x,
      options.scaleAnimation.anchor.y
    );
    const { container } = prepareEmotionContainer(instance.instance, options);
    container.addChild(exclaimImg, surpriseImg);
    container.zIndex = 10;

    const tl = gsap.timeline();
    const xOffset = options.jumpAnimation.xOffset * instance.instance.width;
    const jumpYOffset =
      options.jumpAnimation.jumpYOffset * instance.instance.width;
    return timelinePromise(
      tl
        .to(container, {
          x: `+=${xOffset}`,
          duration: options.jumpAnimation.duration,
        })
        .to(
          container,
          {
            y: `-=${jumpYOffset}`,
            duration: options.jumpAnimation.duration / 2,
          },
          0
        )
        .to(
          container,
          {
            y: `+=${jumpYOffset}`,
            duration: options.jumpAnimation.duration / 2,
          },
          ">"
        )
        .add("jumpEnd")
        .to(
          exclaimImg.scale,
          { x: scale, y: scale, duration: options.scaleAnimation.duration },
          0
        )
        .to(
          surpriseImg.scale,
          { x: scale, y: scale, duration: options.scaleAnimation.duration },
          0
        )
        .to(container, { duration: options.fadeOutPreDuration }, "jumpEnd")
        .to(container, { alpha: 0, duration: options.fadeOutDuration }, ">"),
      [surpriseImg, exclaimImg]
    );
  },
  Sweat(
    instance: CharacterEffectInstance,
    options: EmotionOptions["Sweat"],
    sprites: Sprite[]
  ): Promise<void> {
    const dropImg = sprites[0];
    const smallDropImg = sprites[1];
    const { container } = prepareEmotionContainer(instance.instance, options);
    const scale = getRelativeScale(dropImg, options);
    dropImg.scale.set(scale);
    smallDropImg.scale.set(scale);
    const smallPosition = calcRelativePosition(
      dropImg,
      options.smallImg.offset
    );
    smallDropImg.x = smallPosition.x;
    smallDropImg.y = smallPosition.y;
    dropImg.zIndex = 10;
    smallDropImg.zIndex = 10;
    smallDropImg.visible = dropImg.visible = true;
    container.addChild(dropImg, smallDropImg);
    const tl = gsap.timeline();
    tl.to(dropImg, {
      y: dropImg.y - dropImg.width * options.dropAnimation.yOffset,
      duration: options.dropAnimation.duration,
    }).to(
      smallDropImg,
      {
        y:
          smallDropImg.y -
          options.smallImg.dropAnimationOffset * smallDropImg.width,
        duration: options.dropAnimation.duration,
      },
      "<"
    );

    return timelinePromise(tl, []);
  },
  Twinkle(
    instance: CharacterEffectInstance,
    options: EmotionOptions["Twinkle"],
    sprites: Sprite[]
  ): Promise<void> {
    const { container } = prepareEmotionContainer(instance.instance, options);

    const scale = getRelativeScale(sprites[0], options) / 0.5;
    const starImgs: Sprite[] = [];
    const starImgScales: number[] = [];
    for (let i = 0; i < 3; ++i) {
      starImgScales.push(scale * options.starImgs.scale[i]);
    }
    for (let i = 0; i < 3; ++i) {
      const starImg = Sprite.from(sprites[0].texture);
      starImgs.push(starImg);
      starImg.anchor.set(0.5);
      starImg.scale.set(starImgScales[i]);
      starImg.position = calcRelativePosition(
        starImgs[0],
        options.starImgs.pos[i]
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
          pixi: { scale: options.flashAnimation.scales[i] * starImgScales[i] },
          duration: options.flashAnimation.duration[i] / 2,
          repeat: -1,
          yoyo: true,
        },
        0
      );
      flashTlMaster.add(flashTl, 0);
    }

    const tl = gsap.timeline();
    return timelinePromise(
      tl
        .to(container, { alpha: 1, duration: options.fadeInDuration })
        .add(flashTlMaster.tweenFromTo(0, options.flashAnimation.totalDuration))
        .to(
          container,
          { alpha: 0, duration: options.fadeOutDuration },
          `>-=${options.fadeOutPreDuration}`
        ),
      [...starImgs]
    );
  },
  Upset(
    instance: CharacterEffectInstance,
    options: EmotionOptions["Upset"],
    sprites: Sprite[]
  ): Promise<void> {
    const dialogImg = sprites[0];
    const upsetImg = Sprite.from(sprites[1].texture);
    prepareEmotionContainer(instance.instance, options, dialogImg);
    upsetImg.anchor.set(0.5, 0.5);
    dialogImg.addChild(upsetImg);
    dialogImg.visible = true;
    setRelativePosition(upsetImg, dialogImg, options.upsetImgPos);

    const animationTl = gsap.timeline({ paused: true });
    animationTl
      .fromTo(
        upsetImg,
        { pixi: { angle: options.rotateAnimation.angleFrom } },
        {
          pixi: { angle: options.rotateAnimation.angleTo },
          duration: options.rotateAnimation.duration,
          repeat: -1,
          yoyo: true,
        }
      )
      .to(upsetImg, {
        pixi: { scaleY: options.yScaleAnimation.scale },
        duration: options.yScaleAnimation.duration,
        repeat: -1,
        yoyo: true,
      });

    const tl = gsap.timeline();
    return timelinePromise(
      tl
        .add(animationTl.tweenFromTo(0, options.animationTotalDuration))
        .to(dialogImg, {
          pixi: { alpha: 0 },
          duration: options.fadeOutDuration,
        }),
      [upsetImg]
    );
  },
  Steam(instance, options, sprites) {
    const { container } = prepareEmotionContainer(instance.instance, options);
    const steamImage1 = Sprite.from(sprites[0].texture);
    steamImage1.angle = options.imgAngles[0];
    steamImage1.anchor.set(options.imgPivot.x, options.imgPivot.y);
    steamImage1.scale.set(options.imgScaleAnimation[0].start);

    const steamImage2 = Sprite.from(sprites[0].texture);
    steamImage2.angle = options.imgAngles[1];
    steamImage2.anchor.set(options.imgPivot.x, options.imgPivot.y);
    steamImage2.scale.set(options.imgScaleAnimation[1].start);
    steamImage2.visible = false;
    container.addChild(steamImage2);
    container.addChild(steamImage1);

    const tl = gsap.timeline();
    tl.to(steamImage1, {
      pixi: { scale: options.imgScaleAnimation[0].end },
      duration: 14 / 60,
    })
      .addLabel("image2Start")
      .to(steamImage1, { pixi: { alpha: 0 }, duration: 12 / 60 })
      .to(
        steamImage2,
        {
          pixi: { scale: options.imgScaleAnimation[1].end },
          duration: 21 / 60,
          onStart() {
            steamImage2.visible = true;
          },
        },
        "image2Start"
      )
      .to(steamImage2, { pixi: { alpha: 0 }, duration: 8 / 60 }, ">");

    return timelinePromise(tl, [steamImage1, steamImage2]);
  },
  Sigh(instance, options, sprites) {
    const { container } = prepareEmotionContainer(instance.instance, options);
    const sighImage = Sprite.from(sprites[0].texture);
    sighImage.alpha = 0;
    sighImage.angle = options.angle;
    sighImage.anchor.set(options.anchor.x, options.anchor.y);
    sighImage.scale.set(options.scaleAnimation.start);
    container.addChild(sighImage);

    const tl = gsap.timeline();
    tl.to(sighImage, { pixi: { alpha: 1 }, duration: 2 / 60 })
      .to(sighImage, {
        pixi: { scale: options.scaleAnimation.end },
        ease: Power4.easeOut,
        duration: 33 / 60,
      })
      .to(
        sighImage,
        { pixi: { alpha: 0 }, duration: 11 / 60 },
        `>+=${12 / 60}`
      );

    return timelinePromise(tl, [sighImage]);
  },
  Bulb(instance, options, sprites) {
    const dialogImg = Sprite.from(sprites[0].texture);
    const { container } = prepareEmotionContainer(
      instance.instance,
      options,
      dialogImg
    );
    container.alpha = 0;

    const bulbImage = Sprite.from(sprites[1].texture);
    bulbImage.anchor.set(0.5, 0.5);
    bulbImage.position.set(dialogImg.width / 2, options.bulbYPosition);
    bulbImage.visible = false;
    container.addChild(bulbImage);

    const lightImage = Sprite.from(sprites[2].texture);
    lightImage.anchor.set(0.5, 0.5);
    lightImage.position.set(dialogImg.width / 2, options.lightYPosition);
    lightImage.scale.set(options.lightScale);
    lightImage.visible = false;
    container.addChild(lightImage);

    const tl = gsap.timeline();
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

    return timelinePromise(tl, [bulbImage, lightImage]);
  },
  Tear(instance, options, sprites) {
    const { container } = prepareEmotionContainer(instance.instance, options);

    const largeTearImage = Sprite.from(sprites[0].texture);
    largeTearImage.position = options.positions[0];
    largeTearImage.anchor.set(options.anchors[0].x, options.anchors[0].y);
    largeTearImage.scale.set(options.scaleAnimations[0].start);
    container.addChild(largeTearImage);
    largeTearImage.alpha = 0;

    const smallTearImage = Sprite.from(sprites[1].texture);
    smallTearImage.position = options.positions[1];
    smallTearImage.anchor.set(options.anchors[1].x, options.anchors[1].y);
    smallTearImage.scale.set(options.scaleAnimations[1].start);
    container.addChild(smallTearImage);
    smallTearImage.alpha = 0;

    const tl = gsap.timeline();
    tl.to(smallTearImage, { pixi: { alpha: 1 }, duration: 7 / 60 })
      .to(smallTearImage, {
        pixi: { scale: options.scaleAnimations[0].end },
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
          pixi: { scale: options.scaleAnimations[1].end },
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

    return timelinePromise(tl, [smallTearImage, largeTearImage]);
  },
  Zzz(instance, options, sprites) {
    const { container } = prepareEmotionContainer(instance.instance, options);
    const zImages: Sprite[] = [];
    for (let index = 0; index < 3; ++index) {
      const imageSetting = options.zImageSettings[index];
      const zImage = Sprite.from(sprites[0].texture);
      zImage.scale.set(imageSetting.scale);
      zImage.position = imageSetting.position;
      zImage.angle = imageSetting.rotate;
      zImage.visible = false;
      zImages.push(zImage);
      container.addChild(zImage);
    }

    const tl = gsap.timeline();
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

    return timelinePromise(tl, zImages);
  },
};

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
 * 将帧数转化为秒, 在每秒60帧的前提下计算
 * @param frameNumber
 */
function frameToS(frameNumber: number) {
  return frameNumber / 60;
}

export default CharacterEmotionPlayerInstance;
