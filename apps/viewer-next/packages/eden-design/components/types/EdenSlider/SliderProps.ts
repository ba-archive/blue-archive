import type { WithGradientBackground } from "../WithGradientBackground";

export type SliderProps = {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  traveledBackground?: WithGradientBackground;
  thumbBorderColor?: string;
  width?: number | string;
  controlled?: boolean; // 受控状态

  /* 颜色快捷方式 */
  brand?: boolean; // 品牌色 $arona-blue-6/text-1
  default?: boolean; // =brand
  danger?: boolean; // 危险色 $danger-6, $danger-1, $danger-6
  success?: boolean; // 成功色 $success-6, $success-1, $success-6
  warning?: boolean; // 警告色 $warning-6, $warning-1, $warning-6
};