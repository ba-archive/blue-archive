import { StoryNode, ResourceMap, SpineUrls, ResourceSetting } from "../type";
import { Loader, Sprite, Texture } from "pixi.js";
import { IEventData, ISkeletonData, Spine } from "pixi-spine";
import { Howl } from "howler";
import { cloneDeep } from "lodash-es";

/**
 * 多余的不能识别出l2d音频的事件名
 */
const unexistL2dSoundEvent = ["sound/Nonomi_MemorialLobby_3_3"];
/**
 * ogg类型的音频是否用其他音频类型代替, 影响范围为l2d、bgm、voiceJp
 */
let oggAudioType = "ogg";
let superSampling = "";
let resourceSetting: ResourceSetting | null = null;

export function setResourceSetting(setting: ResourceSetting) {
  resourceSetting = setting;
}

/**
 * 根据资源类型和参数获取资源地址, 可根据服务器实际情况修改
 * @param type
 * @param eventName
 * @returns
 */
function getL2dVoiceUrl(eventName: string): string {
  //arg "sound/CH0184_MemorialLobby_1_1"
  // eslint-disable-next-line no-case-declarations
  const voiceDirectory = eventName.replace(
    /(?:.*\/)?([A-Z0-9]*)_MemorialLobby.*/i,
    "JP_$1"
  );
  // eslint-disable-next-line no-case-declarations
  const voiceFilename = eventName.split("/").pop();
  let currentOggAudioType = "";
  if (oggAudioType === "") {
    currentOggAudioType = "ogg";
  } else {
    currentOggAudioType = oggAudioType;
  }
  if (resourceSetting) {
    // eslint-disable-next-line max-len
    return `${resourceSetting.l2dVoiceOrigin}/Audio/VoiceJp/Character_voice/${voiceDirectory}/${voiceFilename}.${currentOggAudioType}`;
  } else {
    return "";
  }
}

/**
 * 设置ogg类型音频的替代音频类型
 */
export function setOggAudioType(audioType: string) {
  oggAudioType = audioType;
}

export function setSuperSampling(type: string) {
  superSampling = `${type}x`;
}

const resourcerManager = {
  loader: Loader.shared,
  state: "done" as "loading" | "done",
  audioSoundMap: new Map<string, Howl>(),
  async load(storyNodes: StoryNode[]) {
    if (!resourceSetting) {
      throw new Error("resource settting未设置");
    }
    this.state = "loading";
    if (this.loader.loading) {
      await new Promise<void>(resolve =>
        this.loader.onComplete.once(() => resolve())
      );
    }
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
        const bmgUrl = audio.bgm.url;
        if (oggAudioType !== "") {
          audioUrls.push(bmgUrl.slice(0, bmgUrl.length - 3) + oggAudioType);
        } else {
          audioUrls.push(bmgUrl);
        }
      }
      if (audio.sound) {
        audioUrls.push(audio.sound);
      }
      if (audio.voice) {
        const voiceUrl = audio.voice;
        if (oggAudioType !== "") {
          audioUrls.push(voiceUrl.slice(0, voiceUrl.length - 3) + oggAudioType);
        } else {
          audioUrls.push(voiceUrl);
        }
      }
    }
    await new Promise<void>((resolve, reject) => {
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
      if (resourceSetting) {
        const resources = cloneDeep(
          resourceSetting.bgEffect[key as string].effectResources
        );
        const finalResource: Record<string, Sprite> = {};
        for (const key in resources) {
          finalResource[key] = Sprite.from(
            this.loader.resources[resources[key]].texture as Texture
          );
        }
        return finalResource;
      }
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
      if (resourceSetting) {
        return resourceSetting.emotion[key as string].imgs.map(resource =>
          Sprite.from(this.loader.resources[resource].texture as Texture)
        );
      }
    } else if (type === "fx") {
      if (resourceSetting) {
        return resourceSetting.fx[key as string].map(resource =>
          Sprite.from(this.loader.resources[resource].texture as Texture)
        );
      }
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
    if (resourceSetting) {
      for (const fxImages of Object.values(resourceSetting.fx)) {
        for (const img of fxImages) {
          this.checkAndAdd(img);
        }
      }
    }
  },
  /**
   * 添加人物情绪相关资源(图片和声音)
   */
  async addEmotionResources(voiceUrls: string[]) {
    if (resourceSetting) {
      for (const emotionResources of Object.values(resourceSetting.emotion)) {
        for (const imgUrl of emotionResources.imgs) {
          this.checkAndAdd(imgUrl);
        }
        voiceUrls.push(emotionResources.sound);
      }
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
      .map(it => getL2dVoiceUrl(it.name));
    return audios;
  },
  addBGEffectImgs() {
    if (resourceSetting) {
      for (const resources of Object.values(resourceSetting.bgEffect)) {
        for (const effectResource of Object.values(resources.effectResources)) {
          this.checkAndAdd(effectResource);
        }
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
          if (resourceSetting) {
            const emotionSoundMap: Record<string, string> = {};
            for (const key in resourceSetting.emotion) {
              emotionSoundMap[resourceSetting.emotion[key].sound] = key;
            }
            const bgEffectSoundMap: Record<string, string> = {};
            for (const key in resourceSetting.bgEffect) {
              bgEffectSoundMap[resourceSetting.bgEffect[key].sound] = key;
            }
            if (Object.keys(emotionSoundMap).includes(audioUrl)) {
              this.audioSoundMap.set(
                emotionSoundMap[audioUrl],
                newAudio.load()
              );
            } else if (Object.keys(bgEffectSoundMap).includes(audioUrl)) {
              this.audioSoundMap.set(
                bgEffectSoundMap[audioUrl],
                newAudio.load()
              );
            }
          }

          this.audioSoundMap.set(audioUrl, newAudio.load());
        })
      );
    }
    await Promise.all(audioLoadPromises);
  },
};

export default resourcerManager;
