---
outline: deep
---

# 输入框 / Input

> 输入：阿罗娜阿罗娜，谁是基沃托斯性能最强的 OS？ 谁是基沃托斯最优秀的 AI 助手？
>
> 输出：是我，是我，都是我。

## 基础用法

<script setup lang="ts">
import { ref } from 'vue';
import EInput from '@eden-design/components/input/EInput.vue';
import ESpace from '@eden-design/components/ESpace.vue';
import EText from '@eden-design/components/typography/EText.vue';
import EButton from '@eden-design/components/EButton.vue';
import { ElMessage } from 'element-plus';
const modelString = ref('');

const inputRef = ref<HTMLInputElement | null>(null);
const inputRef2 = ref<HTMLInputElement | null>(null);

function handleUpdateValue(value: string) {
  ElMessage.info(`输入内容：${value}`);
}

function handleFocus() {
  inputRef.value?.focus();
}

function handleDelayedBlur() {
  inputRef2.value?.focus();
  setTimeout(() => {
    inputRef2.value?.blur();
  }, 3000);
}
</script>

用 `v-model` 绑定输入框内容，用 `placeholder` 设置输入框的提示文字。

<ESpace wrap padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <EInput v-model="modelString" placeholder="我能吞下玻璃而不伤身体" />
  <EText>输入内容：{{ modelString }}</EText>
</ESpace>

:::details 查看代码

```vue
<template>
  <EInput v-model="modelString" placeholder="我能吞下玻璃而不伤身体" />
  <EText>输入内容：{{ modelString }}</EText>
</template>
```

:::

## 输入框尺寸

输入框有 `mini`、`small`、`medium`、`large` 四种尺寸。默认尺寸为 `medium`。

<ESpace vertical padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <EInput size="mini" placeholder="我能吞下玻璃而不伤身体" />
  <EInput size="small" placeholder="我能吞下玻璃而不伤身体" />
  <EInput size="medium" placeholder="我能吞下玻璃而不伤身体" />
  <EInput size="large" placeholder="我能吞下玻璃而不伤身体" />
</ESpace>

:::details 查看代码

```vue
<template>
  <EInput size="mini" placeholder="mini" />
  <EInput size="small" placeholder="small" />
  <EInput size="medium" placeholder="medium" />
  <EInput size="large" placeholder="large" />
</template>
```

:::

## 禁用状态

<ESpace wrap padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <EInput disabled placeholder="不吃了不吃了" />
</ESpace>

:::details 查看代码

```vue
<template>
  <EInput disabled placeholder="不吃了不吃了" />
</template>
```

:::

## 输入框宽度

输入框的宽度可以通过 `width` 属性设置。

<ESpace wrap padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <EInput width="100" placeholder="我能吞下玻璃而不伤身体" />
  <EInput width="100%" placeholder="我能吞下玻璃而不伤身体" />
</ESpace>

:::details 查看代码

```vue
<template>
  <EInput width="100" placeholder="我能吞下玻璃而不伤身体" />
  <EInput width="100%" placeholder="我能吞下玻璃而不伤身体" />
</template>
```

:::

## 前缀和后缀

可以通过 `prefix` 和 `suffix` 属性快速插入字符串前后缀。

也可以使用 `prefix` 和 `suffix` 插槽插入完全可自定义的内容。

<ESpace vertical wrap padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <EInput prefix="￥" />
  <EInput suffix="￥" />
</ESpace>

:::details 查看代码

```vue
<template>
  <EInput prefix="￥" />
  <EInput suffix="￥" />
</template>
```

:::

## 文本对齐

使用 `align` 属性设置文本对齐方式。

<ESpace vertical wrap padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <EInput align="left" placeholder="左对齐" />
  <EInput align="center" placeholder="居中对齐" />
  <EInput align="right" placeholder="右对齐" />
</ESpace>

:::details 查看代码

```vue
<template>
  <EInput align="left" placeholder="左对齐" />
  <EInput align="center" placeholder="居中对齐" />
  <EInput align="right" placeholder="右对齐" />
</template>
```

:::

## 事件

### update:value

当输入框内容发生变化时，会触发 `update:value` 事件。

<ESpace wrap padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <EInput @update:value="handleUpdateValue" />
</ESpace>

:::details 查看代码

```vue
<template>
  <EInput @update:value="handleUpdateValue" />
</template>

<script setup lang="ts">
function handleUpdateValue(value: string) {
  ElMessage.info(`输入内容：${value}`);
}
</script>
```

:::

### input

`input` 事件与 `update:value` 事件类似，但是 `input` 事件在输入框拼字时也会触发。

<ESpace wrap padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <EInput @input="handleUpdateValue" />
</ESpace>

:::details 查看代码

```vue
<template>
  <EInput @input="handleInput" />
</template>

<script setup lang="ts">
function handleInput(value: string) {
  ElMessage.info(`输入内容：${value}`);
}
</script>
```

## 插槽

### prefix

使用 `prefix` 插槽为输入框插入前缀。也可以用 `prefix` 属性快速插入字符串。

<ESpace wrap padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <EInput prefix="￥">
    <template #prefix>
      <EText secondary>￥</EText>
    </template>
  </EInput>
</ESpace>

:::details 查看代码

```vue
<template>
  <EInput>
    <template #prefix>
      <EText secondary>￥</EText>
    </template>
  </EInput>
</template>
```

:::

### suffix

使用 `suffix` 插槽为输入框插入后缀。也可以用 `suffix` 属性快速插入字符串。

<ESpace wrap padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <EInput>
    <template #suffix>
      <EText secondary>￥</EText>
    </template>
  </EInput>
</ESpace>

:::details 查看代码

```vue
<template>
  <EInput suffix="￥">
    <template #suffix>
      <EText secondary>￥</EText>
    </template>
  </EInput>
</template>
```

:::

## 方法

### focus()

将输入框设置为聚焦状态。

<ESpace wrap align="end" padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <EInput ref="inputRef" />
  <EButton @click="handleFocus">聚焦</EButton>
</ESpace>

:::details 查看代码

```vue
<template>
  <EInput ref="inputRef" />
  <EButton @click="handleFocus">聚焦</EButton>
</template>

<script setup lang="ts">
const inputRef = ref<HTMLInputElement | null>(null);

function handleFocus() {
  inputRef.value?.focus();
}
</script>
```

:::

### blur()

将输入框设置为失焦状态。

<ESpace wrap align="end" padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <EInput ref="inputRef2" />
  <EButton @click="handleDelayedBlur">聚焦，三秒后失焦</EButton>
</ESpace>

:::details 查看代码

```vue
<template>
  <EInput ref="inputRef" />
  <EButton @click="handleDelayedBlur">聚焦，三秒后失焦</EButton>
</template>

<script setup lang="ts">
const inputRef = ref<HTMLInputElement | null>(null);

function handleDelayedBlur() {
  handleFocus();
  setTimeout(() => {
    inputRef.value?.blur();
  }, 3000);
}
</script>
```

:::

## API

```ts
export type InputProps = {
  align?: "left" | "center" | "right";
  value?: string | number;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  disabled?: boolean;
  size?: "mini" | "small" | "medium" | "large";
  width?: string | number | "auto";
  type?: "text" | "number" | "password" | "email" | "tel" | "url";

  /* methods */
  focus?: () => void;
  blur?: () => void;
};
```
