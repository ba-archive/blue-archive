---
outline: deep
---

# 滑动输入条 / Slider

> 选择的范围有限。

## 基础用法

用 `v-model` 绑定当前值。

<script setup lang="ts">
import { ref } from 'vue';
import ESlider from '@eden-design/components/ESlider.vue';
import ESpace from '@eden-design/components/ESpace.vue';
import EText from '@eden-design/components/typography/EText.vue';
import EInputNumber from '@eden-design/components/input/EInputNumber.vue';
import { ElMessage } from 'element-plus';

const value = ref(50);
const value2 = ref(50);
const value3 = ref(50);
const value4 = ref(50);

function handleUpdateValue(value: number) {
  ElMessage.info(`当前值：${value}`);
}
</script>

<ESpace align="center" padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <ESlider v-model="value" />
  <EText>当前值：{{ value }}</EText>
</ESpace>

:::details 查看代码

```vue
<template>
  <ESlider v-model="value" />
  <EText>当前值：{{ value }}</EText>
</template>

<script setup lang="ts">
const value = ref(50);
</script>
```

:::

## 设置范围

用 `min` 和 `max` 属性设置范围。

<ESpace align="center" padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <ESlider v-model="value2" :min="10" :max="90" />
  <EText>当前值：{{ value2 }}</EText>
</ESpace>

:::details 查看代码

```vue
<template>
  <ESpace
    align="center"
    padding="10"
    size="small"
    class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]"
  >
    <ESlider v-model="value2" :min="10" :max="90" />
    <EText>当前值：{{ value2 }}</EText>
  </ESpace>
</template>

<script setup lang="ts">
const value2 = ref(50);
</script>
```

:::

## 设置步长

用 `step` 属性设置步长。

<ESpace align="center" padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <ESlider v-model="value3" :step="10" />
  <EText>当前值：{{ value3 }}</EText>
</ESpace>

:::details 查看代码

```vue
<template>
  <ESlider v-model="value3" :step="10" />
  <EText>当前值：{{ value3 }}</EText>
</template>

<script setup lang="ts">
const value3 = ref(50);
</script>
```

:::

## 受控状态

用 `value` 属性设置当前值，并且使用 `controlled` 声明组件的受控状态。

<ESpace align="center" padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <ESlider v-model="value4" controlled />
  <ESpace>
    <EText>当前值：</EText>
    <EInputNumber v-model="value4" />
  </ESpace>
</ESpace>

:::details 查看代码

```vue
<template>
  <ESlider v-model="value4" controlled />
  <ESpace>
    <EText>当前值：</EText>
    <EInputNumber v-model="value4" />
  </ESpace>
</template>

<script setup lang="ts">
const value4 = ref(50);
</script>
```

:::

## 禁用状态

用 `disabled` 属性设置禁用状态。

<ESpace align="center" padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <ESlider :value="50" disabled />
</ESpace>

:::details 查看代码

```vue
<template>
  <ESlider :value="50" disabled />
</template>
```

:::

## 预设颜色

用 `brand`=`default`、`danger`、`success`、`warning` 属性设置预设颜色。

<ESpace vertical padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <ESlider :value="50" brand />
  <ESlider :value="50" danger />
  <ESlider :value="50" success />
  <ESlider :value="50" warning />
</ESpace>

:::details 查看代码

```vue
<template>
  <ESlider :value="50" brand />
  <ESlider :value="50" danger />
  <ESlider :value="50" success />
  <ESlider :value="50" warning />
</template>
```

:::

## 自定义颜色

用 `traveledBackground` 和 `thumbBorderColor` 属性设置自定义颜色。

摇杆边框颜色暂不支持设置渐变。

<ESpace vertical padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <ESlider :value="50" traveledBackground="#242424" thumbBorderColor="#242424" />
  <ESlider :value="50" :traveledBackground="{ from: 'var(--arona-blue-6)', to: 'var(--arona-blue-1)', deg: 90 }" />
</ESpace>

:::details 查看代码

```vue
<template>
  <ESlider
    :value="50"
    traveledBackground="#242424"
    thumbBorderColor="#242424"
  />
  <ESlider
    :value="50"
    :traveledBackground="{
      from: 'var(--arona-blue-6)',
      to: 'var(--arona-blue-1)',
      deg: 90,
    }"
  />
</template>
```

:::

## 事件

### `update:value`

当滑动条的值发生变化时，会触发 `update:value` 事件。

<ESpace align="center" padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <ESlider :value="50" @update:value="handleUpdateValue" />
</ESpace>

:::details 查看代码

```vue
<template>
  <ESlider :value="50" @update:value="handleUpdateValue" />
</template>

<script setup lang="ts">
function handleUpdateValue(value: number) {
  ElMessage.info(`当前值：${value}`);
}
```

:::

## API

:::code-group

```ts [SliderProps.ts]
import type { WithGradientBackground } from "../WithGradientBackground";

export type SliderProps = {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  traveledBackground?: WithGradientBackground;
  thumbBorderColor?: string;
  width?: number | string;
  controlled?: boolean; // 受控状态

  /* 颜色快捷方式 */
  brand?: boolean; // 品牌色 $arona-blue-6/text-1
  default?: boolean; // =brand
  danger?: boolean; // 危险色 $danger-6, $danger-1, $danger-6
  success?: boolean; // 成功色 $success-6, $success-1, $success-6
  warning?: boolean; // 警告色 $warning-6, $warning-1, $warning-6
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
