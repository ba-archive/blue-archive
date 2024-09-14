export type InputProps = {
  align?: "left" | "center" | "right";
  value?: string | number;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  disabled?: boolean;
  size?: "mini" | "small" | "medium" | "large";
  width?: string | number | "auto";
  type?: "text" | "number" | "password" | "email" | "tel" | "url";

  /* methods */
  focus?: () => void;
  blur?: () => void;

  /* number */
  min?: number;
  max?: number;
  step?: number;
};
