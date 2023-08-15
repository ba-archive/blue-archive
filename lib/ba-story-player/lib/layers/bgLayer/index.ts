/**
 * 初始化背景层, 订阅player的剧情信息.
 */
import eventBus from "@/eventBus";
import { checkloadAssetAlias } from "@/index";
import { usePlayerStore } from "@/stores";
import { Application, Sprite } from "pixi.js";
import gsap from "gsap";
import { BgLayer } from "@/types/bgLayer";

export function bgInit() {
  return BgLayerInstance.init();
}

const BgLayerInstance: BgLayer = {
  /**
   * 注册/销毁实例
   */
  init() {
    this.initEvent();
  },
  dispose() {
    this.disposeEvent();
  },

  /**
   * 注册/销毁事件监听
   */
  initEvent() {
    this.handleShowBg = this.handleShowBg.bind(this);

    eventBus.on("showBg", this.handleShowBg);
    eventBus.on("resize", this.handleResize);
  },
  disposeEvent() {
    eventBus.off("showBg", this.handleShowBg);
  },

  /**
   * 事件监听处理函数
   */
  handleShowBg({ url, overlap }) {
    const {
      app: { loader },
    } = usePlayerStore();
    const resource = checkloadAssetAlias(url, url);
    new Promise<void>(resolve => {
      if (resource) {
        resolve();
      } else {
        loader.add(url).load(() => resolve());
      }
    }).then(() => {
      const instance = this.getBgSpriteFromResource(url);
      if (instance) {
        if (overlap) {
          this.loadBgOverlap(instance, overlap);
        } else {
          this.loadBg(instance);
        }
      }
    });
  },

  handleResize() {
    const { bgInstance, app } = usePlayerStore();
    if (bgInstance) {
      const { x, y, scale } = calcBackgroundImageSize(bgInstance, app);
      bgInstance.position.set(x, y);
      bgInstance.scale.set(scale);
    }
  },

  /**
   * 方法
   */
  getBgSpriteFromResource(name: string) {
    const { app } = usePlayerStore();
    let sprite: Sprite | null = null;
    const asset = app.loader.resources[name];
    if (!asset) {
      console.error(`can't find resource: ${name}`);
      return;
    }
    sprite = new Sprite(asset.texture);
    const { x, y, scale } = calcBackgroundImageSize(sprite, app);
    sprite.position.set(x, y);
    sprite.scale.set(scale);
    return sprite;
  },
  loadBg(instance: Sprite) {
    const { app, bgInstance: oldInstance, setBgInstance } = usePlayerStore();

    instance.zIndex = -100; // 背景层应该在特效, 人物层之下
    app.stage.addChild(instance);
    setBgInstance(instance);

    oldInstance && app.stage.removeChild(oldInstance);
  },
  async loadBgOverlap(instance: Sprite, overlap: number) {
    const { app, bgInstance: oldInstance, setBgInstance } = usePlayerStore();
    const tl = gsap.timeline();
    instance.zIndex = -99;

    app.stage.addChild(instance);
    setBgInstance(instance);

    await tl.fromTo(
      instance,
      { alpha: 0 },
      { alpha: 1, duration: overlap / 1000 }
    );
    eventBus.emit("bgOverLapDone");

    oldInstance && app.stage.removeChild(oldInstance);
  },
};

const StandardWith = 1902;
const StandardWithPadding = 64;
/**
 * 计算图片 cover 样式尺寸 - utils
 */
export function calcBackgroundImageSize(background: Sprite, app: Application) {
  // 计算规则
  // 1.优先满足纵向宽度
  // 2.带上padding, 大小为1920px: 64px
  // **不能用stage的height和width** 他们可以超出视口
  const viewportWidth = app.screen.width;
  const viewportHeight = app.screen.height;
  const rawWidth = background.width / background.scale.x;
  const rawHeight = background.height / background.scale.y;
  const padding = (rawWidth / StandardWith) * StandardWithPadding;
  const finalWidth = viewportWidth + padding * 2;
  const scale = finalWidth / rawWidth;
  const finalHeight = rawHeight * scale;
  const x = -((finalWidth - viewportWidth) / 2);
  const y = -((finalHeight - viewportHeight) / 2);

  return { x, y, scale };
}
