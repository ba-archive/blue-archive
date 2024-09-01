export type DividerProps = {
  type?: "solid" | "dashed";
  dashed?: boolean; // shortcut for type="dashed"
  direction?: "horizontal" | "vertical";
  vertical?: boolean; // shortcut for direction="vertical"
};