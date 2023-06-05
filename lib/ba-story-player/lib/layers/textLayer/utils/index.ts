import { IEffectToCSSMap, PartialCSS } from "@/layers/textLayer/types";
import { TextEffect } from "@/types/common";
import { StText } from "@/types/events";

export * from "./typingEmitter";

const EffectToCSSMap: IEffectToCSSMap = {
  color(param) {
    return {
      color: param.join(""),
    };
  },
  fontsize(param) {
    return {
      "--param-font-size": param.join(""),
    };
  },
};

export function collapseWhiteSpace(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function isElement(e: unknown): e is Element {
  if (typeof Element === "undefined") return false;
  return e instanceof Element;
}

export function parseStEffectToCss(st: StText): PartialCSS {
  const stPos = st.stArgs[0];
  const result: PartialCSS = {
    position: "absolute",
    width: "auto",
  };
  // st坐标系位置
  Reflect.set(result, "--st-x", stPos[0]);
  Reflect.set(result, "--st-y", stPos[1]);
  // 居中显示特殊样式
  if (st.middle) {
    result.textAlign = "center";
    result.left = "50%";
    result.transform = "translateX(-50%)";
  }
  const fontSize = st.stArgs[2]; // st的字号
  Reflect.set(result, "--param-font-size", fontSize);
  return result;
}

export function parseTextEffectToCss(effects: TextEffect[]): PartialCSS {
  return (
    effects
      .map(it => {
        const fn = EffectToCSSMap[it.name];
        if (fn) {
          return fn(it.value);
        }
      })
      .filter(it => it) as PartialCSS[]
  ).reduce((a, b) => ({ ...a, ...b }), {});
}
