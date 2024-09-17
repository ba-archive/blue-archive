---
outline: deep
---

# 排版 / Typography

<style lang="scss">
.demo-container {
  p, span, h1, h2, h3 {
    line-height: inherit;
    margin: initial;
    padding: initial;
    letter-spacing: initial;
    border: initial;
  }

  blockquote {

  }
}
</style>

> 世事洞明皆学问，人情练达即文章。

<script setup lang="ts">
  import EText from "@eden-design/components/typography/EText.vue";
  import EH1 from "@eden-design/components/typography/EH1.vue";
  import EH2 from "@eden-design/components/typography/EH2.vue";
  import EH3 from "@eden-design/components/typography/EH3.vue";
  import EBlockquote from "@eden-design/components/typography/EBlockquote.vue";
  import EUl from "@eden-design/components/typography/EUl.vue";
  import EOl from "@eden-design/components/typography/EOl.vue";
  import ELi from "@eden-design/components/typography/ELi.vue";
  import ESpace from "@eden-design/components/ESpace.vue";
  import EDivider from "@eden-design/components/EDivider.vue";
  import EAvatar from "@eden-design/components/EAvatar.vue";

  const placeholderText = "诗有句含蓄者，如老杜曰：“勋业频看镜，行藏独倚楼。”郑云叟曰“相看临远水，独自上孤舟”是也。有意含蓄者，如《宫词》曰：“银烛秋光冷画屏，轻罗小扇扑流萤。天街夜色凉如水，卧看牵牛织女星。”又《嘲人》诗曰“怪来妆阁闭，朝下不相迎。总向春园里，花间笑语声”是也。有句意倶含蓄者，如《九日》诗曰：“明年此会知谁健，醉把茱萸子细看。”《宫怨》诗曰“玉容不及寒鸦色，犹带朝阳日影来”是也。";
  </script>

## 基础用法

排印工具提供了以下组件：

- 用于展示一般文本的 `<EText>`
- 用于展示标题的 `<EH1>`、`<EH2>`、`<EH3>`
- 用于展示引用的 `<EBlockquote>`，以及
- 用于包裹有序和无序列表的 `<EUl>` 和 `<EOl>`
- 用于展示列表项的 `<ELi>`
- 用于展示链接的 `<ELink>` <sup>\*</sup>

<sup>\*</sup>: 该组件仅支持在 Nuxt 中使用，详情请见 [链接 / ELink](./link.md)。

:::tip

1. 为了说明清晰，下文所有示例代码均省略占位符文本。
2. 虽然此页面中的 demo 尽可能避免了 VitePress 的样式影响，但仍可能存在部分样式被覆盖的情况，请以实际效果为准。

:::

### 一般文本

使用 `<EText>` 包裹正文内容。

<ESpace padding="10" size="small" class="demo-container rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <EText> {{ placeholderText }} </EText>
</ESpace>

:::details 查看代码

```vue
<template>
  <EText> {{ placeholderText }} </EText>
</template>
```

:::

### 次要文本

在 `<EText>` 组件上添加 `secondary` 属性，可以展示次要文本。

<ESpace padding="10" size="small" class="demo-container rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <EText secondary> {{ placeholderText }} </EText>
</ESpace>

:::details 查看代码

```vue
<template>
  <EText secondary> {{ placeholderText }} </EText>
</template>
```

:::

### 次次要文本

在 `<EText>` 组件上添加 `tertiary` 属性，可以展示次次要文本。

<ESpace padding="10" size="small" class="demo-container rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <EText tertiary> {{ placeholderText }} </EText>
</ESpace>

:::details 查看代码

```vue
<template>
  <EText tertiary> {{ placeholderText }} </EText>
</template>
```

:::

### 一般文本的基础类型

在 `<EText>` 组件上添加 `type` 属性，可以设置文本的基础类型。`type` 属性默认值为 `body`。

`<EText>` 有三种类型：

- `body`
- `display`
- `title`

每种类型又包含 `level="1"`、`level="2"` 和 `level="3"` 三种字号等级（从大到小），共 3×3 种组合。

