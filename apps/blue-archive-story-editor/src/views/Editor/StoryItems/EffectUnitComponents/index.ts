import { defineAsyncComponent } from "vue";

type EffectUnitType = "background";

export type IEffectUnitComponentMap = {
  [key in EffectUnitType]: {
    component: ReturnType<typeof defineAsyncComponent>;
    type: key;
    title: string;
    description: string;
  };
};

export const EffectUnitComponentMap: IEffectUnitComponentMap = {
  background: {
    component: defineAsyncComponent(() => import("./BackgroundEffect.vue")),
    type: "background",
    title: "背景图片",
    description: "设置背景图片",
  },
};

export const EffectUnitComponentList = Object.keys(EffectUnitComponentMap).map((key) => ({
  value: key,
  label: Reflect.get(Reflect.get(EffectUnitComponentMap, key), "title") as string,
}));
