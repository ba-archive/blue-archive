import { CheckMethod, HandlerMap, Layer } from "@/type";
import { Howl } from "howler";
import { Application } from "pixi.js";
import { watch } from "vue";

export class AudioLayer extends Layer {
  /**
   * bgm 音量
   */
  bgmVolume = 50;
  /**
   * 音效音量
   */
  soundVolume = 50;
  /**
   * 语音音量
   */
  voiceVolume = 50;

  instances: {
    bgm?: Howl;
    sound?: Howl;
    voice?: Howl;
  } = {};

  constructor(app: Application, handlerMap: HandlerMap) {
    super(app, handlerMap);
    this.addCheckMethod(loadAudio);
  }
}

const loadAudio: CheckMethod<AudioLayer> = async function (
  node,
  app,
  handlerMap
) {
  if (node.audio.sound) {
    const sound = handlerMap.getResources<"audio">("audio", node.audio.sound);
    if (!sound) {
      throw new Error(`获取sound资源失败, 资源名${node.audio.sound}`);
    } else {
      this.instances.sound = sound;
      this.instances.sound.volume(this.soundVolume / 100);
    }
  }
  if (node.audio.bgm) {
    const bgm = handlerMap.getResources<"audio">("audio", node.audio.bgm.url);
    if (!bgm) {
      throw new Error(`获取bgm资源失败, 资源名${node.audio.bgm.url}`);
    } else {
      this.instances.bgm = bgm;
      this.instances.bgm.volume(this.bgmVolume / 100);
    }
  }
  if (node.audio.voice) {
    const voice = handlerMap.getResources<"audio">("audio", node.audio.voice);
    if (!voice) {
      throw new Error(`获取voice资源失败，资源名${node.audio.voice}`);
    } else {
      this.instances.voice = voice;
      this.instances.voice.volume(this.voiceVolume / 100);
    }
  }
  watch(
    () => node.audio.voice,
    (newVoice, oldVoice) => {
      if (newVoice !== oldVoice && newVoice) {
        const voice = handlerMap.getResources<"audio">("audio", newVoice);
        if (!voice) {
          throw new Error(`获取voice资源失败，资源名${newVoice}`);
        } else {
          this.instances.voice = voice;
          this.instances.voice.volume(this.voiceVolume / 100);
        }
      }
    }
  );
};
