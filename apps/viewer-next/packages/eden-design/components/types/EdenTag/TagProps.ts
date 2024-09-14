import type { WithGradientBackground } from "~/packages/eden-design/components/types/WithGradientBackground";
import type { TextProps } from "~/packages/eden-design/components/types/EdenTextCore/TextProps";

export type TagProps = {
  active?: boolean;
  clickable?: boolean;
  disabled?: boolean;
  fill?: boolean;
  id?: string | number;
  size?: "mini" | "small" | "medium" | "large";
  bordered?: boolean;
  background?: WithGradientBackground;

  /* 文字样式 */
  textProps?: TextProps;

  /* 标签类型 */
  type?:
    | "default"
    | "brand"
    | "gray"
    | "striker"
    | "special"
    | "explosion"
    | "pierce"
    | "unarmed"
    | "vibrate"
    | "selector";

  /* 颜色快捷方式，以下所有快捷方式中只能使用一种 */
  default?: boolean; // 默认色 $text-5, transparent, $border-2
  brand?: boolean; // 品牌色 $arona-blue-6, $arona-blue-1, $arona-blue-6
  gray?: boolean; // 单色 $text-3, $fill-1, $border-2

  /* 特殊标签 */
  striker?: boolean; // 前排 $danger-6/$fill-base
  special?: boolean; // 特殊 $warning-6/$fill-base
  explosion?: boolean; // 爆发 $explosion-6/$fill-base
  pierce?: boolean; // 贯通 $pierce-6/$fill-base
  unarmed?: boolean; // 神秘 $unarmed-6/$fill-base
  vibrate?: boolean; // 振动 $vibrate-6/$fill-base

  /* 学生、社团选择器样式 */
  selector?: boolean;
};
