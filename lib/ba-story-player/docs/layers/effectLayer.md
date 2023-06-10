本层中需要协力完成的部分是`BGEffect`

本层提供一个简易的可视化工具方便开发.

# 基本流程

1. 在[bgEffect 特效表](https://docs.qq.com/sheet/DQ1pFSmdHbFRNd3Fu?tab=BB08J2)找到未完成的特效并在实现者中填入自己的 github id.
2. 根据[图像资源获取](#图片资源获取)获取图像资源
3. (可选) 中`@/types/effectLayer.ts`的`BGEffectHandlerOptions`中填入参数定义, 例子:

```js
let BGEffectHandlerOptions = {
  BG_Test: {
    testOptions1: number,
  },
};
```

4. 在`@/layers/effectLayer/effectFunctions/`文件夹中添加自己的实现并设置为默认导出, 需要命名为实现的特效名, 例子:

```js
//BG_test.ts
import { usePlayerStore } from "@/stores"
import { BGEffectHandlerFunction } from "@/types/effectLayer"
import { Emitter, EmitterConfigV2, upgradeConfig } from "@pixi/particle-emitter"
import { emitterConfigs, emitterContainer, emitterStarter } from "../emitterUtils"

const handler: BGEffectHandlerFunction<'BG_Test'> = async function (resources, setting, options) {
  ...
  return removeFunction
}

export default handler
//请符合BGEffectHandlerFunction规范
//注意需要返回一个特效移除函数
```

5. 功能测试无异常后在[bgEffect 特效表](https://docs.qq.com/sheet/DQ1pFSmdHbFRNd3Fu?tab=BB08J2)中自己 github id 后加入`(已完成)`

# 特效文档完善

[bgEffect 特效表](https://docs.qq.com/sheet/DQ1pFSmdHbFRNd3Fu?tab=BB08J2)中可能没有效果示例位置, 可按如下方法获取并填入完善:

1. 在[BGEffect table](https://github.com/aizawey479/ba-data/blob/jp/Excel/ScenarioBGEffectExcelTable.json)中搜索得到当前 effect 的 id(也可在可视化工具中获取)
2. 在[主线剧情](https://github.com/aizawey479/ba-data/blob/jp/Excel/ScenarioScriptMain2ExcelTable.json)中搜索得到 effect 出现位置(地址 main 后数字可替换)
3. 在[威威的视频](https://www.bilibili.com/list/7045822?sid=1061322&desc=1&oid=765681436&bvid=BV1Zr4y1v7ZT)中找到找到对应出现位置, 复制视频详细位置信息填入表中

# 图片资源获取

请在[特效资源后端资源地址](https://yuuka.diyigemt.com/files/ba-all-data/effectTexture/)(账号密码群中自行获取)中根据特效名寻找素材. 如找不到或原素材使用困难请自行上网寻找素材.

找到后请填入`@/stores/index.ts`中的`bgEffectImgTable`, 例子:

```js
let bgEffectImgTable: BGEffectImgTable = {
  "BG_ScrollT_0.5": ["img1.png", "img2.png"],
};
```

# utils

## emitter

提供常量

- emitterContainr 放置 emitter 的 container

提供函数

- emitterStarter 开启 emitter 并返回终止函数

设置路径

请将 emitter 设置的 json 放入`@/layers/effectLayer/emitterConfigs/`, 然后使用`emitterConfigs(filename)`获取 config.

## resources

提供函数

- sprite2TransParent 将黑色背景转为透明
- loadSpriteSheet 自动分割图片并生成 spritesheet
