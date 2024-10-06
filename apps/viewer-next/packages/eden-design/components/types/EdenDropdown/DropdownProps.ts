export type DropdownProps = {
  size?: "mini" | "small" | "medium" | "large";
  maxHeight?: number | string; // 下拉框最大高度
  disabled?: boolean; // 是否禁用
  placement?: "top" | "bottom" | "auto"; // 下拉框位置
  trigger?: "click" | "hover"; // 下拉框触发方式
  options?: Array<{
    label: string;
    value: string | number;
    disabled?: boolean;
  }>; // 下拉框选项
  value?: string | number; // 下拉框选中值
  onChange?: (value: string | number) => void; // 下拉框选中值变化时回调
};