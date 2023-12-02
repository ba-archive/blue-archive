import { get, set } from "lodash-es";
import type { Entries } from "type-fest";
import { Arrayable } from "./typescript";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const entriesOf = <T>(arr: T) => Object.entries(arr) as Entries<T>;
export const getProp = <T = any>(
  obj: Record<string, any>,
  path: Arrayable<string>,
  defaultValue?: any
): { value: T } => {
  return {
    get value() {
      return get(obj, path, defaultValue);
    },
    set value(val: any) {
      set(obj, path, val);
    },
  };
};
// eslint-disable-next-line vue/prefer-import-from-vue
export { hasOwn } from "@vue/shared";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const keysOf = <T>(arr: T) => Object.keys(arr) as Array<keyof T>;
