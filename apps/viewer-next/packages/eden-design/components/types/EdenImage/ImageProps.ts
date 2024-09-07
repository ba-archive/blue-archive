export type ImageProps = {
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  fit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  caption?: string;
  borderRadius?: string | number;
  enablePreview?: boolean;
  lazy?: boolean;
  circle?: boolean;
};