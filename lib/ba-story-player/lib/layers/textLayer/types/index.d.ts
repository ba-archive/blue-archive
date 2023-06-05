import { TextEffect, TextEffectName } from "@/types/common";

export type BaseTypingEvent =
  | "start"
  | "pause"
  | "stop"
  | "destroy"
  | "skip"
  | "complete"
  | "stComplete";

export type IEffectToCSSMap = {
  [key in TextEffectName]?: (param: TextEffect["value"]) => PartialCSS;
};

export type IEventHandlerMap = {
  [key in BaseTypingEvent]?: (index?: string) => void;
};

export type PartialCSS = Partial<CSSStyleDeclaration>;
