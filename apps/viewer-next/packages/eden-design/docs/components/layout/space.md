---
outline: deep
---

# 间距 / Space

> 规范化两个元素之间的间距。

## 基础用法

<script setup lang="ts">
import ESpace from '@eden-design/components/ESpace.vue';
import EText from '@eden-design/components/typography/EText.vue';
import EButton from '@eden-design/components/EButton.vue';
import EDivider from '@eden-design/components/EDivider.vue';
import EIconSubtract from '@eden-design/components/icon/EIconSubtract.vue';
</script>

可以设置 `size` 为 `mini`、`small`、`medium`、`large` 或具体数值（单位为 px）。默认尺寸为 `medium`。

<ESpace wrap align="center" padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
<template #divider>
  <EDivider vertical/>
</template>
  <ESpace size="mini">
    <EButton>mini</EButton>
    <EButton>mini</EButton>
  </ESpace>
  <ESpace size="small">
    <EButton>small</EButton>
    <EButton>small</EButton>
  </ESpace>
  <ESpace>
    <EButton>medium</EButton>
    <EButton>medium</EButton>
  </ESpace>
  <ESpace size="large">
    <EButton>large</EButton>
    <EButton>large</EButton>
  </ESpace>
  <ESpace :size="20">
    <EButton>20px</EButton>
    <EButton>20px</EButton>
  </ESpace>
</ESpace>

:::details 查看代码

```vue
<template>
  <ESpace
    wrap
    align="center"
    padding="10"
    size="small"
    class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]"
  >
    <template #divider>
      <EDivider vertical />
    </template>
    <ESpace size="mini">
      <EButton>mini</EButton>
      <EButton>mini</EButton>
    </ESpace>
    <ESpace size="small">
      <EButton>small</EButton>
      <EButton>small</EButton>
    </ESpace>
    <ESpace>
      <EButton>medium</EButton>
      <EButton>medium</EButton>
    </ESpace>
    <ESpace size="large">
      <EButton>large</EButton>
      <EButton>large</EButton>
    </ESpace>
    <ESpace :size="20">
      <EButton>20px</EButton>
      <EButton>20px</EButton>
    </ESpace>
  </ESpace>
</template>
```

:::

## 垂直排列

设置 `direction="vertical"` 或快捷属性 `vertical` 可垂直排列。

<ESpace wrap align="center" padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <ESpace direction="vertical" size="small">
    <EButton>按钮1</EButton>
    <EButton>按钮2</EButton>
  </ESpace>
</ESpace>

:::details 查看代码

```vue
<template>
  <ESpace
    wrap
    align="center"
    padding="10"
    size="small"
    class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]"
  >
    <ESpace direction="vertical" size="small">
      <EButton>按钮1</EButton>
      <EButton>按钮2</EButton>
    </ESpace>
  </ESpace>
</template>
```

:::

## 对齐方式

设置 `align` 为 `start`、`end`、`center`、`baseline` 或 `stretch` 可设置对齐方式。

<ESpace wide wrap align="center" padding="10" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
<template #divider>
<EDivider vertical/>
</template>
  <ESpace align="start">
      <EButton size="mini">start</EButton>
      <EButton size="large">start</EButton>
    </ESpace>
    <ESpace align="end">
      <EButton size="mini">end</EButton>
      <EButton size="large">end</EButton>
    </ESpace>
    <ESpace align="center">
      <EButton size="mini">center</EButton>
      <EButton size="large">center</EButton>
    </ESpace>
    <ESpace align="baseline">
      <EButton size="mini">baseline</EButton>
      <EButton size="large">baseline</EButton>
    </ESpace>
    <ESpace align="stretch">
      <div class="p-2 bg-[var(--arona-blue-6)]">
      <EText color="color-fill-base">stretch</EText>
      </div>
      <div class="p-4 bg-[var(--arona-blue-6)]">
        <EText color="color-fill-base">stretch</EText>
      </div>
    </ESpace>
</ESpace>

:::details 查看代码

