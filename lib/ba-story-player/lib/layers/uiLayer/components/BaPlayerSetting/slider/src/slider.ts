import type { ExtractPropTypes } from "vue";
import { CHANGE_EVENT, INPUT_EVENT, UPDATE_MODEL_EVENT } from "../utils/event";
import { buildProps, definePropType } from "../utils/runtime";
import { isArray, isNumber } from "../utils/types";
import type { Arrayable } from "../utils/typescript";
import { useSizeProp } from "../utils/useSize";
import type { SliderMarkerProps } from "./marker";
import type Slider from "./slider.vue";

type SliderMarks = Record<number, string | SliderMarkerProps["mark"]>;

export type SliderEmits = typeof sliderEmits;

export interface SliderInitData {
  firstValue: number;
  secondValue: number;
  oldValue?: Arrayable<number>;
  dragging: boolean;
  sliderSize: number;
}
export type SliderInstance = InstanceType<typeof Slider>;

const isValidValue = (value: Arrayable<number>) =>
  isNumber(value) || (isArray(value) && value.every(isNumber));
export type SliderProps = ExtractPropTypes<typeof sliderProps>;
export const sliderEmits = {
  [UPDATE_MODEL_EVENT]: isValidValue,
  [INPUT_EVENT]: isValidValue,
  [CHANGE_EVENT]: isValidValue,
};

export const sliderProps = buildProps({
  modelValue: {
    type: definePropType<Arrayable<number>>([Number, Array]),
    default: 0,
  },
  id: {
    type: String,
    default: undefined,
  },
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 100,
  },
  step: {
    type: Number,
    default: 1,
  },
  showInput: Boolean,
  showInputControls: {
    type: Boolean,
    default: true,
  },
  size: useSizeProp,
  inputSize: useSizeProp,
  showStops: Boolean,
  showTooltip: {
    type: Boolean,
    default: true,
  },
  formatTooltip: {
    type: definePropType<(val: number) => number | string>(Function),
    default: undefined,
  },
  disabled: Boolean,
  range: Boolean,
  vertical: Boolean,
  height: String,
  debounce: {
    type: Number,
    default: 300,
  },
  label: {
    type: String,
    default: undefined,
  },
  rangeStartLabel: {
    type: String,
    default: undefined,
  },
  rangeEndLabel: {
    type: String,
    default: undefined,
  },
  formatValueText: {
    type: definePropType<(val: number) => string>(Function),
    default: undefined,
  },
  tooltipClass: {
    type: String,
    default: undefined,
  },
  marks: {
    type: definePropType<SliderMarks>(Object),
  },
  validateEvent: {
    type: Boolean,
    default: true,
  },
} as const);
