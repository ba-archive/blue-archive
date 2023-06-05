# Neu UI 组件库

## 组件

### 进度条 Progress Bar

#### 接受参数

| 名称              | 必须 | 类型      | 默认值      | 说明           |
| ----------------- | ---- | --------- | ----------- | -------------- |
| `progress`        | ✅   | `number`  | `0`         | 进度条进度     |
| `show-percentage` | ❌   | `boolean` | `undefined` | 是否显示百分比 |

### 开关 Switch

#### 接受参数

| 名称              | 必须 | 类型                              | 默认值  | 说明                     |
| ----------------- | ---- | --------------------------------- | ------- | ------------------------ |
| `checked`         | ❌   | `boolean`                         | `false` | 开关是否开启             |
| `checked-value`   | ❌   | `boolean` \| `string` \| `number` | `true`  | 触发开启事件时 emit 的值 |
| `unchecked-value` | ❌   | `boolean` \| `string` \| `number` | `false` | 触发关闭事件时 emit 的值 |
