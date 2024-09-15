---
outline: deep
---

# 图片预览 / ImagePreview

> 预览图片。

## 基础用法

手动控制展示图片预览。在预览界面点击图片以外的区域可关闭预览。

<script setup lang="ts">
import EImagePreview from "@eden-design/components/EImagePreview.vue";
import EButton from "@eden-design/components/EButton.vue";
import ESpace from "@eden-design/components/ESpace.vue";
import { ref } from "vue";

const showPreview = ref(false);

function handleShowPreview() {
  showPreview.value = true;
}

function handleClosePreview() {
  showPreview.value = false;
}
</script>

<ESpace padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <EImagePreview v-if="showPreview" src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg" @close="handleClosePreview" />
  <EButton @click="handleShowPreview">展示图片预览</EButton>
</ESpace>

:::details 查看代码

```vue
<template>
  <EImagePreview
    v-if="showPreview"
    src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg"
    @close="handleClosePreview"
  />
  <EButton @click="handleShowPreview">展示图片预览</EButton>
</template>

<script setup lang="ts">
import { ref } from "vue";

const showPreview = ref(false);

function handleShowPreview() {
  showPreview.value = true;
}

function handleClosePreview() {
  showPreview.value = false;
}
</script>
```

:::

## API

```ts
export type ImagePreviewProps = {
  src: string;
};
```