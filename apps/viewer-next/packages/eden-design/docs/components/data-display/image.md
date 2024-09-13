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

<ESpace vertical padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <ESpace align="end">
    <EImage src="https://s2.loli.net/2024/09/07/gvVuD6aqFNroPLe.jpg" width="128" height="128" />
    <EImage src="https://s2.loli.net/2024/09/07/gvVuD6aqFNroPLe.jpg" width="128" height="128" border-radius="10" />
    <EImage src="https://s2.loli.net/2024/09/07/gvVuD6aqFNroPLe.jpg" width="128" height="128" circle />
    <EImage
        src="https://example.com/image.jpg"
        width="128"
        height="128"
        circle
      />
  </ESpace>
</ESpace>

<details>
  <summary>查看代码</summary>

```vue
<template>
  <ESpace
    vertical
    padding="10"
    size="small"
    class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]"
  >
    <ESpace align="end">
      <EImage
        src="https://s2.loli.net/2024/09/07/gvVuD6aqFNroPLe.jpg"
        width="128"
        height="128"
      />
      <EImage
        src="https://s2.loli.net/2024/09/07/gvVuD6aqFNroPLe.jpg"
        width="128"
        height="128"
        border-radius="10"
      />
      <EImage
        src="https://s2.loli.net/2024/09/07/gvVuD6aqFNroPLe.jpg"
        width="128"
        height="128"
        circle
      />
      <EImage src="https://example.com/image.jpg" width="128" height="128" />
    </ESpace>
  </ESpace>
</template>
```

</details>

## 标签

使用 `caption` 属性展示图片描述。也支持使用 `caption` 插槽自定义描述内容。

<ESpace vertical padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <ESpace align="end">
    <EImage src="https://s2.loli.net/2024/09/07/gvVuD6aqFNroPLe.jpg" width="128" height="128" caption="这是一张图片" />
    <EImage src="https://s2.loli.net/2024/09/07/gvVuD6aqFNroPLe.jpg" width="128" height="128">
      <template #caption>
        <EText
          :color="{
            from: 'var(--arona-blue-6)',
            to: 'var(--arona-blue-2)',
            deg: '45deg',
          }"
          >自定义描述
        </EText>
      </template>
    </EImage>
  </ESpace>
</ESpace>

<details>
  <summary>查看代码</summary>

```vue
<template>
  <ESpace
    vertical
    padding="10"
    size="small"
    class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]"
  >
    <ESpace align="end">
      <EImage
        src="https://s2.loli.net/2024/09/07/gvVuD6aqFNroPLe.jpg"
        width="128"
        height="128"
        caption="这是一张图片"
      />
      <EImage
        src="https://s2.loli.net/2024/09/07/gvVuD6aqFNroPLe.jpg"
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
            >自定义描述
          </EText>
        </template>
      </EImage>
    </ESpace>
  </ESpace>
</template>
```

</details>

## 点击预览

使用 `enable-preview` 属性开启点击预览。

<ESpace vertical padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <ESpace align="end">
    <EImage src="https://s2.loli.net/2024/09/07/gvVuD6aqFNroPLe.jpg" width="128" height="128" enable-preview />
  </ESpace>
</ESpace>

<details>
  <summary>查看代码</summary>

```vue
<template>
  <ESpace
    vertical
    padding="10"
    size="small"
    class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]"
  >
    <ESpace align="end">
      <EImage
        src="https://s2.loli.net/2024/09/07/gvVuD6aqFNroPLe.jpg"
        width="128"
        height="128"
        enable-preview
      />
    </ESpace>
  </ESpace>
</template>
```

</details>

## object-fit

使用 `fit` 属性设置图片的 `object-fit` 属性。

