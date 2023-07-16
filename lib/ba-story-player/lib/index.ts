import * as utils from "@/utils";
import eventBus from "@/eventBus";
import { initPrivateState, usePlayerStore } from "@/stores";
import { wait } from "@/utils";
import axios from "axios";
import {
  Application,
  Assets,
  LoadAsset,
  utils as pixiUtils,
  settings,
} from "pixijs";
import { extensions } from "pixijs";
import { version } from "../package.json";
import { L2DInit } from "./layers/l2dLayer/L2D";
import { bgInit } from "@/layers/bgLayer";
import { characterInit } from "@/layers/characterLayer";
import { effectInit } from "@/layers/effectLayer";
import { preloadSound, soundInit } from "@/layers/soundLayer";
import { translate } from "@/layers/translationLayer";
import { buildStoryIndexStackRecord } from "@/layers/translationLayer/utils";
import { PlayerConfigs, StoryUnit } from "@/types/common";
import "@pixi/sound";
import "pixi-spine/bundles/pixi-spine";
import { IEventData, ISkeletonData } from "pixi-spine/packages/base";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
extensions.add(window.spineLoader);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
extensions.add(window.spineTextureAtlasLoader);

let playerStore: ReturnType<typeof usePlayerStore>;
let privateState: ReturnType<typeof initPrivateState>;
/**
 * 多余的不能识别出l2d音频的事件名
 */
const unexistL2dSoundEvent = ["sound/Nonomi_MemorialLobby_3_3"];

/**
 * 继续播放
 */
export function continuePlay() {
  eventBus.emit("continue");
}

/**
 * 回收播放器资源, 让播放器回到初始状态
 */
export function dispose() {
  initPrivateState().app?.destroy();
  initPrivateState().app = null;
  eventBus.emit("dispose");
  eventBus.all.clear();
  usePlayerStore().logText.value = [];
  pixiUtils.clearTextureCache();
  storyHandler.isEnd = true;
}

/**
 * 事件发送控制对象
 */
