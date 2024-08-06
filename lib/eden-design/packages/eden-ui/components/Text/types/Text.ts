export type TextProps = {
  size?:
    | "body-3"
    | "body-2"
    | "body-1"
    | "title-3"
    | "title-2"
    | "title-1"
    | "display-3"
    | "display-2"
    | "display-1";
  title?: boolean;
  bold?: boolean;
  level?: 5 | 4 | 3 | 2 | 1 | "5" | "4" | "3" | "2" | "1";
  blockquote?: boolean;
  noSelect?: boolean;
  disabled?: boolean;
  underline?: boolean;
  strong?: boolean;
  italic?: boolean;
  delete?: boolean;
  stroke?: boolean;
  superscript?: boolean;
  subscript?: boolean;
  inline?: boolean;
  color?:
    | string
    | {
        from: string;
        to: string;
        deg?: number | string;
      };
};
