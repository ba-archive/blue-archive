import eventBus from "@/eventBus";
import { usePlayerStore } from "@/stores";
import { PlayAudio } from "@/types/events";
import { Sound } from "@pixi/sound";

const audioMap = new Map<string, Sound>();
/**
 * 获取url对于的Sound对象, 缓存不存在则新建
 * @param url
 */
function getAudio(url: string): Sound {
  const audio = audioMap.get(url);
  if (audio) {
    return audio;
  } else {
    const newAudio = Sound.from({
      url,
      autoPlay: false,
    });
    audioMap.set(url, newAudio);
    return newAudio;
  }
}

/**
 * 预加载与解析声音资源
 * @param audioUrls 声音地址数组
 */
export async function preloadSound(audioUrls: string[]) {
  const audioLoadPromises: Promise<void>[] = [];
  for (const audioUrl of audioUrls) {
    audioLoadPromises.push(
      new Promise<void>(resolve => {
        audioMap.set(
          audioUrl,
          Sound.from({
            url: audioUrl,
            preload: true,
            autoPlay: false,
            loaded(err, resource) {
              eventBus.emit("oneResourceLoaded", {
                type: err ? "fail" : "success",
                resourceName: audioUrl,
              });
              resolve();
            },
          })
        );
      })
    );
  }
  await Promise.all(audioLoadPromises);
}

/**
 * 初始化声音层, 订阅player的剧情信息.
 */
export function soundInit() {
  let bgm: Sound | undefined = undefined;
  let sfx: Sound | undefined = undefined;
  let voice: Sound | undefined = undefined;
  let emotionSound: Sound | undefined = undefined;

  /**
   * 声音层的全局设置, 包括BGM音量, 效果音量和语音音量
   */
  let soundSettings = new (class SoundSettings {
    BGMvolume = 0.3;
    SFXvolume = 1;
    Voicevolume = 1;
  })();
  // bgm.stop(); 在window lose focus时不会生效
  const pausedBgm: Sound[] = [];
  function stopShouldStopBgm() {
    pausedBgm.filter((it) => it.instances.some((_in) => !_in.paused)).forEach((it) => it.pause());
    pausedBgm.splice(0, pausedBgm.length);
  }
  window.addEventListener("focus", stopShouldStopBgm);
  /**
   * @description 播放声音
   * @param playAudioInfo
   */
  function playAudio(playAudioInfo: PlayAudio) {
    if (playAudioInfo.bgm) {
      const historySound = pausedBgm.findIndex((it) => it.url === playAudioInfo.bgm?.url);
      if (historySound) {
        pausedBgm.splice(historySound, 1);
      }
      // 如果有正在播放的BGM则停止当前播放, 替换为下一个BGM
      if (bgm) {
        bgm.stop();
        pausedBgm.push(bgm);
      }
      // 替换BGM
      bgm = getAudio(playAudioInfo.bgm.url);
      bgm.volume = soundSettings.BGMvolume;
      bgm.play({
        // 第一次是非loop播放, 播放到LoopStartTime为止
        loop: false,
        start: 0,
        end: playAudioInfo.bgm?.bgmArgs.LoopEndTime,
        complete: function (sound) {
          if (bgm && bgm.url !== sound.url) {
            return;
          }
          // 第一次播放结束后进入loop
          sound.play({
            loop: true,
            start: playAudioInfo.bgm?.bgmArgs.LoopStartTime,
            end: playAudioInfo.bgm?.bgmArgs.LoopEndTime,
          });
        },
      }); // 这样写真的好吗...
    }

    if (playAudioInfo.soundUrl) {
      if (sfx) {
        sfx.stop();
      }
      sfx = getAudio(playAudioInfo.soundUrl);
      sfx.volume = soundSettings.SFXvolume;
      sfx.play({
        complete: () => {
          console.log("Finish Playing Sound!");
        },
      });
    }

    if (playAudioInfo.voiceJPUrl) {
      if (voice) {
        voice.stop();
      }
      voice = getAudio(playAudioInfo.voiceJPUrl);
      voice.volume = soundSettings.Voicevolume;
      voice.play({
        complete: () => {
          eventBus.emit("playVoiceJPDone", playAudioInfo.voiceJPUrl || "");
        },
      });
    }
  }

  // 当想要播放VoiceJP的时候, 可以直接
  // eventBus.emit('playAudio', {voiceJPUrl: url})
  // 这样就可以了x

  eventBus.on("playAudio", (playAudioInfo: PlayAudio) => {
    console.log(
      `Get playAudioInfo: ${
        playAudioInfo.soundUrl ||
        playAudioInfo.voiceJPUrl ||
        playAudioInfo.bgm?.url
      }`
    );
    playAudio(playAudioInfo);
  });

  eventBus.on("playEmotionAudio", (emotype: string) => {
    if (emotionSound) {
      emotionSound.stop();
    }
    emotionSound = getAudio(usePlayerStore().emotionSoundUrl(emotype));
    emotionSound.play({
      volume: soundSettings.SFXvolume,
    });
  });

  eventBus.on("playOtherSounds", sound => {
    console.log("Play Select Sound!");
    playAudio({ soundUrl: usePlayerStore().otherSoundUrl(sound) });
  });

  eventBus.on("playBgEffectSound", bgEffect => {
    playAudio({ soundUrl: usePlayerStore().bgEffectSoundUrl(bgEffect) });
  });

  eventBus.on("dispose", () => {
    window.removeEventListener("focus", stopShouldStopBgm);
    soundDispose();
  });
  eventBus.on("stop", () => soundDispose());
  eventBus.on("continue", () => bgm?.play());
  eventBus.on("playAudioWithConfig", ({ url, config }) => {
    getAudio(url).play(config);
  });
  eventBus.on("end", () => soundDispose);
}

export function soundDispose() {
  for (const sound of audioMap.values()) {
    sound.stop();
  }
}
