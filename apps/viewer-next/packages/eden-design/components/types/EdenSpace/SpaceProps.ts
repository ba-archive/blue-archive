export type SpaceProps = {
  align?: "start" | "end" | "center" | "baseline";
  direction?: "horizontal" | "vertical";
  vertical?: boolean; // shortcut for direction="vertical"
  size?: "mini" | "small" | "medium" | "large" | number;
  wrap?: boolean;
  divider?: string;
  margin?: string | number | [number, number] | [number, number, number, number];
  padding?: string | number | [number, number] | [number, number, number, number];
};