export const eventEmitter = {
  /** 当前是否处于l2d播放中, 并不特指l2d某个动画 */
  l2dPlaying: false,
  characterDone: true,
  effectDone: true,
  titleDone: true,
  textDone: true,
  stDone: true,
  // 当前的历史消息 log 是否显示
  isStoryLogShow: false,
  toBeContinueDone: true,
  nextEpisodeDone: true,
  /** 当前l2d动画是否播放完成 */
  l2dAnimationDone: true,
  VoiceJpDone: true,

  get unitDone(): boolean {
    let result = true;
    for (const key of Object.keys(eventEmitter) as Array<
      keyof typeof eventEmitter
    >) {
      if (key.endsWith("Done") && key !== "unitDone") {
        result = result && (eventEmitter[key] as boolean);
      }
    }
    return result;
  },

  /**
   * 注册事件
   */
  init() {
    //初始化值
    for (const key of Object.keys(eventEmitter) as Array<
      keyof typeof eventEmitter
    >) {
      if (key.endsWith("Done") && key !== "unitDone") {
        Reflect.set(eventEmitter, key, true);
      }
    }
    this.l2dPlaying = false;
    eventBus.on("next", () => {
      storyHandler.next();
      if (!this.unitDone) {
        this.textDone = true;
        this.VoiceJpDone = true;
      }
    });
    eventBus.on("select", e => {
      // 选择完直接下一步, 避免卡在 l2dplaying 前
      if (storyHandler.isSkip) {
        storyHandler.select(e);
        this.emitEvents();
        return;
      }
      if (this.unitDone) {
        storyHandler.select(e);
        storyHandler.storyPlay();
      }
    });
    eventBus.on("isStoryLogShow", e => (eventEmitter.isStoryLogShow = e));
    eventBus.on("effectDone", () => (eventEmitter.effectDone = true));
    eventBus.on("characterDone", () => (eventEmitter.characterDone = true));
    eventBus.on("titleDone", () => (this.titleDone = true));
    eventBus.on("stDone", () => (this.stDone = true));
    eventBus.on("l2dAnimationDone", e => {
      if (e.done) {
        eventEmitter.l2dAnimationDone = e.done;
      }
    });
    eventBus.on("textDone", async () => {
      //等待一段时间在textDone, 提升auto的体验
      if (storyHandler.auto) {
        await wait(1000);
      }
      this.textDone = true;
    });
    eventBus.on("auto", () => storyHandler.startAuto());
    eventBus.on("stopAuto", () => storyHandler.stopAuto());
    eventBus.on("skip", () => storyHandler.end());
    eventBus.on("playVoiceJPDone", async () => {
      if (storyHandler.auto) {
        await wait(1200);
      }
      this.VoiceJpDone = true;
    });
    eventBus.on("nextEpisodeDone", () => (this.nextEpisodeDone = true));
    eventBus.on("toBeContinueDone", () => (this.toBeContinueDone = true));

    storyHandler.currentStoryIndex = 0;
    if (import.meta.env.DEV) {
      storyHandler.currentStoryIndex = Number(
        localStorage.getItem("storyIndex") || 0
      );
    }
    storyHandler.isEnd = false;
    storyHandler.storyPlay().then();
  },

  /**
   * 根据当前剧情发送事件
   */
  async emitEvents() {
    // TODO: 上线注释, 也可以不注释
    console.log(
      "剧情进度: " + storyHandler.currentStoryIndex,
      storyHandler.currentStoryUnit
    );
    await this.transitionIn();
    this.hide();
    await this.showBg();
    this.showPopup();
    this.playEffect();
    this.playL2d();
    this.playAudio();
    this.clearSt();
    await this.transitionOut();
    this.showCharacter();
    this.show();

    this.actionByUnitType();

    await waitForStoryUnitPlayComplete();
  },

  actionByUnitType(currentStoryUnit?: StoryUnit) {
    currentStoryUnit = currentStoryUnit ?? storyHandler.currentStoryUnit;
    switch (currentStoryUnit.type) {
      case "title":
        this.titleDone = false;
        if (currentStoryUnit.textAbout.titleInfo) {
          eventBus.emit("showTitle", currentStoryUnit.textAbout.titleInfo);
        } else {
          throw new Error("没有标题信息提供");
        }
        break;
      case "place":
        if (currentStoryUnit.textAbout.titleInfo) {
          eventBus.emit(
            "showPlace",
            currentStoryUnit.textAbout.titleInfo.subtitle || ""
          );
          // 如有有译者信息 顺便发送
          if (currentStoryUnit.textAbout.titleInfo.translator) {
            eventBus.emit(
              "showPlaceTranslator",
              currentStoryUnit.textAbout.titleInfo.translator
            );
          }
        }
        break;
      case "text":
        this.textDone = false;
        eventBus.emit("showText", {
          ...currentStoryUnit.textAbout.showText,
          index: storyHandler.currentStoryIndex,
        });
        eventBus.emit("showmenu");
        if (usePlayerStore().translator) {
          eventBus.emit("showPlaceTranslator", usePlayerStore().translator);
          usePlayerStore().setTranslator("");
        }
        break;
      case "option":
        if (currentStoryUnit.textAbout.options) {
          eventBus.emit(
            "option",
            currentStoryUnit.textAbout.options.map(i => {
              return { ...i, index: storyHandler.currentStoryIndex };
            })
          );
        }
        break;
      case "st":
        this.stDone = false;
        if (currentStoryUnit.textAbout.st) {
          if (currentStoryUnit.textAbout.st.stArgs) {
            const middle = !!currentStoryUnit.textAbout.st.middle;
            eventBus.emit("st", {
              text: currentStoryUnit.textAbout.showText.text,
              stArgs: currentStoryUnit.textAbout.st.stArgs,
              middle,
            });
          }
        }
        break;
      case "effectOnly":
        break;
      case "continue":
        this.toBeContinueDone = false;
        eventBus.emit("toBeContinue");
        break;
      case "nextEpisode":
        this.nextEpisodeDone = false;
        if (currentStoryUnit.textAbout.titleInfo) {
          eventBus.emit("nextEpisode", currentStoryUnit.textAbout.titleInfo);
        } else {
          throw new Error("没有标题信息提供");
        }
        break;
      default:
        console.log(`本体中尚未处理${currentStoryUnit.type}类型故事节点`);
    }
  },

  clearSt() {
    if (storyHandler.currentStoryUnit.textAbout.st) {
      if (storyHandler.currentStoryUnit.textAbout.st.clearSt) {
        eventBus.emit("clearSt");
      }
    }
  },

  /**
   * 显示背景
   */
  async showBg(currentStoryUnit?: StoryUnit) {
    currentStoryUnit = currentStoryUnit || storyHandler.currentStoryUnit;
    if (currentStoryUnit.bg) {
      const bgOverLap = currentStoryUnit.bg.overlap;
      eventBus.emit("showBg", {
        url: currentStoryUnit.bg?.url,
        overlap: bgOverLap,
      });
      if (this.l2dPlaying) {
        eventBus.emit("endL2D");
        this.l2dPlaying = false;
      }
      if (bgOverLap) {
        await new Promise<void>(resolve => {
          const fn = () => {
            eventBus.off("bgOverLapDone", fn);
            resolve();
          };
          eventBus.on("bgOverLapDone", fn);
        });
      }
    }
  },

  /**
   * 显示角色
   */
  showCharacter(currentStoryUnit?: StoryUnit) {
    currentStoryUnit = currentStoryUnit || storyHandler.currentStoryUnit;
    if (currentStoryUnit.characters.length !== 0) {
      this.characterDone = false;
      eventBus.emit("showCharacter", {
        characters: storyHandler.currentStoryUnit.characters,
      });
    } else {
      setTimeout(() => {
        eventBus.emit("characterDone");
      });
    }
  },

  /**
   * 播放声音
   */
  playAudio(currentStoryUnit?: StoryUnit) {
    currentStoryUnit = currentStoryUnit || storyHandler.currentStoryUnit;
    if (currentStoryUnit.audio) {
      eventBus.emit("playAudio", currentStoryUnit.audio);
      if (currentStoryUnit.audio.voiceJPUrl) {
        this.VoiceJpDone = false;
      }
    }
  },

  playL2d() {
    if (storyHandler.currentStoryUnit.l2d) {
      if (storyHandler.currentStoryUnit.l2d.animationName === "Idle_01") {
        eventBus.emit("playL2D");
        this.l2dPlaying = true;
      } else {
        eventBus.emit(
          "changeAnimation",
          storyHandler.currentStoryUnit.l2d.animationName
        );
      }
    }
  },

  /**
   * 控制隐藏事件的发送
   */
  hide() {
    if (storyHandler.currentStoryUnit.hide) {
      //当下一节点仍是text时只隐藏character
      if (storyHandler.currentStoryUnit.hide === "all") {
        // if (storyHandler.nextStoryUnit.type === 'text' && !storyHandler.currentStoryUnit.transition) {
        //   eventBus.emit('hideCharacter')
        // }
        // else {
        //   eventBus.emit('hide')
        // }
        eventBus.emit("hideCharacter");
      } else {
        eventBus.emit("hidemenu");
      }
    }
    //在有变换时隐藏所有对象
    if (
      storyHandler.currentStoryUnit.bg?.overlap ||
      storyHandler.currentStoryUnit.transition ||
      storyHandler.currentStoryUnit.type === "continue"
    ) {
      eventBus.emit("hide");
    }
  },

  show() {
    if (storyHandler.currentStoryUnit.show) {
      if (storyHandler.currentStoryUnit.show === "menu") {
        eventBus.emit("showmenu");
      }
    }
  },

  /**
   * 播放特效
   */
  playEffect() {
    if (
      storyHandler.currentStoryUnit.effect.BGEffect ||
      storyHandler.currentStoryUnit.effect.otherEffect.length !== 0
    ) {
      this.effectDone = false;
      eventBus.emit("playEffect", storyHandler.currentStoryUnit.effect);
    } else {
      eventBus.emit("removeEffect");
    }
  },

  async transitionIn() {
    if (storyHandler.currentStoryUnit.transition) {
      await new Promise<void>(resolve => {
        function complete() {
          eventBus.off("transitionInDone", complete);
          resolve();
        }
        eventBus.on("transitionInDone", complete);
        eventBus.emit(
          "transitionIn",
          storyHandler.currentStoryUnit.transition!
        );
      });
    }
  },

  async transitionOut() {
    if (storyHandler.currentStoryUnit.transition) {
      if (storyHandler.currentStoryUnit.transition) {
        await new Promise<void>(resolve => {
          const resolveFun = () => {
            eventBus.off("transitionOutDone", resolveFun);
            resolve();
          };
          eventBus.on("transitionOutDone", resolveFun);
          eventBus.emit(
            "transitionOut",
            storyHandler.currentStoryUnit.transition!
          );
        });
      }
    }
  },

  showPopup() {
    if (storyHandler.currentStoryUnit.PopupFileName) {
      eventBus.emit("popupImage", storyHandler.currentStoryUnit.PopupFileName);
    } else if (storyHandler.currentStoryUnit.video) {
      eventBus.emit(
        "popupVideo",
        storyHandler.currentStoryUnit.video.videoPath
      );
      eventBus.emit("playAudio", {
        soundUrl: storyHandler.currentStoryUnit.video.soundPath,
      });
    } else {
      eventBus.emit("hidePopup");
    }
  },
};

