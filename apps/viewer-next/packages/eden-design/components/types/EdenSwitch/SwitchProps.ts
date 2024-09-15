import type { WithGradientBackground } from "../WithGradientBackground";

export type SwitchProps = {
  checked?: boolean;
  thumbColor?: WithGradientBackground;
  backgroundColor?: WithGradientBackground;
  borderColor?: string;
  disabled?: boolean;
  size?: "mini" | "small" | "medium" | "large";
  controlled?: boolean; // 受控状态

  /* 颜色快捷方式 */
  brand?: boolean;
  default?: boolean;
  danger?: boolean;
  success?: boolean;
  warning?: boolean;
};
