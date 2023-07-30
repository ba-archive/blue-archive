import { EffectRemoveFunction } from "@/types/effectLayer";
import {
  Emitter,
  EmitterConfigV2,
  EmitterConfigV3,
} from "@pixi/particle-emitter";
import { Container } from "pixijs";


/**
 * 获取emitter config
 * @param filename 文件名, 不需要加.json后缀
 * @returns
 */
export function emitterConfigs(filename: string) {
  const config = Reflect.get(
    emitterConfigsRaw,
    `./emitterConfigs/${filename}.json`
  );
  if (!config) {
    throw new Error("emitter参数获取失败, 文件名错误或文件不存在");
  }
  return config;
}

/**
 * 给emitter用的container
 */
export const emitterContainer = new Container();
emitterContainer.zIndex = 15;
emitterContainer.sortableChildren = true;

const emitterConfigsRaw = import.meta.glob<EmitterConfigV2 | EmitterConfigV3>(
  "./emitterConfigs/*.json",
  { eager: true }
);

/**
 * emitter工具函数, 会自动启动emitter并返回一个终止函数
 * @param emitter
 * @param stopCallback 终止函数中调用的函数
 * @returns 终止函数, 功能是停止当前emitter并回收
 */
export function emitterStarter(
  emitter: Emitter,
  stopCallback?: () => void
): EffectRemoveFunction {
  let elapsed = Date.now();
  let stopFlag = false;
  // Update function every frame
  const update = function () {
    if (stopFlag) {
      return;
    }
    // Update the next frame
    requestAnimationFrame(update);

    const now = Date.now();
    // The emitter requires the elapsed
    // number of seconds since the last update
    emitter.update((now - elapsed) * 0.001);
    elapsed = now;
  };

  const stop = async function () {
    stopFlag = true;
    emitter.emit = false;
    emitter.destroy();
    if (stopCallback) {
      stopCallback();
    }
  };

  // Start emitting
  emitter.emit = true;

  // Start the update
  update();

  return stop;
}