<ESpace>
  <div class="flex flex-col rounded border border-1 border-solid border-[var(--arona-blue-6)]">
    <EImage
      src="https://s2.loli.net/2024/09/07/gvVuD6aqFNroPLe.jpg"
      width="128"
      height="128"
      fit="contain"
      caption="contain"
    />
  </div>
  <div class="flex flex-col rounded border border-1 border-solid border-[var(--arona-blue-6)]">
    <EImage
      src="https://s2.loli.net/2024/09/07/gvVuD6aqFNroPLe.jpg"
      width="128"
      height="128"
      fit="cover"
      caption="cover"
    />
  </div>
  <div class="flex flex-col rounded border border-1 border-solid border-[var(--arona-blue-6)]">
    <EImage
      src="https://s2.loli.net/2024/09/07/gvVuD6aqFNroPLe.jpg"
      width="128"
      height="128"
      fit="fill"
      caption="fill"
    />
  </div>
  <div class="flex flex-col rounded border border-1 border-solid border-[var(--arona-blue-6)]">
    <EImage
      src="https://s2.loli.net/2024/09/07/gvVuD6aqFNroPLe.jpg"
      width="128"
      height="128"
      fit="none"
      caption="none"
    />
  </div>
  <div class="flex flex-col rounded border border-1 border-solid border-[var(--arona-blue-6)]">
    <EImage
      src="https://s2.loli.net/2024/09/07/gvVuD6aqFNroPLe.jpg"
      width="128"
      height="128"
      fit="scale-down"
      caption="scale-down"
    />
  </div>
</ESpace>

<details>
  <summary>查看代码</summary>

```vue
<template>
  <ESpace>
    <div
      class="flex flex-col rounded border border-1 border-solid border-[var(--arona-blue-6)]"
    >
      <EImage
        src="https://s2.loli.net/2024/09/07/gvVuD6aqFNroPLe.jpg"
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
        src="https://s2.loli.net/2024/09/07/gvVuD6aqFNroPLe.jpg"
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
        src="https://s2.loli.net/2024/09/07/gvVuD6aqFNroPLe.jpg"
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
        src="https://s2.loli.net/2024/09/07/gvVuD6aqFNroPLe.jpg"
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
        src="https://s2.loli.net/2024/09/07/gvVuD6aqFNroPLe.jpg"
        width="128"
        height="128"
        fit="scale-down"
        caption="scale-down"
      />
    </div>
  </ESpace>
</template>
```

</details>

## 懒加载

使用 `lazy` 属性开启懒加载。

<ESpace vertical padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <ESpace align="end">
    <EImage src="https://s2.loli.net/2024/09/07/gvVuD6aqFNroPLe.jpg" width="128" height="128" lazy />
  </ESpace>
</ESpace>

<details>
  <summary>查看代码</summary>

```vue
<template>
  <ESpace
    vertical
    padding="10"
    size="small"
    class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]"
  >
    <ESpace align="end">
      <EImage
        src="https://s2.loli.net/2024/09/07/gvVuD6aqFNroPLe.jpg"
        width="128"
        height="128"
        lazy
      />
    </ESpace>
  </ESpace>
</template>
```

</details>

## 失败回滚

默认状态下，图片加载失败时会显示缺省错误样式。你也可以使用 `error` 插槽自定义失败回滚内容。

<ESpace
  vertical
  padding="10"
  size="small"
  class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]"
>
  <ESpace align="end">
    <EImage src="https://example.com/image.jpg" width="128" height="128" />
    <EImage src="https://example.com/image.jpg" width="128" height="128">
      <template #error>
        <div class="grid [grid-template-areas:image] place-items-center">
          <EImage
            class="[grid-area:image]"
            src="https://s2.loli.net/2024/09/07/gvVuD6aqFNroPLe.jpg"
            width="128"
            height="128"
          />
          <EText class="[grid-area:image]">自定义回滚内容</EText>
        </div>
      </template>
    </EImage>
  </ESpace>
</ESpace>

<details>
  <summary>查看代码</summary>

```vue
<template>
  <ESpace
    vertical
    padding="10"
    size="small"
    class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]"
  >
    <ESpace align="end">
      <EImage src="https://example.com/image.jpg" width="128" height="128" />
      <EImage src="https://example.com/image.jpg" width="128" height="128">
        <template #error>
          <div class="grid [grid-template-areas:image] place-items-center">
            <EImage
              class="[grid-area:image]"
              src="https://s2.loli.net/2024/09/07/gvVuD6aqFNroPLe.jpg"
              width="128"
              height="128"
            />
            <EText class="[grid-area:image]">自定义回滚内容</EText>
          </div>
        </template>
      </EImage>
    </ESpace>
  </ESpace>
</template>
```

</details>

## 属性

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
