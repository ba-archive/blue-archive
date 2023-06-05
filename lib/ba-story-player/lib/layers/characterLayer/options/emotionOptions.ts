import { EmotionOptions, OptionDescriptions } from "@/types/characterLayer";

/**
 * 每个参数的描述, 用于可视化调试工具
 */
export const emotionDescriptions: OptionDescriptions["emotion"] = {
  globalOptions: {
    startPositionOffset:
      "图片开始时相对于角色的位置, 相对值, 值为偏移量与角色宽度比例",
    scale: "图片缩放比例, 多个图片时为基准图片缩放比例",
    fadeOutPreDuration: "淡出动画前的时间, 可选",
    fadeOutDuration: "淡出动画的时间",
  },
  Heart: {
    heartImg: "心相对于对话框的位置",
    jumpAnimation: "心跳动动画参数",
  },
  Respond: {
    flashAnimation: "闪烁动画参数",
    perImgSetting: "每个图片的缩放, 旋转原点, 旋转角度",
  },
  Music: {
    rotateAngle: "来回旋转的角度",
    animation: "动画参数",
  },
  Twinkle: {
    starImgs: "三颗星的位置和缩放大小设置",
    flashAnimation: "闪烁动画设置, 包括放大缩小倍数-动画时长",
    fadeInDuration: "出现动画时长",
  },
  Sad: {
    moveYDistance: "在y轴移动的距离",
    imageGap: "个图片的间距",
    imgInitYPosition: "各图片开始时y轴位置",
  },
  Sweat: {
    smallImg: "较小的图片相较于较大图片的设置, 包括缩放和相对位置",
    dropAnimation: "下落动画的参数",
  },
  Dot: {
    dotContainerPos: "所有点图片的容器在对话框图片中的位置",
    dotPos: "起始位置的x方向位移的相对值",
    showAnimation: "显示点的动画参数",
  },
  Chat: {
    rotateAngle: "旋转的角度",
    rotateTime: "一次旋转来回的时间, 单位为秒",
    rotatePivot: "旋转原点位置, 以设置初始值, 修改的是相对于初始值的值",
  },
  Exclaim: {
    scaleAnimation: "动画过程为先放大然后恢复回原来大小",
    fadeOutWaitTime: "消失动画前的等待时间",
  },
  Angry: {
    pivotPosition: "旋转的原点",
    animationScale: "angry图像的动画效果, 通过scaleX实现",
    endScale: "结束时的缩小动画",
  },
  Surprise: {
    imgSetting: "图片位置和选择角度设置",

    scaleAnimation:
      "图片放大的动画, 其中?图片还有一个y方向的形变, 还可以选定缩放动画的原点",
    jumpAnimation: "图片向左移动并跳动的动画",
  },
  Question: {
    scaleAnimation: "动画过程为先放大然后恢复回原来大小",
  },
  Shy: {
    shyImg: "///图片的相关设置",
    scaleAnamation:
      "开始时的放大动画设置, 包括放大开始前的大小,放大动画的依据点, 放大动画的时间",
    shakeAnimation:
      "///图片摇动动画的相关设置, 包括摇动从哪个角度到哪个角度, 摇动次数",
  },
  Upset: {
    upsetImgPos: "线条图片的位置",
    rotateAnimation: "线条图片左右选择的动画参数, 包括选择角度和时间",
    yScaleAnimation: "线条图片上下压缩的动画参数, 包括压缩的比例和动画时间",
    animationTotalDuration: "动画持续时间",
  },
  Steam: {
    imgAngles: "各图片选择角度",
    imgPivot: "图片原点",
    imgScaleAnimation: "图片放大动画参数",
  },
  Sigh: {
    scaleAnimation: "图片缩放动画",
    angle: "图片选择角度",
    anchor: "缩放的起始点",
  },
  Bulb: {
    bulbYPosition: "灯泡在y轴的位置",
    dialogScaleAnimation: "对话框缩放动画",
    lightScale: "光线图片的缩放",
    lightYPosition: "光线图片y轴位置",
  },
  Tear: {
    positions: "图片位置",
    anchors: "图片anchor",
    scaleAnimations: "图片缩放动画",
  },
  Zzz: {
    zImageSettings: "每个z图片的设置",
  },
};

