import { usePlayerStore } from "@/stores";
import { AnimatedSprite, Container, Sprite } from "pixi.js";

export default async function BG_Cherryblossom_Fly_Sound(resources: Sprite[]) {
  const { app } = usePlayerStore();
  const sakuraContainer = new Container();
  app.stage.addChild(sakuraContainer);

  const textures = resources.map(sprite => sprite.texture);
  const maxParticles = 15;
  const initialParticles = 10;
  let activeParticles = 0;
  // 创建逐帧动画
  const createSakuraAnimation = (x: number, y: number) => {
    const sakuraAnimation = new AnimatedSprite(textures);
    sakuraAnimation.animationSpeed = 0.175;
    sakuraAnimation.loop = true;
    sakuraAnimation.anchor.set(0.5);
    // 粒子大小
    const randomScale = 0.6 + (Math.random() * 0.3 - 0.1);
    sakuraAnimation.scale.set(randomScale);
    sakuraAnimation.position.set(x, y);
    sakuraContainer.addChild(sakuraAnimation);
    sakuraAnimation.play();
    activeParticles++;
    // 下落速度
    const fallSpeedX = Math.random() * 3 + 3.25;
    const fallSpeedY = Math.random() * 2 + 1.25;
    const animation = (delta: number) => {
      sakuraAnimation.x -= fallSpeedX * delta;
      sakuraAnimation.y += fallSpeedY * delta;
      // 移除超出屏幕的动画
      if (sakuraAnimation.x < 0 || sakuraAnimation.y > app.view.height) {
        sakuraContainer.removeChild(sakuraAnimation);
        sakuraAnimation.destroy();
        app.ticker.remove(animation);
        activeParticles--;
      }
    };
    app.ticker.add(animation);
  };
  // 初始化粒子
  for (let i = 0; i < initialParticles; i++) {
    createSakuraAnimation(Math.random() * app.view.width, Math.random() * app.view.height);
  }
  // 动态创建粒子
  const createParticleInterval = setInterval(() => {
    if (activeParticles < maxParticles) {
      const randomX = Math.random() < 0.5 ? app.view.width : Math.random() * app.view.width;
      const randomY = randomX === app.view.width ? Math.random() * (app.view.height / 5) : 0;
      createSakuraAnimation(randomX, randomY);
    }
  }, Math.random() * 250 + 250);
  return () => {
    clearInterval(createParticleInterval);
    sakuraContainer.destroy();
  };
}
