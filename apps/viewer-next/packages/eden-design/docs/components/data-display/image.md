---
outline: deep
---

# 图片 / Image

> 展示和预览图片。

## 基础用法

展示图片。

<script setup lang="ts">
import EImage from "@eden-design/components/EImage.vue";
import EIconError from "@eden-design/components/icon/EIconError.vue";
import ESpace from "@eden-design/components/ESpace.vue";
import EText from "@eden-design/components/typography/EText.vue";
</script>

<ESpace
  vertical
  padding="10"
  size="small"
  class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
<EImage src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg" />
</ESpace>

:::details 查看代码

```vue
<template>
  <EImage src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg" />
</template>
```

:::

## 图片尺寸

使用 `width` 和 `height` 属性设置图片的尺寸。属性值可以是 `number` 或 `string` 类型。`string` 类型支持纯数字以及 `px`、`%`、`em`、`rem`、`(d)vh`、`(d)vw` 单位。

<ESpace vertical padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <ESpace align="end">
    <EImage src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg" width="64" height="64" />
  </ESpace>
</ESpace>

:::details 查看代码

```vue
<template>
  <ESpace align="end">
    <EImage
      src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg"
      width="64"
      height="64"
    />
  </ESpace>
</template>
```

:::

## 自定义圆角

使用 `border-radius` 属性设置图片的圆角。

<ESpace vertical padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <ESpace align="end">
    <EImage src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg" width="128" height="128" border-radius="10" />
  </ESpace>
</ESpace>

:::details 查看代码

```vue
<template>
  <ESpace align="end">
    <EImage
      src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg"
      width="128"
      height="128"
      border-radius="10"
    />
  </ESpace>
</template>
```

:::

## 圆形图片

使用 `circle` 属性设置图片为圆形。

<ESpace vertical padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <ESpace align="end">
    <EImage src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg" width="128" height="128" circle />
  </ESpace>
</ESpace>

:::details 查看代码

```vue
<template>
  <ESpace align="end">
    <EImage
      src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg"
      width="128"
      height="128"
      circle
    />
  </ESpace>
</template>
```

:::

## 图片描述

使用 `caption` 属性展示图片描述。也支持使用 `caption` 插槽自定义描述内容，具体请参考 [caption 插槽](#caption)。

<ESpace align="end" padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
    <EImage src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg" width="128" height="128" caption="这是一张图片" />
    <EImage src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg" width="128" height="128">
      <template #caption>
        <EText
          :color="{
            from: 'var(--arona-blue-6)',
            to: 'var(--arona-blue-2)',
            deg: '45deg',
          }"
          level="3"
          >自定义描述
        </EText>
      </template>
    </EImage>
</ESpace>

:::details 查看代码

```vue
<template>
  <EImage
    src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg"
    width="128"
    height="128"
    caption="这是一张图片"
  />
  <EImage
    src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg"
    width="128"
    height="128"
  >
    <template #caption>
      <EText
        :color="{
          from: 'var(--arona-blue-6)',
          to: 'var(--arona-blue-2)',
          deg: '45deg',
        }"
        level="3"
        >自定义描述
      </EText>
    </template>
  </EImage>
</template>
```

:::

## 点击预览

使用 `enable-preview` 属性开启点击预览。在预览界面点击图片以外的区域可关闭预览。

<ESpace vertical padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
    <EImage src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg" width="128" height="128" enable-preview />
</ESpace>

:::details 查看代码

```vue
<template>
  <EImage
    src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg"
    width="128"
    height="128"
    enable-preview
  />
</template>
```

:::

`EImagePreview` 组件也可单独抽离使用，具体请参考 [图片预览 / ImagePreview](./image-preview.md)。

## object-fit

使用 `fit` 属性设置图片的 `object-fit` 属性。

<ESpace padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <div class="flex flex-col rounded border border-1 border-solid border-[var(--arona-blue-6)]">
    <EImage
      src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg"
      width="128"
      height="128"
      fit="contain"
      caption="contain"
    />
  </div>
  <div class="flex flex-col rounded border border-1 border-solid border-[var(--arona-blue-6)]">
    <EImage
      src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg"
      width="128"
      height="128"
      fit="cover"
      caption="cover"
    />
  </div>
  <div class="flex flex-col rounded border border-1 border-solid border-[var(--arona-blue-6)]">
    <EImage
      src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg"
      width="128"
      height="128"
      fit="fill"
      caption="fill"
    />
  </div>
  <div class="flex flex-col rounded border border-1 border-solid border-[var(--arona-blue-6)]">
    <EImage
      src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg"
      width="128"
      height="128"
      fit="none"
      caption="none"
    />
  </div>
  <div class="flex flex-col rounded border border-1 border-solid border-[var(--arona-blue-6)]">
    <EImage
      src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg"
      width="128"
      height="128"
      fit="scale-down"
      caption="scale-down"
    />
  </div>
