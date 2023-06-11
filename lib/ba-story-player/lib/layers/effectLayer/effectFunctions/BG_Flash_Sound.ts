import eventBus from "@/eventBus";
import { usePlayerStore } from "@/stores";
import { AnimatedSprite, Sprite } from "pixi.js";
import { gsap } from "gsap";
import { loadSpriteSheet } from "../resourcesUtils";
import { AdvancedBloomFilter } from "@pixi/filter-advanced-bloom";

export default async function flash_sound(resources: Sprite[]) {
  const animationName = "lightning";
  const lightningLineSpriteSheet = await loadSpriteSheet(
    resources[0],
    { x: 1, y: 4 },
    animationName
  );
  const lightningAnimation = new AnimatedSprite(
    lightningLineSpriteSheet.animations[animationName]
  );
  lightningAnimation.animationSpeed = 0.3;

  const app = usePlayerStore().app;
  const scale = app.screen.width / lightningAnimation.width;
  const scaleYSmall = scale * 0.2;
  const scaleYLarge = scale * 0.4;
  lightningAnimation.scale.set(scale, scaleYSmall);
  lightningAnimation.x = app.screen.width;
  lightningAnimation.y = (app.screen.height * 5) / 12;
  lightningAnimation.anchor.set(0, 0.5);
  const bloomFilter = new AdvancedBloomFilter({ brightness: 1, blur: 4 });
  lightningAnimation.filters = [bloomFilter];
  app.stage.addChild(lightningAnimation);

  eventBus.emit("playBgEffectSound", "BG_Flash_Sound");
  const tl = gsap.timeline();
  await tl
    .to(lightningAnimation, {
      pixi: { x: 0, scaleY: scaleYLarge },
      duration: 7 / 60,
    })
    .to(lightningAnimation, {
      onStart: () => {
        lightningAnimation.visible = false;
      },
      duration: 9 / 60,
    })
    .to(lightningAnimation, {
      onStart: () => {
        lightningAnimation.visible = true;
        lightningAnimation.play();
      },
      pixi: { scaleY: scaleYSmall },
      duration: 41 / 60,
    });

  lightningAnimation.destroy();

  return async () => {};
}
