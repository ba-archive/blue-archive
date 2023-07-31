// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import eventBus from "@/eventBus";
import { usePlayerStore } from "@/stores";
import { getResourcesUrl } from "@/utils";
import gsap from "gsap";
import { IEvent, ITrackEntry, Spine } from "pixi-spine";
import { Assets, Container } from "pixijs";
import { IL2dPlayQue } from "@/types/l2d";

let disposed = true;
const IDLE_TRACK = 1;
const DEV_TRACK = 0;
const TALK_START_TRACK = 2;

export function L2DInit() {
  disposed = false;
  const { app } = usePlayerStore();
  // 主要播放 spine
  let mainItem: Spine;
  /**
   * 用来防止dev动画和普通动画都有event时的冲突
   */
  let currentVoice = "";
  // 背景混合或者其他播放 spine, 如普通星野和运动邮箱
  let otherItems: Spine[] = [];
  // 当前顶层的spine index
  let currentIndex = 0;
  let startAnimations: ({
    animation: string;
    spine: Spine;
  } & Partial<IL2dPlayQue>)[];
  let timeOutArray: number[] = [];
  function dispose() {
    for (const timeout of timeOutArray) {
      clearInterval(timeout);
    }
    timeOutArray = [];
    otherItems.forEach(it => app.stage.removeChild(it as unknown as Container));
    if (startAnimations) {
      startAnimations.forEach(it => {
        if (null !== app.stage) {
          app.stage.removeChild(it.spine as unknown as Container);
        }
      });
    }
    if (null !== app.stage) {
      app.stage.removeChild(mainItem as unknown as Container);
    }
    disposed = true;
  }
  eventBus.on("dispose", dispose);
  eventBus.on("live2dDebugDispose", dispose);
  // 接收动画消息
  eventBus.on("changeAnimation", e => {
    const temAnimation = e.replace(/_(A|M)/, "");
    let talkAnimations = mainItem.spineData.animations.filter(i =>
      i.name.includes(temAnimation)
    );
    const devAnimation = talkAnimations.find(i => /dev/i.test(i.name));
    talkAnimations = talkAnimations.filter(i => !/dev/i.test(i.name));
    console.log(e, ": ", talkAnimations);
    let animationTrack = TALK_START_TRACK;
    for (const animation of talkAnimations) {
      mainItem.state.setAnimation(animationTrack++, animation.name, false);
    }
    if (devAnimation) {
      mainItem.state.setAnimation(DEV_TRACK, devAnimation.name, false);
    }
  });
  // 停止
  eventBus.on("endL2D", () => {
    [mainItem, ...otherItems].forEach(i => app.stage.removeChild(i));
  });
  // 播放live2D
  eventBus.on("playL2D", () => {
    const { l2dSpineData, curL2dConfig } = usePlayerStore();
    // 动画是否已经播放, true 代表播放完成
    const hasPlayedAnimation = {} as { [key: string]: boolean };
    currentIndex = 0;
    // 设置 spine 播放信息
    function setSpinePlayInfo({
      item,
      zIndex,
    }: {
      item: Spine;
      zIndex: number;
    }) {
      const { scale = 1 } = curL2dConfig?.spineSettings?.[item.name] || {};
      const { width, height } = calcL2DSize(
        item.width,
        item.height,
        app.renderer.width,
        app.renderer.height
      );
      // 设置位置, 大小
      item = Object.assign(item, {
        x: app.renderer.width / 2,
        y: app.renderer.height,
        width: width * scale,
        height: height * scale,
      });
      item.zIndex = zIndex;
      item.state.addListener({
        // spine中事件回调
        start: function (entry: any) {
          const entryAnimationName = entry.animation.name + item.name;
          const duration = entry.animation.duration;
          const {
            fade,
            fadeTime = 0.8,
            secondFadeTime,
            sounds,
          } = startAnimations[currentIndex - 1] || {};
          if (fade) {
            // 在快结束的时候触发 fade
            timeOutArray.push(
              window.setTimeout(fadeEffect, (duration - fadeTime) * 1000)
            );
            if (secondFadeTime) {
              timeOutArray.push(
                window.setTimeout(
                  fadeEffect,
                  (duration - secondFadeTime) * 1000
                )
              );
            }
          }
          if (sounds) {
            for (const sound of sounds) {
              if (sound.fileName) {
                timeOutArray.push(
                  window.setTimeout(
                    () =>
                      eventBus.emit("playAudioWithConfig", {
                        url: getResourcesUrl("sound", sound.fileName),
                        config: {
                          volume: sound.volume || 2,
                        },
                      }),
                    sound.time
                  )
                );
              }
            }
          }
          // 如果没有播放过的话就设置播放状态为播放
          if (!hasPlayedAnimation[entryAnimationName]) {
            eventBus.emit("l2dAnimationDone", {
              done: false,
              animation: entryAnimationName,
            });
            hasPlayedAnimation[entryAnimationName] = true;
          }
        },
        complete: function (entry: any) {
          // 如果不是有待机动作的主 spine 就去掉
          if (item !== mainItem) {
            timeOutArray.push(
              window.setTimeout(() => {
                app.stage.removeChild(item);
              }, 4)
            );
          }
          const entryAnimationName = entry.animation.name + item.name;
          if (
            entryAnimationName.includes("Idle") &&
            startAnimations[currentIndex]
          ) {
            const curStartAnimations = startAnimations[currentIndex]!;
            currentIndex += 1;
            app.stage.addChild(curStartAnimations.spine);
            // 待机动画 Idle 循环播放, 为空时代表起始动画播放完成, 开始播放待机动画
            // 必须要先加入 app 才能播放
            timeOutArray.push(
              window.setTimeout(() => {
                curStartAnimations.spine.state.setAnimation(
                  IDLE_TRACK,
                  curStartAnimations.animation,
                  !startAnimations[currentIndex] // 最后一个待机动作循环
                );
              }, 4)
            );
            return;
          }
          // TODO: 是否播放完可以下一步
          eventBus.emit("l2dAnimationDone", {
            done: true,
            animation: entryAnimationName,
          });
          // 0轨道, 空动画, 待机动画跳过
          if (
            entry.trackIndex === 0 ||
            entryAnimationName.includes("<empty>") ||
            /^Idle_01/.test(entryAnimationName) // Start_Idle_01 不是待机动画, Idle_01 才是
          ) {
            return;
          }

          if (entryAnimationName.indexOf("_Talk_") >= 0) {
            // 说话动作结束后设为待机
            const e = item.state.setAnimation(
              entry.trackIndex,
              "Idle_01",
              true
            );
            // 跳转到下一个动画的过场
            e!.mixDuration = 0.8;
          } else {
            // 结束后动作置空
            item.state.setEmptyAnimation(entry.trackIndex, 0.8);
          }
        },
      });
    }
    mainItem = new Spine(l2dSpineData!);
    function playL2dVoice(entry: ITrackEntry, event: IEvent) {
      const eventName = event.data.name;
      if (
        eventName !== "Talk" &&
        eventName !== currentVoice &&
        !["enableobject", "disableobject"].includes(eventName.toLowerCase())
      ) {
        currentVoice = eventName;
        eventBus.emit("playAudio", {
          voiceJPUrl: getResourcesUrl("l2dVoice", event.data.name),
        });
      }
    }
    mainItem.state.addListener({
      event: playL2dVoice,
    });

    // 设置名字区分
    mainItem.name = curL2dConfig?.name || "";
    if (curL2dConfig?.otherSpine) {
      otherItems = curL2dConfig.otherSpine.map((i, idx) => {
        const temItem = new Spine(
          Assets.get(getResourcesUrl("otherL2dSpine", i)).spineData
        );
        temItem.name = i;
        setSpinePlayInfo({ item: temItem, zIndex: 100 + idx + 1 });
        return temItem;
      });
    }
    setSpinePlayInfo({ item: mainItem, zIndex: 100 });
    // 注意!!! 起始动画中最后一个动作是塞入的待机动作
    startAnimations = mainItem.spineData.animations
      .map(i => i.name)
      .filter(i => i.startsWith("Start_Idle"))
      .sort()
      .map(i => {
        return {
          animation: i,
          spine: mainItem,
        };
      });
    if (curL2dConfig?.playQue) {
      startAnimations = curL2dConfig.playQue.map(i => {
        return {
          ...i,
          // playQue 中的name和otherSpine中的一致
          spine:
            i.name === curL2dConfig.name
              ? mainItem
              : otherItems.find(j => j.name === i.name)!,
        };
      });
    }
    // 最后置入一个待机动作
    startAnimations.push({
      spine: mainItem,
      animation: "Idle_01",
    });
    // 0轨道播放待机 部分没有做待机的动画,用try兜底避免throw
    try {
      const curStartAnimations = startAnimations[currentIndex]!;
      currentIndex += 1;
      app.stage.addChild(curStartAnimations.spine);
      curStartAnimations.spine.state.setAnimation(
        IDLE_TRACK,
        curStartAnimations.animation,
        false
      );
    } catch (e) {
      console.log(e);
    }
  });
}
/**
 * 计算 l2d 样式尺寸 - utils
 */
function calcL2DSize(
  rawWidth: number,
  rawHeight: number,
  viewportWidth: number,
  viewportHeight: number
) {
  const ratio = Math.min(rawWidth / viewportWidth, rawHeight / viewportHeight);
  // 稍微放大点完全遮住
  const width = (rawWidth / ratio) * 1.1; // 是根据spine呼吸时最小和正常的比例推测得到的, 不同的spine可能会有不同的最小比例...
  const height = (rawHeight / ratio) * 1.1;
  return { width, height, ratio };
}
function fadeEffect() {
  if (!disposed) {
    const player = document.querySelector("#player__main") as HTMLDivElement;
    player.style.backgroundColor = "white";
    const playerCanvas = document.querySelector("#player canvas");
    gsap.to(playerCanvas, { alpha: 0, duration: 1 });
    setTimeout(() => {
      if (!disposed) {
        gsap.to(playerCanvas, { alpha: 1, duration: 0.8 });
      }
    }, 1300);
  }
}
