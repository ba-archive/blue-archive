---
outline: deep
---

# 设计规范

## 间距 / Spacing

组件之间的间距以及内部元素的间距。

<script setup>
  import ColorPalette from "@components/docs/ColorPalette.vue";
  import ColorPaletteGroup from "@components/docs/ColorPaletteGroup.vue";

    const columns = [
      {
          title: "间距",
      dataIndex: "spacing",
      },
      {
        title: "描述",
        dataIndex: "description",
      },
      {
        title: "例",
        dataIndex: "example",
      }
    ];

    const data = [
      {
        spacing: "1px",
        description: "小型组件中父元素的 padding",
        example: "small 尺寸的 Tag 中，标签文字到边框的距离",
      },
      {
        spacing: "2px",
        description: "小型组件中标题和辅助信息的间距",
        example: "normal 尺寸的 Tag 中，标签文字到边框的距离",
      },
      {
        spacing: "4px",
        description: "多层嵌套组件内部元素的间距",
        example: "large 尺寸的 Tag 中，标签文字到边框的距离",
      },
      {
        spacing: "8px",
        description: "组件内部元素的一般间距；互相关联的组件之间的间距",
        example: "MomoTalk 选项卡片中两个选项之间的间距",
      },
      {
        spacing: "10px",
        description: ""
      },
      {
        spacing: "12px",
        description: ""
      },
      {
        spacing: "16px",
        description: "组件间元素的一般间距"
      },
      {
        spacing: "32px",
        description: "大型组件或布局间的间距，栅格单元格尺寸"
      },
    ]
</script>

<a-table :columns="columns" :data="data" :pagination="false" size="medium" :bordered="false"></a-table>

## 栅格 / Grid

Eden Design System 的栅格宽度为 32px。

## 颜色 / Color

<script>
  const aronaBlueGroup = {
    token: "阿罗娜蓝 / Arona Blue",
    description: "阿罗娜蓝是 Eden Design System 的主色，用于品牌标识和主要操作元素。",
    primary: true,
    background: false,
    palettes: [
      {
        color: "#2773E1",
        description: "常规",
        token: "arona-blue-6",
      },
      {
        color: "#4A91E7",
        description: "悬浮",
        token: "arona-blue-5",
      },
      {
        color: "#1857BC",
        description: "点击",
        token: "arona-blue-7",
      },
      {
        color: "#6FACED",
        description: "特殊场景",
        token: "arona-blue-4",
      },
      {
        color: "#96C6F3",
        description: "一般禁用",
        token: "arona-blue-3",
      },
      {
        color: "#BEDEF9",
        description: "文字禁用",
        token: "arona-blue-2",
      },
      {
        color: "#E8F5FF",
        description: "浅色/白底悬浮",
        token: "arona-blue-1",
      },
    ]
  }

  const grayGroup = {
    token: "灰度 / Gray",
    description: "灰度色卡包含了从纯黑到纯白共 9 个色阶。",
    palettes: [
      {
        color: "#000",
        description: "纯黑",
        token: "color-gray-9",
      },
      {
        color: "#141414",
        description: "8 度灰",
        token: "color-gray-8",
      },
      {
        color: "#242424",
        description: "14 度灰",
        token: "color-gray-7",
      },
      {
        color: "#404040",
        description: "25 度灰",
        token: "color-gray-6",
      },
      {
        color: "#7c7c7c",
        description: "49 度灰",
        token: "color-gray-5",
      },
      {
        color: "#c0c0c0",
        description: "75 度灰",
        token: "color-gray-4",
      },
      {
        color: "#dfdfdf",
        description: "87 度灰",
        token: "color-gray-3",
      },
      {
        color: "#f2f2f2",
        description: "95 度灰",
        token: "color-gray-2",
      },
      {
        color: "#fff",
        description: "纯白",
        token: "color-gray-1",
      },
    ]
  }

  const fillGroup = {
    token: "填充色 / Fill",
    description: "填充色用于非主要类型的图标填充，以及部分元素的背景填充。",
    palettes: [
      {
        color: "#616161",
        description: "强调/图标/特殊场景",
        token: "color-fill-5",
      },
      {
        color: "#818181",
        description: "重/特殊场景",
        token: "color-fill-4",
      },
      {
        color: "#c0c0c0",
        description: "深/灰底悬浮",
        token: "color-fill-3",
      },
      {
        color: "#dfdfdf",
        description: "一般/常规/白底悬浮",
        token: "color-fill-2",
      },
      {
        color: "#f2f2f2",
        description: "浅/禁用",
        token: "color-fill-1",
      },
      {
        color: "#fff",
        description: "白色",
        token: "color-fill-base",
      },
    ]
  }
</script>

### 主色 / Primary Color

<ColorPaletteGroup :group="aronaBlueGroup" />

### 中性色 / Neutral

<ColorPaletteGroup :group="grayGroup" />
<a-divider />
<ColorPaletteGroup :group="fillGroup" />
