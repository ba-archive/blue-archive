import { StoryType, StoryRawUnit as PlayerStoryUnit, Text } from "ba-story-player/dist/lib/types/common";
import { Ref, defineAsyncComponent } from "vue";

export type StoryUnitType = StoryType;

export type StoryRawUnit = PlayerStoryUnit & {
  type: StoryUnitType;
};

export type StoryStoreState = {
  story: StoryRawUnit[];
  internalStory: InternalStoryUnit[];
};

/**
 * <h1>重点修改</h1>
 *
 * 指定InternalStoryUnit自己的结构
 */
export type InternalStoryUnit =
  | InternalTitleStoryUnit
  | InternalPlaceStoryUnit
  | InternalEffectStoryUnit
  | InternalTextStoryUnit;

export type InternalTitleStoryUnit = BaseInternalStoryUnit<
  "title",
  {
    title: string;
    subTitle?: string;
  }
>;

export type InternalPlaceStoryUnit = BaseInternalStoryUnit<
  "place",
  {
    place: string;
  }
>;

export type InternalEffectStoryUnit = BaseInternalStoryUnit<"effectOnly", EffectOnlyConfig>;

/**
 * @characterName 对应CharacterNameExcelTableItem的CharacterName
 */
export type InternalTextStoryUnit = BaseInternalStoryUnit<"text", TextConfig>;

export type IStoryUnitComponentMap = {
  [key in StoryUnitType]: {
    component: ReturnType<typeof defineAsyncComponent>;
    type: key;
    icon: string;
    title: string;
    description: string;
  };
};

export type StoryRawUnitOmitType = Omit<StoryRawUnit, "type">;

type MultipleArgsFun<T> = (...args: Ref<never>[]) => T;

type BaseGeneralFunction = {
  [type in StoryUnitType]: MultipleArgsFun<BaseInternalStoryUnit<type, unknown>>;
};

type BaseInternalStoryUnit<Key extends StoryUnitType, Other> = {
  type: Key;
} & Other;

type BaseGeneralFunctionIncludeList = {
  [key in StoryUnitType]: keyof StoryRawUnitOmitType;
};

/**
 * <h1>重点修改</h1>
 *
 * 指定对应的story unit会影响raw story unit的哪些字段
 */
export interface ActualGeneralFunctionIncludeList extends BaseGeneralFunctionIncludeList {
  title: "ScriptKr" | "TextCn";
  place: "ScriptKr" | "TextCn";
  effectOnly: "BGName";
  text: "ScriptKr" | "TextCn";
}

export type EffectOnlyConfig = {
  background: number;
};

export type TextConfig = {
  characterName?: number; // 角色在CharacterNameExcelTable中的id
  position?: number; // 角色在的位置 1/2/3/4/5
  face?: string; // spine中的表情差分编号
  text: Text[];
};

/**
 * <h1>重点修改</h1>
 *
 * 指定对应的story unit如何保存自己的内容
 */
interface ActualGeneralFunction extends BaseGeneralFunction {
  title: (title: Ref<string>, subTitle: Ref<string | undefined>) => InternalTitleStoryUnit;
  place: (place: Ref<string>) => InternalPlaceStoryUnit;
  effectOnly: (config: Ref<EffectOnlyConfig>) => InternalEffectStoryUnit;
  text: (config: Ref<TextConfig>) => InternalTextStoryUnit;
}

type BuildFunctionFromType<type extends StoryUnitType, key extends keyof StoryRawUnitOmitType> = (
  ...args: Parameters<ActualGeneralFunction[type]>
) => StoryRawUnitOmitType[key];

export type IStoryUnitGenerator = {
  [type in StoryUnitType]: {
    raw: {
      [key in ActualGeneralFunctionIncludeList[type]]: BuildFunctionFromType<type, key>;
    };
    internal: ActualGeneralFunction[type];
    default: () => { type: type } & {
      [key in keyof Omit<Required<ReturnType<ActualGeneralFunction[type]>>, "type">]:
        | Omit<Required<ReturnType<ActualGeneralFunction[type]>>, "type">[key]
        | undefined;
    };
  };
};