/**
 * 调用各层的初始化函数
 */
export async function init(
  elementID: string,
  props: PlayerConfigs,
  endCallback: () => void,
  errorCallback: () => void
) {
  //缓解图片缩放失真
  settings.MIPMAP_TEXTURES = 2;
  console.log(
    `%c ba-bug-player %c ${version} %c`,
    "background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff",
    "background:#41b883 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff",
    "background:transparent"
  );

  if (
    !props.story ||
    !props.story.content ||
    props.story.content.length === 0
  ) {
    eventBus.emit("startLoading", {
      url: `${props.dataUrl}/loading/404.webp`,
      restrict: true,
    });
    eventBus.emit("oneResourceLoaded", {
      type: "fail",
      resourceName: '剧情对象中的 "content" 不能为 undefined',
    });
    errorCallback();
    return;
  }

  const { useMp3, useSuperSampling } = props;
  useMp3 && utils.setOggAudioType("mp3");
  useSuperSampling && utils.setSuperSampling(useSuperSampling);
  storyHandler.endCallback = endCallback;
  storyHandler.errorCallback = errorCallback;
  playerStore = usePlayerStore();
  privateState = initPrivateState();
  utils.setDataUrl(props.dataUrl);
  privateState.dataUrl = props.dataUrl;
  privateState.language = props.language;
  privateState.userName = props.userName;
  privateState.storySummary = props.storySummary;
  //加入判断防止vite热更新重新创建app导致加载资源错误
  if (!privateState.app) {
    privateState.app = new Application({
      height: props.height,
      width: props.width,
    });
  }
  // TODO debug用 线上环境删掉 而且会导致HMR出问题 慎用
  // https://chrome.google.com/webstore/detail/pixijs-devtools/aamddddknhcagpehecnhphigffljadon/related?hl=en
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  globalThis.__PIXI_APP__ = privateState.app;
  const app = playerStore.app;
  document.querySelector(`#${elementID}`)?.appendChild(app.view);
  //加载初始化资源以便翻译层进行翻译
  await resourcesLoader.init();
  privateState.allStoryUnit = translate(props.story);
  privateState.stackStoryUnit = buildStoryIndexStackRecord(
    privateState.allStoryUnit
  );
  bgInit();
  characterInit();
  soundInit();
  effectInit();
  L2DInit();

  // 记录加载开始时间 优化光速加载的体验
  const startLoadTime = Date.now();
  eventBus.emit("startLoading", { url: props.dataUrl });
  //加载剩余资源
  await resourcesLoader.addLoadResources();
  resourcesLoader.load(() => {
    // 加载时间少于1秒, 延迟一下再开始
    const loadedTime = Date.now() - startLoadTime;
    new Promise<void>(resolve => {
      if (loadedTime < 1000) {
        setTimeout(() => {
          resolve();
        }, 1000 - loadedTime);
      } else {
        resolve();
      }
    }).then(() => {
      eventBus.emit("loaded");
      eventBus.emit("hidemenu");
      //开始发送事件
      eventEmitter.init();
    });
  });
}

