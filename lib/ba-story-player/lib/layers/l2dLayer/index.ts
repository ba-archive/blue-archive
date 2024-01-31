import { HandlerMap, Layer } from "@/type";
import { Application } from "pixi.js";

export class L2DLayer extends Layer {
  /**
   * 其他层调用接口
   */
  private handleMap : HandlerMap;

  constructor(app: Application, handlerMap: HandlerMap) {
    super(app, handlerMap);
    this.handleMap = handlerMap;
  }

  
}