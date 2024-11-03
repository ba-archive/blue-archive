import { usePlayerStore } from "@/stores";
import {
  Container,
  Point,
  SimpleRope,
  type Application,
  type Sprite,
} from "pixi.js";
import { emitterContainer } from "../emitterUtils";
import { ColorOverlayFilter } from "@pixi/filter-color-overlay";
import { AdvancedBloomFilter } from "@pixi/filter-advanced-bloom";

function firework_constructor(
  app: Application,
  res: Sprite,
  startx: number,
  starty: number
) {
  // 实现原理是使用rope绘制每一条烟花线
  // main线是存在时间较长的，other线是存在时间较短的
  // main线一共6条，other线60条，间距6度
  const main_points: Point[][] = [];
  const other_points: Point[][] = [];
  const main_ropes: SimpleRope[] = [];
  const other_ropes: SimpleRope[] = [];
  const sp = res.texture;
  // 包裹main和other的container
  const mr_container = new Container();
  const or_container = new Container();
  const main_angles = [
    Math.PI / 9,
    Math.PI / 3,
    (Math.PI * 2) / 3,
    Math.PI,
    (Math.PI * 25) / 18,
    -Math.PI / 6,
  ];
  let inter = 0;
  const other_angles = new Array(60).fill(0).map(() => {
    inter += 6;
    return (Math.PI * inter) / 180;
  });
  // 为main和other随机开始和消失的时间
  const random_start_o: number[] = [];
  const random_start_m: number[] = [];
  const random_fade_o: number[] = [];
  const random_fade_m: number[] = [];
  main_angles.forEach(item => {
    const points = [];
    for (let i = 0; i < 30; i++) {
      points.push(new Point(startx, starty));
    }
    main_points.push(points);
    main_ropes.push(new SimpleRope(sp, points));
    random_start_m.push(Math.random() * 0.3);
    random_fade_m.push(Math.random() + 4);
  });
  other_angles.forEach(() => {
    const points = [];
    for (let i = 0; i < Math.round(Math.random() * 5 + 20); i++) {
      points.push(new Point(startx, starty));
    }
    other_points.push(points);
    other_ropes.push(new SimpleRope(sp, points, 0));
    random_start_o.push(Math.random() * 0.5);
    random_fade_o.push(Math.random() + 2);
  });
  mr_container.addChild(...main_ropes);
  or_container.addChild(...other_ropes);
  emitterContainer.addChild(mr_container, or_container);
  // 给texture着色并设置发光效果
  emitterContainer.filters = [new ColorOverlayFilter(0xff0a00)];
  or_container.filters = [
    new AdvancedBloomFilter({
      blur: 1,
    }),
  ];
  mr_container.filters = [new AdvancedBloomFilter()];

  // main rope的迭代函数，原理是抛物线，count用于计数，控制点依次动
  // x += vx0, y += vy0 + at -a/2, t为从开始运动到现在的时间
  const mr_step = (time: number, count: number) => {
    main_points.forEach((item, index) => {
      main_points[index].map((p, i) => {
        if (time <= random_start_m[index]) return;
        if (time >= random_fade_m[index]) {
          main_ropes[index].alpha =
            1 - (1 / random_fade_m[index]) * (time - random_fade_m[index]);
        }
        if (time >= 4.5) {
          mr_container.filters = [
            new AdvancedBloomFilter({
              bloomScale: 1 - (1 / 4.5) * (time - 4.5),
            }),
          ];
        }
        if (i <= count) {
          p.x += 2 * Math.cos(main_angles[index]);
          p.y +=
            2 * Math.sin(main_angles[index]) + (time - i * 0.1) * 0.25 - 0.125;
        }
      });
    });
  };
  // other rope的迭代函数，原理同上，加入了对角度的判断，向上发射的线增加了
  // y轴上速度的补偿，避免顶部太快塌陷
  const or_step = (time: number, count: number) => {
    other_points.map((item, index) => {
      other_points[index].map((p, i) => {
        if (time <= random_start_o[index]) return;
        if (time >= random_fade_o[index]) {
          other_ropes[index].alpha =
            1 - (1 / random_fade_o[index]) * (time - random_fade_o[index]);
        }
        if (time >= 2.5) {
          or_container.filters = [
            new AdvancedBloomFilter({
              bloomScale: 1 - (1 / 2.5) * (time - 2.5),
            }),
          ];
        }
        if (i <= count) {
          p.x += 2 * Math.cos(other_angles[index]);
          if (other_angles[index] > Math.PI && time < 3) {
            p.y += 2 * Math.sin(other_angles[index]) * 0.05;
          }
          p.y +=
            2 * Math.sin(other_angles[index]) + (time - i * 0.1) * 0.25 - 0.125;
        }
      });
    });
  };
  let time = 0;
  let count = 0;
  const update = () => {
    time += 0.1;
    if (time <= 6) {
      mr_step(time, count);
      or_step(time, count);
    } else if (time <= 11) {
      mr_step(time, count);
    } else {
      remover();
    }
    count++;
  };
  app.ticker.add(update);
  const remover = () => {
    app.ticker.remove(update);
    emitterContainer.removeChild(or_container);
    emitterContainer.removeChild(mr_container);
  };
  return remover;
}

export default async function BG_Fireworks_L_BGOff_02(resources: Sprite[]) {
  const { app } = usePlayerStore();
  const appWidth = app.view.width;
  const appHeight = app.view.height;
  app.stage.addChild(emitterContainer);
  const callbacks: (() => void)[] = [];
  // 修改此处的x,y改变烟花的位置
  const timer = setInterval(() => {
    const x = Math.floor(Math.random() * (appWidth - 100) + 100);
    const y = Math.floor((Math.random() * appHeight) / 2 + 100);
    callbacks.push(firework_constructor(app, resources[0], x, y));
  }, Math.random() + 800);
  return async () => {
    clearInterval(timer);
    callbacks.forEach(item => item());
  };
}