/**
 * 资源加载处理对象
 */
export const resourcesLoader = {
  loadTaskList: [] as Promise<unknown>[],
  loadedList: [] as string[],
  /**
   * 初始化, 预先加载表资源供翻译层使用
   */
  async init() {
    await this.loadExcels();
  },
  /**
   * 添加所有资源, 有些pixi loader不能处理的资源则会调用资源处理函数, 故会返回promise
   */
  async addLoadResources() {
    // this.loader.add('https://yuuka.cdn.diyigemt.com/image/ba-all-data/UIs/03_Scenario/01_Background/BG_CS_PR_16.jpg',
    //   'https://yuuka.cdn.diyigemt.com/image/ba-all-data/UIs/03_Scenario/01_Background/BG_CS_PR_16.jpg'
    // )
    this.addEmotionResources();
    this.addFXResources();
    this.addOtherSounds();
    this.addBGEffectImgs();
    const audioUrls: string[] = [];
    if (playerStore.curL2dConfig) {
      for (const que of playerStore.curL2dConfig.playQue) {
        for (const sound of que.sounds || []) {
          audioUrls.push(utils.getResourcesUrl("sound", sound.fileName));
        }
      }
    }
    for (const unit of playerStore.allStoryUnit) {
      //添加人物spine
      if (unit.characters.length !== 0) {
        for (const character of unit.characters) {
          const spineUrl = character.spineUrl;
          checkloadAssetAlias(String(character.CharacterName), spineUrl);
          // TODO ? 为什么要在这里加载
          // loadAssetAlias(String(character.CharacterName), spineUrl).then((res: ISkeletonData) => {
          //   if (res) {
          //     this.loadL2dVoice(res.events);
          //   }
          // });
        }
      }
      if (unit.audio) {
        //添加bgm资源
        if (unit.audio.bgm?.url) {
          audioUrls.push(unit.audio.bgm.url);
        }
        if (unit.audio.soundUrl) {
          audioUrls.push(unit.audio.soundUrl);
        }
        if (unit.audio.voiceJPUrl) {
          audioUrls.push(unit.audio.voiceJPUrl);
        }
        // this.checkAndAdd(unit.audio.bgm?.url)

        // //添加sound
        // this.checkAndAdd(unit.audio.soundUrl)
        // this.checkAndAdd(unit.audio.voiceJPUrl)
      }
      //添加背景图片
      this.checkAndAdd(unit.bg, "url");
      //添加popupImage
      this.checkAndAdd(unit.PopupFileName);

      //添加l2d spine资源
      if (unit.l2d) {
        checkloadAssetAlias(unit.l2d.spineUrl, unit.l2d.spineUrl).then(
          (res?: { spineData: ISkeletonData }) => {
            if (res) {
              this.loadL2dVoice(res.spineData.events);
            }
          }
        );
        playerStore.curL2dConfig?.otherSpine?.forEach(i =>
          this.checkAndAdd(utils.getResourcesUrl("otherL2dSpine", i))
        );
        playerStore.setL2DSpineUrl(unit.l2d.spineUrl);
      }
    }
    await preloadSound(audioUrls);
  },

  /**
   * 加载资源并在加载完成后执行callback
   * @param callback
   */
  load(callback: () => void) {
    let hasLoad = false;
    Promise.allSettled(this.loadTaskList).then(() => {
      //当chrome webgl inspector打开时可能导致callback被执行两次
      if (!hasLoad) {
        this.loadTaskList.splice(0, this.loadTaskList.length);
        this.loadedList.splice(0, this.loadedList.length);
        hasLoad = true;
        callback();
      }
    });
  },

  /**
   * 检查资源是否存在或已加载, 没有则添加
   * @param resources 检查是否存在的资源, url可为对象属性或本身
   * @param key 当resoureces为对象时指定的url属性
   */
  checkAndAdd(resources: object | string | undefined, key?: string) {
    let url = "";
    if (resources) {
      if (typeof resources === "string") {
        url = resources;
      } else {
        url = key ? Reflect.get(resources, key) : "";
      }
      this.loadTaskList.push(checkloadAssetAlias(url, url));
    }
  },

  /**
   * 添加人物情绪相关资源(图片和声音)
   */
  async addEmotionResources() {
    for (const emotionResources of playerStore.emotionResourcesTable.values()) {
      for (const emotionResource of emotionResources) {
        // eslint-disable-next-line max-len
        this.loadTaskList.push(
          checkloadAssetAlias(
            emotionResource,
            utils.getResourcesUrl("emotionImg", emotionResource)
          )
        );
      }
    }
    // for (const emotionName of playerStore.emotionResourcesTable.keys()) {
    //   const emotionSoundName = `SFX_Emoticon_Motion_${emotionName}`;
    //   // eslint-disable-next-line max-len
    //   this.loadTaskList.push(checkloadAssetAlias(emotionSoundName, utils.getResourcesUrl("emotionSound", emotionSoundName)));
    // }
  },

  /**
   * 添加FX相关资源
   */
  async addFXResources() {
    for (const fxImages of playerStore.fxImageTable.values()) {
      for (const url of fxImages) {
        this.loadTaskList.push(
          checkloadAssetAlias(url, utils.getResourcesUrl("fx", url))
        );
      }
    }
  },

  /**
   * 添加l2d语音
   */
  loadL2dVoice(audioEvents: IEventData[]) {
    for (const event of audioEvents) {
      if (
        event.name.includes("MemorialLobby") &&
        !unexistL2dSoundEvent.includes(event.name)
      ) {
        const voiceUrl = utils.getResourcesUrl("l2dVoice", event.name);
        this.loadTaskList.push(loadAssetAlias(voiceUrl, voiceUrl));
      }
    }
  },

  /**
   * 添加其他特效音
   */
  addOtherSounds() {
    // const otherSoundUrls = getOtherSoundUrls();
    // for (const url of otherSoundUrls) {
    //   this.loadTaskList.push(checkloadAssetAlias(url, url));
    // }
  },

  /**
   * 添加bgEffect相关图像资源
   */
  addBGEffectImgs() {
    for (const imgs of playerStore.bgEffectImgMap.values()) {
      for (const img of imgs) {
        this.loadTaskList.push(
          checkloadAssetAlias(img, utils.getResourcesUrl("bgEffectImgs", img))
        );
      }
    }
  },

  /**
   * 加载原始数据资源
   */
  async loadExcels() {
    const excelPromiseArray: Array<Promise<void>> = [];
    excelPromiseArray.push(
      axios
        .get(utils.getResourcesUrl("excel", "ScenarioBGNameExcelTable.json"))
        .then(res => {
          for (const i of res.data["DataList"]) {
            privateState.BGNameExcelTable.set(i["Name"], i);
          }
        })
    );
    excelPromiseArray.push(
      axios
        .get(
          utils.getResourcesUrl("excel", "ScenarioCharacterNameExcelTable.json")
        )
        .then(res => {
          for (const i of res.data["DataList"]) {
            privateState.CharacterNameExcelTable.set(i["CharacterName"], i);
          }
        })
    );
    excelPromiseArray.push(
      axios
        .get(utils.getResourcesUrl("excel", "BGMExcelTable.json"))
        .then(res => {
          for (const i of res.data["DataList"]) {
            privateState.BGMExcelTable.set(i["Id"], i);
          }
        })
    );
    excelPromiseArray.push(
      axios
        .get(
          utils.getResourcesUrl("excel", "ScenarioTransitionExcelTable.json")
        )
        .then(res => {
          for (const i of res.data["DataList"]) {
            privateState.TransitionExcelTable.set(i["Name"], i);
          }
        })
    );
    excelPromiseArray.push(
      axios
        .get(utils.getResourcesUrl("excel", "ScenarioBGEffectExcelTable.json"))
        .then(res => {
          for (const i of res.data["DataList"]) {
            privateState.BGEffectExcelTable.set(i["Name"], i);
          }
        })
    );
    excelPromiseArray.push(
      axios
        .get(
          utils.getResourcesUrl(
            "excel",
            "ScenarioCharacterEmotionExcelTable.json"
          )
        )
        .then(res => {
          for (const i of res.data["DataList"]) {
            privateState.EmotionExcelTable.set(i["Name"], i["EmoticonName"]);
          }
        })
    );

    const results = await Promise.allSettled(excelPromiseArray);
    const reasons = [];
    for (const result of results) {
      if (result.status === "rejected") {
        reasons.push(result.reason);
      }
    }
    if (reasons.length !== 0) {
      throw new Error(reasons.toString());
    }
  },
};

