/**
 * wait in promise
 */
export function waitMs(ms: number) {
  return new Promise<void>(resolve => {
    setTimeout(resolve, ms);
  });
}

/**
 * 各层zindex的基础数字, 各层的zindex范围为基数-基数+50
 */
export const ZINDEXBASE = {
  bg: 0,
  /**
   *bgEffect可根据实际情况使用其他层的index
   */
  effect: 100,
  character: 20,
  l2d: 300,
  show: 400,
  ui: 500,
};

export function timelineToPauseAble(tl: ReturnType<typeof gsap.timeline>) {
  return {
    pause() {
      return new Promise<void>(resolve => {
        tl.pause();
        resolve();
      });
    },
  };
}
