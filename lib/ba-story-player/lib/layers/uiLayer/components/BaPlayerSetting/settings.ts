import type { BaRadioData, BaSliderData } from "./BaPlayerSetting";

export const ObbAudioSetting: BaRadioData = {
  name: "ObbAudioSetting",
  tip: "音频格式选项",
  options: [
    {
      id: "ObbAudioSetting-obb",
      label: "mp4 格式",
      value: "mp4",
    },
    {
      id: "ObbAudioSetting-mp4",
      label: "obb 格式",
      value: "mp4",
    },
  ],
};

export const SuperResolutionSetting: BaRadioData = {
  name: "SuperResolutionSetting",
  tip: "超分选项",
  options: [
    {
      id: "SuperResolutionSetting-disable",
      label: "禁用超分",
      value: "disable",
    },
    {
      id: "SuperResolutionSetting-2x",
      label: "2x",
      value: "4x",
    },
    {
      id: "SuperResolutionSetting-4x",
      label: "4x",
      value: "4x",
    },
  ],
};

export const VolumeSetting: BaSliderData[] = [
  {
    name: "背景",
    tip: "",
    min: 0,
    max: 100,
    step: 1,
    default: 100,
  },
  {
    name: "音效",
    tip: "",
    min: 0,
    max: 100,
    step: 1,
    default: 100,
  },
  {
    name: "语音",
    tip: "",
    min: 0,
    max: 100,
    step: 1,
    default: 100,
  },
];