/**
 * 暂停播放
 */
export function stop() {
  eventBus.emit("stop");
}

/**
 * 处理故事进度对象
 */
export const storyHandler = {
  currentStoryIndex: 0,
  endCallback: () => {},
  errorCallback: () => {},
  unitPlaying: false,
  auto: false,
  isEnd: false,
  isSkip: false,

  get currentStoryUnit(): StoryUnit {
    if (
      playerStore &&
      playerStore.allStoryUnit.length > this.currentStoryIndex
    ) {
      return playerStore.allStoryUnit[this.currentStoryIndex];
    }

    //默认值
    return {
      type: "text",
      GroupId: 0,
      SelectionGroup: 0,
      PopupFileName: "",
      audio: {},
      effect: { otherEffect: [] },
      characters: [],
      textAbout: {
        showText: {
          text: [],
        },
      },
    };
  },

  get nextStoryUnit(): StoryUnit {
    if (
      playerStore &&
      playerStore.allStoryUnit.length > this.currentStoryIndex + 1
    ) {
      return playerStore.allStoryUnit[this.currentStoryIndex + 1];
    }

    //默认值
    return {
      type: "text",
      GroupId: 0,
      SelectionGroup: 0,
      PopupFileName: "",
      audio: {},
      effect: { otherEffect: [] },
      characters: [],
      textAbout: {
        showText: {
          text: [],
        },
      },
    };
  },

  /**
   * 通过下标递增更新当前故事节点
   */
  storyIndexIncrement() {
    if (this.checkEnd()) {
      return;
    }
    const currentSelectionGroup = this.currentStoryUnit.SelectionGroup;
    this.currentStoryIndex++;
    while (
      !this.checkEnd() &&
      ![0, currentSelectionGroup].includes(this.currentStoryUnit.SelectionGroup)
    ) {
      this.currentStoryIndex++;
    }

    return true;
  },

  next() {
    if (this.isSkip && !eventEmitter.l2dPlaying) {
      storyHandler.storyIndexIncrement();
      // 快进用 storyPlay 需要考虑 unitPlaying, 同时会有一个while循环在里边导致控制不符合预期
      eventEmitter.emitEvents().then(() => {
        // 注意这个函数是 异步的, 需要等待执行完再继续 l2d, 此时后续的skip会被拦住
        if (this.currentStoryUnit.l2d) {
          this.next();
        }
      });
      return;
    }
    if (eventEmitter.unitDone && !this.unitPlaying && !this.auto) {
      storyHandler.storyIndexIncrement();
      storyHandler.storyPlay();
    }
  },

  /**
   * 根据选项控制故事节点
   * @param option
   * @returns
   */
  select(option: number) {
    if (option === 0) {
      this.storyIndexIncrement();
      return;
    }
    const index = playerStore.allStoryUnit.findIndex(
      value => value.SelectionGroup === option
    );
    if (index === -1) {
      return false;
    }
    this.currentStoryIndex = index;
    return true;
  },
  /**
   * 播放故事直到对话框或选项出现, auto模式下只在选项时停下
   */
  async storyPlay() {
    if (!this.unitPlaying) {
      this.unitPlaying = true;
      //当auto开启时只在选项停下
      const playCondition = () => {
        if (this.auto) {
          return ["option"];
        } else {
          return ["text", "option"];
        }
      };
      try {
        while (
          !playCondition().includes(storyHandler.currentStoryUnit.type) &&
          !this.isEnd
        ) {
          await eventEmitter.emitEvents();
          storyHandler.storyIndexIncrement();
        }
        if (!this.isEnd) {
          await eventEmitter.emitEvents();
        }
        this.unitPlaying = false;
      } catch (error) {
        this.errorCallback();
      }
    }
  },

  /**
   * 检查故事是否已经结束, 结束则调用结束函数结束播放
   */
  checkEnd() {
    if (playerStore.allStoryUnit.length <= this.currentStoryIndex) {
      this.end();
      return true;
    }

    return false;
  },

  /**
   * 结束播放
   */
  end() {
    console.log("播放结束");
    this.auto = false;
    this.isEnd = true;
    this.endCallback();
  },

  /**
   * 开启auto模式
   */
  startAuto() {
    this.auto = true;
    if (!this.unitPlaying) {
      if (this.currentStoryUnit.type !== "option") {
        this.storyIndexIncrement();
        this.storyPlay();
      }
    } else {
      //可能storyPlay正要结束但还没结束导致判断错误
      setTimeout(() => {
        if (!this.unitPlaying && this.auto) {
          if (this.currentStoryUnit.type !== "option") {
            this.storyIndexIncrement();
            this.storyPlay();
          }
        }
      }, 2000);
    }
  },

  /**
   * 停止auto模式
   */
  stopAuto() {
    this.auto = false;
  },
};

