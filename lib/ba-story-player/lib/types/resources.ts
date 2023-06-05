export type ResourcesTypes =
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

// select：按钮点击音效，back：返回音效
export type OtherSounds = "select" | "bg_underfire" | "back";
export type OtherSoundsUrls = {
  [key in OtherSounds]: string;
};
