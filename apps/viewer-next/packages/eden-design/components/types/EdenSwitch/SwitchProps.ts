import type { WithGradientBackground } from "../WithGradientBackground";

export type SwitchProps = {
  checked?: boolean;
  thumbColor?: WithGradientBackground;
  backgroundColor?: WithGradientBackground;
  borderColor?: WithGradientBackground;
  disabled?: boolean;
  "update:checked"?: (checked: boolean) => void;
  size?: "mini" | "small" | "medium" | "large";
  // medium: 40x20px
  /* 颜色快捷方式 */
  brand?: boolean;
  default?: boolean;
  danger?: boolean;
  success?: boolean;
  warning?: boolean;
};
