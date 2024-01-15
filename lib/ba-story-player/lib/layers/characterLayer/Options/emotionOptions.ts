import { EmotionOptions } from "../type";

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
