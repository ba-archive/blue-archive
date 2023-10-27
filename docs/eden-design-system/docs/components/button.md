---
outline: deep
---

# 按钮 / Button

按钮用于触发一个操作，也可能是触发一个 bug。

## 基础用法

:::demo 按钮分为 `filled`（默认），`outline`，`dashed`，`text` 四种显示模式，支持 `mini`，`small`，`normal`，`large` 四种尺寸。

button/basic

:::

## 按钮类型

::: 按钮有 `primary`, `secondary`（默认），`success`, `warning`, `danger` 六种类型。

button/type

:::

## 禁用状态

:::demo 按钮有 `disabled` 状态。

button/disabled

:::

## 图标按钮

:::demo 按钮内可以是图标。

button/icon

:::

## 加载状态按钮

:::demo 按钮有 `loading` 状态。

button/loading

:::

## 组合按钮

:::demo 按钮可以组合在一起。

button/group

:::

## API

### 属性 / Props

| 属性名   | 类型                                                                     | 说明         | 默认值        |
| -------- | ------------------------------------------------------------------------ | ------------ | ------------- |
| mode     | `'filled'` \| `'outline'` \| `'dashed'` \| `'text'`                      | 按钮显示模式 | `'filled'`    |
| type     | `'primary'` \| `'secondary'` \| `'success'` \| `'warning'` \| `'danger'` | 按钮类型     | `'secondary'` |
| size     | `'mini'` \| `'small'` \| `'normal'` \| `'large'`                         | 按钮尺寸     | `'normal'`    |
| disabled | `boolean`                                                                | 是否禁用     | `false`       |
| loading  | `boolean`                                                                | 是否加载中   | `false`       |

### 插槽 / Slots

| 插槽名  | 说明     |
| ------- | -------- |
| default | 按钮内容 |
| icon    | 按钮图标 |

### EButtonGroup 属性 / EButtonGroup Props

| 属性名 | 类型                                                                     | 说明                   | 默认值      |
| ------ | ------------------------------------------------------------------------ | ---------------------- | ----------- |
| mode   | `'filled'` \| `'outline'` \| `'dashed'` \| `'text'`                      | 该按钮组内按钮显示模式 | `'filled'`  |
| type   | `'primary'` \| `'secondary'` \| `'success'` \| `'warning'` \| `'danger'` | 该按钮组内按钮类型     | `secondary` |
| size   | `'mini'` \| `'small'` \| `'normal'` \| `'large'`                         | 该按钮组内按钮尺寸     | `'normal'`  |
