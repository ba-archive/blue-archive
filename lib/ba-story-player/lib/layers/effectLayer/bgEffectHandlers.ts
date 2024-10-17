import { usePlayerStore } from "@/stores";
import { Sprite } from "pixi.js";
import {
  BGEffectHandlerFunction,
  BGEffectHandlerOptions,
  CurrentBGEffect,
} from "@/types/effectLayer";
import { BGEffectExcelTableItem, BGEffectType } from "@/types/excels";

const effectFunctionsRaw = import.meta.glob<{
  default: BGEffectHandlerFunction<BGEffectType>;
}>("./effectFunctions/*", { eager: true });
function getEffectFunctions(functionName: string) {
  const effectFunction = Reflect.get(
    effectFunctionsRaw,
    `./effectFunctions/${functionName}.ts`
  );
  if (!effectFunction) {
    return undefined;
  }
  return effectFunction.default;
}

/**
 * 当前播放的BGEffect
 */
let currentBGEffect: CurrentBGEffect;

/**
 * 处理函数的对应参数
 */
export const bgEffectHandlerOptions: BGEffectHandlerOptions = {
  BG_FocusLine: {},
  "": {},
  "BG_ScrollT_0.5": {},
  BG_Filter_Red: {},
  BG_Wave_F: {},
  BG_Flash: {},
  BG_UnderFire_R: {},
  BG_Love_L: {},
  "BG_ScrollB_0.5": {},
  BG_Rain_L: {
    frequency: 0.05,
  },
  BG_UnderFire: {},
  BG_WaveShort_F: {},
  BG_SandStorm_L: {},
  "BG_ScrollT_1.5": {},
  BG_Shining_L: {},
  "BG_ScrollB_1.0": {},
  BG_Love_L_BGOff: {},
  BG_Dust_L: {},
  "BG_ScrollL_0.5": {},
  "BG_ScrollL_1.0": {},
  BG_Ash_Black: {},
  BG_Mist_L: {},
  BG_Flash_Sound: {},
  "BG_ScrollL_1.5": {},
  "BG_ScrollR_1.5": {},
  BG_Shining_L_BGOff: {},
  "BG_ScrollT_1.0": {},
  "BG_ScrollB_1.5": {},
  BG_Filter_Red_BG: {},
  BG_Ash_Red: {},
  BG_Fireworks_L_BGOff_02: {},
  "BG_ScrollR_0.5": {},
  BG_Snow_L: {},
  BG_Fireworks_L_BGOff_01: {},
  "BG_ScrollR_1.0": {},
  BG_TvNoise_Sound: {},
  BG_Filter_Gray_BG: {},
};

export const bgEffectHandlers: Record<
  string,
  BGEffectHandlerFunction<BGEffectType>
> = {};

const bgEffects = [
  "BG_ScrollT_0.5",
  "BG_Filter_Red",
  "BG_Wave_F",
  "BG_Flash",
  "BG_UnderFire_R",
  "BG_Love_L",
  "BG_ScrollB_0.5",
  "BG_Rain_L",
  "BG_UnderFire",
  "BG_WaveShort_F",
  "BG_SandStorm_L",
  "",
  "BG_ScrollT_1.5",
  "BG_Shining_L",
  "BG_ScrollB_1.0",
  "BG_Love_L_BGOff",
  "BG_Dust_L",
  "BG_ScrollL_0.5",
  "BG_ScrollL_1.0",
  "BG_Ash_Black",
  "BG_Mist_L",
  "BG_Flash_Sound",
  "BG_ScrollL_1.5",
  "BG_FocusLine",
  "BG_ScrollR_1.5",
  "BG_Shining_L_BGOff",
  "BG_ScrollT_1.0",
  "BG_ScrollB_1.5",
  "BG_Filter_Red_BG",
  "BG_Ash_Red",
  "BG_Fireworks_L_BGOff_02",
  "BG_ScrollR_0.5",
  "BG_Snow_L",
  "BG_Fireworks_L_BGOff_01",
  "BG_ScrollR_1.0",
  "BG_TvNoise_Sound",
  "BG_Filter_Gray_BG",
];

/**
 * 播放对应的BGEffect
 * @param bgEffectItem
 * @returns
 */
export async function playBGEffect(bgEffectItem: BGEffectExcelTableItem) {
  console.log(bgEffectHandlers);
  const effect = bgEffectItem.Effect;
  //此特效正在播放, 无需处理, 先移除保证开发便利
  // if (effect === currentBGEffect?.effect) {
  //   return
  // }
  await removeBGEffect();
  const resources = usePlayerStore().bgEffectImgMap.get(effect) ?? [];
  const imgs: Sprite[] = [];
  for (const resource of resources) {
    imgs.push(Sprite.from(resource));
  }
  const handler = bgEffectHandlers[effect];
  let removeFunction: any;
  try {
    removeFunction = await Reflect.apply(handler, undefined, [
      imgs,
      bgEffectItem,
      bgEffectHandlerOptions[effect],
    ]);
  } catch (e) {
    console.error(`执行 ${effect} 时发生错误`, e);
  }
  currentBGEffect = {
    effect,
    removeFunction,
    resources: imgs,
  };
}
for (const effect of bgEffects) {
  const handler = getEffectFunctions(effect);
  if (handler) {
    Reflect.set(bgEffectHandlers, effect, handler);
  } else {
    Reflect.set(bgEffectHandlers, effect, async () => {
      throw new Error("未找到该bgEffect实现");
    });
  }
}

/**
 * 移除当前的BGEffect
 */
export async function removeBGEffect() {
  if (currentBGEffect && "function" === typeof currentBGEffect.removeFunction) {
    await currentBGEffect.removeFunction();
    for (const resource of currentBGEffect.resources) {
      resource.destroy();
    }
    currentBGEffect = undefined;
  }
}
