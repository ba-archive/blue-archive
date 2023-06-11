import eventBus from "@/eventBus";
import { usePlayerStore } from "@/stores";
import { Container } from "pixi.js";
import {
  emitterConfigs,
  emitterContainer,
  emitterStarter,
} from "../emitterUtils";
import { loadSpriteSheet } from "../resourcesUtils";
import { BGEffectHandlerFunction } from "@/types/effectLayer";
import { Emitter, EmitterConfigV3 } from "@pixi/particle-emitter";

const handler: BGEffectHandlerFunction<"BG_UnderFire"> = async function (
  resources,
  setting,
  options
) {
  let { height: appHeight, width: appWidth } = usePlayerStore().app.screen;
  let ininX = (appWidth * 7) / 8;
  let ininY = (appHeight * 7) / 8;
  eventBus.emit("playOtherSounds", "bg_underfire");

  //烟雾效果, 通过spritesheet实现烟雾散开
  let smokeContainer = new Container();
  emitterContainer.addChild(smokeContainer);
  smokeContainer.zIndex = 1;
  let smokeConifg: EmitterConfigV3 = {
    ...(emitterConfigs("smoke") as EmitterConfigV3),
  };
  smokeConifg.pos = {
    x: ininX,
    y: ininY,
  };
  let smokeAnimationsName = "smoke";
  let smokeSpritesheet = await loadSpriteSheet(
    resources[0],
    { x: 3, y: 3 },
    smokeAnimationsName
  );
  smokeConifg.behaviors[0].config.anim.textures = Reflect.get(
    smokeSpritesheet.animations,
    smokeAnimationsName
  );
  let smokeImageHeight = resources[0].height / 3;
  //根据高度算缩放比例
  let smokeScale = ((2 / 5) * appHeight) / smokeImageHeight;
  Reflect.set(smokeConifg.behaviors[1].config, "min", smokeScale);
  Reflect.set(smokeConifg.behaviors[1].config, "max", smokeScale + 0.5);
  let smokeMoveSpeed = (1 / 2) * appHeight;
  Reflect.set(smokeConifg.behaviors[2].config, "min", smokeMoveSpeed);
  Reflect.set(smokeConifg.behaviors[2].config, "max", smokeMoveSpeed + 10);
  let smokeEmitter = new Emitter(smokeContainer, smokeConifg);
  let smokeRemover = emitterStarter(smokeEmitter);

  //火焰效果, emitter随机从三个素材中选一个发出
  let fireContainer = new Container();
  emitterContainer.addChild(fireContainer);
  fireContainer.zIndex = 2;
  let fireConfig: EmitterConfigV3 = {
    ...(emitterConfigs("fire") as EmitterConfigV3),
  };
  fireConfig.pos = {
    x: ininX,
    y: ininY,
  };
  let fireImgs = resources.slice(1, 4);
  let fireScale = ((1 / 3) * appHeight) / fireImgs[0].height;
  Reflect.set(fireConfig.behaviors[0].config.scale, "list", [
    {
      value: fireScale,
      time: 0,
    },
    {
      value: fireScale - 0.1,
      time: 1,
    },
  ]);
  for (let i = 0; i < 3; ++i) {
    //textureRandom behaviors
    fireConfig.behaviors[2].config.textures.push(fireImgs[i].texture);
  }
  let fireEmitter = new Emitter(fireContainer, fireConfig);
  let fireRemover = emitterStarter(fireEmitter);

  let firelineContainer = new Container();
  emitterContainer.addChild(firelineContainer);
  firelineContainer.zIndex = 0;
  let firelineConfig: EmitterConfigV3 = {
    ...(emitterConfigs("fireline") as EmitterConfigV3),
  };
  let firelineImage = resources[4];
  firelineConfig.behaviors[0].config.texture = firelineImage.texture;
  firelineConfig.pos = {
    x: ininX,
    y: ininY,
  };
  let firelineScale = ((1 / 16) * appHeight) / firelineImage.height;
  Reflect.set(firelineConfig.behaviors[1].config, "min", firelineScale - 0.2);
  Reflect.set(firelineConfig.behaviors[1].config, "max", firelineScale);
  let firelineMoveSpeed = 2 * appHeight;
  Reflect.set(
    firelineConfig.behaviors[2].config,
    "min",
    firelineMoveSpeed * 0.95
  );
  Reflect.set(firelineConfig.behaviors[2].config, "max", firelineMoveSpeed);
  let fireLineEmitter = new Emitter(firelineContainer, firelineConfig);
  let firelineRemover = emitterStarter(fireLineEmitter);

  let posX = smokeEmitter.spawnPos.x;
  let posY = smokeEmitter.spawnPos.y;

  //原点向左移动, 移出屏幕后停止
  await new Promise<void>(resolve => {
    let underfirePlay = setInterval(async () => {
      if (posX <= -ininX) {
        clearInterval(underfirePlay);
        await smokeRemover();
        await fireRemover();
        await firelineRemover();
        resolve();
        return;
      }
      posX -= usePlayerStore().app.screen.width / 5;
      smokeEmitter.updateSpawnPos(posX, posY);
      fireEmitter.updateSpawnPos(posX, posY);
      fireLineEmitter.updateSpawnPos(posX, posY);
    }, 100);
  });

  return () => Promise.resolve();
};

export default handler;
