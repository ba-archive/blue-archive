export type InputNumberProps = {
  align?: "left" | "center" | "right";
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  readonly?: boolean;
  width?: string | number | "auto";
  size?: "mini" | "small" | "medium" | "large";
};