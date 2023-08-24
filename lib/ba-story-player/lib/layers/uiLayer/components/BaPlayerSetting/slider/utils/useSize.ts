import { computed, inject, unref } from "vue";
import type { InjectionKey, Ref } from "vue";
import { buildProp } from "./runtime";
import type { ComponentSize } from "./size";
import { componentSizes } from "./size";

export const SIZE_INJECTION_KEY: InjectionKey<SizeContext> = Symbol("size");

export interface SizeContext {
  size: Ref<ComponentSize>;
}

export const useGlobalSize = () => {
  const injectedSize = inject(SIZE_INJECTION_KEY, {} as SizeContext);

  return computed<ComponentSize>(() => {
    return unref(injectedSize.size) || "";
  });
};

export const useSizeProp = buildProp({
  type: String,
  values: componentSizes,
  required: false,
} as const);

export const useSizeProps = {
  size: useSizeProp,
};
