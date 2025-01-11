# 剧情播放器组件仓库

本仓库是剧情播放器组件仓库, 用于播放碧蓝档案游戏剧情.

在进入全屏后, 如果宽高比小于 16/9, 则维持宽高比, 若大于, 则锁定为 16/9.
全屏时会自动检测是否横屏并自动旋转.

# 使用

```html
<script setup>
  import storyPlayer from "ba-story-player";
  import "ba-story-player/dist/style.css";
</script>
```

# props

## story

type: `StoryRawUnit[]`

剧情原始数据数组.

## dataUrl

type: `string`

资源服务器地址, 用于获取立绘语音等游戏资源. 各资源的具体路径请参照`lib/utils.ts`中的`getResourcesUrl`.

## width

type: `number`

播放器宽度, 单位是 px, 可变.

## height

播放器高度, 单位是 px, 可变. 注意请不要设置偏离 16/9 太多的宽高比, 可能导致播放器表现变差.

## storySummary

type:

```ts
export interface StorySummary {
  /**
   * 章节名
   */
  chapterName: string;
  /**
   * 简介
   */
  summary: string;
}
```

## language

type: `'Cn'|'Jp'|'En'|'Tw'`

语言选项

## startFullScreen

type: `boolean`

是否立即全屏, 用于移动端.

## useMp3

type: `boolean`

使用 mp3 代替 ogg 格式音频, 用于解决 safari 浏览器的音频解码问题.

## useSuperSampling

type: `'' | '2' | '4' | boolean`

是否使用超分素材。请注意目前 '4' 配置项无效果，仅支持 2 倍超分。

当设置为 `true` 时，使用 2 倍超分。

# event

## end

播放结束时发送

## error

发生错误时发送(播放错误或资源加载错误)

# 贡献说明

请参照[贡献指南](./docs/contribute.md)
