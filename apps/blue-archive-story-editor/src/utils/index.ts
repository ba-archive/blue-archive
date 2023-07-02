import { cloneDeep } from "lodash";

export function extraDomBounding(dom: HTMLElement) {
  const style = getComputedStyle(dom);
  return {
    width: Number(style.width.replace("px", "")),
    height: Number(style.width.replace("px", "")),
  };
}

/**
 * 用JSON实现的简单对象拷贝
 * @param data
 */
export function deepCopy<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

/**
 * 用lodash实现深拷贝
 * @param data
 */
export function deepClone<T>(data: T): T {
  return cloneDeep(data);
}

export function fillForm<IForm extends object>(form: IForm, data: IForm, keys: (keyof IForm)[]) {
  keys.forEach((key) => {
    const value = Reflect.get(data, key);
    Reflect.set(form, key, value);
  });
}

export function dataFilterChain<T, Form extends object>(
  data: T[],
  filterForm: Form,
  filterFn: ((data: T[], value: any) => T[])[],
  keys: (keyof Form)[],
): T[] {
  if (keys.length !== filterFn.length) {
    return data;
  }
  filterFn.forEach((fn, index) => {
    const key = keys[index];
    const value = Reflect.get(filterForm, key);
    if (!value || (Array.isArray(value) && (value as any[]).length === 0)) {
      return;
    }
    data = fn(data, value);
  });
  return data;
}

/**
 * 返回start至end之间的随机整数
 * @param start
 * @param end
 * @return [start,end)
 */
export function randomInt(start: number, end: number) {
  return Math.floor(Math.random() * (end - start) + start);
}

/**
 * 随机选取arr里的一个item
 * @param arr
 */
export function randomArrayItem<T>(arr: T[]): T {
  const index = randomInt(0, arr.length);
  return arr[index];
}

/**
 * 随机选取arr里0至size-1的一个item,并放回最后
 * @param arr
 */
export function pickRandomArrayItemAndPutBack<T>(arr: T[]) {
  if (arr.length < 1) {
    return {
      arr,
      item: arr[0],
    };
  }
  const pickItem = randomArrayItem(arr.slice(0, arr.length - 1));
  arr.splice(arr.indexOf(pickItem), 1);
  arr.push(pickItem);
  return {
    arr,
    item: pickItem,
  };
}
