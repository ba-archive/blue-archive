import { StoryNode, ResourceMap, SpineUrls } from "../type";
import { Loader, Sprite, Texture } from "pixi.js";
import { IEventData, ISkeletonData, Spine } from "pixi-spine";
import { Howl } from "howler";

type ResourcesTypes =
  | "emotionImg"
  | "emotionSound"
  | "fx"
  | "l2dSpine"
  | "l2dVoice"
  | "excel"
  | "bgm"
  | "sound"
  | "voiceJp"
  | "characterSpine"
  | "bg"
  | "otherSound"
  | "otherL2dSpine"
  | "bgEffectImgs"
  | "avatar"
  | "video"
  | "popupImage"
  | "bgEffectSounds";

let dataUrl = "";
let otherSoundMap = {
  select: `${dataUrl}/Audio/Sound/UI_Button_Touch.wav`,
  bg_underfire: `${dataUrl}/Audio/Sound/UI_FX_BG_UnderFire.wav`,
  back: `${dataUrl}/Audio/Sound/UI_Button_Back.wav`,
};
/**
 * 多余的不能识别出l2d音频的事件名
 */
const unexistL2dSoundEvent = ["sound/Nonomi_MemorialLobby_3_3"];

/**
 * ogg类型的音频是否用其他音频类型代替
 */
let oggAudioType = "ogg";
let superSampling = "";

/**
 * 获取其他特效音资源, 用于本体资源加载
 * @returns
 */
export function getOtherSoundUrls(): string[] {
  return Object.values(otherSoundMap);
}

/**
 * 根据资源类型和参数获取资源地址, 可根据服务器实际情况修改
 * @param type
 * @param arg
 * @returns
 */
function getResourcesUrl(type: ResourcesTypes, arg: string): string {
  switch (type) {
    case "emotionImg":
      return `${dataUrl}/emotions/${arg}`;
    case "emotionSound":
      return `${dataUrl}/Audio/Sound/${arg}.wav`;
    case "fx":
      return `${dataUrl}/effectTexture/${arg}`;
    case "l2dVoice":
      //arg "sound/CH0184_MemorialLobby_1_1"
      // eslint-disable-next-line no-case-declarations
      const voiceDirectory = arg.replace(
        /(?:.*\/)?([A-Z0-9]*)_MemorialLobby.*/i,
        "JP_$1"
      );
      // eslint-disable-next-line no-case-declarations
      const voiceFilename = arg.split("/").pop();
      return `${dataUrl}/Audio/VoiceJp/Character_voice/${voiceDirectory}/${voiceFilename}.${oggAudioType}`;
    case "l2dSpine":
      return `${dataUrl}/spine/${arg}/${arg}.skel`;
    case "otherL2dSpine":
      return `${dataUrl}/spine/${arg}.skel`;
    case "excel":
      return `${dataUrl}/data/${arg}`;
    case "bgm":
      return `${dataUrl}/${arg}.${oggAudioType}`;
    case "sound":
      return `${dataUrl}/Audio/Sound/${arg}.wav`;
    case "voiceJp":
      return `${dataUrl}/Audio/VoiceJp/${arg}.${oggAudioType}`;
    case "characterSpine":
      //arg UIs/03_Scenario/02_Character/CharacterSpine_hasumi
      // eslint-disable-next-line no-case-declarations
      const temp = String(arg).split("/");
      // eslint-disable-next-line no-case-declarations
      let id = temp.pop();
      id = id?.replace("CharacterSpine_", "");
      if (id?.endsWith("ND")) {
        id = id.slice(0, id.length - 2);
      }
      // eslint-disable-next-line no-case-declarations
      const filename = `${id}_spr`; //hasumi_spr
      if (superSampling) {
        return `${dataUrl}/spine/${filename}/${filename}${superSampling}/${filename}.skel`;
      }
      return `${dataUrl}/spine/${filename}/${filename}.skel`;
    case "bg":
      // UIs/03_Scenario/01_Background/BG_WinterRoad.jpg
      if (superSampling && /01_Background/.test(arg)) {
        const pathArr = arg.split("/");
        const lastFileName = pathArr.pop();
        const dir = pathArr.join("/");
        return `${dataUrl}/${dir}/01_Background${superSampling}/${lastFileName}.png`;
      }
      return `${dataUrl}/${arg}.jpg`;
    case "otherSound":
      return Reflect.get(otherSoundMap, arg) || "";
    case "bgEffectImgs":
      return `${dataUrl}/effectTexture/${arg}`;
    case "bgEffectSounds":
      return `${dataUrl}/Audio/Sound/UI_FX_${arg}.wav`;
    case "avatar":
      //arg: UIs/01_Common/01_Character/Student_Portrait_Hasumi
      return `${dataUrl}/${arg}.png`;
    case "popupImage":
      return `${dataUrl}/UIs/03_Scenario/04_ScenarioImage/${arg}.png`;
    default:
      return "";
  }
}

