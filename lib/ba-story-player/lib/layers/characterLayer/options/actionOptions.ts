import { ActionOptions, OptionDescriptions } from "@/types/characterLayer";

export const actionDescriptions: OptionDescriptions["action"] = {
  a: {},
  d: {
    duration: "消失动画的时间",
  },
  dl: {
    speed: "移动速度",
  },
  dr: {
    speed: "移动速度",
  },
  ar: {
    speed: "移动速度",
  },
  al: {
    speed: "移动速度",
  },
  hophop: {
    yOffset: "跳动的高度",
    duration: "跳动一次的时间",
  },
  greeting: {
    yOffset: "移动的高度",
    duration: "移动所花的时间",
  },
  shake: {
    shakeAnimation: "晃动动画的参数, 包括起始点终结点, 时长, 重复次数",
  },
  m1: {},
  m2: {},
  m3: {},
  m4: {},
  m5: {},
  stiff: {
    shakeAnimation: "晃动动画的参数, 包括起始点终结点, 时长, 重复次数",
  },
  closeup: {
    scale: "相对于原来大小的缩放比例",
  },
  jump: {
    yOffset: "跳动的高度",
    duration: "跳动一次的时间",
  },
  falldownR: {
    rightAngle: "向右旋转的角度",
    leftAngle: "向左旋转的角度",
    firstRotateDuration: "第一个向右旋转的时间",
    falldownDuration: "向下移动的时间",
    anchor: "旋转原点",
    xOffset: "在x轴方向移动的距离",
    leftRotationPercent: "左转动画在下降动画中的时间比例",
  },
  falldownL: {
    rightAngle: "向右旋转的角度",
    leftAngle: "向左旋转的角度",
    firstRotateDuration: "第一个向右旋转的时间",
    falldownDuration: "向下移动的时间",
    anchor: "旋转原点",
    xOffset: "在x轴方向移动的距离",
    leftRotationPercent: "左转动画在下降动画中的时间比例",
  },
  hide: {},
};

/**
 * 立绘移动速度
 */
export const moveSpeed = 2.4;

const actionOptions: ActionOptions = {
  a: {},
  d: {
    duration: 0.6,
  },
  dl: {
    speed: moveSpeed,
  },
  dr: {
    speed: moveSpeed,
  },
  ar: {
    speed: moveSpeed,
  },
  al: {
    speed: moveSpeed,
  },
  hophop: {
    yOffset: 0.05,
    duration: 0.25,
  },
  greeting: {
    yOffset: -0.04,
    duration: 0.4,
  },
  shake: {
    shakeAnimation: {
      from: -0.03,
      to: 0.02,
      duration: 0.08,
      repeat: 2,
    },
  },
  m1: {},
  m2: {},
  m3: {},
  m4: {},
  m5: {},
  stiff: {
    shakeAnimation: {
      from: -0.01,
      to: 0.01,
      duration: 0.08,
      repeat: 4,
    },
  },
  closeup: {
    scale: 1.5,
  },
  jump: {
    yOffset: 0.03,
    duration: 0.25,
  },
  falldownR: {
    rightAngle: 10,
    anchor: {
      x: 0.4,
      y: 0.5,
    },
    leftAngle: -3,
    firstRotateDuration: 0.4,
    falldownDuration: 0.55,
    xOffset: 0.13,
    leftRotationPercent: 0.2,
  },
  falldownL: {
    rightAngle: 3,
    leftAngle: -10,
    anchor: {
      x: 0.4,
      y: 0.5,
    },
    firstRotateDuration: 0.4,
    falldownDuration: 0.55,
    xOffset: -0.13,
    leftRotationPercent: 0.2,
  },
  hide: {},
};

export default actionOptions;
