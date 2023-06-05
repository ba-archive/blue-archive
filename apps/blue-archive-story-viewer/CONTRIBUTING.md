# 开发规范

项目使用 TS + Vue3 + Vite 进行开发。

其中，Vue SFC 组件使用 `<script setup>` 写法。

```vue
<script setup lang="ts">
// ...
</script>
```

## 命名规则

- 组件名称 : 大驼峰
- 函数 : function
- 函数命名 : 大驼峰
- 私有变量 : 小驼峰
- 公有变量 : 小驼峰
- 常量 : 全大写，单词之间使用 `_` 分隔
- 模板 : 大驼峰

## 注释规则

- 尽可能详细

## 提交信息

`提交类型`: `简要描述`

# 设计规范

## 预定义的 `CSS` 样式

提供了毛玻璃样式。`class` 为 `acrylic`。

```scss
.acrylic {
  position: relative;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  background-image: url('/src/assets/nnnoise.svg');
  background-position: center;
  background-repeat: repeat;
  overflow: hidden;
}
```

## 预定义的 `CSS` 布局

提供了以下预定义布局：

### 完全居中布局 `center`

```scss
.center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
```

### 水平居中布局 `flex-horizontal`

```scss
.flex-horizontal {
  display: flex;
  flex-direction: row;
  align-items: center;
}
```

### 垂直居中布局 `flex-vertical`

```scss
.flex-vertical {
  display: flex;
  flex-direction: column;
  align-items: center;
}
```

### 其他补充布局 `fill-width`, `fill-screen`

```scss
.fill-width {
  width: 100%;
}

.fill-screen {
  flex: 1;
}
```

## CSS 变量

### 颜色变量

颜色变量统一放置在 `/src/style.scss` 中的 `html` 选择器中，方便暗色模式使用。

```scss
html {
  --color-main-background: #edf4fb;
  --color-text-main: #2f2f2f;
  --color-text-ingame: #344a6e;
}

html[data-theme='dark'] {
  --color-main-background: #343e50;
  --color-text-main: #eee;
  --color-text-ingame: #eee;
}
```

### 圆角 `class`

总共有三种圆角半径，分别为 `0.5rem`、`1rem`、`2rem`。对应的 `class` 为 `rounded-small`、`rounded-medium`、`rounded-large`。

```scss
.rounded-small {
  border-radius: 0.5rem;
  -webkit-border-radius: 0.5rem;
}

.rounded-medium {
  border-radius: 1rem;
  -webkit-border-radius: 1rem;
}

.rounded-large {
  border-radius: 2rem;
  -webkit-border-radius: 2rem;
}
```

### 阴影 `class`

总共有三种阴影。对应 `class` 为 `shadow-near`, `shadow-far`, `shadow-farther`。

```scss
.shadow-near {
  box-shadow: 0.1rem 0.1rem 0.2rem var(--color-shadow-near);
}

.shadow-far {
  box-shadow: 0.2rem 0.2rem 0.5rem var(--color-shadow-far);
}

.shadow-farther {
  box-shadow: 0.2rem 0.2rem 1rem var(--color-shadow-farther);
}
```

对于 `:hover` 样式改变，提供三种变量。

```scss
html {
  --style-shadow-near: 0.1rem 0.1rem 0.2rem var(--color-shadow-near);
  --style-shadow-far: 0.2rem 0.2rem 0.5rem var(--color-shadow-far);
  --style-shadow-farther: 0.2rem 0.2rem 1rem var(--color-shadow-farther);
}
```