/**
 * 设置数据站点
 * @param url
 */
export function setDataUrl(url: string): void {
  dataUrl = url;
  otherSoundMap = {
    select: `${dataUrl}/Audio/Sound/UI_Button_Touch.wav`,
    bg_underfire: `${dataUrl}/Audio/Sound/UI_FX_BG_UnderFire.wav`,
    back: `${dataUrl}/Audio/Sound/UI_Button_Back.wav`,
  };
}

/**
 * 设置ogg类型音频的替代音频类型
 */
export function setOggAudioType(audioType: "mp3") {
  oggAudioType = audioType;
}

export function setSuperSampling(type: string) {
  superSampling = `${type}x`;
}

const emotionResourcesTable = {
  Heart: ["Emoticon_Balloon_N.png", "Emoticon_Heart.png"],
  Respond: ["Emoticon_Action.png"],
  Music: ["Emoticon_Note.png"],
  Twinkle: ["Emoticon_Twinkle.png"],
  Upset: ["Emoticon_Balloon_N.png", "Emoticon_Anxiety.png"],
  Sweat: ["Emoticon_Sweat_1.png", "Emoticon_Sweat_2.png"],
  Dot: ["Emoticon_Balloon_N.png", "Emoticon_Idea.png"],
  Exclaim: ["Emoticon_ExclamationMark.png"],
  Surprise: ["Emoticon_Exclamation.png", "Emoticon_Question.png"],
  Question: ["Emoticon_QuestionMark.png"],
  Shy: ["Emoticon_Balloon_N.png", "Emoticon_Shy.png"],
  Angry: ["Emoticon_Aggro.png"],
  Chat: ["Emoticon_Chat.png"],
  Sad: ["Emoji_Sad.png"],
  Steam: ["Emoji_Steam.png"],
  Sigh: ["Emoji_Sigh.png"],
  Bulb: ["Emoticon_Balloon_N.png", "Emoji_Bulb_1.png", "Emoji_Bulb_2.png"],
  Tear: ["Emoji_Tear_1.png", "Emoji_Tear_2.png"],
  Zzz: ["Emoji_Zzz.png"],
};

const fxImageTable = {
  shot: ["fire1.png", "fire2.png", "fire3.png"],
};

/**
 * 请在此处填入需要的图片资源的名称
 */
