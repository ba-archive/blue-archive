import { BGMExcelTableItem, CheckMethod, HandlerMap, Layer } from "@/type";
import { Howl } from "howler";
import { Application } from "pixi.js";

export interface AudioSetting {
  /**
   * 音量大小
   */
  volume: number;
}

export class AudioLayer extends Layer {
  /**
   * bgm 音量 0-100
   */
  bgmVolume = 50;
  /**
   * 音效音量 0-100
   */
  soundVolume = 50;
  /**
   * 语音音量 0-100
   */
  voiceVolume = 50;
  /**
   * 播放实例
   */
  instances: {
    bgm?: Howl;
    sound?: Howl;
    voice?: Howl;
  } = {};

  /**
   * 其他层调用接口
   */
  private handlerMap: HandlerMap;

  constructor(app: Application, handlerMap: HandlerMap) {
    super(app, handlerMap);
    this.handlerMap = handlerMap;
    this.addCheckMethod(this.loadAudio);
    handlerMap.playAudio = this.playAudio.bind(this);
  }

  public playAudio(url: string, setting: AudioSetting) {
    const audio = this.handlerMap.getResources<"audio">("audio", url);
    if (!audio) {
      throw new Error(`获取audio资源失败，资源名${url}`);
    } else {
      audio.volume(setting.volume / 100);
      audio.play();
    }
  }

  public playBgm(url: string | undefined, args: BGMExcelTableItem | undefined) {
    if (!url) return;

    const bgm = this.handlerMap.getResources<"audio">("audio", url);
    if (!bgm) {
      throw new Error(`获取bgm资源失败，资源名${url}`);
    }

    // 检查是否是同一个bgm
    if (this.instances.bgm && this.instances.bgm.playing()) {
      if (
        Reflect.get(bgm, "_src") === Reflect.get(this.instances.bgm, "_src")
      ) {
        // TODO: 同一个bgm，不做处理?
        return;
      }
    }
    // 需要切换，停止旧的bgm
    if (this.instances.bgm) {
      this.instances.bgm.stop();
    }

    // bgm 需要按片段循环播放
    this.setBgmSprite(bgm, args);

    // 保存实例，设置参数，播放
    this.instances.bgm = bgm;
    bgm.volume(this.bgmVolume / 100);
    bgm.seek(0);
    bgm.play();
  }

  private setBgmSprite(bgm: Howl, args: BGMExcelTableItem | undefined) {
    const sprite = Reflect.get(bgm, "_sprite");

    let loopStartTime: (number | undefined)[] = [];
    let loopEndTime: (number | undefined)[] = [];

    if (Array.isArray(args?.LoopStartTime)) {
      loopStartTime = args.LoopStartTime;
    } else {
      // 旧版bgm配置
      loopStartTime = [args?.LoopStartTime];
    }

    if (Array.isArray(args?.LoopEndTime)) {
      loopEndTime = args.LoopEndTime;
    } else {
      // 旧版bgm配置
      loopEndTime = [args?.LoopEndTime];
    }

    // 设置循环片段
    if (sprite) {
      Reflect.set(sprite, "loop", [
        (loopStartTime[0] ?? 0) * 1000,
        (loopEndTime[0] ?? bgm.duration(0)) * 1000,
        true,
      ]);
    } else {
      Reflect.set(sprite, "_sprite", {
        loop: [
          (loopStartTime[0] ?? 0) * 1000,
          (loopEndTime[0] ?? bgm.duration(0)) * 1000,
          true,
        ],
      });
    }
  }

  public playSound(url: string | undefined) {
    if (!url) return;
    const sound = this.handlerMap.getResources<"audio">("audio", url);

    if (!sound) {
      throw new Error(`获取sound资源失败, 资源名${url}`);
    }
    // 停止旧的音效
    if (this.instances.sound) {
      this.instances.sound.stop();
    }

    this.instances.sound = sound;
    sound.volume(this.soundVolume / 100);
    sound.play();
  }

  public playVoice(url: string | undefined) {
    if (!url) return;
    const voice = this.handlerMap.getResources<"audio">("audio", url);
    if (!voice) {
      throw new Error(`获取voice资源失败，资源名${url}`);
    }
    // 停止旧的语音
    if (this.instances.voice) {
      this.instances.voice.stop();
    }

    this.instances.voice = voice;
    voice.volume(this.voiceVolume / 100);
    voice.play();
  }

  public loadAudio: CheckMethod<AudioLayer> = async function (
    node,
    app,
    handlerMap
  ) {
    this.playBgm(node.audio.bgm?.url, node.audio.bgm?.bgmArgs);
    this.playSound(node.audio.sound);
    this.playVoice(node.audio.voice);
  };
}
