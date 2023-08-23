export type BaRadioData = {
  name: string;
  tip: string;
  options: {
    id: string;
    value: string;
    label: string;
  }[];
};

export type BaSliderData = {
  name: string;
  tip: string;
  min: number;
  max: number;
  step: number;
  fator?: number;
  default?: number;
};