```vue
<template>
  <ESpace
    wide
    wrap
    align="center"
    padding="10"
    class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]"
  >
    <template #divider>
      <EDivider vertical />
    </template>
    <ESpace align="start">
      <EButton size="mini">start</EButton>
      <EButton size="large">start</EButton>
    </ESpace>
    <ESpace align="end">
      <EButton size="mini">end</EButton>
      <EButton size="large">end</EButton>
    </ESpace>
    <ESpace align="center">
      <EButton size="mini">center</EButton>
      <EButton size="large">center</EButton>
    </ESpace>
    <ESpace align="baseline">
      <EButton size="mini">baseline</EButton>
      <EButton size="large">baseline</EButton>
    </ESpace>
    <ESpace align="stretch">
      <div class="p-2 bg-[var(--arona-blue-6)]">
        <EText color="color-fill-base">stretch</EText>
      </div>
      <div class="p-4 bg-[var(--arona-blue-6)]">
        <EText color="color-fill-base">stretch</EText>
      </div>
    </ESpace>
  </ESpace>
</template>
```

:::

## 分隔线

使用 `divider` 插槽插入自定义分隔线，或者设置 `divider` 属性为你希望插入的字符串。

<ESpace align="center" padding="10" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
<template #divider>
<EDivider vertical />
</template>
<ESpace divider="|">
<EText>鹅鹅鹅</EText>
<EText>曲项向天歌</EText>
</ESpace>
<EText>白毛浮绿水</EText>
<EText>红掌拨清波</EText>
</ESpace>

:::details 查看代码

```vue
<template>
  <ESpace
    align="center"
    padding="10"
    class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]"
  >
    <template #divider>
      <EDivider vertical />
    </template>
    <ESpace divider="|">
      <EText>鹅鹅鹅</EText>
      <EText>曲项向天歌</EText>
    </ESpace>
    <EText>白毛浮绿水</EText>
    <EText>红掌拨清波</EText>
  </ESpace>
</template>
```

:::

## 插槽

### 默认插槽

使用默认插槽显示内容。

<ESpace wide wrap align="center" padding="10" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <EButton>按钮1</EButton>
  <EButton>按钮2</EButton>
</ESpace>

:::details 查看代码

```vue
<template>
  <ESpace
    wide
    wrap
    align="center"
    padding="10"
    class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]"
  >
    <EButton>按钮1</EButton>
    <EButton>按钮2</EButton>
  </ESpace>
</template>
```

:::

### divider

使用 `divider` 插槽插入自定义分隔线。

<ESpace align="center" padding="10" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <ESpace size="small">
  <template #divider>
    <EIconSubtract size="24" rotate="90"/>
  </template>
    <EText>鹅鹅鹅</EText>
    <EText>曲项向天歌</EText>
    <ESpace align="baseline" size="small">
      <template #divider>
        <EDivider vertical/>
      </template>
      <EText>白毛浮绿水</EText>
      <EText>红掌拨清波</EText>
    </ESpace>
  </ESpace>
</ESpace>

:::details 查看代码

```vue
<template>
  <ESpace
    align="center"
    padding="10"
    class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]"
  >
    <ESpace size="small">
      <template #divider>
        <EIconSubtract size="24" rotate="90" />
      </template>
      <EText>鹅鹅鹅</EText>
      <EText>曲项向天歌</EText>
      <ESpace align="baseline" size="small">
        <template #divider>
          <EDivider vertical />
        </template>
        <EText>白毛浮绿水</EText>
        <EText>红掌拨清波</EText>
      </ESpace>
    </ESpace>
  </ESpace>
</template>
```

:::

## API

```ts
export type SpaceProps = {
  align?: "start" | "end" | "center" | "baseline" | "stretch";
  direction?: "horizontal" | "vertical";
  vertical?: boolean; // shortcut for direction="vertical"
  size?: "mini" | "small" | "medium" | "large" | number;
  wrap?: boolean;
  wide?: boolean;
  divider?: string;
  margin?:
    | string
    | number
    | [number, number]
    | [number, number, number, number];
  padding?:
    | string
    | number
    | [number, number]
    | [number, number, number, number];
};
```
