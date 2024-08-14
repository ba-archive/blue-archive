export type TextProps = {
  align?: "left" | "center" | "right" | "justify";
  bold?: boolean;
  color?:
    | string
    | {
        from: string;
        to: string;
        deg?: number | string;
      };
  delete?: boolean;
  disabled?: boolean;
  inline?: boolean;
  italic?: boolean;
  level?: 3 | 2 | 1 | "3" | "2" | "1";
  noSelect?: boolean;
  size?: number | string;
  strikethrough?: boolean;
  strong?: boolean;
  sub?: boolean;
  sup?: boolean;
  type?: "body" | "display" | "title" | "blockquote";
  underline?: boolean;
};
