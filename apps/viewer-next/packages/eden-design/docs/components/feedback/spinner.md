---
outline: deep
---

# 加载中 / Spinner

> 当你看到它的时候，你八成是卡了。

<script setup lang="ts">
import ESpinner from '@eden-design/components/ESpinner.vue';
import ESpace from '@eden-design/components/ESpace.vue';
import EButton from '@eden-design/components/EButton.vue';
</script>

## 基础用法

没什么好说的，转就完事了。

<ESpace padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <ESpinner />
</ESpace>

:::details 查看代码

```vue
<template>
  <ESpinner />
</template>
```

:::

## Spinner 尺寸

用 `size` 属性来控制大小。

<ESpace align="end" padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <ESpinner size="12" />
  <ESpinner size="16" />
  <ESpinner size="20" />
  <ESpinner size="24" />
  <ESpinner size="32" />
</ESpace>

:::details 查看代码

```vue
<template>
  <ESpinner size="12" />
  <ESpinner size="16" />
  <ESpinner size="20" />
  <ESpinner size="24" />
  <ESpinner size="32" />
</template>
```

:::

### 圆环宽度

用 `strokeWidth` 属性来控制圆环宽度。

<ESpace align="end" padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <ESpinner size="16" strokeWidth="1" />
  <ESpinner size="16" strokeWidth="2" />
  <ESpinner size="16" strokeWidth="3" />
</ESpace>

:::details 查看代码

```vue
<template>
  <ESpinner size="16" strokeWidth="1" />
  <ESpinner size="16" strokeWidth="2" />
  <ESpinner size="16" strokeWidth="3" />
</template>
```

:::

## Spinner 颜色

### 预设颜色

Spinner 预设有 `default` 和 `white` 两种颜色。

<ESpace align="end" padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <ESpinner size="16"  />
  <EButton>
    <ESpinner size="16" white />
  </EButton>
</ESpace>

:::details 查看代码

```vue
<template>
  <ESpinner size="16" />
  <EButton>
    <ESpinner size="16" white />
  </EButton>
</template>
```

:::

### 自定义颜色

用 `baseColor`、`primaryColor` 和 `secondaryColor` 属性来自定义颜色。

<ESpace align="end" padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <ESpinner
    size="24"
    base-color="plana-pink-1"
    primary-color="plana-pink-6"
    secondary-color="plana-pink-3"
    stroke-width="3"
  />
</ESpace>

:::details 查看代码

```vue
<template>
  <ESpinner
    size="24"
    base-color="plana-pink-1"
    primary-color="plana-pink-6"
    secondary-color="plana-pink-3"
    stroke-width="3"
  />
</template>
```

:::

## API

```ts
export type SpinnerProps = {
  size?: string | number;
  baseColor?: string;
  primaryColor?: string;
  secondaryColor?: string;
  strokeWidth?: string | number;

  /* 预设颜色 */
  brand?: boolean;
  white?: boolean;
};
```
