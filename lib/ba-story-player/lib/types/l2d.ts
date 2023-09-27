export type IL2dConfig = {
  [key: string]: {
    name: string;
    playQue: IL2dPlayQue[];
    spineSettings?: {
      [key: string]: {
        scale?: number; // 对单个 spine 文件进行设置
      };
    };
    /** 实际上是请求的路径 */
    otherSpine?: string[];
  };
};
export type IL2dPlayQue = {
  name: string;
  animation: string;
  fadeTime?: number;
  fadeBlackTime?: number;
  secondFadeTime?: number;
  sounds?: {
    fileName: string;
    time: number;
    /**
     * 声音大小, 默认为2
     */
    volume?: number;
  }[];
  /** 和后一个动画是否fade */
  fade?: boolean;
};
