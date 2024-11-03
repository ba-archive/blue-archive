export interface IFilmAspectTransition {
  type: "film_aspect_transition";
  startTime: number;
  startDuration: number;
  keepDuration: number;
  endDuration: number;
}

export type TCustomTransition = IFilmAspectTransition;

export type IL2dConfig = {
  [key: string]: {
    name: string;
    playQue: IL2dPlayQue[];
    spineSettings?: {
      [key: string]: {
        scale?: number; // 对单个 spine 文件进行设置
        customizeBones?: {
          name: string;
          props: {
            [key: string]:
              | number
              | string
              | {
                  [key: string]: number | string;
                };
          };
        }[];
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
  secondFadeTime?: number;
  customFade?: Array<{
    customFadeTime: number;
    customFadeColor?: string;
    toSolidDuration?: number;
    solidStateDuration?: number;
    toNormalDuration?: number;
  }>;
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
  customTransitions?: TCustomTransition[];
};
