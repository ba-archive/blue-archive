---
outline: deep
---

# 设计规范

## 间距 / Spacing

组件之间的间距以及内部元素的间距。

<script setup>
  import ColorPalette from "@components/docs/ColorPalette.vue";
  import ColorPaletteGroup from "@components/docs/ColorPaletteGroup.vue";

  const aronaBlueGroup = {
  token: "阿罗娜蓝 / Arona Blue",
  description: "阿罗娜蓝是 Eden Design System 的主色，用于品牌标识和主要操作元素。",
  primary: true,
  background: false,
  palettes: [
    {
      color: "#2773E1",
      darkColor: "#4B91E7",
      description: "常规",
      token: "arona-blue-6",
    },
    {
      color: "#4A91E7",
      darkColor: "#397EE1",
      description: "悬浮",
      token: "arona-blue-5",
    },
    {
      color: "#1857BC",
      darkColor: "#70ADED",
      description: "点击",
      token: "arona-blue-7",
    },
    {
      color: "#6FACED",
      darkColor: "#225DBC",
      description: "特殊场景",
      token: "arona-blue-4",
    },
    {
      color: "#96C6F3",
      darkColor: "#114097",
      description: "一般禁用",
      token: "arona-blue-3",
    },
    {
      color: "#BEDEF9",
      darkColor: "#052772",
      description: "文字禁用",
      token: "arona-blue-2",
    },
    {
      color: "#E8F5FF",
      darkColor: "#00164D",
      description: "浅色/白底悬浮",
      token: "arona-blue-1",
    },
  ]
};

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
};

const fillGroup = {
  token: "填充色 / Fill",
  description: "填充色用于非主要类型的图标填充，以及部分元素的背景填充。",
  palettes: [
    {
      color: "#616161",
      darkColor: "#4B4B4B",
      description: "强调/图标/特殊场景",
      token: "color-fill-5",
    },
    {
      color: "#818181",
      darkColor: "#828284",
      description: "重/特殊场景",
      token: "color-fill-4",
    },
    {
      color: "#c0c0c0",
      darkColor: "#474749",
      description: "深/灰底悬浮",
      token: "color-fill-3",
    },
    {
      color: "#dfdfdf",
      darkColor: "#414144",
      description: "一般/常规/白底悬浮",
      token: "color-fill-2",
    },
    {
      color: "#f2f2f2",
      darkColor: "#37373A",
      description: "浅/禁用",
      token: "color-fill-1",
    },
    {
      color: "#fff",
      darkColor: "#242424",
      description: "白色",
      token: "color-fill-base",
    },
  ]
};

const textGroup = {
  token: "文字 / Text",
  description: "用于文本内容的展示。",
  palettes: [
    {
      color: "#242424",
      darkColor: "#fff",
      description: "强调/正文标题",
      token: "color-text-5",
    },
    {
      color: "#505050",
      darkColor: "#B8B8B8",
      description: "次强调/正文标题",
      token: "color-text-4",
    },
    {
      color: "#7c7c7c",
      darkColor: "#8C8C8C",
      description: "次要信息",
      token: "color-text-3",
    },
    {
      color: "#bdbdbd",
      darkColor: "#8C8C8C",
      description: "置灰信息",
      token: "color-text-2",
    },
    {
      color: "#fff",
      darkColor: "#1C1C1E",
      description: "纯白文字",
      token: "color-text-1",
    },
  ]
};

const borderGroup = {
  token: "边框 / Border",
  description: "用于边框的颜色。",
  palettes: [
    {
      color: "#a0a0a0",
      darkColor: "#6B6B6B",
      description: "重/按钮描边",
      token: "color-border-4",
    },
    {
      color: "#b3b3b3",
      darkColor: "#575757",
      description: "深/悬浮",
      token: "color-border-3",
    },
    {
      color: "#ececec",
      darkColor: "#474749",
      description: "一般",
      token: "color-border-2",
    },
    {
      color: "#f2f2f2",
      darkColor: "#37373A",
      description: "浅",
      token: "color-border-1",
    },
  ]
};

