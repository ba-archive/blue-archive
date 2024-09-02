export type InputProps = {
  value?: string | number;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  disabled?: boolean;
  readonly?: boolean;
  size?: "mini" | "small" | "medium" | "large";
  width?: string | number | "auto";
  type?: "text" | "number" | "password" | "email" | "tel" | "url";
  "update:value"?: (value: string) => void;
};
