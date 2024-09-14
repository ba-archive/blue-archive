export type SpaceProps = {
  align?: "start" | "end" | "center" | "baseline" | "stretch";
  direction?: "horizontal" | "vertical";
  vertical?: boolean; // shortcut for direction="vertical"
  size?: "mini" | "small" | "medium" | "large" | number;
  wrap?: boolean;
  wide?: boolean;
  divider?: string;
  margin?: string | number | [number, number] | [number, number, number, number];
  padding?: string | number | [number, number] | [number, number, number, number];
};
