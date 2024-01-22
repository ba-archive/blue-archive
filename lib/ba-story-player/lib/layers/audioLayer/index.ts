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
  checkMethodMap: Record<string | "loadAudio", CheckMethod<this>> = {};
  /**
   * 播放实例
   */
  instances: {
    bgm?: Howl;
    bgmArgs?: {
      url?: string;
      LoopStartTime?: number;
      LoopEndTime?: number;
    };
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
    this.addCheckMethod(this.loadAudio, "loadAudio");
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

  public playAudio(url: string, setting?: AudioSetting) {
    const audio = this.handlerMap.getResources<"audio">("audio", url);
    if (!audio) {
      throw new Error(`获取audio资源失败，资源名${url}`);
    } else {
      if (setting) {
        audio.volume(setting.volume);
      }
      audio.play();
    }
  }

  public playBgm(url: string | undefined, args: BGMExcelTableItem | undefined) {
    if (!url) {
      // 没有bgm，停止旧的bgm
      this.stopBgm();
      return;
    }

    const bgm = this.handlerMap.getResources<"audio">("audio", url);
    if (!bgm) {
      throw new Error(`获取bgm资源失败，资源名${url}`);
    }

    // 检查是否是同一个bgm
    if (
      this.instances.bgm &&
      this.instances.bgmArgs?.url === url &&
      this.instances.bgmArgs?.LoopStartTime === args?.LoopStartTime &&
      this.instances.bgmArgs?.LoopEndTime === args?.LoopEndTime
    ) {
      if (!this.instances.bgm.playing()) {
        // 没有在播放，播放
        this.instances.bgm.play("loop");
      } else {
        // 已经在播放了，不处理
        return;
      }
    }

    // 需要切换，停止旧的bgm
    this.stopBgm();
    // bgm 需要按片段循环播放
    this.setBgmSprite(bgm, args);

    // 保存实例，设置参数，播放
    this.instances.bgm = bgm;
    this.instances.bgmArgs = {
      url,
      LoopStartTime: args?.LoopStartTime,
      LoopEndTime: args?.LoopEndTime,
    };
    bgm.volume(this.bgmVolume);
    bgm.loop(true);
    bgm.play("loop");
  }

  private setBgmSprite(bgm: Howl, args: BGMExcelTableItem | undefined) {
    if (!bgm) return;
    if (!args) return;
    // 设置循环片段
    Reflect.set(bgm, "_sprite", {
      loop: [
        (args.LoopStartTime ?? 0) * 1000,
        (args.LoopEndTime ?? bgm.duration(0)) * 1000,
      ],
    });
  }

  public playSound(url: string | undefined) {
    if (!url) {
      // 没有音效，停止旧的音效
      this.stopSound();
      return;
    }
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
    if (!url) {
      // 没有语音，停止旧的语音
      this.stopVoice();
      return;
    }
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

  public loadAudio: CheckMethod<AudioLayer> = async function (node) {
    this.playBgm(node.audio.bgm?.url, node.audio.bgm?.bgmArgs);
    this.playSound(node.audio.sound);
    this.playVoice(node.audio.voice);
  };

  private stopBgm() {
    if (this.instances.bgm) {
      this.instances.bgm.stop();
      this.instances.bgm = undefined;
      this.instances.bgmArgs = undefined;
    }
  }

  private stopSound() {
    if (this.instances.sound) {
      this.instances.sound.stop();
      this.instances.sound = undefined;
    }
  }

  private stopVoice() {
    if (this.instances.voice) {
      this.instances.voice.stop();
      this.instances.voice = undefined;
    }
  }

  public stop(): Promise<void> {
    super.stop();
    this.stopBgm();
    this.stopSound();
    this.stopVoice();
    return Promise.resolve();
  }
}
