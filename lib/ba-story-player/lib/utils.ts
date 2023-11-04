/**
 * wait in promise
 */
export function waitMs(ms: number) {
  return new Promise<void>(resolve => {
    setTimeout(resolve, ms);
  });
}

/**
 * pixi内各层zindex的基础数字, 各层的zindex范围为基数-基数+50
 */
export const ZINDEXBASE = {
  bg: 0,
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
