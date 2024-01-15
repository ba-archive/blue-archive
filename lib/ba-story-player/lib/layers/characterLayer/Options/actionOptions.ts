import { ActionOptions } from "../type";

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
