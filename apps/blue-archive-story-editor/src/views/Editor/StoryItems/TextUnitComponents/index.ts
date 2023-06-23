import { TextEffect, TextEffectName } from "ba-story-player/dist/lib/types/common";
import { StText } from "ba-story-player/dist/lib/types/events";

export const TextEffectTypeList: TextEffectName[] = ["color", "fontsize", "ruby"];

type TextEffectUnit = {
  type: TextEffectName;
  value: string;
};

type IEffectToCSSMap = {
  [key in TextEffectName]?: (param: TextEffect["value"]) => PartialCSS;
};

type PartialCSS = Partial<CSSStyleDeclaration>;

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
      .map((it) => {
        const fn = EffectToCSSMap[it.name];
        if (fn) {
          return fn(it.value);
        }
        return undefined;
      })
      .filter((it) => it) as PartialCSS[]
  ).reduce((a, b) => ({ ...a, ...b }), {});
}

export function buildTextEffect(unit: TextEffectUnit): TextEffect {
  return {
    name: unit.type,
    value: [unit.value],
  };
}
