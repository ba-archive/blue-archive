import { LoaderResource, Sprite } from "pixi.js";

import { Dict } from "@/types/common";
import { BgParams } from "@/types/events";

export interface BgLayer {
  /**
   * 初始化 BgLayer 实例函数
   */
  init(): void;
  /**
   * 销毁 BgLayer 实例函数
   */
  dispose(): void;
  /**
   * 初始化实例事件
   */
  initEvent(): void;
  /**
   * 销毁实例事件
   */
  disposeEvent(): void;
  /**
   * showBg 事件处理函数
   * @param params 背景图片参数
   */
  handleShowBg(params: BgParams): void;
  /**
   * 处理canvas尺寸变化
   */
  handleResize(): void;
  /**
   * 从 Loader Resource 获取背景 Sprite
   * @param resources loader resources
   * @param name 背景图片名
   */
  getBgSpriteFromResource(
    resources: Dict<LoaderResource>,
    name: string
  ): Sprite | undefined;
  /**
   * 直接加载背景
   */
  loadBg(instance: Sprite): void;
  /**
   * 基于 bgoverlap 特效加载背景
   */
  loadBgOverlap(instance: Sprite, overlap: number): void;
}
