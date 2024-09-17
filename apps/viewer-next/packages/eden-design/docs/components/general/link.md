---
outline: deep
---

# 链接 / Link

> 至少点开这个链接的时候，你知道它会带你去哪里。

:::warning

1. 该组件为 Nuxt 设计，仅支持在 Nuxt 中使用。
2. 虽然此页面中的 demo 尽可能避免了 VitePress 的样式影响，但仍可能存在部分样式被覆盖的情况，请以实际效果为准。

:::

## 基本用法

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
