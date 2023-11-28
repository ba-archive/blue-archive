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
   * bgm 音量 0-1
   */
  private bgmVolume = 0.8;
  /**
   * 音效音量 0-1
   */
  private soundVolume = 0.8;
  /**
   * 语音音量 0-1
   */
  private voiceVolume = 0.8;
  /**
   * 播放实例
   */
  instances: {
    bgm?: Howl;
    bgmArgs?: BGMExcelTableItem;
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

  public setBgmVolume(volume: number) {
    if (volume > 1 || volume < 0) {
      throw new Error("bgm音量设置错误，应该在0-1之间");
    }
    this.bgmVolume = volume;
    if (this.instances.bgm) {
      this.instances.bgm.volume(volume);
    }
  }

  public setSoundVolume(volume: number) {
    if (volume > 1 || volume < 0) {
      throw new Error("音效音量设置错误，应该在0-1之间");
    }
    this.soundVolume = volume;
    if (this.instances.sound) {
      this.instances.sound.volume(volume);
    }
  }

  public setVoiceVolume(volume: number) {
    if (volume > 1 || volume < 0) {
      throw new Error("语音音量设置错误，应该在0-1之间");
    }
    this.voiceVolume = volume;
    if (this.instances.voice) {
      this.instances.voice.volume(volume);
    }
  }

  public playAudio(url: string, setting: AudioSetting) {
    const audio = this.handlerMap.getResources<"audio">("audio", url);
    if (!audio) {
      throw new Error(`获取audio资源失败，资源名${url}`);
    } else {
      audio.volume(setting.volume);
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
    if (this.instances.bgm
      && this.instances.bgmArgs?.LoopStartTime === args?.LoopStartTime
      && this.instances.bgmArgs?.LoopEndTime === args?.LoopEndTime) {
      // 同一个bgm，不处理
      return;
    }

    // 需要切换，停止旧的bgm
    if (this.instances.bgm) {
      this.instances.bgm.stop();
    }

    // bgm 需要按片段循环播放
    this.setBgmSprite(bgm, args);

    // 保存实例，设置参数，播放
    this.instances.bgm = bgm;
    bgm.volume(this.bgmVolume);
    bgm.seek(0);
    bgm.loop(true);
    bgm.play();
  }

  private setBgmSprite(bgm: Howl, args: BGMExcelTableItem | undefined) {
    if (!bgm) return;
    if (!args) return;
    // 设置循环片段
    Reflect.set(bgm, "_sprite", {
      __default: [
        (args.LoopStartTime ?? 0) * 1000,
        (args.LoopEndTime ?? bgm.duration(0)) * 1000,
      ],
    });

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
    sound.volume(this.soundVolume);
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
    voice.volume(this.voiceVolume);
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

  public stop(): Promise<void> {
    super.stop();
    if (this.instances.bgm) {
      this.instances.bgm.stop();
    }
    if (this.instances.sound) {
      this.instances.sound.stop();
    }
    if (this.instances.voice) {
      this.instances.voice.stop();
    }
    return Promise.resolve();
  }
}