const bgEffectResourceTable: Record<string, string[]> = {
  "": [],
  "BG_ScrollT_0.5": [],
  BG_Filter_Red: [],
  BG_Wave_F: [],
  BG_Flash: [],
  BG_UnderFire_R: [],
  BG_Love_L_BGOff: [
    "FX_TEX_Img_Heart_01.png",
    "FX_TEX_SCN_Ring_02.png",
    "Gacha/FX_TEX_GT_Circle_Blur_inv.png",
  ],
  "BG_ScrollB_0.5": [],
  BG_Rain_L: ["HardRain.png"],
  BG_UnderFire: [
    "FX_TEX_Smoke_17.png",
    "fire1.png",
    "fire2.png",
    "fire3.png",
    "HardRain.png",
  ],
  BG_WaveShort_F: [],
  BG_SandStorm_L: ["FX_TEX_Smoke_10a.png"],
  "BG_ScrollT_1.5": [],
  BG_Shining_L: [
    "FX_TEX_SCN_Ring_02.png",
    "FX_TEX_Flare_23.png",
    "FX_TEX_SCN_Circle_Love.png",
    "Gacha/FX_TEX_GT_Circle_Blur_inv.png",
  ],
  "BG_ScrollB_1.0": [],
  BG_Love_L: [
    "FX_TEX_Img_Heart_01.png",
    "FX_TEX_SCN_Ring_02.png",
    "FX_TEX_SCN_Circle_Love.png",
  ],
  BG_Dust_L: ["FX_TEX_Smoke_Scroll_23.png", "dust_spark.png"],
  "BG_ScrollL_0.5": [],
  "BG_ScrollL_1.0": [],
  BG_Ash_Black: [],
  BG_Mist_L: [],
  BG_Flash_Sound: ["FX_TEX_Lightning_Line_16.png"],
  "BG_ScrollL_1.5": [],
  BG_FocusLine: ["FX_TEX_SCN_FocusLine5.png"],
  "BG_ScrollR_1.5": [],
  BG_Shining_L_BGOff: [
    "FX_TEX_SCN_Ring_02.png",
    "FX_TEX_Flare_23.png",
    "Gacha/FX_TEX_GT_Circle_Blur_inv.png",
  ],
  "BG_ScrollT_1.0": [],
  "BG_ScrollB_1.5": [],
  BG_Filter_Red_BG: [],
  BG_Ash_Red: [],
  BG_Fireworks_L_BGOff_02: [],
  "BG_ScrollR_0.5": [],
  BG_Snow_L: [],
  BG_Fireworks_L_BGOff_01: [],
  "BG_ScrollR_1.0": [],
};

