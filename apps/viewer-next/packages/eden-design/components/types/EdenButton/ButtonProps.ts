import type { WithGradientBackground } from "~/packages/eden-design/components/types/WithGradientBackground";
import type { TextProps } from "~/packages/eden-design/components/types/EdenTextCore/TextProps";

export type ButtonProps = {
  active?: boolean;
  disabled?: boolean;
  size?: "mini" | "small" | "medium" | "large";
  background?: WithGradientBackground;
  bordered?: boolean;
  wide?: boolean;
  loading?: boolean;

  /* 按钮类型 */
  primary?: boolean;
  secondary?: boolean;

  /* 颜色快捷方式 */
  brand?: boolean; // 品牌色 $arona-blue-6/text-1
  default?: boolean; // =brand
  danger?: boolean; // 危险色 $danger-6, $danger-1, $danger-6
  success?: boolean; // 成功色 $success-6, $success-1, $success-6
  warning?: boolean; // 警告色 $warning-6, $warning-1, $warning-6
  momotalk?: boolean; // 特殊样式momotalk

  /* 字体样式 */
  textProps?: TextProps;
};
