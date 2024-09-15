---
outline: deep
---

# 开关 / Switch

> 咔哒。

## 基本用法

用 `v-model` 绑定当前值。

<script setup lang="ts">
import { ref } from 'vue';
import ESwitch from '@eden-design/components/ESwitch.vue';
import ESpace from '@eden-design/components/ESpace.vue';
import EText from '@eden-design/components/typography/EText.vue';
import { ElMessage } from 'element-plus';

const checked = ref(false);

function handleUpdateChecked(checked: boolean) {
  ElMessage.info(`当前值：${checked}`);
}
</script>

<ESpace align="center" padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <ESwitch v-model="checked" />
  <EText>checked：{{ checked }}</EText>
</ESpace>

:::details 查看代码

```vue
<template>
  <ESwitch v-model="checked" />
  <EText>checked：{{ checked }}</EText>
</template>

<script setup lang="ts">
const checked = ref(false);
</script>
```

:::

## 开关尺寸

使用 `size` 属性设置开关尺寸。尺寸有 `mini`、`small`、`medium`、`large` 四种。

<ESpace align="end" padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <ESwitch size="mini" />
  <ESwitch size="small" />
  <ESwitch size="medium" />
  <ESwitch size="large" />
</ESpace>

:::details 查看代码

```vue
<template>
  <ESwitch size="mini" />
  <ESwitch size="small" />
  <ESwitch size="medium" />
  <ESwitch size="large" />
</template>
```

:::

## 预设颜色

开关预设了 `brand`、`default`、`danger`、`success`、`warning` 五种颜色。

在未选中时，五种样式看起来没有差别。

<ESpace vertical padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <ESpace>
    <ESwitch default />
    <ESwitch brand />
    <ESwitch danger />
    <ESwitch success />
    <ESwitch warning />
  </ESpace>
  <ESpace>
    <ESwitch checked default />
    <ESwitch checked brand />
    <ESwitch checked danger />
    <ESwitch checked success />
    <ESwitch checked warning />
  </ESpace>
</ESpace>

:::details 查看代码

```vue
<template>
  <ESpace>
    <ESwitch default />
    <ESwitch brand />
    <ESwitch danger />
    <ESwitch success />
    <ESwitch warning />
  </ESpace>
  <ESpace>
    <ESwitch checked default />
    <ESwitch checked brand />
    <ESwitch checked danger />
    <ESwitch checked success />
    <ESwitch checked warning />
  </ESpace>
</template>
```

:::

## 受控状态

使用 `controlled` 属性设置受控状态。

<ESpace align="end" padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <ESwitch controlled checked/>
</ESpace>

:::details 查看代码

```vue
<template>
  <ESwitch controlled checked />
</template>
```

:::

## 禁用状态

使用 `disabled` 属性设置禁用状态。

<ESpace align="end" padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <ESwitch disabled />
  <ESwitch checked disabled />
</ESpace>

:::details 查看代码

```vue
<template>
  <ESwitch disabled />
  <ESwitch checked disabled />
</template>
```

:::

## 自定义颜色

使用 `thumbColor`、`backgroundColor`、`borderColor` 属性设置开关的摇杆、背景、边框颜色。`backgroundColor` 和 `borderColor` 支持渐变，设置渐变时参数为 `{from: string, to: string, deg?: number | string}`。

<ESpace align="end" padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <ESpace>
    <ESwitch
      :thumb-color="{
        from: '#fff',
        to: 'var(--arona-blue-1)',
        deg: 45,
      }"
      :background-color="{
        from: 'var(--arona-blue-5)',
        to: 'var(--arona-blue-1)',
        deg: 45,
      }"
      border-color="arona-blue-6"
    />
    <ESwitch
      thumb-color="arona-blue-6"
      background-color="arona-blue-1"
      border-color="arona-blue-6"
    />
  </ESpace>
</ESpace>

:::details 查看代码

```vue
<template>
  <ESwitch
    :thumb-color="{
      from: '#fff',
      to: 'var(--arona-blue-1)',
      deg: 45,
    }"
    :background-color="{
      from: 'var(--arona-blue-5)',
      to: 'var(--arona-blue-1)',
      deg: 45,
    }"
    border-color="arona-blue-6"
  />
  <ESwitch
    thumb-color="arona-blue-6"
    background-color="arona-blue-1"
    border-color="arona-blue-6"
  />
</template>
```

:::

## 事件

### `update:checked`

使用 `update:checked` 事件监听开关状态变化。

<ESpace
align="end"
padding="10"
size="small"
class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
<ESwitch @update:checked="handleUpdateChecked" />
</ESpace>

:::details 查看代码

```vue
<template>
  <ESwitch @update:checked="handleUpdateChecked" />
</template>

<script setup lang="ts">
function handleUpdateChecked(checked: boolean) {
  ElMessage.info(`当前值：${checked}`);
}
</script>
```

:::

## API

:::code-group

```ts [SwitchProps.ts]
import type { WithGradientBackground } from "../WithGradientBackground";

export type SwitchProps = {
  checked?: boolean;
  thumbColor?: WithGradientBackground;
  backgroundColor?: WithGradientBackground;
  borderColor?: string;
  disabled?: boolean;
  size?: "mini" | "small" | "medium" | "large";
  controlled?: boolean; // 受控状态

  /* 颜色快捷方式 */
  brand?: boolean;
  default?: boolean;
  danger?: boolean;
  success?: boolean;
  warning?: boolean;
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
