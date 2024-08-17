import type { WithGradientBackground } from "~/packages/eden-design/components/types/WithGradientBackground";

export type AvatarProps = {
  /* 头像属性 */
  alt?: string;
  background?: WithGradientBackground;
  bordered?: boolean;
  borderColor?: string;
  borderWidth?: number | string;
  squared?: boolean;
  size?:
    | number
    | string
    | "mini"
    | "small"
    | "medium"
    | "large"
    | "xlarge"
    | "auto";
  src?: string;
  fallbackSrc?: string;
};
