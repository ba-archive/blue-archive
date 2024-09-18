---
outline: deep
---

# 链接 / Link

> 我们鼓励开发者尽可能使用链接，而不是点击事件。

:::warning

1. 该组件为 Nuxt 设计，仅支持在 Nuxt 中使用。
2. 此页面的组件不能正常工作，仅供预览样式。
3. 虽然此页面中的 demo 尽可能避免了 VitePress 的样式影响，但仍可能存在部分样式被覆盖的情况，请以实际效果为准。

:::

<script setup lang="ts">
  import ELinkDemo from "../../assets/components/ELinkDemo.vue";
  import ESpace from "@eden-design/components/ESpace.vue";
  import EIconError from "@eden-design/components/icon/EIconError.vue";
  </script>

  <style lang="scss">
    .demo-container {
  a, p, span, h1, h2, h3 {
    line-height: inherit;
    margin: initial;
    padding: initial;
    letter-spacing: initial;
      border: initial;
    }
  }
</style>

## 基本用法

仅供演示样式，具体参数可参考 [\<NuxtLink\>](https://nuxt.com/docs/api/components/nuxt-link)。

<ESpace padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <ELinkDemo>链接</ELinkDemo>
</ESpace>

:::details 查看代码

```vue
<template>
  <ELink>链接</ELink>
</template>
```

:::

## 导航样式

设置 `nav` 属性，链接会显示为导航样式。

<ESpace vertical :padding="[10,20]" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <ELinkDemo nav >链接</ELinkDemo>
  <ELinkDemo nav class="router-link-active">活跃导航链接</ELinkDemo>
</ESpace>

:::details 查看代码

```vue
<template>
  <ELink nav>链接</ELink>
  <ELink nav>活跃导航链接</ELink>
</template>
```

:::

## 自定义样式

传入的所有非导航参数都会被传递给 [排版 / Typography](/components/general/typography) 组件。你可以参考 [排版 / Typography - 附加样式](/components/general/typography#附加样式) 组件的参数来修改链接的样式。

<ESpace vertical :padding="[10,20]" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <ELinkDemo nav bold>粗体导航链接</ELinkDemo>
  <ELinkDemo italic>斜体链接</ELinkDemo>
  <ELinkDemo warning>警告色链接</ELinkDemo>
</ESpace>

:::details 查看代码

```vue
<template>
  <ELink nav bold>粗体导航链接</ELink>
  <ELink italic>斜体链接</ELink>
  <ELink warning>警告色链接</ELink>
</template>
```

:::

## 插槽

### `prefix`

使用 `prefix` 插槽为链接添加前缀。详细使用方式请参考 [排版 / Typography - prefix](/components/general/typography#prefix)。

<ESpace padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <ELinkDemo>
    <template #prefix>
      <EIconError name="home" class="self-end"/>
    </template>
    带前缀的链接
  </ELinkDemo>
</ESpace>

:::details 查看代码

```vue
<template>
  <ELink>
    <template #prefix>
      <EIconError name="home" class="self-end"/>
    </template>
    带前缀的链接
  </ELink>
</template>
```

:::

### `default`

使用 `default` 插槽为链接添加内容。详细使用方式请参考 [排版 / Typography - default](/components/general/typography#default)。

<ESpace padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <ELinkDemo>
    链接
  </ELinkDemo>
</ESpace>

:::details 查看代码

```vue
<template>
  <ELink>
    链接
  </ELink>
</template>
```

:::

### `suffix`

使用 `suffix` 插槽为链接添加后缀。详细使用方式请参考 [排版 / Typography - suffix](/components/general/typography#suffix)。

<ESpace padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <ELinkDemo>
    <template #suffix>
      <EIconError name="home" class="self-end"/>
    </template>
    带后缀的链接
  </ELinkDemo>
</ESpace>

:::details 查看代码

```vue
<template>
  <ELink>
    <template #suffix>
      <EIconError name="home" class="self-end"/>
    </template>
    带后缀的链接
  </ELink>
</template>
```

:::

## API

:::code-group

```tsx [ELink.vue]
import type { TextProps } from "../types/EdenTextCore/TextProps";
import type { NuxtLinkProps } from "nuxt/app";

type EdenLinkProps = TextProps &
  NuxtLinkProps & { nav?: boolean; underline?: boolean };
```

```ts [TextProps.ts]
import type { WithGradientBackground } from "~/packages/eden-design/components/types/WithGradientBackground";

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

```ts [WithGradientBackground.ts]
type WithGradientBackground =
  | string
  | {
      from: string;
      to: string;
      deg?: number | string;
    };
```

:::
