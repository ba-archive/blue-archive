---
outline: deep
---

# 标签 / Tag

> 标签用于标记和分类内容。

## 基础用法

<script setup lang="ts">
  import ETag from "@eden-design/components/ETag.vue"
  import ESpace from "@eden-design/components/ESpace.vue"
</script>

使用 `size` 属性来设置标签的尺寸。默认尺寸为 `medium`。

<ESpace align="end" padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <ETag brand fill size="mini">标签</ETag>
  <ETag brand fill size="small">标签</ETag>
  <ETag brand fill size="medium">标签</ETag>
  <ETag brand fill size="large">标签</ETag>
</ESpace>

:::details 查看代码

```vue
<template>
  <ESpace
    align="end"
    padding="10"
    size="small"
    class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]"
  >
    <ETag brand fill size="mini">标签</ETag>
    <ETag brand fill size="small">标签</ETag>
    <ETag brand fill size="medium">标签</ETag>
    <ETag brand fill size="large">标签</ETag>
  </ESpace>
</template>
```

:::

## 颜色风格

Tag 组件提供了 `brand`、`gray`、`striker`、`special`、`explosion`、`pierce`、`unarmed`、`vibrate` 八种颜色风格。

Tag 额外提供了一个特殊的 `selector` 预设样式，用于主页的学生和社团筛选。

<ESpace
align="end"
padding="10"
size="small"
class="rounded-md border-1 border-solid border-[var(--arona-blue-6)] bg-[var(--arona-blue-2)]">
<ESpace>
<ETag brand fill>标签</ETag>
<ETag gray fill>标签</ETag>
<ETag striker fill>标签</ETag>
<ETag special fill>标签</ETag>
<ETag explosion fill>标签</ETag>
<ETag pierce fill>标签</ETag>
<ETag unarmed fill>标签</ETag>
<ETag vibrate fill>标签</ETag>
</ESpace>
<ESpace>
<ETag selector clickable>点击筛选稀有度/社团/学校</ETag>
</ESpace>
</ESpace>

:::details 查看代码

```vue
<template>
  <ESpace
    align="end"
    padding="10"
    size="small"
    class="rounded-md border-1 border-solid border-[var(--arona-blue-6)] bg-[var(--arona-blue-2)]"
  >
    <ESpace>
      <ETag brand fill>标签</ETag>
      <ETag gray fill>标签</ETag>
      <ETag striker fill>标签</ETag>
      <ETag special fill>标签</ETag>
      <ETag explosion fill>标签</ETag>
      <ETag pierce fill>标签</ETag>
      <ETag unarmed fill>标签</ETag>
      <ETag vibrate fill>标签</ETag>
    </ESpace>
    <ESpace>
      <ETag selector clickable>点击筛选稀有度/社团/学校</ETag>
    </ESpace>
  </ESpace>
</template>
```

:::

## 边框和填充

使用 `bordered` 属性开启标签边框，`fill` 属性开启标签填充。

`fill` 属性只有在选择了颜色风格后才会生效。

<ESpace vertical align="start" padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <ESpace align="end">
    <ETag brand fill>标签</ETag>
    <ETag brand bordered>标签</ETag>
    <ETag brand fill bordered>标签</ETag>
  </ESpace>
</ESpace>

:::details 查看代码

```vue
<template>
  <ESpace
    vertical
    align="start"
    padding="10"
    size="small"
    class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]"
  >
    <ESpace align="end">
      <ETag brand fill>标签</ETag>
      <ETag brand bordered>标签</ETag>
      <ETag brand fill bordered>标签</ETag>
    </ESpace>
  </ESpace>
</template>
```

:::

## 点击和禁用

标签默认不会对点击事件作出响应，可以用 `clickable` 属性来开启。

当标签被 `disabled` 属性设置为禁用状态时，标签不会对点击事件作出响应。

<ESpace align="end" padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <ETag brand fill clickable>标签</ETag>
  <ETag brand fill clickable disabled>标签</ETag>
</ESpace>

:::details 查看代码