const resourcerManager = {
  loader: Loader.shared,
  state: "done" as "loading" | "done",
  audioSoundMap: new Map<string, Howl>(),
  load(storyNodes: StoryNode[]) {
    this.state = "loading";
    const audioUrls: string[] = [];
    this.addBGEffectImgs();
    this.addEmotionResources(audioUrls);
    this.addFXResources();
    let l2dUrl = "";
    for (const storyNode of storyNodes) {
      this.checkAndAdd(storyNode.bg, "url");
      this.checkAndAdd(storyNode.text.popupImage);
      this.checkAndAdd(storyNode.text.popupVideo);
      if (storyNode.characters) {
        if (superSampling === "") {
          for (const character of storyNode.characters) {
            this.checkAndAdd(character.CharacterSpine.common);
          }
        } else {
          for (const character of storyNode.characters) {
            this.checkAndAdd(character.CharacterSpine.superSampling2x);
          }
        }
      }

      const audio = storyNode.audio;
      if (storyNode.l2d) {
        if (superSampling === "") {
          l2dUrl = storyNode.l2d.spineUrl.common;
        } else {
          l2dUrl = storyNode.l2d.spineUrl.superSampling2x;
        }
        this.checkAndAdd(l2dUrl);
      }
      if (audio.bgm) {
        audioUrls.push(audio.bgm.url);
      }
      if (audio.sound) {
        audioUrls.push(audio.sound);
      }
      if (audio.voice) {
        audioUrls.push(audio.voice);
      }
    }
    return new Promise<void>((resolve, reject) => {
      this.loader.load(async () => {
        if (l2dUrl) {
          const l2dSpinedata: ISkeletonData = this.loader.resources[l2dUrl]
            .spineData as ISkeletonData;
          audioUrls.concat(this.getL2dVoiceUrls(l2dSpinedata.events));
        }
        try {
          await this.preloadSound(audioUrls);
        } catch (error) {
          reject(error);
        }
        resolve();
        this.state = "done";
      });
    });
  },
  getResource<T extends keyof ResourceMap>(
    type: T,
    key: ResourceMap[T]["key"]
  ): ResourceMap[T]["value"] | undefined {
    if (type === "img" || type === "video") {
      return Sprite.from(
        this.loader.resources[key as string].texture as Texture
      );
    } else if (type === "audio") {
      return this.audioSoundMap.get(key as string) as ResourceMap[T]["value"];
    } else if (type === "bgEffect") {
      return bgEffectResourceTable[key as string].map(resource =>
        Sprite.from(
          this.loader.resources[getResourcesUrl("bgEffectImgs", resource)]
            .texture as Texture
        )
      ) as ResourceMap[T]["value"];
    } else if (type === "character") {
      const spineUrls = key as SpineUrls;
      let spineUrl = "";
      if (superSampling === "") {
        spineUrl = spineUrls.common;
      } else {
        spineUrl = spineUrls.superSampling2x;
      }
      return new Spine(
        this.loader.resources[spineUrl].spineData as ISkeletonData
      ) as ResourceMap[T]["value"];
    } else if (type === "l2d") {
      const spineUrls = key as SpineUrls;
      let spineUrl = "";
      if (superSampling === "") {
        spineUrl = spineUrls.common;
      } else {
        spineUrl = spineUrls.superSampling2x;
      }
      return new Spine(
        this.loader.resources[spineUrl].spineData as ISkeletonData
      ) as ResourceMap[T]["value"];
    } else if (type === "l2dOtherSpine") {
      const spineUrlsArr = key as SpineUrls[];

      return spineUrlsArr.map(value => {
        let spineUrl = "";
        if (superSampling === "") {
          spineUrl = value.common;
        } else {
          spineUrl = value.superSampling2x;
        }
        return new Spine(
          this.loader.resources[spineUrl].spineData as ISkeletonData
        );
      }) as ResourceMap[T]["value"];
    } else if (type === "emotion") {
      return emotionResourcesTable[
        key as keyof typeof emotionResourcesTable
      ].map(resource =>
        Sprite.from(
          this.loader.resources[getResourcesUrl("emotionImg", resource)]
            .texture as Texture
        )
      ) as ResourceMap[T]["value"];
    } else if (type === "fx") {
      return emotionResourcesTable[
        key as keyof typeof emotionResourcesTable
      ].map(resource =>
        Sprite.from(
          this.loader.resources[getResourcesUrl("fx", resource)]
            .texture as Texture
        )
      ) as ResourceMap[T]["value"];
    }
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
      if (!this.loader.resources[url]) {
        this.loader.add(url, url);
      }
    }
  },

  /**
   * 添加FX相关资源
   */
  async addFXResources() {
    for (const fxImages of Object.values(fxImageTable)) {
      for (const img of fxImages) {
        this.checkAndAdd(getResourcesUrl("fx", img));
      }
    }
  },
  /**
   * 添加人物情绪相关资源(图片和声音)
   */
  async addEmotionResources(voiceUrls: string[]) {
    for (const emotionResources of Object.values(emotionResourcesTable)) {
      for (const emotionResource of emotionResources) {
        this.checkAndAdd(getResourcesUrl("emotionImg", emotionResource));
      }
    }
    for (const emotionName of Object.keys(emotionResourcesTable)) {
      const emotionSoundName = `SFX_Emoticon_Motion_${emotionName}`;
      voiceUrls.push(getResourcesUrl("emotionSound", emotionSoundName));
    }
  },
  /**
   * 添加l2d语音
   */
  getL2dVoiceUrls(audioEvents: IEventData[]) {
    const audios = audioEvents
      .filter(it => {
        return (
          it.name.includes("MemorialLobby") &&
          !unexistL2dSoundEvent.includes(it.name)
        );
      })
      .map(it => getResourcesUrl("l2dVoice", it.name));
    return audios;
  },
  addBGEffectImgs() {
    for (const imgs of Object.values(bgEffectResourceTable)) {
      for (const img of imgs) {
        this.checkAndAdd(getResourcesUrl("bgEffectImgs", img));
      }
    }
  },
  /**
   * 预加载与解析声音资源
   * @param audioUrls 声音地址数组
   */
  async preloadSound(audioUrls: string[]) {
    const audioLoadPromises: Promise<void>[] = [];
    for (const audioUrl of audioUrls) {
      audioLoadPromises.push(
        new Promise<void>((resolve, reject) => {
          const newAudio = new Howl({
            src: audioUrl,
            preload: false,
            autoplay: false,
          });
          newAudio.once("load", () => {
            resolve();
          });
          newAudio.once("loaderror", (_, error) => {
            reject(error);
          });
          this.audioSoundMap.set(audioUrl, newAudio.load());
        })
      );
    }
    await Promise.all(audioLoadPromises);
  },
};

export default resourcerManager;
