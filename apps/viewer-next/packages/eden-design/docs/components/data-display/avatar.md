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
</script>

指定头像 `src`，或者如果你喜欢全手动，也可以自己塞东西。

默认尺寸是 `medium`。

可以用 `squared` 属性控制是否为方形。

<ESpace align="end" padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <EAvatar size="mini" src="https://s2.loli.net/2024/09/07/gvVuD6aqFNroPLe.jpg" />
  <EAvatar size="small">
  <img src="https://s2.loli.net/2024/09/07/gvVuD6aqFNroPLe.jpg" />
  </EAvatar>
  <EAvatar size="medium" src="https://s2.loli.net/2024/09/07/gvVuD6aqFNroPLe.jpg" />
  <EAvatar size="large" src="https://s2.loli.net/2024/09/07/gvVuD6aqFNroPLe.jpg" />
  <EAvatar size="xlarge" background="color-fill-3">
    <EText color="#fff" level="3">Eden Design</EText>
  </EAvatar>
  <EAvatar size="xlarge" background="color-fill-3" squared>
    <EText color="#fff" level="3">我是方形</EText>
  </EAvatar>
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
    <EAvatar
      size="mini"
      src="https://s2.loli.net/2024/09/07/gvVuD6aqFNroPLe.jpg"
    />
    <EAvatar size="small">
      <img src="https://s2.loli.net/2024/09/07/gvVuD6aqFNroPLe.jpg" />
    </EAvatar>
    <EAvatar
      size="medium"
      src="https://s2.loli.net/2024/09/07/gvVuD6aqFNroPLe.jpg"
    />
    <EAvatar
      size="large"
      src="https://s2.loli.net/2024/09/07/gvVuD6aqFNroPLe.jpg"
    />
    <EAvatar size="xlarge" background="color-fill-3">
      <EText color="#fff" level="3">Eden Design</EText>
    </EAvatar>
    <EAvatar size="xlarge" background="color-fill-3" squared>
      <EText color="#fff" level="3">我是方形</EText>
    </EAvatar>
  </ESpace>
</template>
```

:::

## 背景颜色

通过 `background` 属性可以设置头像的背景颜色。`background` 支持设置线性渐变，语法为 `{ from: string, to: string, deg: number | string }`。

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
  <ESpace
    padding="10"
    size="small"
    class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]"
  >
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
  </ESpace>
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
  <ESpace
    padding="10"
    size="small"
    class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]"
  >
    <EAvatar bordered size="large">
      <EText level="3" secondary>默认</EText>
    </EAvatar>
    <EAvatar bordered borderColor="success-6" borderWidth="2" size="large">
      <EText level="3" secondary>自定义</EText>
    </EAvatar>
  </ESpace>
</template>
```

:::

## 错误回滚

通过 `fallbackSrc` 属性可以设置加载错误时的回滚图片。

<ESpace padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <EAvatar src="https://example.com/image.jpg" fallbackSrc="https://s2.loli.net/2024/09/07/gvVuD6aqFNroPLe.jpg" />
</ESpace>

:::details 查看代码

```vue
<template>
  <ESpace
    padding="10"
    size="small"
    class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]"
  >
    <EAvatar
      src="https://example.com/image.jpg"
      fallbackSrc="https://s2.loli.net/2024/09/07/gvVuD6aqFNroPLe.jpg"
    />
  </ESpace>
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
