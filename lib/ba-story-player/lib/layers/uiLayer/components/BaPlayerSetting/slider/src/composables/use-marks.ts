import { computed } from "vue";
import type { SliderMarkerProps } from "../marker";
import type { SliderProps } from "../slider";

export interface Mark extends SliderMarkerProps {
  point: number;
  position: number;
}

export const useMarks = (props: SliderProps) => {
  return computed(() => {
    if (!props.marks) {
      return [];
    }

    const marksKeys = Object.keys(props.marks);
    return marksKeys
      .map(Number.parseFloat)
      .sort((a, b) => a - b)
      .filter(point => point <= props.max && point >= props.min)
      .map(
        (point): Mark => ({
          point,
          position: ((point - props.min) * 100) / (props.max - props.min),
          mark: props.marks![point],
        })
      );
  });
};
