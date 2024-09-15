---
outline: deep
---

# 头像 / Avatar

> 展示头像。

## 基本用法

<script setup lang="ts">
  import EAvatar from '@eden-design/components/EAvatar.vue'
  import ESpace from '@eden-design/components/ESpace.vue'
  import EText from '@eden-design/components/typography/EText.vue'
  import EImage from "@eden-design/components/EImage.vue"
  import EDivider from "@eden-design/components/EDivider.vue"
</script>

指定头像 `src`，或者如果你喜欢全手动，也可以自己塞东西。

<ESpace align="end" padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <EAvatar src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg" />
  <EAvatar background="color-fill-3">
    <EText color="#fff" level="3">Eden</EText>
  </EAvatar>
</ESpace>

:::details 查看代码

```vue
<template>
  <EAvatar src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg" />
  <EAvatar background="color-fill-3">
    <EText color="#fff" level="3">Eden</EText>
  </EAvatar>
</template>
```

:::

## 头像尺寸

Avatar 组件有 `mini`，`small`，`medium`，`large`和`xlarge` 五种预设尺寸。

可以通过给 `size` 属性传入 `number` 或 `string` 来设置自定义尺寸。数值支持 `px`、`rem`、`em`、`%` 等单位。

<ESpace wrap align="end" padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <EAvatar size="mini" src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg" />
  <EAvatar size="small" src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg" />
  <EAvatar size="medium" src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg" />
  <EAvatar size="large" src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg" />
  <EAvatar size="xlarge" src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg" />
  <EAvatar size="56px" src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg" />
  <EAvatar size="48" src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg" />
  <EAvatar :size="32" src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg" />
  <EAvatar size="1.5rem" src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg" />
</ESpace>

:::details 查看代码

```vue
<template>
  <EAvatar
    size="mini"
    src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg"
  />
  <EAvatar
    size="small"
    src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg"
  />
  <EAvatar
    size="medium"
    src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg"
  />
  <EAvatar
    size="large"
    src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg"
  />
  <EAvatar
    size="xlarge"
    src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg"
  />
  <EAvatar
    size="56px"
    src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg"
  />
  <EAvatar size="48" src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg" />
  <EAvatar :size="32" src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg" />
  <EAvatar
    size="1.5rem"
    src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg"
  />
</template>
```

:::

## 方形头像

通过 `squared` 属性可以设置方形头像。

<ESpace padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <EAvatar squared src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg" />
</ESpace>

:::details 查看代码

```vue
<template>
  <EAvatar squared src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg" />
</template>
```

:::

## 背景颜色

通过 `background` 属性可以设置头像的背景颜色。`background` 支持设置线性渐变，语法为 `{ from: string, to: string, deg?: number | string }`。

<ESpace padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <EAvatar background="danger-6">
    <EText color="#fff">R</EText>
  </EAvatar>
  <EAvatar background="success-6">
    <EText color="#fff">G</EText>
  </EAvatar>
  <EAvatar background="arona-blue-6">
    <EText color="#fff">B</EText>
  </EAvatar>
  <EAvatar :background="{
    from: 'var(--danger-6)',
    to: 'var(--arona-blue-6)',
    deg: 135
  }">
    <EText color="#fff" level="3">炫彩</EText>
  </EAvatar>
</ESpace>

:::details 查看代码

```vue
<template>
  <EAvatar background="danger-6">
    <EText color="#fff">R</EText>
  </EAvatar>
  <EAvatar background="success-6">
    <EText color="#fff">G</EText>
  </EAvatar>
  <EAvatar background="arona-blue-6">
    <EText color="#fff">B</EText>
  </EAvatar>
  <EAvatar
    :background="{
      from: 'var(--danger-6)',
      to: 'var(--arona-blue-6)',
      deg: 135,
    }"
  >
    <EText color="#fff" level="3">炫彩</EText>
  </EAvatar>
</template>
```

:::

## 边框

通过 `bordered` 属性可以显示边框。

`borderColor` 和 `borderWidth` 属性可以设置边框的颜色和宽度。

<ESpace padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <EAvatar bordered size="large">
    <EText level="3" secondary>默认</EText>
  </EAvatar>
  <EAvatar bordered borderColor="success-6" borderWidth="2" size="large">
    <EText level="3" secondary>自定义</EText>
  </EAvatar>
</ESpace>

:::details 查看代码

```vue
<template>
  <EAvatar bordered size="large">
    <EText level="3" secondary>默认</EText>
  </EAvatar>
  <EAvatar bordered borderColor="success-6" borderWidth="2" size="large">
    <EText level="3" secondary>自定义</EText>
  </EAvatar>
</template>
```

:::

## 错误回滚

通过 `fallbackSrc` 属性可以设置加载错误时的回滚图片。

<ESpace padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <EAvatar src="https://example.com/image.jpg" fallbackSrc="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg" />
</ESpace>

:::details 查看代码

```vue
<template>
  <EAvatar
    src="https://example.com/image.jpg"
    fallbackSrc="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg"
  />
</template>
```

:::

## 插槽

### `default`

使用默认插槽显示内容。

<ESpace padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <EAvatar size="large" background="color-fill-3">
    <EText color="#fff" level="3">Eden</EText>
  </EAvatar>
  <EAvatar size="large" background="color-fill-3">
    <EImage src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg" width="56" height="56" />
  </EAvatar>
</ESpace>

:::details 查看代码

```vue
<template>
  <EAvatar size="large" background="color-fill-3">
    <EText color="#fff" level="3">Eden</EText>
  </EAvatar>
  <EAvatar size="large" background="color-fill-3">
    <EImage
      src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg"
      width="56"
      height="56"
    />
  </EAvatar>
</template>
```

:::

## API

::: code-group

```ts [AvatarProps.ts]
import type { WithGradientBackground } from "~/packages/eden-design/components/types/WithGradientBackground";

export type AvatarProps = {
  /* 头像属性 */
  alt?: string;
  background?: WithGradientBackground;
  bordered?: boolean;
  borderColor?: string;
  borderWidth?: number | string;
  squared?: boolean;
  size?:
    | number
    | string
    | "mini"
    | "small"
    | "medium"
    | "large"
    | "xlarge"
    | "auto";
  src?: string;
  fallbackSrc?: string;
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

:::
