---
outline: deep
---

# 数字输入框 / InputNumber

> 输入数字，输出数字。

## 基础用法

<script setup lang="ts">
import EInputNumber from "@eden-design/components/input/EInputNumber.vue";
import ESpace from "@eden-design/components/ESpace.vue";
import { ref } from "vue";
import { ElMessage } from "element-plus";

const value = ref(0);  
const value2 = ref(20);

function handleUpdateValue(value: number) {
  ElMessage.info(`值更新：${value}`);
}
</script>

用 `v-model` 绑定值，支持 `number` 类型。

<ESpace padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <EInputNumber v-model="value" />
</ESpace>

:::details 查看代码

```vue
<template>
  <EInputNumber v-model="value" />
</template>
```

:::

## 范围和步长

使用 `min` 和 `max` 属性设置输入框的最小值和最大值，使用 `step` 属性设置步长。

<ESpace padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <EInputNumber v-model="value2" :min="10" :max="100" :step="5" />
</ESpace>

:::details 查看代码

```vue
<template>
  <EInputNumber v-model="value" :min="10" :max="100" :step="5" />
</template>
```

:::

## 输入框宽度

使用 `width` 属性设置输入框宽度。

<ESpace padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <EInputNumber v-model="value" width="200px" />
</ESpace>

:::details 查看代码

```vue
<template>
  <EInputNumber v-model="value" width="200px" />
</template>
```

:::

## 禁用状态

使用 `disabled` 属性设置输入框是否禁用。

<ESpace padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <EInputNumber v-model="value" disabled />
</ESpace>

:::details 查看代码

```vue
<template>
  <EInputNumber v-model="value" disabled />
</template>
```

:::

## 事件

### `update:value`

当输入框的值发生变化时，会触发 `update:value` 事件，并传递当前值作为参数。

<ESpace padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <EInputNumber v-model="value" @update:value="handleUpdateValue" />
</ESpace>

:::details 查看代码

```vue
<template>
  <EInputNumber v-model="value" @update:value="handleUpdateValue" />
</template>
```

:::


## API

```ts
export type InputNumberProps = {
  align?: "left" | "center" | "right";
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  readonly?: boolean;
  width?: string | number | "auto";
  size?: "mini" | "small" | "medium" | "large";
};
```