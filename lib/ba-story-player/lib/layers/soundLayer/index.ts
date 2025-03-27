import eventBus from "@/eventBus";
import { usePlayerStore } from "@/stores";
import { Howl, Howler } from "howler";
import { watch } from "vue";
import { useUiState } from "@/stores/state";
import { PlayAudio } from "@/types/events";
import { BGMExcelTableItem } from "@/types/excels";

const audioMap = new Map<string, Howl>();
/**
 * 获取url对于的Sound对象, 缓存不存在则新建
 * @param url
 */
function getAudio(url: string): Howl {
  const audio = audioMap.get(url);
  if (audio) {
    return audio;
  } else {
    const newAudio = new Howl({
      src: url,
      autoplay: false,
      preload: true,
    });
    audioMap.set(url, newAudio);
    return newAudio;
  }
}

export function soundDispose() {
  for (const sound of audioMap.values()) {
    sound.stop();
  }
  Howler.stop();
}

/**
 * 初始化声音层, 订阅player的剧情信息.
 */
export function soundInit() {
  let bgm: Howl | undefined = undefined;
  let sfx: Howl | undefined = undefined;
  let voice: Howl | undefined = undefined;
  let emotionSound: Howl | undefined = undefined;
  const UiState = useUiState();
  watch(
    () => UiState.volume.value,
    cur => {
      if (bgm) {
        bgm.volume(cur.bgmVolume);
      }
      if (sfx) {
        sfx.volume(cur.sfxVolume);
      }
      if (voice) {
        voice.volume(cur.voiceVolume);
      }
    },
    { deep: true }
  );
  /**
   * @description 播放声音
   * @param playAudioInfo
   */
  function playAudio(playAudioInfo: PlayAudio) {
    if (playAudioInfo.bgm) {
      // 如果有正在播放的BGM则停止当前播放, 替换为下一个BGM
      const cfg = playAudioInfo.bgm;
      const self = getAudio(cfg.url);
      // eslint-disable-next-line no-inner-declarations
      function endCb() {
        bgm?.off("end", endCb);
        if (Reflect.get(bgm || {}, "_src") === cfg.url) {
          self.play("loop");
        }
      }
      new Promise<typeof cfg>((resovle, reject) => {
        if (bgm) {
          // 如果正在播放的bgm和新的是同一个，直接跳过?? 是否合理
          if (Reflect.get(bgm, "_src") === cfg.url) {
            reject("");
            return;
          }
          bgm.stop();
          bgm.off("end", endCb);
          bgm = undefined;
        }
        resovle(cfg);
      })
        .then(cfg => {
          // 替换BGM
          bgm = self;
          const state = Reflect.get(self, "_state");
          function setLoop() {
            const sprite = Reflect.get(self, "_sprite");
            let loopStartTime: (number | undefined)[] = [];
            let loopEndTime: (number | undefined)[] = [];

            if (Array.isArray(cfg.bgmArgs.LoopStartTime)) {
              loopStartTime = cfg.bgmArgs.LoopStartTime;
            } else {
              // 旧版bgm配置
              loopStartTime = [cfg.bgmArgs.LoopStartTime];
            }

            if (Array.isArray(cfg.bgmArgs.LoopEndTime)) {
              loopEndTime = cfg.bgmArgs.LoopEndTime;
            } else {
              // 旧版bgm配置
              loopEndTime = [cfg.bgmArgs.LoopEndTime];
            }

            if (sprite) {
              // eslint-disable-next-line max-len
              Reflect.set(sprite, "loop", [
                (loopStartTime[0] ?? 0) * 1000,
                (loopEndTime[0] || self.duration()) * 1000,
                true,
              ]);
            } else {
              // eslint-disable-next-line max-len
              Reflect.set(sprite, "_sprite", {
                loop: [
                  (loopStartTime[0] ?? 0) * 1000,
                  (loopEndTime[0] || self.duration()) * 1000,
                  true,
                ],
              });
            }
          }
          if (state !== "loaded") {
            bgm.once("load", () => {
              setLoop();
            });
          } else {
            setLoop();
          }
          bgm.seek(0);
          bgm.once("end", endCb);
          bgm.volume(UiState.volume.value.bgmVolume);
          bgm.play();
        })
        .catch(err => {
          if (err && typeof err !== "string") {
            console.log(err);
          }
        });
    }
    if (playAudioInfo.soundUrl) {
      if (sfx) {
        sfx.stop();
      }
      sfx = getAudio(playAudioInfo.soundUrl);
      sfx.volume(UiState.volume.value.sfxVolume);
      sfx.once("end", () => {
        eventBus.emit("playSFXDone", playAudioInfo.soundUrl || "");
      });
      sfx.play();
    }

    if (playAudioInfo.voiceJPUrl) {
      if (voice) {
        voice.stop();
      }
      voice = getAudio(playAudioInfo.voiceJPUrl);
      voice.volume(UiState.volume.value.voiceVolume);
      voice.once("end", () => {
        eventBus.emit("playVoiceJPDone", playAudioInfo.voiceJPUrl || "");
      });
      voice.play();
    }
  }

  // 当想要播放VoiceJP的时候, 可以直接
  // eventBus.emit('playAudio', {voiceJPUrl: url})
  // 这样就可以了x

  eventBus.on("playAudio", (playAudioInfo: PlayAudio | undefined) => {
    if (
      !playAudioInfo ||
      Object.values(playAudioInfo).every(el => [undefined, null].includes(el))
    ) {
      console.warn("playAudioInfo is empty");
      return;
    }
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
    emotionSound.volume(UiState.volume.value.sfxVolume);
    emotionSound.play();
  });

  eventBus.on("playOtherSounds", sound => {
    console.log("Play Select Sound!");
    playAudio({ soundUrl: usePlayerStore().otherSoundUrl(sound) });
  });

  eventBus.on("playBgEffectSound", bgEffect => {
    playAudio({ soundUrl: usePlayerStore().bgEffectSoundUrl(bgEffect) });
  });
  eventBus.on("dispose", () => {
    soundDispose();
  });
  eventBus.on("stop", () => {
    soundDispose();
  });
  eventBus.on("continue", () => bgm?.play());
  eventBus.on(
    "playAudioWithConfig",
    ({
      url,
      config: {
        config: { volume },
      },
    }) => {
      const howl = getAudio(url);
      howl.volume(volume > 1 ? volume / 100 : volume);
      howl.play();
    }
  );
  eventBus.on("end", () => {
    soundDispose();
  });
}
