import { defineAsyncComponent, Ref } from "vue";
import { EffectOnlyConfig, IStoryUnitComponentMap, IStoryUnitGenerator, TextConfig } from "@/views/Editor/tools/types";

export const StoryUnitComponentMap: IStoryUnitComponentMap = {
  title: {
    component: defineAsyncComponent(() => import("../StoryItems/TitleUnit.vue")),
    type: "title",
    icon: "",
    title: "章节名",
    description: "显示在最开头的章节名称",
  },
  place: {
    component: defineAsyncComponent(() => import("../StoryItems/PlaceUnit.vue")),
    type: "place",
    icon: "",
    title: "地点名称",
    description: "左上角那个",
  },
  text: {
    component: defineAsyncComponent(() => import("../StoryItems/TextUnit.vue")),
    type: "text",
    icon: "",
    title: "文字层",
    description: "谁在说话",
  },
  option: {
    component: defineAsyncComponent(() => import("../StoryItems/TitleUnit.vue")),
    type: "option",
    icon: "",
    title: "",
    description: "",
  },
  st: {
    component: defineAsyncComponent(() => import("../StoryItems/TitleUnit.vue")),
    type: "st",
    icon: "",
    title: "",
    description: "",
  },
  effectOnly: {
    component: defineAsyncComponent(() => import("../StoryItems/EffectUnit.vue")),
    type: "effectOnly",
    icon: "",
    title: "特效层",
    description: "背景啥的",
  },
  continue: {
    component: defineAsyncComponent(() => import("../StoryItems/TitleUnit.vue")),
    type: "continue",
    icon: "",
    title: "",
    description: "",
  },
  nextEpisode: {
    component: defineAsyncComponent(() => import("../StoryItems/TitleUnit.vue")),
    type: "nextEpisode",
    icon: "",
    title: "",
    description: "",
  },
};

/**
 * <h1>重点修改</h1>
 *
 * 在这里面添加生成函数
 */
// @ts-ignore
export const StoryRawUnitGeneratorMap: IStoryUnitGenerator = {
  title: {
    raw: {
      ScriptKr(title: Ref<string>, subTitle: Ref<string | undefined>) {
        return `#title;${this.TextCn(title, subTitle)}`;
      },
      TextCn(title: Ref<string>, subTitle: Ref<string | undefined>) {
        const base = `${title.value}`;
        if (subTitle.value) {
          return `${subTitle.value};${base}`;
        }
        return base;
      },
    },
    internal(title: Ref<string>, subTitle: Ref<string | undefined>) {
      return {
        type: "title",
        title: title.value,
        subTitle: subTitle.value,
      };
    },
    default() {
      return {
        type: "title",
        title: "",
        subTitle: "",
      };
    },
  },
  place: {
    raw: {
      ScriptKr(place: Ref<string>) {
        return `#place;${this.TextCn(place)}`;
      },
      TextCn(place: Ref<string>) {
        return place.value;
      },
    },
    internal(place: Ref<string>) {
      return {
        type: "place",
        place: place.value,
      };
    },
    default() {
      return {
        type: "place",
        place: "",
      };
    },
  },
  effectOnly: {
    raw: {
      BGName(config: Ref<EffectOnlyConfig>) {
        return config.value.background;
      },
    },
    internal(config: Ref<EffectOnlyConfig>) {
      return {
        type: "effectOnly",
        background: config.value.background,
      };
    },
    default() {
      return {
        type: "effectOnly",
        background: undefined,
      };
    },
  },
  text: {
    raw: {
      ScriptKr(config: Ref<TextConfig>) {
        const { position, characterName, face, text } = config.value;
        return `${position};${characterName};${face};${text.map((it) => it.content).join("")}`;
      },
      TextCn(config: Ref<TextConfig>) {
        return config.value.text.map((it) => it.content).join("");
      },
    },
    internal(config: Ref<TextConfig>) {
      const { position, characterName, face, text } = config.value;
      return {
        type: "text",
        characterName,
        position,
        face,
        text,
      };
    },
    default() {
      return {
        type: "text",
        characterName: undefined,
        position: undefined,
        face: undefined,
        text: [],
      };
    },
  },
};
