import { Application, Sprite } from "pixi.js";
import { HandlerMap, Layer, CheckMethod, Animation } from "../../type";
import { gsap } from "gsap";
import { ZINDEXBASE, timelineToPauseAble } from "../../utils";

export class BgLayer extends Layer {
  currentBgUrl = "";
  animations: { bgOverlap: typeof loadBgOverlapAnimation } = {
    bgOverlap: loadBgOverlapAnimation,
  };
  instances: { bgInstance?: Sprite } = {};
  constructor(app: Application, handlerMap: HandlerMap) {
    super(app, handlerMap);
    handlerMap.getBgInstance = () => this.instances.bgInstance;
    this.addCheckMethod(loadBg);
  }
  async resize(app: Application) {
    if (this.instances.bgInstance) {
      initBg(this.instances.bgInstance, app);
    }
  }
}

const StandardWith = 1902;
const StandardWithPadding = 64;
/**
 * 计算图片 cover 样式尺寸并初始化
 */
export function initBg(background: Sprite, app: Application) {
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

  background.position.set(x, y);
  background.scale.set(scale);
  background.zIndex = ZINDEXBASE.bg;
  app.stage.addChild(background);
}

const loadBg: CheckMethod<BgLayer> = async function (node, app, handlerMap) {
  if (node.bg) {
    if (node.bg.url !== this.currentBgUrl) {
      const newBg = handlerMap.getResources<"img">("img", node.bg.url);
      if (!newBg) {
        throw new Error("获取bg资源失败");
      } else {
        if (node.bg.overlap) {
          newBg.alpha = 0;
          initBg(newBg, app);
          const bgOverlap = this.animations.bgOverlap;
          bgOverlap.args = { instance: newBg, overlap: node.bg.overlap };
          await this.animations.bgOverlap.animate();
          if (this.instances.bgInstance) {
            app.stage.removeChild(this.instances.bgInstance);
          }
        } else {
          initBg(newBg, app);
        }
        this.instances.bgInstance = newBg;
      }
    }
  }
};

const loadBgOverlapAnimation: Animation<{ instance: Sprite; overlap: number }> =
  {
    args: { instance: new Sprite(), overlap: 0 },
    runningAnimation: [],
    async animate() {
      const tl = gsap.timeline();
      this.args.instance.zIndex = ZINDEXBASE.bg + 1;
      this.runningAnimation.push(timelineToPauseAble(tl));

      await tl.fromTo(
        this.args.instance,
        { alpha: 0 },
        { alpha: 1, duration: this.args.overlap / 1000 }
      );
    },
    async final() {
      for (const animation of this.runningAnimation) {
        animation.pause();
      }
      this.args.instance.alpha = 1;
    },
  };