const successGroup = {
  token: "成功 / Success",
  description: "用于成功、通过状态的提示。",
  palettes: [
    {
      color: "#00b42a",
      darkColor: "#8ED051",
      description: "常规",
      token: "success-6",
    },
    {
      color: "#88d045",
      darkColor: "#7AC43D",
      description: "悬浮",
      token: "success-5",
    },
    {
      color: "#53a618",
      darkColor: "#AADC74",
      description: "点击",
      token: "success-7",
    },
    {
      color: "#c0e790",
      darkColor: "#408814",
      description: "禁用",
      token: "success-3",
    },
    {
      color: "#dbf3ba",
      darkColor: "#296A07",
      description: "特殊场景",
      token: "success-2",
    },
    {
      color: "#f6ffe8",
      darkColor: "#184D00",
      description: "浅色背景",
      token: "success-1",
    },
  ]
};

const warningGroup = {
  token: "警告 / Warning",
  description: "主要用于警告、重点提醒、等待类色彩。",
  palettes: [
    {
      color: "#ffd700",
      darkColor: "#FF9626",
      description: "常规",
      token: "warning-6",
    },
    {
      color: "#FF9A2E",
      darkColor: "#FF8D1F",
      description: "悬浮",
      token: "warning-5",
    },
    {
      color: "#D25F00",
      darkColor: "#FFB357",
      description: "点击",
      token: "warning-7",
    },
    {
      color: "#FFCF8B",
      darkColor: "#A64B0A",
      description: "禁用",
      token: "warning-3",
    },
    {
      color: "#FFE4BA",
      darkColor: "#793004",
      description: "特殊场景",
      token: "warning-2",
    },
    {
      color: "#FFF7E8",
      darkColor: "#4D1B00",
      description: "浅色背景",
      token: "warning-1",
    },
  ]
};

const dangerGroup = {
  token: "错误 / Danger",
  description: "主要用于危险、错误、失败状态的提示。",
  palettes: [
    {
      color: "#E9583B",
      darkColor: "#ED7D60",
      description: "常规",
      token: "danger-6",
    },
    {
      color: "#ED795B",
      darkColor: "#E96449",
      description: "悬浮",
      token: "danger-5",
    },
    {
      color: "#C23A25",
      darkColor: "#F29B81",
      description: "点击",
      token: "danger-7",
    },
    {
      color: "#F6B79F",
      darkColor: "#9B2215",
      description: "禁用",
      token: "danger-3",
    },
    {
      color: "#FBD4C3",
      darkColor: "#740D05",
      description: "特殊场景",
      token: "danger-2",
    },
    {
      color: "#FFF0E8",
      darkColor: "#4D0300",
      description: "浅色背景",
      token: "danger-1",
    },
  ]
};

const planaPinkGroup = {
  token: "普拉娜粉 / Plana Pink",
  description: "普拉娜粉是阿罗娜蓝的反色，用于品牌标识和主要操作元素。",
  palettes: [
    {
      color: "#E62C8C",
      darkColor: "#EB509B",
      description: "常规",
      token: "plana-pink-6",
    },
    {
      color: "#EB4F9A",
      darkColor: "#E63E95",
      description: "悬浮",
      token: "plana-pink-5",
    },
    {
      color: "#C01B76",
      darkColor: "#F076AD",
      description: "点击",
      token: "plana-pink-7",
    },
    {
      color: "#F599BF",
      darkColor: "#991462",
      description: "特殊场景",
      token: "plana-pink-3",
    },
    {
      color: "#FAC0D6",
      darkColor: "#73074A",
      description: "特殊场景",
      token: "plana-pink-2",
    },
    {
      color: "#FFE8F0",
      darkColor: "#4D0032",
      description: "浅色背景",
      token: "plana-pink-1",
    },
  ]
};

const strikerGroup = {
  token: "突击位｜错误 / Striker｜Danger",
  description: "用于表现游戏中的战术位置。",
  palettes: dangerGroup.palettes.map((palette) => {
    return {
      ...palette,
      token: palette.token.replace("danger", "striker"),
    };
  })
};

const specialGroup = {
  token: "特种位｜阿罗娜蓝 / Special｜Arona Blue",
  description: "用于表现游戏中的战术位置。",
  palettes: aronaBlueGroup.palettes.filter(i => "arona-blue-4" !== i.token).map((palette) => {
    return {
      ...palette,
      color: palette.color,
      token: palette.token.replace("arona-blue", "special"),
    };
  })
};

