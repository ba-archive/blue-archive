import { OtherSoundsUrls, ResourcesTypes } from "@/types/resources";

let dataUrl = "";
let otherSoundMap: OtherSoundsUrls;
/**
 * ogg类型的音频是否用其他音频类型代替
 */
let oggAudioType = "ogg";
let superSampling = "";

/**
 * 字面意思, 深拷贝json
 */
export function deepCopyObject<T>(object: T): T {
  if (typeof object !== "object") {
    return object;
  }
  return JSON.parse(JSON.stringify(object));
}

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
export function getResourcesUrl(type: ResourcesTypes, arg: string): string {
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
      // return `${dataUrl}/data/${arg}`; // FIXME: 临时禁用缓存
      return `${dataUrl}/data/${arg}?t=${Math.floor(Date.now() / 3600000)}`;
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
  superSampling = `-${type}x`;
}

/*
 * wait in promise
 */
export function wait(milliseconds: number) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}
