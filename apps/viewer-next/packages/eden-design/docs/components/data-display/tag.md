---
outline: deep
---

# 标签 / Tag

> 标签用于标记和分类内容。

## 基础用法

<script setup lang="ts">
  import ETag from "@eden-design/components/ETag.vue"
  import ESpace from "@eden-design/components/ESpace.vue"
  import EIconSubtract from "@eden-design/components/icon/EIconSubtract.vue"
  import EDivider from "@eden-design/components/EDivider.vue"
  import { ElMessage } from "element-plus";

  function handleUpdateActive(ev: boolean | {id: string | number, active: boolean}) {
    if ("[object Object]" === Object.prototype.toString.call(ev)) {
      ElMessage.success(`Tag 激活事件：${JSON.stringify(ev)}`);
    } else {
      ElMessage.success(`Tag 激活: ${ev}`);
    }
  }

  const types = [
    "default",
    "brand",
    "gray",
    "striker",
    "special",
    "explosion",
    "pierce",
    "unarmed",
    "vibrate",
    "selector",
  ];
</script>

最基础的标签没有颜色风格和边框。要是你喜欢的话，可以当成单行文本用。

<ESpace align="end" padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <ETag>标签</ETag>
</ESpace>

:::details 查看代码

```vue
<template>
  <ETag>标签</ETag>
</template>
```

:::

## 标签尺寸

可以使用 `size` 属性来设置标签的尺寸。尺寸有 `mini`、`small`、`medium`、`large` 四种。

默认尺寸为 `medium`。

<ESpace align="end" padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <ETag brand fill size="mini">mini</ETag>
  <ETag brand fill size="small">small</ETag>
  <ETag brand fill size="medium">medium</ETag>
  <ETag brand fill size="large">large</ETag>
</ESpace>

:::details 查看代码

```vue
<template>
  <ETag brand fill size="mini">mini</ETag>
  <ETag brand fill size="small">small</ETag>
  <ETag brand fill size="medium">medium</ETag>
  <ETag brand fill size="large">large</ETag>
</template>
```

:::

## 颜色风格

Tag 组件提供了 `brand`、`gray`、`striker`、`special`、`explosion`、`pierce`、`unarmed`、`vibrate` 八种颜色风格。

你可以使用 `type="属性名"` 属性设置，也可以使用 `default`、`brand`、`gray` 等快捷方式来设置颜色风格。为了避免冲突，`type` 优先级高于快捷方式。

Tag 额外提供了一个特殊的 `selector` 预设样式，用于主页的学生和社团筛选。

<ESpace
wrap
vertical
align="end"
padding="10"
size="small"
class="rounded-md border-1 border-solid border-[var(--arona-blue-6)] bg-[var(--arona-blue-2)]">
<template #divider>
<EDivider />
</template>
<ESpace wrap>
<ETag brand fill clickable>brand</ETag>
<ETag gray fill clickable>gray</ETag>
<ETag striker fill clickable>striker</ETag>
<ETag special fill clickable>special</ETag>
<ETag explosion fill clickable>explosion</ETag>
<ETag pierce fill clickable>pierce</ETag>
<ETag unarmed fill clickable>unarmed</ETag>
<ETag vibrate fill clickable>vibrate</ETag>
<ETag selector clickable>点击筛选稀有度/社团/学校</ETag>
</ESpace>
<ESpace wrap>
<ETag v-for="type in types" :key="type" :type="type" fill clickable>{{ type }}</ETag>
</ESpace>
</ESpace>

:::details 查看代码

```vue
<template>
  <ESpace wrap vertical>
    <template #divider>
      <EDivider />
    </template>
    <ESpace wrap>
      <ETag brand fill clickable>brand</ETag>
      <ETag gray fill clickable>gray</ETag>
      <ETag striker fill clickable>striker</ETag>
      <ETag special fill clickable>special</ETag>
      <ETag explosion fill clickable>explosion</ETag>
      <ETag pierce fill clickable>pierce</ETag>
      <ETag unarmed fill clickable>unarmed</ETag>
      <ETag vibrate fill clickable>vibrate</ETag>
      <ETag selector clickable>点击筛选稀有度/社团/学校</ETag>
    </ESpace>
    <ESpace wrap>
      <ETag v-for="type in types" :key="type" :type="type" fill clickable>{{
        type
      }}</ETag>
    </ESpace>
  </ESpace>
</template>

<script setup lang="ts">
const types = [
  "default",
  "brand",
  "gray",
  "striker",
  "special",
  "explosion",
  "pierce",
  "unarmed",
  "vibrate",
  "selector",
];
</script>
```

:::

## 边框和填充

使用 `bordered` 属性开启标签边框，`fill` 属性开启标签填充。

`fill` 属性只有在选择了颜色风格后才会生效。

<ESpace align="start" padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
    <ETag brand fill>标签</ETag>
    <ETag brand bordered>标签</ETag>
    <ETag brand fill bordered>标签</ETag>
</ESpace>

:::details 查看代码

```vue
<template>
  <ETag brand fill>标签</ETag>
  <ETag brand bordered>标签</ETag>
  <ETag brand fill bordered>标签</ETag>
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
  <ETag brand fill clickable>标签</ETag>
  <ETag brand fill clickable disabled>标签</ETag>
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
<template>
  <ETag brand fill :textProps="{ bold: true }">标签</ETag>
  <ETag brand fill :textProps="{ italic: true }">标签</ETag>
  <ETag brand fill :textProps="{ underline: true }">标签</ETag>
  <ETag brand fill :textProps="{ strikethrough: true }">标签</ETag>
</template>
```

:::

## 插槽

### icon

使用 `icon` 插槽在文字前插入图标。

<ESpace align="end" padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <ETag brand fill>
    <template #icon>
      <EIconSubtract color="var(--arona-blue-6)" />
    </template>
    标签
  </ETag>
</ESpace>

:::details 查看代码

```vue
<template>
  <ETag brand fill>
    <template #icon>
      <EIconSubtract color="var(--arona-blue-6)" />
    </template>
    标签
  </ETag>
</template>
```

:::

### `default`

使用默认插槽插入文字。

<ESpace align="end" padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <ETag brand fill>标签</ETag>
</ESpace>

:::details 查看代码

```vue
<template>
  <ETag brand fill>标签</ETag>
</template>
```

:::

## 事件

### `update:active`

当标签被点击时，会触发 `update:active` 事件，返回 `active` 状态。`active` 的类型为 `boolean`。

**如果设置了 `id` 属性，则会返回一个包含 `id` 和 `active` 的对象。**

<ESpace align="end" padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <ETag brand fill clickable @update:active="handleUpdateActive">我没有 id</ETag>
  <ETag brand fill clickable @update:active="handleUpdateActive" id="1">我的 id 是 1</ETag>
</ESpace>

:::details 查看代码

```vue
<template>
  <ETag brand fill clickable @update:active="handleUpdateActive"
    >我没有 id</ETag
  >
  <ETag brand fill clickable @update:active="handleUpdateActive" id="1"
    >我的 id 是 1</ETag
  >
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";

function handleUpdateActive(
  ev: boolean | { id: string | number; active: boolean }
) {
  if ("[object Object]" === Object.prototype.toString.call(ev)) {
    ElMessage.success(`Tag 激活事件：${JSON.stringify(ev)}`);
  } else {
    ElMessage.success(`Tag 激活: ${ev}`);
  }
}
</script>
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

  /* 标签类型 */
  type?:
    | "default"
    | "brand"
    | "gray"
    | "striker"
    | "special"
    | "explosion"
    | "pierce"
    | "unarmed"
    | "vibrate"
    | "selector";

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