const explosionGroup = {
  token: "爆发 / Explosion",
  description: "用于表现游戏中的攻击和防御属性。",
  palettes: [
    {
      color: "#C23A25",
      darkColor: "#CE5D46",
      description: "常规",
      token: "explosion-6",
    },
    {
      color: "#CE5C45",
      darkColor: "#C24735",
      description: "悬浮",
      token: "explosion-5",
    },
    {
      color: "#A52618",
      darkColor: "#DA816B",
      description: "点击",
      token: "explosion-7",
    },
    {
      color: "#E7A48F",
      darkColor: "#871912",
      description: "禁用",
      token: "explosion-3",
    },
    {
      color: "#F3C9BA",
      darkColor: "#6A0906",
      description: "特殊场景",
      token: "explosion-2",
    },
    {
      color: "#FFEFE8",
      darkColor: "#4D0000",
      description: "浅色背景",
      token: "explosion-1",
    },
  ]
};

const pierceGroup = {
  token: "贯通 / Pierce",
  description: "用于表现游戏中的攻击和防御属性。",
  palettes: [
    {
      color: "#CC9213",
      darkColor: "#D6A834",
      description: "常规",
      token: "pierce-6",
    },
    {
      color: "#D6A937",
      darkColor: "#CC9827",
      description: "悬浮",
      token: "pierce-5",
    },
    {
      color: "#AC740C",
      darkColor: "#E0C05D",
      description: "点击",
      token: "pierce-7",
    },
    {
      color: "#EBD589",
      darkColor: "#8C5B0D",
      description: "禁用",
      token: "pierce-3",
    },
    {
      color: "#F5E9B7",
      darkColor: "#6C4105",
      description: "特殊场景",
      token: "pierce-2",
    },
    {
      color: "#FFFCE8",
      darkColor: "#4D2A00",
      description: "浅色背景",
      token: "pierce-1",
    },
  ]
};

const unarmedGroup = {
  token: "神秘 / Unarmed",
  description: "用于表现游戏中的攻击和防御属性。",
  palettes: [
    {
      color: "#216F9C",
      darkColor: "#408BB0",
      description: "常规",
      token: "unarmed-6",
    },
    {
      color: "#3E8AB0",
      darkColor: "#2C739C",
      description: "悬浮",
      token: "unarmed-5",
    },
    {
      color: "#165A88",
      darkColor: "#62A7C4",
      description: "点击",
      token: "unarmed-7",
    },
    {
      color: "#88C2D7",
      darkColor: "#0E4874",
      description: "禁用",
      token: "unarmed-3",
    },
    {
      color: "#B5DFEB",
      darkColor: "#043660",
      description: "特殊场景",
      token: "unarmed-2",
    },
    {
      color: "#E8FAFF",
      darkColor: "#00264D",
      description: "浅色背景",
      token: "unarmed-1",
    }
  ]
};

const vibrateGroup = {
  token: "振动 / Vibrate",
  description: "用于表现游戏中的攻击和防御属性。",
  palettes: [
    {
      color: "#995AA6",
      darkColor: "#B07FB8",
      description: "常规",
      token: "vibrate-6",
    },
    {
      color: "#AE71B8",
      darkColor: "#995CA6",
      description: "悬浮",
      token: "vibrate-5",
    },
    {
      color: "#7F3A90",
      darkColor: "#C498CA",
      description: "点击",
      token: "vibrate-7",
    },
    {
      color: "#D8A7DB",
      darkColor: "#652179",
      description: "禁用",
      token: "vibrate-3",
    },
    {
      color: "#ECC6ED",
      darkColor: "#4C0D63",
      description: "特殊场景",
      token: "vibrate-2",
    },
    {
      color: "#FFE8FF",
      darkColor: "#36004D",
      description: "浅色背景",
      token: "vibrate-1",
    }
  ]
};

  const textCn = "实用、美观与友好的三位一体";
  const textEn = "Pragmatic, aesthetic, friendly";
</script>

| 间距 | 描述                                             | 例                                         |
| ---- | ------------------------------------------------ | ------------------------------------------ |
| 1px  | 小型组件中父元素的 padding                       | small 尺寸的 Tag 中，标签文字到边框的距离  |
| 2px  | 小型组件中标题和辅助信息的间距                   | normal 尺寸的 Tag 中，标签文字到边框的距离 |
| 4px  | 多层嵌套组件内部元素的间距                       | large 尺寸的 Tag 中，标签文字到边框的距离  |
| 8px  | 组件内部元素的一般间距；互相关联的组件之间的间距 | MomoTalk 选项卡片中两个选项之间的间距      |
| 10px |                                                  |                                            |
| 12px |                                                  |                                            |
| 16px | 组件间元素的一般间距                             |                                            |
| 32px | 大型组件或布局间的间距，栅格单元格尺寸           |                                            |