function waitForStoryUnitPlayComplete() {
  let startTime = Date.now();
  let leftTime = 50000;
  let interval = 0;

  return new Promise<void>((resolve, reject) => {
    eventBus.on("activated", restart);
    eventBus.on("deactivated", resetTime);
    function resetTime() {
      clearInterval(interval);
      const now = Date.now();
      leftTime = leftTime - (now - startTime);
    }
    function restart() {
      startTime = Date.now();
      start();
    }
    function end() {
      clearInterval(interval);
      eventBus.off("activated", restart);
      eventBus.off("deactivated", resetTime);
    }
    function start() {
      interval = window.setInterval(() => {
        if (storyHandler.isEnd) {
          end();
          resolve();
        }
        if (eventEmitter.unitDone) {
          end();
          resolve();
        } else if (Date.now() - startTime >= leftTime) {
          for (const key of Object.keys(eventEmitter) as Array<
            keyof typeof eventEmitter
          >) {
            if (key.endsWith("Done") && key !== "unitDone") {
              if (!eventEmitter[key]) {
                console.error(`${key}未完成: `);
              }
            }
          }
          console.warn(
            `故事节点 index: ${storyHandler.currentStoryIndex}长时间未完成`,
            storyHandler.currentStoryUnit
          );
          end();
          reject();
        }
      }, 500);
    }
    restart();
  });
}

