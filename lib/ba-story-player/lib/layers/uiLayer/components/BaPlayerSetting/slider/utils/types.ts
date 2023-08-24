import { isNil } from "lodash-es";
import { isArray, isObject, isString } from "@vue/shared";

export {
  isArray,
  isDate,
  isFunction,
  isObject,
  isPromise,
  isString,
  isSymbol,
} from "@vue/shared";
export const isBoolean = (val: any): val is boolean => typeof val === "boolean";

export const isElement = (e: unknown): e is Element => {
  if (typeof Element === "undefined") return false;
  return e instanceof Element;
};
export const isEmpty = (val: unknown) =>
  (!val && val !== 0) ||
  (isArray(val) && val.length === 0) ||
  (isObject(val) && !Object.keys(val).length);
export const isNumber = (val: any): val is number => typeof val === "number";

export const isPropAbsent = (prop: unknown): prop is null | undefined => {
  return isNil(prop);
};

export const isStringNumber = (val: string): boolean => {
  if (!isString(val)) {
    return false;
  }
  return !Number.isNaN(Number(val));
};

export const isUndefined = (val: any): val is undefined => val === undefined;

export { isVNode } from "vue";