## 栅格 / Grid

Eden Design System 的栅格宽度为 32px。

## 颜色 / Color

我们在不断尝试和调整的过程中总结出了一套适合 Eden Design System 的颜色体系，分为亮色和暗色两套色卡。你可以使用右上角的主题切换开关切换亮暗模式以对比两套色卡的差异。

::: tip
点击色号或色板可以复制当前色号的值到剪贴板；点击 token 可以复制当前色号 token 到剪贴板。
:::

### 主色 / Primary Color

<ColorPaletteGroup :group="aronaBlueGroup" />

### 中性色 / Neutral Color

<ColorPaletteGroup :group="grayGroup" />
<a-space />
<ColorPaletteGroup :group="fillGroup" />
<a-space />
<ColorPaletteGroup :group="textGroup" />
<a-space />
<ColorPaletteGroup :group="borderGroup" />

### 功能色 / Functional Color

<ColorPaletteGroup :group="successGroup" />
<a-space />
<ColorPaletteGroup :group="warningGroup" />
<a-space />
<ColorPaletteGroup :group="dangerGroup" />

### 其他系统色 / Other System Color

<ColorPaletteGroup :group="planaPinkGroup" />

### 战术位置 / Tactical Position Color

<ColorPaletteGroup :group="strikerGroup" />
<a-space />
<ColorPaletteGroup :group="specialGroup" />

### 攻防属性 / Attack & Defense Color

<ColorPaletteGroup :group="explosionGroup" />
<a-space />
<ColorPaletteGroup :group="pierceGroup" />
<a-space />
<ColorPaletteGroup :group="unarmedGroup" />

## 字体 / Typography

字体是体系化界面中最基本的构成之一。
用户通过文本来理解内容和完成工作，科学的字体系统能提升用户的阅读体验及工作效率。

本次设计中，我们对中文和英文进行了分别处理。中文段落使用 HarmonyOS Sans SC Regular，标题使用 HarmonyOS Sans SC Bold。英文段落使用 Wix Madefor Text Regular，标题使用 Wix Madefor Display SemiBold。

### 中文段落 / CJK Paragraph

中文段落使用的字体为 HarmonyOS Sans SC，字重为 Regular (400)。

<table class="w-full">
<tr>
  <th>字体展示</th>
  <th>字体规格</th>
  <th>语义化</th>
</tr>
<tr>
  <td style="font-size: 14px !important; line-height: 22px !important">{{textCn}}</td>
  <td>14/CN-Regular</td>
  <td>正文-小</td>
</tr>
<tr>
  <td style="font-size: 16px !important; line-height: 24px !important">{{textCn}}</td>
  <td>16/CN-Regular</td>
  <td>正文-中</td>
</tr>
<tr>
  <td style="font-size: 18px !important; line-height: 26px !important">{{textCn}}</td>
  <td>18/CN-Regular</td>
  <td>正文-大</td>
</tr>
<tr>
  <td style="font-size: 20px !important; line-height: 28px !important">{{textCn}}</td>
  <td>20/CN-Regular</td>
  <td>标题-小</td>
</tr>
<tr>
  <td style="font-size: 24px !important; line-height: 32px !important">{{textCn}}</td>
  <td>24/CN-Regular</td>
  <td>标题-中</td>
</tr>
<tr>
  <td style="font-size: 28px !important; line-height: 36px !important">{{textCn}}</td>
  <td>28/CN-Regular</td>
  <td>标题-大</td>
  </tr>
</table>

### 中文标题 / CJK Title

中文标题使用的字体为 HarmonyOS Sans SC，字重为 Bold (700)。

<table class="w-full">
<tr>
<th>字体展示</th>
<th>字体规格</th>
<th>语义化</th>
</tr>
<tr>
  <td class="title" style="font-size: 14px !important; line-height: 22px !important">{{textCn}}</td>
  <td>14/CN-SemiBold</td>
  <td>正文-小</td>
</tr>
<tr>
  <td class="title" style="font-size: 16px !important; line-height: 24px !important">{{textCn}}</td>
  <td>16/CN-SemiBold</td>
  <td>正文-中</td>
</tr>
<tr>
  <td class="title" style="font-size: 18px !important; line-height: 26px !important">{{textCn}}</td>
  <td>18/CN-SemiBold</td>
  <td>正文-大</td>
</tr>
<tr>
  <td class="title" style="font-size: 20px !important; line-height: 28px !important">{{textCn}}</td>
  <td>20/CN-SemiBold</td>
  <td>标题-小</td>
