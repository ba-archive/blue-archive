---
outline: deep
---

# 分割线 / Divider

> 对不同模块进行视觉分割。

## 基础用法

什么都不做。

<script setup lang="ts">
  import EDivider from "@eden-design/components/EDivider.vue"
  import ESpace from "@eden-design/components/ESpace.vue"
  import EText from "@eden-design/components/typography/EText.vue"
</script>

<ESpace align="stretch" padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <ESpace vertical wide size="mini">
    <template #divider>
      <EDivider />
    </template>
    <EText>观朱霞悟其明丽</EText>
    <EText>观白云悟其卷舒</EText>
    <EText>观山岳悟其灵奇</EText>
    <EText>观河海悟其浩瀚</EText>
    <EText>则俯仰间皆文章也</EText>
  </ESpace>
</ESpace>

:::details 查看代码

```vue
<template>
  <ESpace vertical wide size="mini">
    <template #divider>
      <EDivider />
    </template>
    <EText>观朱霞悟其明丽</EText>
    <EText>观白云悟其卷舒</EText>
    <EText>观山岳悟其灵奇</EText>
    <EText>观河海悟其浩瀚</EText>
    <EText>则俯仰间皆文章也</EText>
  </ESpace>
</template>
```

:::

## 垂直分割线

可以指定 `direction="vertical"` 或者快捷方式 `vertical` 来使用垂直分割线。

<ESpace align="stretch" padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <ESpace size="mini">
    <template #divider>
      <EDivider vertical />
    </template>
    <EText>鹅鹅鹅</EText>
    <EText>曲项向天歌</EText>
    <EText>白毛浮绿水</EText>
    <EText>红掌拨清波</EText>
  </ESpace>
</ESpace>

:::details 查看代码

```vue
<template>
  <ESpace size="mini">
    <template #divider>
      <EDivider vertical />
    </template>
    <EText>鹅鹅鹅</EText>
    <EText>曲项向天歌</EText>
    <EText>白毛浮绿水</EText>
    <EText>红掌拨清波</EText>
  </ESpace>
</template>
```

:::

## 虚线分割线

可以指定 `type="dashed"` 或者快捷方式 `dashed` 来使用虚线分割线。

<ESpace align="stretch" padding="10" size="small" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <ESpace vertical wide size="mini">
    <template #divider>
      <EDivider dashed />
    </template>
    <EText>观朱霞悟其明丽</EText>
    <EText>观白云悟其卷舒</EText>
    <EText>观山岳悟其灵奇</EText>
    <EText>观河海悟其浩瀚</EText>
    <EText>则俯仰间皆文章也</EText>
  </ESpace>
</ESpace>

:::details 查看代码

```vue
<template>
  <ESpace vertical wide size="mini">
    <template #divider>
      <EDivider dashed />
    </template>
    <EText>观朱霞悟其明丽</EText>
    <EText>观白云悟其卷舒</EText>
    <EText>观山岳悟其灵奇</EText>
    <EText>观河海悟其浩瀚</EText>
    <EText>则俯仰间皆文章也</EText>
  </ESpace>
</template>
```

:::

## API

```ts
export type DividerProps = {
  type?: "solid" | "dashed";
  dashed?: boolean; // shortcut for type="dashed"
  direction?: "horizontal" | "vertical";
  vertical?: boolean; // shortcut for direction="vertical"
};
```