const emotionOptions: EmotionOptions = {
  Heart: {
    startPositionOffset: {
      x: 0.1,
      y: -0.1,
    },
    scale: 0.45,
    heartImg: {
      scale: 0.4,
      position: {
        x: 0.27,
        y: 0.16,
      },
    },
    jumpAnimation: {
      firstScale: {
        x: 1.2,
        y: 1.3,
      },
      secondScale: {
        x: 1.1,
        y: 1.2,
      },
      duration: 0.25,
    },
    fadeOutDuration: 0.2,
  },
  Respond: {
    startPositionOffset: {
      x: 0.6,
      y: 0,
    },
    scale: 0.13,
    fadeOutPreDuration: 0.3,
    fadeOutDuration: 0.12,
    flashAnimation: {
      duration: 0.3,
      alpha: 0.2,
    },
    perImgSetting: [
      {
        scale: 0.7,
        anchor: {
          x: 1.8,
          y: 0,
        },
        angle: -10,
      },
      {
        scale: 1,
        anchor: {
          x: 1.5,
          y: 0,
        },
        angle: 23,
      },
      {
        scale: 0.7,
        anchor: {
          x: 1.8,
          y: 0,
        },
        angle: 50,
      },
    ],
  },
  Music: {
    startPositionOffset: {
      x: 0.2,
      y: 0,
    },
    scale: 0.2,
    rotateAngle: -8,
    animation: {
      offset: {
        x: -1,
        y: 0.1,
      },
      duration: 0.8,
    },
    fadeOutDuration: 0.1,
  },
  Twinkle: {
    startPositionOffset: {
      x: 0.2,
      y: 0,
    },
    scale: 0.08,
    fadeOutPreDuration: 0.2,
    fadeOutDuration: 0.2,
    starImgs: {
      pos: [
        {
          x: 0,
          y: 0,
        },
        {
          x: 0.7,
          y: -0.6,
        },
        {
          x: 0.8,
          y: 0.6,
        },
      ],
      scale: [1, 0.9, 0.6],
    },
    flashAnimation: {
      scales: [1.2, 1.15, 0.9],
      duration: [0.5, 0.6, 0.4],
      totalDuration: 1,
    },
    fadeInDuration: 0.2,
  },
  Sad: {
    startPositionOffset: {
      x: 0.4,
      y: 0,
    },
    scale: 0.3,
    fadeOutDuration: 0.1,
    imageGap: 30,
    moveYDistance: 35,
    imgInitYPosition: [0, 30, -30],
  },
  Sweat: {
    startPositionOffset: {
      x: 0.4,
      y: 0,
    },
    scale: 0.12,
    smallImg: {
      scale: 1,
      offset: {
        x: 1,
        y: -0.5,
      },
      dropAnimationOffset: -2.3,
    },
    dropAnimation: {
      yOffset: -1,
      duration: 0.4,
    },
    fadeOutDuration: 0.1,
  },
  Dot: {
    startPositionOffset: {
      x: 0,
      y: -0.1,
    },
    scale: 0.3,
    fadeOutPreDuration: 0.1,
    fadeOutDuration: 0.1,
    dotContainerPos: {
      x: 0.1,
      y: 0.35,
    },
    dotPos: [0, 2, 4],
    showAnimation: {
      alpahaDuration: 0.1,
      showDelay: 0.3,
    },
  },
  Chat: {
    startPositionOffset: {
      x: 0.45,
      y: 0.17,
    },
    scale: 0.2,
    rotateAngle: -25,
    rotateTime: 0.5,
    rotatePivot: {
      x: 0.3,
      y: 0,
    },
    fadeOutDuration: 0.1,
  },
  Exclaim: {
    startPositionOffset: {
      x: 0.42,
      y: -0.1,
    },
    scale: 0.13,
    fadeOutDuration: 0.1,
    scaleAnimation: {
      scale: 1.4,
      scaleDuration: 0.2,
      recoverScale: 1.2,
      recoverDuration: 0.1,
    },
    fadeOutWaitTime: 0.3,
  },
  Angry: {
    startPositionOffset: {
      x: 0.5,
      y: 0.05,
    },
    scale: 0.16,
    pivotPosition: {
      x: 0.35,
      y: -0.05,
    },
    animationScale: {
      scale: 0.9,
      duration: 0.2,
    },
    endScale: {
      scale: 0.2,
      duration: 0.1,
    },
    fadeOutDuration: 0.1,
  },
  Surprise: {
    startPositionOffset: {
      x: 0.35,
      y: 0.06,
    },
    scale: 0.12,
    fadeOutPreDuration: 0.4,
    imgSetting: {
      angles: [-10, 15],
      questionImgPos: {
        x: 1.5,
        y: 0,
      },
    },
    fadeOutDuration: 0.1,
    scaleAnimation: {
      startScale: 0.7,
      questionImgYScale: 0.3,
      duration: 0.3,
      anchor: {
        x: 0.5,
        y: 1,
      },
    },
    jumpAnimation: {
      xOffset: -0.1,
      jumpYOffset: 0.1,
      duration: 0.3,
    },
  },
  Question: {
    startPositionOffset: {
      x: 0.4,
      y: 0.07,
    },
    scale: 0.15,
    fadeOutDuration: 0.2,
    fadeOutPreDuration: 0.4,
    scaleAnimation: {
      scale: 1.6,
      anchor: {
        x: 0.5,
        y: 1,
      },
      scaleDuration: 0.2,
      recoverScale: 1.4,
      recoverDuration: 0.05,
    },
  },
  Shy: {
    startPositionOffset: {
      x: 0.5,
      y: 0.06,
    },
    scale: 0.46,
    fadeOutDuration: 0.1,
    shyImg: {
      anchor: {
        x: 0.5,
        y: 0.5,
      },
      scale: 1,
      position: {
        x: -0.65,
        y: -0.5,
      },
    },
    scaleAnamation: {
      startScale: 0.8,
      anchor: {
        x: 1,
        y: 1,
      },
      duration: 0.1,
    },
    shakeAnimation: {
      angleFrom: 13,
      angleTo: -10,
      duration: 0.4,
      times: 2,
    },
  },
  Upset: {
    startPositionOffset: {
      x: 0,
      y: -0.1,
    },
    scale: 0.27,
    fadeOutDuration: 0.3,
    upsetImgPos: {
      x: 0.5,
      y: 0.5,
    },
    rotateAnimation: {
      angleFrom: 6,
      angleTo: -7,
      duration: 0.2,
    },
    yScaleAnimation: {
      scale: 0.8,
      duration: 0.43,
    },
    animationTotalDuration: 1,
  },
  Steam: {
    startPositionOffset: {
      x: 0.5,
      y: 0.1,
    },
    scale: 0.27,
    fadeOutDuration: 0.3,
    imgPivot: {
      x: 1.4,
      y: 1.5,
    },
    imgScaleAnimation: [
      {
        start: 0.1,
        end: 0.7,
      },
      {
        start: 0.6,
        end: 0.9,
      },
    ],
    imgAngles: [-30, 0],
  },
  Sigh: {
    startPositionOffset: {
      x: 0.4,
      y: 0.15,
    },
    scale: 0.27,
    fadeOutDuration: 0.3,
    angle: 0,
    scaleAnimation: {
      start: 0.3,
      end: 0.9,
    },
    anchor: {
      x: 1,
      y: -0.2,
    },
  },
  Bulb: {
    startPositionOffset: {
      x: 0.1,
      y: -0.1,
    },
    scale: 0.27,
    fadeOutDuration: 0.3,
    dialogScaleAnimation: {
      start: 0.7,
      end: 1,
    },
    bulbYPosition: 100,
    lightScale: 1.13,
    lightYPosition: 82,
  },
  Tear: {
    startPositionOffset: {
      x: 0.45,
      y: 0.15,
    },
    scale: 0.27,
    fadeOutDuration: 0.3,
    positions: [
      {
        x: 0,
        y: 30,
      },
      {
        x: 0,
        y: 0,
      },
    ],
    scaleAnimations: [
      {
        start: 0.5,
        end: 1,
      },
      {
        start: 0.6,
        end: 1,
      },
    ],
    anchors: [
      {
        x: 1,
        y: 0,
      },
      {
        x: 1,
        y: 0,
      },
    ],
  },
  Zzz: {
    startPositionOffset: {
      x: 0.45,
      y: 0.1,
    },
    scale: 0.1,
    fadeOutDuration: 0.3,
    zImageSettings: [
      {
        position: {
          x: 0,
          y: 0,
        },
        scale: 0.8,
        rotate: 15,
      },
      {
        position: {
          x: -80,
          y: -30,
        },
        scale: 0.9,
        rotate: 5,
      },
      {
        position: {
          x: -190,
          y: 7,
        },
        scale: 1,
        rotate: -15,
      },
    ],
  },
};

export default emotionOptions;
