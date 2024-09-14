---
outline: deep
---

# 按钮 / Button

> 按钮用于触发一个操作。

<script setup lang="ts">
  import EButton from "@eden-design/components/EButton.vue"
  import ESpace from "@eden-design/components/ESpace.vue"
</script>

## 基本用法

如果它长得像按钮，点击起来像按钮，那它就是按钮。

<ESpace vertical padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <ESpace align="end">
    <EButton size="mini">主要按钮</EButton>
    <EButton size="small">主要按钮</EButton>
    <EButton size="medium">主要按钮</EButton>
    <EButton size="large">主要按钮</EButton>
  </ESpace>
  <ESpace align="end">
    <EButton size="mini" secondary>次要按钮</EButton>
    <EButton size="small" secondary>次要按钮</EButton>
    <EButton size="medium" secondary>次要按钮</EButton>
    <EButton size="large" secondary>次要按钮</EButton>
  </ESpace>
</ESpace>

:::details 查看代码

```vue
<template>
  <ESpace
    vertical
    padding="10"
    size="small"
    class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]"
  >
    <ESpace align="end">
      <EButton size="mini">主要按钮</EButton>
      <EButton size="small">主要按钮</EButton>
      <EButton size="medium">主要按钮</EButton>
      <EButton size="large">主要按钮</EButton>
    </ESpace>
    <ESpace align="end">
      <EButton size="mini" secondary>次要按钮</EButton>
      <EButton size="small" secondary>次要按钮</EButton>
      <EButton size="medium" secondary>次要按钮</EButton>
      <EButton size="large" secondary>次要按钮</EButton>
    </ESpace>
  </ESpace>
</template>
```

:::

## 边框

可以使用 `bordered` 属性来设置按钮的边框。

<ESpace vertical padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <ESpace align="end">
    <EButton bordered>按钮</EButton>
  </ESpace>
</ESpace>

:::details 查看代码

```vue
<template>
  <ESpace
    vertical
    padding="10"
    size="small"
    class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]"
  >
    <ESpace align="end">
      <EButton bordered>按钮</EButton>
    </ESpace>
  </ESpace>
</template>
```

:::

## 预设颜色

按钮预设了 `brand`、`danger`、`success`、`warning`、`momotalk` 五种颜色样式。

<ESpace vertical padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)] bg-[var(--arona-blue-1)]">
  <ESpace align="end">
    <EButton brand>品牌色</EButton>
    <EButton danger>危险色</EButton>
    <EButton success>成功色</EButton>
    <EButton warning>警告色</EButton>
    <EButton momotalk>momotalk</EButton>
  </ESpace>
  <ESpace align="end">
    <EButton secondary brand>品牌色</EButton>
    <EButton secondary danger>危险色</EButton>
    <EButton secondary success>成功色</EButton>
    <EButton secondary warning>警告色</EButton>
    <EButton secondary momotalk>momotalk</EButton>
  </ESpace>
</ESpace>

:::details 查看代码

```vue
<template>
  <ESpace
    vertical
    padding="10"
    size="small"
    class="rounded-md border-1 border-solid border-[var(--arona-blue-6)] bg-[var(--arona-blue-1)]"
  >
    <ESpace align="end">
      <EButton brand>品牌色</EButton>
      <EButton danger>危险色</EButton>
      <EButton success>成功色</EButton>
      <EButton warning>警告色</EButton>
      <EButton momotalk>momotalk</EButton>
    </ESpace>
    <ESpace align="end">
      <EButton secondary brand>品牌色</EButton>
      <EButton secondary danger>危险色</EButton>
      <EButton secondary success>成功色</EButton>
      <EButton secondary warning>警告色</EButton>
      <EButton secondary momotalk>momotalk</EButton>
    </ESpace>
  </ESpace>
</template>
```

:::

## 禁用状态

可以使用 `disabled` 属性来设置按钮的禁用状态。

<ESpace vertical padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <ESpace align="end">
    <EButton disabled>我被沉默了</EButton>
  </ESpace>
</ESpace>

:::details 查看代码

```vue
<template>
  <ESpace
    vertical
    padding="10"
    size="small"
    class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]"
  >
    <ESpace align="end">
      <EButton disabled>我被沉默了</EButton>
    </ESpace>
  </ESpace>
</template>
```

:::

## 自定义颜色

可以使用 `background` 属性来设置按钮的背景颜色，用 `textProps.color` 来设置按钮的文字颜色。`background` 支持设置线性渐变，语法为 `{ from: string, to: string, deg: number | string }`。

按钮的文字样式可以通过 `textProps` 属性来设置。完整配置项请参考 [排版 / Typography](/components/general/typography)。

<ESpace vertical padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <ESpace align="end">
    <EButton background="#B3F6EC" :textProps="{ color: '#00888F', bold: true }">
      世界で一番お姫様
    </EButton>
    <EButton :background="{ from: '#39C5BB', to: '#00888F', deg: 135 }" :textProps="{ color: { from: '#56D1C4', to: '#BFF3E9', deg: 135 }, bold: true }">
      世界で一番お姫様
    </EButton>
  </ESpace>
</ESpace>

:::details 查看代码

```vue
<template>
  <ESpace
    vertical
    padding="10"
    size="small"
    class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]"
  >
    <ESpace align="end">
      <EButton
        background="#B3F6EC"
        :textProps="{ color: '#00888F', bold: true }"
      >
        世界で一番お姫様
      </EButton>
      <EButton
        :background="{ from: '#39C5BB', to: '#00888F', deg: 135 }"
        :textProps="{
          color: { from: '#56D1C4', to: '#BFF3E9', deg: 135 },
          bold: true,
        }"
      >
        世界で一番お姫様
      </EButton>
    </ESpace>
  </ESpace>
</template>
```

:::

## 长按钮

可以使用 `wide` 属性来让按钮占满宽度。

<ESpace vertical padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
    <EButton wide>我膨胀了</EButton>
</ESpace>

:::details 查看代码

```vue
<template>
  <ESpace
    vertical
    padding="10"
    size="small"
    class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]"
  >
    <EButton wide>我膨胀了</EButton>
  </ESpace>
</template>
```

:::

## API

:::code-group

```ts [ButtonProps.ts]
import type { WithGradientBackground } from "~/packages/eden-design/components/types/WithGradientBackground";
import type { TextProps } from "~/packages/eden-design/components/types/EdenTextCore/TextProps";

export type ButtonProps = {
  active?: boolean;
  disabled?: boolean;
  size?: "mini" | "small" | "medium" | "large";
  background?: WithGradientBackground;
  bordered?: boolean;
  wide?: boolean;

  /* 按钮类型 */
  primary?: boolean;
  secondary?: boolean;

  /* 颜色快捷方式 */
  brand?: boolean; // 品牌色 $arona-blue-6/text-1
  default?: boolean; // =brand
  danger?: boolean; // 危险色 $danger-6, $danger-1, $danger-6
  success?: boolean; // 成功色 $success-6, $success-1, $success-6
  warning?: boolean; // 警告色 $warning-6, $warning-1, $warning-6
  momotalk?: boolean; // 特殊样式momotalk

  /* 字体样式 */
  textProps?: TextProps;
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
