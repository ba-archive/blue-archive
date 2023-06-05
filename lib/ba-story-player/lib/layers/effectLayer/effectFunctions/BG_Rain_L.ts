import { usePlayerStore } from "@/stores";
import { BGEffectHandlerFunction } from "@/types/effectLayer";
import {
  Emitter,
  EmitterConfigV2,
  upgradeConfig,
} from "@pixi/particle-emitter";
import {
  emitterConfigs,
  emitterContainer,
  emitterStarter,
} from "../emitterUtils";

const handler: BGEffectHandlerFunction<"BG_Rain_L"> = async function (
  resources,
  setting,
  options
) {
  let newRainConfig: EmitterConfigV2 = { ...emitterConfigs("rain") };
  const app = usePlayerStore().app;
  newRainConfig.spawnRect!.w = app.view.width;
  newRainConfig.spawnRect!.h = app.view.height;
  newRainConfig.frequency = options.frequency;
  let emitter = new Emitter(
    emitterContainer,
    upgradeConfig(newRainConfig, [resources[0].texture])
  );
  return emitterStarter(emitter);
};

export default handler;
