export type TextProps = {
  /* 文本属性 */
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
  type?: "body" | "display" | "title" | "blockquote" | "ol" | "ul" | "li";
  underline?: boolean;

  /* 颜色快捷方式 */
  brand?: boolean;      // 品牌色 --arona-blue-6
  danger?: boolean;     // 危险色 --danger-6 
  error?: boolean;      // 错误色 --danger-6
  secondary?: boolean;  // 次要色 --color-text-3
  success?: boolean;    // 成功色 --success-6
  tertiary?: boolean;   // 三级色 --color-text-2
  warning?: boolean;    // 警告色 --warning-6
};