</ESpace>

:::details 查看代码

```vue
<template>
  <div
    class="flex flex-col rounded border border-1 border-solid border-[var(--arona-blue-6)]"
  >
    <EImage
      src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg"
      width="128"
      height="128"
      fit="contain"
      caption="contain"
    />
  </div>
  <div
    class="flex flex-col rounded border border-1 border-solid border-[var(--arona-blue-6)]"
  >
    <EImage
      src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg"
      width="128"
      height="128"
      fit="cover"
      caption="cover"
    />
  </div>
  <div
    class="flex flex-col rounded border border-1 border-solid border-[var(--arona-blue-6)]"
  >
    <EImage
      src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg"
      width="128"
      height="128"
      fit="fill"
      caption="fill"
    />
  </div>
  <div
    class="flex flex-col rounded border border-1 border-solid border-[var(--arona-blue-6)]"
  >
    <EImage
      src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg"
      width="128"
      height="128"
      fit="none"
      caption="none"
    />
  </div>
  <div
    class="flex flex-col rounded border border-1 border-solid border-[var(--arona-blue-6)]"
  >
    <EImage
      src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg"
      width="128"
      height="128"
      fit="scale-down"
      caption="scale-down"
    />
  </div>
</template>
```

:::

## 懒加载

使用 `lazy` 属性开启懒加载。

<ESpace vertical padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
    <EImage src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg" width="128" height="128" lazy />
</ESpace>

:::details 查看代码

```vue
<template>
  <EImage
    src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg"
    width="128"
    height="128"
    lazy
  />
</template>
```

:::

## 错误回滚

默认状态下，图片加载错误时会显示缺省错误样式。你也可以使用 `error` 插槽自定义加载错误后应该显示的内容。

<ESpace
  padding="10"
  size="small"
  class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">

<EImage src="https://example.com/image.jpg" width="128" height="128" />
<EImage src="https://example.com/image.jpg" width="128" height="128">
<template #error>

<div class="grid [grid-template-areas:image] place-items-center">
<EImage
            class="[grid-area:image]"
            src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg"
            width="128"
            height="128"
          />
<EText class="[grid-area:image]">自定义回滚内容</EText>
</div>
</template>
</EImage>
</ESpace>

:::details 查看代码

```vue
<template>
  <EImage src="https://example.com/image.jpg" width="128" height="128" />
  <EImage src="https://example.com/image.jpg" width="128" height="128">
    <template #error>
      <div class="grid [grid-template-areas:image] place-items-center">
        <EImage
          class="[grid-area:image]"
          src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg"
          width="128"
          height="128"
        />
        <EText class="[grid-area:image]">自定义回滚内容</EText>
      </div>
    </template>
  </EImage>
</template>
```

:::

## 插槽

### `error`

使用 `error` 插槽自定义图片加载错误时的显示内容。

<ESpace
vertical
padding="10"
size="small"
class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
<EImage src="https://example.com/image.jpg" width="128" height="128">
<template #error>

<div class="grid [grid-template-areas:image] place-items-center">
<EText class="[grid-area:image]" secondary level="3">自定义回滚内容</EText>
</div>
</template>
</EImage>
</ESpace>

:::details 查看代码

```vue
<template>
  <EImage src="https://example.com/image.jpg" width="128" height="128">
    <template #error>
      <div class="grid [grid-template-areas:image] place-items-center">
        <EText class="[grid-area:image]" secondary level="3"
        >自定义回滚内容</EText
        >
      </div>
    </template>
  </EImage>
</template>
```

:::

### `caption`

使用 `caption` 插槽自定义图片描述内容。也可以使用 `caption` 属性设置图片描述内容，具体请参考 [图片描述](#图片描述)。

<ESpace
vertical
padding="10"
size="small"
class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
<EImage
  src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg"
  width="128"
  height="128">
<template #caption>
<EText
      :color="{
        from: 'var(--arona-blue-6)',
        to: 'var(--arona-blue-2)',
        deg: '45deg',
      }"
      level="3"
      >自定义描述
</EText>
</template>
</EImage>
</ESpace>

:::details 查看代码

```vue
<template>
  <EImage
    src="https://cdn.sa.net/2024/09/15/HfLgdKCBeP2SbVW.jpg"
    width="128"
    height="128"
  >
    <template #caption>
      <EText
        :color="{
            from: 'var(--arona-blue-6)',
            to: 'var(--arona-blue-2)',
            deg: '45deg',
          }"
        level="3"
      >自定义描述
      </EText>
    </template>
  </EImage>
</template>
```

:::

## API

```ts
export type ImageProps = {
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  fit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  caption?: string;
  borderRadius?: string | number;
  enablePreview?: boolean;
  lazy?: boolean;
  circle?: boolean;
};
```
