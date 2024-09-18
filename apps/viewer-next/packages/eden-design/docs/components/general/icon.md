---
outline: deep
---

# 图标 / Icon

> 很好，这份图标集里没有香菜。

## 基础用法

<script setup lang="ts">
  import { ref, computed, watch } from "vue";
  import ESpace from "@eden-design/components/ESpace.vue";
  import IconShowcase from "../../assets/components/IconShowcase.vue";
  import EInputNumber from "@eden-design/components/input/EInputNumber.vue";
  import EInput from "@eden-design/components/input/EInput.vue";
  import EText from "@eden-design/components/typography/EText.vue";
  import EIconAdd from "@eden-design/components/icon/EIconAdd.vue";
  import EIconError from "@eden-design/components/icon/EIconError.vue";

  const iconNameList = [
    "e-icon-add",
    "e-icon-close",
    "e-icon-subtract",
    "e-icon-error",
  ];

  const filteredIconNameList = computed(() => {
    return iconNameList.filter(name => name.includes(searchIconName.value));
  });

  const searchIconName = ref("");
  const iconSize = ref(24);
  const iconColor = ref("2773E1");
  const iconRotation = ref(0);
  const iconStrokeWidth = ref(2);
  watch(iconSize, (newVal) => {
    if (!newVal) {
      iconSize.value = 24;
    }
  });

  watch(iconRotation, (newVal) => {
    if (!newVal) {
      iconRotation.value = 0;
    }
  });

  watch(iconStrokeWidth, (newVal) => {
    if (!newVal) {
      iconStrokeWidth.value = 2;
    }
  });
</script>

<ESpace vertical size="large" wide>
  <ESpace wrap wide>
    <EInput width="100%" placeholder="输入图标名称搜索，点击可复制组件名" v-model="searchIconName" />
    <ESpace>
      <ESpace align="center" size="small">
        <EText>尺寸</EText>
        <EInputNumber width="100px" v-model="iconSize" />
      </ESpace>
      <ESpace align="center" size="small">
        <EText>颜色</EText>
        <EInput width="100px" v-model="iconColor" prefix="#"/>
      </ESpace>
      <ESpace align="center" size="small">
        <EText>描边</EText>
        <EInputNumber width="100px" v-model="iconStrokeWidth" />
      </ESpace>
      <ESpace align="center" size="small">
        <EText>旋转</EText>
        <EInputNumber width="100" v-model="iconRotation" />
      </ESpace>
    </ESpace>
  </ESpace>
  <ESpace>
    <IconShowcase v-for="name in filteredIconNameList" :key="name" :name="name" :size="iconSize" :color="'#' + iconColor" :rotate="iconRotation" :stroke-width="iconStrokeWidth" />
  </ESpace>
</ESpace>

## 图标尺寸

使用 `size` 属性可以设置图标尺寸。默认尺寸为 `16`。

<ESpace align="end" padding="10" size="small" class="demo-container rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <EIconAdd size="16" />
  <EIconAdd size="24" />
  <EIconAdd size="32" />
</ESpace>

:::details 查看代码

```vue
<template>
  <EIconAdd size="16" />
  <EIconAdd size="24" />
  <EIconAdd size="32" />
</template>
```

:::

## 图标颜色

使用 `color` 属性可以设置图标颜色。默认颜色为 `#616161`。

<ESpace align="end" padding="10" size="small" class="demo-container rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <EIconAdd color="#2773E1" />
  <EIconAdd color="arona-blue-5" />
  <EIconAdd color="arona-blue-4" />
  <EIconAdd color="arona-blue-3" />
  <EIconAdd color="arona-blue-2" />
  <EIconAdd color="arona-blue-1" />
</ESpace>

:::details 查看代码

```vue
<template>
  <EIconAdd color="#2773E1" />
  <EIconAdd color="arona-blue-5" />
  <EIconAdd color="arona-blue-4" />
  <EIconAdd color="arona-blue-3" />
  <EIconAdd color="arona-blue-2" />
  <EIconAdd color="arona-blue-1" />
</template>
```

:::

## 图标描边

使用 `strokeWidth` 属性可以设置图标描边宽度。（大部分时候没什么用）

默认描边宽度为 `2`。
<ESpace align="end" padding="10" size="small" class="demo-container rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
<EIconAdd stroke-width="1" />
<EIconAdd stroke-width="2" />
<EIconAdd stroke-width="3" />
</ESpace>

:::details 查看代码

```vue
<template>
  <EIconAdd stroke-width="1" />
  <EIconAdd stroke-width="2" />
  <EIconAdd stroke-width="3" />
</template>
```

:::

## 图标填充

用于 Menu 的图标有填充（激活）和默认两种状态，使用 `fill` 属性可以设置图标填充。（其他图标没有 `fill`）

默认为 `false`。

<ESpace align="end" padding="10" size="small" class="demo-container rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <EIconAdd fill />
</ESpace>

:::details 查看代码

```vue
<template>
  <EIconAdd fill />
</template>
```

:::

## 图标旋转

使用 `rotate` 属性可以设置图标旋转。默认旋转角度为 `0`。

<ESpace align="end" padding="10" size="small" class="demo-container rounded-md border-1 border-solid border-[var(--arona-blue-6)]">
  <EIconError rotate="90" />
  <EIconError rotate="180" />
  <EIconError rotate="270" />
</ESpace>

:::details 查看代码

```vue
<template>
  <EIconError rotate="90" />
  <EIconError rotate="180" />
  <EIconError rotate="270" />
</template>
```

## API

```ts
export type IconProps = {
  size?: string | number;
  color?: string;
  strokeWidth?: string;
  fill?: boolean; // 是否填充，用于 Menu 组件的图标有此特性
  rotate?: number | string;
};
```