关于字号等级的具体说明，请参照 [字号级别](#字号级别)。

请注意，虽然 `title` 看似功能与标题组件 `<EH1>`、`<EH2>`、`<EH3>` 重合，但是这里的 `title` 可以理解为 “不重要的小标题”。对于真正的标题，请使用 `<EH1>`、`<EH2>`、`<EH3>` 组件。

<ESpace vertical padding="10" size="small" class="demo-container rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <EText type="body"> body </EText>
  <EText type="display"> display </EText>
  <EText type="title"> title </EText>
</ESpace>

:::details 查看代码

```vue
<template>
  <EText type="body"> {{ placeholderText }} </EText>
  <EText type="display"> {{ placeholderText }} </EText>
  <EText type="title"> {{ placeholderText }} </EText>
</template>
```

:::

### 标题

使用 `<EH1>`、`<EH2>`、`<EH3>` 组件展示标题。

<ESpace vertical :padding="[20, 10]" :size="20" class="demo-container rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <EH1> 一级标题 / Heading Level 1 </EH1>
  <EH2> 二级标题 / Heading Level 2 </EH2>
  <EH3> 三级标题 / Heading Level 3 </EH3>
</ESpace>

:::details 查看代码

```vue
<template>
  <EH1> 一级标题 / Heading Level 1 </EH1>
  <EH2> 二级标题 / Heading Level 2 </EH2>
  <EH3> 三级标题 / Heading Level 3 </EH3>
</template>
```

:::

### 有序和无序列表

使用 `<EUl>` 和 `<EOl>` 组件展示有序和无序列表。

<ESpace vertical padding="10" :size="0" class="demo-container rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <EUl>
    <ELi> 无序列表项</ELi>
    <ELi> 无序列表项</ELi>
    <ELi> 无序列表项</ELi>
  </EUl>
  <EOl>
    <ELi> 有序列表项 1 </ELi>
    <ELi> 有序列表项 2 </ELi>
    <ELi> 有序列表项 3 </ELi>
  </EOl>
</ESpace>

:::details 查看代码

```vue
<template>
  <EUl>
    <ELi> 无序列表项</ELi>
    <ELi> 无序列表项</ELi>
    <ELi> 无序列表项</ELi>
  </EUl>
  <EOl>
    <ELi> 有序列表项 1 </ELi>
    <ELi> 有序列表项 2 </ELi>
    <ELi> 有序列表项 3 </ELi>
  </EOl>
</template>
```

:::

### 块引用

使用 `<EBlockquote>` 组件展示块引用。

<ESpace padding="10" size="small" class="demo-container rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <EBlockquote> {{ placeholderText }} </EBlockquote>
</ESpace>

:::details 查看代码

```vue
<template>
  <EBlockquote> {{ placeholderText }} </EBlockquote>
</template>
```

:::

## 附加样式

### 对齐

使用 `align` 属性可以设置文本的对齐方式。

<ESpace vertical padding="10" size="small" class="demo-container rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
<template #divider>
  <EDivider />
</template>

  <ESpace vertical size="small">
    <EH3>左对齐</EH3>
    <EText align="start" class="bg-[var(--arona-blue-1)]"> {{ placeholderText }} </EText>
  </ESpace>
  <ESpace vertical size="small">
    <EH3>居中对齐</EH3>
    <EText align="center" class="bg-[var(--arona-blue-1)]"> {{ placeholderText }} </EText>
  </ESpace>
  <ESpace vertical size="small">
    <EH3>右对齐</EH3>
    <EText align="end" class="bg-[var(--arona-blue-1)]"> {{ placeholderText }} </EText>
  </ESpace>
  <ESpace vertical size="small">
    <EH3>两端对齐</EH3>
    <EText align="justify" class="bg-[var(--arona-blue-1)]"> {{ placeholderText }} </EText>
  </ESpace>
</ESpace>

:::details 查看代码

```vue
<template>
  <ESpace vertical size="small">
    <EH3>左对齐</EH3>
    <EText align="start" class="bg-[var(--arona-blue-1)]">
      {{ placeholderText }}
    </EText>
  </ESpace>
  <ESpace vertical size="small">
    <EH3>居中对齐</EH3>
    <EText align="center" class="bg-[var(--arona-blue-1)]">
      {{ placeholderText }}
    </EText>
  </ESpace>
  <ESpace vertical size="small">
    <EH3>右对齐</EH3>
    <EText align="end" class="bg-[var(--arona-blue-1)]">
      {{ placeholderText }}
    </EText>
  </ESpace>
  <ESpace vertical size="small">
    <EH3>两端对齐</EH3>
    <EText align="justify" class="bg-[var(--arona-blue-1)]">
      {{ placeholderText }}
    </EText>
  </ESpace>
</template>
```

:::

### 加粗

使用 `bold` 或者 `strong` 属性可以设置文本的加粗样式。

<ESpace padding="10" size="small" class="demo-container rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <EText bold> {{ placeholderText }} </EText>
</ESpace>

:::details 查看代码

```vue
<template>
  <EText bold> {{ placeholderText }} </EText>
</template>
```

:::

### 删除线

使用 `delete` 或者 `strikethrough` 属性可以设置文本的删除线样式。

<ESpace padding="10" size="small" class="demo-container rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <EText delete> {{ placeholderText }} </EText>
</ESpace>

:::details 查看代码

```vue
<template>
  <EText delete> {{ placeholderText }} </EText>
</template>
```

:::

### 禁用

使用 `disabled` 属性可以设置文本的禁用样式。

<ESpace padding="10" size="small" class="demo-container rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <EText disabled> {{ placeholderText }} </EText>
</ESpace>

:::details 查看代码

```vue
<template>
  <EText disabled> {{ placeholderText }} </EText>
</template>
```

:::

### 继承文本颜色

使用 `inheritTextColor` 属性可以设置文本的颜色继承自父元素。

<ESpace padding="10" size="small" class="demo-container rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <div class="flex flex-col gap-2 text-red-500">
    <EText> 我不继承 </EText>
    <EText inheritTextColor> {{ placeholderText }} </EText>
  </div>
</ESpace>

:::details 查看代码

```vue
<template>
  <div class="flex flex-col gap-2 text-red-500">
    <EText> 我不继承 </EText>
    <EText inheritTextColor> {{ placeholderText }} </EText>
  </div>
</template>
```

:::

### 内联文本

使用 `inline` 属性可以设置文本为内联文本。

:::warning
当属性为 `inline` 时，`align` 属性会失效。
:::

<ESpace vertical padding="10" class="demo-container rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
<template #divider>
  <EDivider />
</template>
  <span class="text-gray-500">
    你说得对，但是<EText inline> {{ placeholderText }} </EText>
  </span>
  <span class="text-gray-500">
    你说得对，但是<EText> {{ placeholderText }} </EText>
  </span>
</ESpace>

:::details 查看代码

```vue
<template>
  <span class="text-gray-500">
    你说得对，但是<EText inline> {{ placeholderText }} </EText>
  </span>
  <span class="text-gray-500">
    你说得对，但是<EText> {{ placeholderText }} </EText>
  </span>
</template>
```

:::

### 斜体

使用 `italic` 属性可以设置文本的斜体样式。

<ESpace padding="10" size="small" class="demo-container rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <EText italic> {{ placeholderText }} </EText>
</ESpace>

:::details 查看代码

```vue
<template>
  <EText italic> {{ placeholderText }} </EText>
</template>
```

:::

### 字号级别

使用 `level` 属性可以设置文本的字号级别。

字号级别一般与 `<EText>` 组件的 `type` 属性配合使用。详细说明请参照 [基础用法 / 一般文本的基础类型](#一般文本的基础类型)。

<ESpace vertical padding="10" size="small" class="demo-container rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <EText level="1"> 一级字号 / Font Size Level 1 </EText>
  <EText level="2"> 二级字号 / Font Size Level 2 </EText>
  <EText level="3"> 三级字号 / Font Size Level 3 </EText>
</ESpace>

:::details 查看代码

```vue
<template>
  <EText level="1"> 一级字号 / Font Size Level 1 </EText>
  <EText level="2"> 二级字号 / Font Size Level 2 </EText>
  <EText level="3"> 三级字号 / Font Size Level 3 </EText>
</template>
```

:::

### 禁止选中

使用 `noSelect` 属性可以禁止文本被选中。

<ESpace padding="10" size="small" class="demo-container rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <EText noSelect> {{ placeholderText }} </EText>
</ESpace>

:::details 查看代码

```vue
<template>
  <EText noSelect> {{ placeholderText }} </EText>
</template>
```

:::

### 禁止换行

使用 `noWrap` 属性可以禁止文本换行。

<ESpace padding="10" size="small" class="demo-container rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <ESpace vertical class="w-[200px] bg-[var(--arona-blue-1)]">
    <EText> 我允许换行我允许换行我允许换行 </EText>
    <EText noWrap> 我不允许换行我不允许换行我不允许换行 </EText>
  </ESpace>
</ESpace>

:::details 查看代码

```vue
<template>
  <ESpace vertical class="w-[200px] bg-[var(--arona-blue-1)]">
    <EText> 我允许换行我允许换行我允许换行 </EText>
    <EText noWrap> 我不允许换行我不允许换行我不允许换行 </EText>
  </ESpace>
</template>
```

:::

### 下划线

使用 `underline` 属性可以设置文本的下划线样式。

<ESpace padding="10" size="small" class="demo-container rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <EText underline> {{ placeholderText }} </EText>
</ESpace>

:::details 查看代码

```vue
<template>
  <EText underline> {{ placeholderText }} </EText>
</template>
```

:::

## 自定义颜色

颜色可以使用 `color` 属性自定义。`color` 属性原生支持线性渐变，参数为 `{ from: string, to: string, deg?: number | string }`。

<ESpace vertical padding="10" size="small" class="demo-container rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <EText color="plana-pink-6"> {{ placeholderText }} </EText>
  <EText :color="{ from: 'arona-blue-6', to: 'arona-blue-1', deg: 135 }"> {{ placeholderText }} </EText>
</ESpace>

:::details 查看代码

```vue
<template>
  <EText color="plana-pink-6"> {{ placeholderText }} </EText>
  <EText :color="{ from: 'arona-blue-6', to: 'arona-blue-1', deg: 135 }">
    {{ placeholderText }}
  </EText>
</template>
```

:::

:::warning

渐变文本使用 `background-clip: text` 以及 `background-image: linear-gradient(deg, from, to)` 实现，因此不支持显示 Emoji 表情。

:::

### 颜色快捷方式

方便起见，排印工具还提供了一些颜色快捷方式：

- `brand`：品牌色
- `danger`：危险色 = `error`
- `secondary`：次要色
- `success`：成功色

<ESpace vertical padding="10" size="small" class="demo-container rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <EText brand> {{ Array(6).fill("品牌色").join("") }} </EText>
  <EText danger> {{ Array(6).fill("危险色").join("") }} </EText>
  <EText secondary> {{ Array(6).fill("次要色").join("") }} </EText>
  <EText success> {{ Array(6).fill("成功色").join("") }} </EText>
</ESpace>

## 处理显示异常的可变字体

现代浏览器使用 `font-synthesis` 控制字体合成的行为。它允许浏览器在某些情况下选择替代字体，以确保文本的显示效果最佳。然而 Safari 浏览器对可变字体的支持策略会导致英文字体 Wix Madefor 显示粗体时异常。

<div class="grid grid-cols-2 gap-4">

![错误的 Wix Madefor 字体](https://cdn.sa.net/2024/09/17/iR2qmX79CS6DQhf.png)

![正确的 Wix Madefor 字体](https://cdn.sa.net/2024/09/17/dnwvaureW3JOk1R.png)

</div>

理论上 `<EText>` 组件已经处理了这个问题，但是如果你发现某些字体在 Safari 浏览器中显示异常，可以尝试设置 `font-synthesis` 属性为 `none`。

```css
.font-synthesis-none {
  font-synthesis: none;
  font-weight: 400 800;
}
```

## 插槽

### `prefix`

使用 `prefix` 插槽在文本前面插入内容。可以是文本，也可以是组件或者其他什么东西。

<ESpace vertical padding="10" size="small" class="demo-container rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <EText>
    <template #prefix>
      <EAvatar src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg" size="mini" />
    </template>
    {{ placeholderText }}
  </EText>
</ESpace>

:::details 查看代码

```vue
<template>
  <EText>
    <template #prefix>
      <EAvatar
        src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg"
        size="mini"
      />
    </template>
    {{ placeholderText }}
  </EText>
</template>
```

:::

### `default`

使用 `default` 插槽在文本中间插入内容。可以是文本，也可以是组件或者其他什么东西。

<ESpace vertical padding="10" size="small" class="demo-container rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <EText>
    终于要写完了
  </EText>
</ESpace>

### `suffix`

使用 `suffix` 插槽在文本后面插入内容。可以是文本，也可以是组件或者其他什么东西。

<ESpace vertical padding="10" size="small" class="demo-container rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <EText>
    {{ placeholderText }}
    <template #suffix>
      <EAvatar src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg" size="mini" />
    </template>
  </EText>
</ESpace>

:::details 查看代码

```vue
<template>
  <EText>
    {{ placeholderText }}
    <template #suffix>
      <EAvatar
        src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg"
        size="mini"
      />
    </template>
  </EText>
</template>
```

:::

## API

:::code-group

```ts [TextProps.ts]
import type { WithGradientBackground } from "~/packages/eden-design/components/types/WithGradientBackground";

export type TextProps = {
  /* 文本属性 */
  align?: "start" | "center" | "end" | "justify";
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
export type WithGradientBackground =
  | string
  | {
      from: string;
      to: string;
      deg?: number | string;
    };
```

:::