```vue
<template>
  <ESpace
    align="end"
    padding="10"
    size="small"
    class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]"
  >
    <ETag brand fill clickable>标签</ETag>
    <ETag brand fill clickable disabled>标签</ETag>
  </ESpace>
</template>
```

:::

## 文字样式

标签的文字样式可以通过 `textProps` 属性来设置。完整配置项请参考 [排版 / Typography](/components/general/typography)。

你也可以使用 `slot` 来插入任意自定义内容。

<ESpace align="end" padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <ETag brand fill :textProps="{ bold: true }">标签</ETag>
  <ETag brand fill :textProps="{ italic: true }">标签</ETag>
  <ETag brand fill :textProps="{ underline: true }">标签</ETag>
  <ETag brand fill :textProps="{ strikethrough: true }">标签</ETag>
</ESpace>

:::details 查看代码

```vue
<ESpace
  align="end"
  padding="10"
  size="small"
  class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]"
>
  <ETag brand fill :textProps="{ bold: true }">标签</ETag>
  <ETag brand fill :textProps="{ italic: true }">标签</ETag>
  <ETag brand fill :textProps="{ underline: true }">标签</ETag>
  <ETag brand fill :textProps="{ strikethrough: true }">标签</ETag>
</ESpace>
```

:::

## API

:::code-group

```ts [TagProps.ts]
import type { WithGradientBackground } from "~/packages/eden-design/components/types/WithGradientBackground";
import type { TextProps } from "~/packages/eden-design/components/types/EdenTextCore/TextProps";

export type TagProps = {
  active?: boolean;
  clickable?: boolean;
  disabled?: boolean;
  fill?: boolean;
  id?: string | number;
  size?: "mini" | "small" | "medium" | "large";
  bordered?: boolean;
  background?: WithGradientBackground;

  /* 文字样式 */
  textProps?: TextProps;

  /* 颜色快捷方式，以下所有快捷方式中只能使用一种 */
  default?: boolean; // 默认色 $text-5, transparent, $border-2
  brand?: boolean; // 品牌色 $arona-blue-6, $arona-blue-1, $arona-blue-6
  gray?: boolean; // 单色 $text-3, $fill-1, $border-2

  /* 特殊标签 */
  striker?: boolean; // 前排 $danger-6/$fill-base
  special?: boolean; // 特殊 $warning-6/$fill-base
  explosion?: boolean; // 爆发 $explosion-6/$fill-base
  pierce?: boolean; // 贯通 $pierce-6/$fill-base
  unarmed?: boolean; // 神秘 $unarmed-6/$fill-base
  vibrate?: boolean; // 振动 $vibrate-6/$fill-base

  /* 学生、社团选择器样式 */
  selector?: boolean;
};
```

```ts [WithGradientBackground.ts]
export type WithGradientBackground =
  | string
  | {
      from: string;
      to: string;
      deg?: number | string;
    };
```

```ts [TextProps.ts]
export type TextProps = {
  /* 文本属性 */
  align?: "left" | "center" | "right" | "justify";
  bold?: boolean;
  color?: WithGradientBackground;
  delete?: boolean;
  disabled?: boolean;
  inheritTextColor?: boolean;
  inline?: boolean;
  italic?: boolean;
  level?: 3 | 2 | 1 | "3" | "2" | "1";
  noSelect?: boolean;
  noWrap?: boolean;
  size?: number | string;
  strikethrough?: boolean;
  strong?: boolean;
  sub?: boolean;
  sup?: boolean;
  type?: "body" | "display" | "title";
  underline?: boolean;

  /* 颜色快捷方式 */
  brand?: boolean; // 品牌色 --arona-blue-6
  danger?: boolean; // 危险色 --danger-6
  error?: boolean; // 错误色 --danger-6
  secondary?: boolean; // 次要色 --color-text-3
  success?: boolean; // 成功色 --success-6
  tertiary?: boolean; // 三级色 --color-text-2
  warning?: boolean; // 警告色 --warning-6
};
```

:::