function checkloadAssetAlias<T = any>(alias: string, url: string) {
  if (!resourcesLoader.loadedList.includes(alias)) {
    resourcesLoader.loadedList.push(alias);
    return loadAssetAlias(alias, url);
  }
  return Promise.resolve();
}

function loadAssetAlias<T = any>(alias: string | string[], url: string) {
  return loadAsset<T>({
    src: url,
    alias: Array.isArray(alias) ? alias : [alias],
  });
}

function loadAsset<T = any>(
  param: string | LoadAsset | string[] | LoadAsset[]
) {
  function getResourceName(): string[] {
    if (typeof param === "string") {
      return [lastName(param as string)];
    } else {
      if (Array.isArray(param)) {
        if (typeof param[0] === "string") {
          return param as string[];
        } else {
          const tmp: LoadAsset[] = param as LoadAsset[];
          return tmp.map(it => (it.alias && it.alias[0]) ?? lastName(it.src));
        }
      } else {
        return [(param.alias && param.alias[0]) ?? lastName(param.src)];
      }
    }
  }
  function lastName(source: string) {
    return source.substring(source.lastIndexOf("/") + 1);
  }
  return Assets.load<T>(param as never)
    .then(_ => {
      eventBus.emit("oneResourceLoaded", {
        type: "success",
        resourceName: getResourceName(),
      });
      return _;
    })
    .catch(err => {
      console.error(err);
      eventBus.emit("oneResourceLoaded", {
        type: "fail",
        resourceName: getResourceName(),
      });
    });
}
