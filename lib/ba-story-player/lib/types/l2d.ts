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
    playQueAsync?: IL2dPlayQue[];
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
  /** 动画名称 */
  name: string;
  animation: string;
  /** 动画播放延迟 */
  pushDelay?: number;
  /** 第一次淡入转场时机 */
  fadeTime?: number;
  /** 第二次淡入转场时机 */
  secondFadeTime?: number;
  /** 自定义淡入转场 */
  customFade?: Array<{
    customFadeTime: number;
    customFadeColor?: string;
    toSolidDuration?: number;
    solidStateDuration?: number;
    toNormalDuration?: number;
  }>;
  /** 声音 */
  sounds?: {
    /** 声音路径 */
    fileName: string;
    /** 声音播放时间 */
    time: number;
    /**
     * 声音大小, 默认为2
     */
    volume?: number;
  }[];
  /** 是否淡入淡出过渡到下一动画 */
  fade?: boolean;
  /** 自定义转场 */
  customTransitions?: TCustomTransition[];
};
