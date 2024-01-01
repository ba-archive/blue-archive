export interface IButtonProps {
  style?: "brand" | "success" | "danger" | "monochrome";
  type?: "primary" | "secondary" | "outline" | "text";
  size?: "mini" | "small" | "medium" | "large";
  link?: string;
  loading?: boolean;
  disabled?: boolean;
}

export interface IButtonGroupProps {
  size?: "mini" | "small" | "medium" | "large";
  vertical?: boolean;
}