</tr>
<tr>
  <td class="title" style="font-size: 24px !important; line-height: 32px !important">{{textCn}}</td>
  <td>24/CN-SemiBold</td>
  <td>标题-中</td>
</tr>
<tr>
  <td class="title" style="font-size: 28px !important; line-height: 36px !important">{{textCn}}</td>
  <td>28/CN-SemiBold</td>
  <td>标题-大</td>
</tr>
<tr>
<td class="title" style="font-size: 32px !important; line-height: 40px !important">{{textCn}}</td>
<td>32/CN-SemiBold</td>
<td>运营标题-小</td>
</tr>
<tr>
<td class="title" style="font-size: 48px !important; line-height: 56px !important">{{textCn}}</td>
<td>48/CN-SemiBold</td>
<td>运营标题-中</td>
</tr>
<tr>
<td class="title" style="font-size: 64px !important; line-height: 72px !important">{{textCn}}</td>
<td>64/CN-SemiBold</td>
<td>运营标题-大</td>
</tr>
</table>

### 英文段落 / English Paragraph

英文段落使用的字体为 Wix Madefor Text，字重为 Regular。

<table class="w-full">
<tr>
<th>字体展示</th>
<th>字体规格</th>
<th>语义化</th>
</tr>
<tr>
  <td style="font-size: 14px !important; line-height: 22px !important">{{textEn}}</td>
  <td>14/EN-Regular</td>
  <td>正文-小</td>
</tr>
<tr>
  <td style="font-size: 16px !important; line-height: 24px !important">{{textEn}}</td>
  <td>16/EN-Regular</td>
  <td>正文-中</td>
</tr>
<tr>
  <td style="font-size: 18px !important; line-height: 26px !important">{{textEn}}</td>
  <td>18/EN-Regular</td>
  <td>正文-大</td>
</tr>
<tr>
  <td style="font-size: 20px !important; line-height: 28px !important">{{textEn}}</td>
  <td>20/EN-Regular</td>
  <td>标题-小</td>
</tr>
<tr>
  <td style="font-size: 24px !important; line-height: 32px !important">{{textEn}}</td>
  <td>24/EN-Regular</td>
  <td>标题-中</td>
</tr>
<tr>
  <td style="font-size: 28px !important; line-height: 36px !important">{{textEn}}</td>
  <td>28/EN-Regular</td>
  <td>标题-大</td>
</tr>
</table>

### 英文标题 / English Title

英文标题使用的字体为 Wix Madefor Display，字重为 Bold。

<table class="w-full">
<tr>
<th>字体展示</th>
<th>字体规格</th>
<th>语义化</th>
</tr>
<tr>
  <td class="title" style="font-size: 14px !important; line-height: 22px !important">{{textEn}}</td>
  <td>14/EN-Bold</td>
  <td>正文-小</td>
</tr>
<tr>
  <td class="title" style="font-size: 16px !important; line-height: 24px !important">{{textEn}}</td>
  <td>16/EN-Bold</td>
  <td>正文-中</td>
</tr>
<tr>
  <td class="title" style="font-size: 18px !important; line-height: 26px !important">{{textEn}}</td>
  <td>18/EN-Bold</td>
  <td>正文-大</td>
</tr>
<tr>
  <td class="title" style="font-size: 20px !important; line-height: 28px !important">{{textEn}}</td>
  <td>20/EN-Bold</td>
  <td>标题-小</td>
</tr>
<tr>
  <td class="title" style="font-size: 24px !important; line-height: 32px !important">{{textEn}}</td>
  <td>24/EN-Bold</td>
  <td>标题-中</td>
</tr>
<tr>
  <td class="title" style="font-size: 28px !important; line-height: 36px !important">{{textEn}}</td>
  <td>28/EN-Bold</td>
  <td>标题-大</td>
</tr>
<tr>
<td class="title" style="font-size: 32px !important; line-height: 40px !important">{{textEn}}</td>
<td>32/EN-Bold</td>
<td>运营标题-小</td>
</tr>
<tr>
<td class="title" style="font-size: 48px !important; line-height: 56px !important">{{textEn}}</td>
<td>48/EN-Bold</td>
<td>运营标题-中</td>
</tr>
<tr>
<td class="title" style="font-size: 64px !important; line-height: 72px !important">{{textEn}}</td>
<td>64/EN-Bold</td>
<td>运营标题-大</td>
</tr>
</table>
