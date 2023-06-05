import { FXOptions, OptionDescriptions } from "@/types/characterLayer";

export let fxOptionsDescriptions: OptionDescriptions["fx"] = {
  shot: {
    scale: "图片缩放大小",
    shotDuration: "每次射击显示效果的时长",
    shotSequence: "每次击中效果的设置",
  },
};

let fxOptions: FXOptions = {
  shot: {
    scale: 0.2,
    shotDuration: 0.1,
    shotSequence: [
      {
        startImg: 1,
        endRed: true,
        pos: {
          x: -0.3,
          y: -1.6,
        },
        angle: -20,
        scale: 1,
      },
      {
        startImg: 2,
        endRed: true,
        pos: {
          x: 0.2,
          y: -1.7,
        },
        angle: 10,
        scale: 1,
      },
      {
        startImg: 0,
        endRed: true,
        pos: {
          x: -0.6,
          y: -2.1,
        },
        angle: -30,
        scale: 1.2,
      },
      {
        startImg: 1,
        endRed: false,
        endImg: 2,
        pos: {
          x: 0.7,
          y: -2.4,
        },
        angle: 80,
        scale: 1.2,
      },
    ],
  },
};

export default fxOptions;
