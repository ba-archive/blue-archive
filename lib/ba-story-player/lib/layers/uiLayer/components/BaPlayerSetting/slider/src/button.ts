import type { ExtractPropTypes, Ref } from "vue";
import { UPDATE_MODEL_EVENT } from "../utils/event";
import { buildProps } from "../utils/runtime";
import { isNumber } from "../utils/types";
import type Button from "./button.vue";

export type ButtonRefs = Record<
  "firstButton" | "secondButton",
  Ref<SliderButtonInstance | undefined>
>;
export type SliderButtonEmits = typeof sliderButtonEmits;

export interface SliderButtonInitData {
  hovering: boolean;
  dragging: boolean;
  isClick: boolean;
  startX: number;
  currentX: number;
  startY: number;
  currentY: number;
  startPosition: number;
  newPosition: number;
  oldValue: number;
}
export type SliderButtonInstance = InstanceType<typeof Button>;

export type SliderButtonProps = ExtractPropTypes<typeof sliderButtonProps>;

export const sliderButtonEmits = {
  [UPDATE_MODEL_EVENT]: (value: number) => isNumber(value),
};

export const sliderButtonProps = buildProps({
  modelValue: {
    type: Number,
    default: 0,
  },
  vertical: Boolean,
  tooltipClass: String,
} as const);
