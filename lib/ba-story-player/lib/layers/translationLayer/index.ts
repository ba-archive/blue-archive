import { usePlayerStore } from "@/stores";
import { deepCopyObject, getResourcesUrl } from "@/utils";
import { l2dConfig } from "../l2dLayer/l2dConfig";
import {
  StoryRawUnit,
  StoryUnit,
  TranslatedStoryUnit,
  ZmcArgs,
} from "@/types/common";
import { ShowOption, StArgs } from "@/types/events";
import * as utils from "./utils";
import { getText } from "./utils";

type IStoryRawUnitParserFn = {
  reg: RegExp;
  fn: (
    match: RegExpExecArray,
    unit: StoryUnit,
    rawUnit: StoryRawUnit,
    parseUnitResult: StoryUnit[],
    currentIndex: number
  ) => StoryUnit;
};

type IStoryRawUnitParserUnit = {
  [key: string]: IStoryRawUnitParserFn;
};
// [\u2E80-\u9FFF]
const StoryRawUnitParserUnit: IStoryRawUnitParserUnit = {
  title: {
    reg: /#title;([^;\n]+);?([^;\n]+)?;?/i,
    fn(match: RegExpExecArray, unit: StoryUnit, rawUnit: StoryRawUnit) {
      unit.type = "title";
      unit.textAbout.titleInfo = utils.generateTitleInfo(
        rawUnit,
        usePlayerStore().language
      );
      return unit;
    },
  },
  place: {
    reg: /#place;([^;\n]+);?/i,
    fn(match: RegExpExecArray, unit: StoryUnit, rawUnit: StoryRawUnit) {
      unit.type = "place";
      unit.textAbout.titleInfo = {
        title: [],
        subtitle: utils.generateText(rawUnit)[0].content,
      };
      return unit;
    },
  },
  nextEpisode: {
    reg: /#nextepisode;([^;\n]+);([^;\n]+);?/i,
    fn(match: RegExpExecArray, unit: StoryUnit, rawUnit: StoryRawUnit) {
      unit.type = "nextEpisode";
      unit.textAbout.titleInfo = utils.generateTitleInfo(
        rawUnit,
        usePlayerStore().language
      );
      return unit;
    },
  },
  continued: {
    reg: /#continued;?/i,
    fn(match: RegExpExecArray, unit: StoryUnit) {
      unit.type = "continue";
      return unit;
    },
  },
  na: {
    reg: /#na;([^;\n]+);?([^;\n]+)?;?/i,
    fn(match: RegExpExecArray, unit: StoryUnit, rawUnit: StoryRawUnit) {
      unit.type = "text";
      unit.textAbout.showText.text = utils.generateText(rawUnit);
      const characterInfo = utils.getCharacterInfo(match[1]);
      if (match[2]) {
        unit.textAbout.showText.speaker = characterInfo?.speaker;
        unit.textAbout.showText.avatarUrl = characterInfo?.avatarUrl;
      }
      return unit;
    },
  },
  st: {
    reg: /#st;(\[-?\d+,-?\d+]);(serial|instant|smooth);(\d+);?(.+)?/i,
    fn(match: RegExpExecArray, unit: StoryUnit, rawUnit: StoryRawUnit) {
      unit.type = "st";
      unit.textAbout.st = { middle: false };
      unit.textAbout.st.stArgs = [
        JSON.parse(match[1]) as number[],
        match[2] as StArgs[1],
        Number(match[3]),
      ];
      if (match[4]) {
        unit.textAbout.showText.text = utils.generateText(rawUnit);
      }
      return unit;
    },
  },
  stm: {
    reg: /#stm;(\[0,-?\d+]);(serial|instant|smooth);(\d+);([^;\n]+);?/i,
    fn(match: RegExpExecArray, unit: StoryUnit, rawUnit: StoryRawUnit) {
      unit.type = "st";
      unit.textAbout.st = { middle: true };
      unit.textAbout.st.stArgs = [
        JSON.parse(match[1]) as number[],
        match[2] as StArgs[1],
        Number(match[3]),
      ];
      unit.textAbout.showText.text = utils.generateText(rawUnit);
      return unit;
    },
  },
  clearSt: {
    reg: /#clearST;?/i,
    fn(match: RegExpExecArray, unit: StoryUnit) {
      unit.textAbout.st = {};
      unit.textAbout.st.clearSt = true;
      return unit;
    },
  },
  wait: {
    reg: /#wait;(\d+);?/i,
    fn(match: RegExpExecArray, unit: StoryUnit) {
      unit.type = "effectOnly";
      unit.effect.otherEffect.push({ type: "wait", args: Number(match[1]) });
      return unit;
    },
  },
  fontsize: {
    reg: /#fontsize;(\d+);?/i,
    fn(match: RegExpExecArray, unit: StoryUnit) {
      unit.textAbout.showText.text.forEach(it => {
        it.effects.push({ name: "fontsize", value: [match[1]] });
      });
      return unit;
    },
  },
  all: {
    // TODO #all;dl
    // #all;hide
    reg: /#all;([^;\n]+);?/i,
    fn(match: RegExpExecArray, unit: StoryUnit) {
      if (utils.compareCaseInsensive(match[1], "hide")) {
        unit.type = "effectOnly";
        unit.hide = "all";
      }
      return unit;
    },
  },
  hideMenu: {
    reg: /#hidemenu;?/i,
    fn(match: RegExpExecArray, unit: StoryUnit) {
      unit.hide = "menu";
      return unit;
    },
  },
  showMenu: {
    reg: /#showmenu;?/i,
    fn(match: RegExpExecArray, unit: StoryUnit) {
      unit.show = "menu";
      return unit;
    },
  },
  zmc: {
    reg: /#zmc;(instant|instnat|intstant|move);(-?\d+,-?\d+);(\d+);?(\d+)?;?/i,
    fn(match: RegExpExecArray, unit: StoryUnit) {
      const args: ZmcArgs = {
        type: match[1] as "instant",
        position: match[2].split(",").map(Number) as [number, number],
        size: Number(match[3]),
      };
      if (match[4]) {
        Reflect.set(args, "type", "move");
        Reflect.set(args, "duration", Number(match[4]));
      }
      unit.effect.otherEffect.push({ type: "zmc", args });
      return unit;
    },
  },
  bgShake: {
    reg: /#bgshake;?/i,
    fn(match: RegExpExecArray, unit: StoryUnit) {
      unit.effect.otherEffect.push({ type: "bgshake" });
      return unit;
    },
  },
  video: {
    reg: /#video;([^;\n]+);([^;\n]+);?/i,
    //处理情况为 #video;Scenario/Main/22000_MV_Video;Scenario/Main/22000_MV_Sound
    fn(match: RegExpExecArray, unit: StoryUnit) {
      unit.video = {
        videoPath: match[1],
        soundPath: match[2],
      };
      return unit;
    },
  },
  character: {
    // 5;세리카;12;부장은 옆방에서 자고 있어. 내가 가서 데려올게.
    // 初始位置;人名(用来xxhash);spine表情动画编号;说话(如果有)
    reg: /^(?!#)([1-5]);([^;\n]+);([^;\n]+);?([^;\n]+)?/,
    fn(
      match: RegExpExecArray,
      unit: StoryUnit,
      rawUnit: StoryRawUnit,
      parseUnitResult: StoryUnit[],
      currentIndex: number
    ) {
      const playerStore = usePlayerStore();
      const CharacterName = utils.getCharacterName(match[2]);
      const characterInfo =
        playerStore.CharacterNameExcelTable.get(CharacterName);
      if (characterInfo) {
        //添加人物spineUrl
        const spineUrl = getResourcesUrl(
          "characterSpine",
          characterInfo.SpinePrefabName
        );
        const avatarUrl = getResourcesUrl(
          "avatar",
          characterInfo?.SmallPortrait
        );
        const speaker = utils.getSpeaker(characterInfo);
        //人物有对话
        if (match[4]) {
          unit.type = "text";
          unit.textAbout.showText = {
            text: utils.generateText(rawUnit),
            speaker,
            avatarUrl,
          };
        }
        unit.characters.push({
          CharacterName,
          position: Number(match[1]),
          face: match[3],
          highlight: Boolean(match[4]),
          //添加全息人物特效
          signal: characterInfo.Shape === "Signal",
          spineUrl,
          effects: [],
        });
      } else {
        console.log(rawUnit);
        console.log(currentIndex);
        throw new Error(
          `${CharacterName}(${match[2]})在CharacterNameExcelTable中不存在，index: ${currentIndex}`
        );
      }
      return unit;
    },
  },
  characterEffect: {
    reg: /#([1-5]);(((em|fx);([^;\n]+))|\w+);?/,
    fn(
      match: RegExpExecArray,
      unit: StoryUnit,
      rawUnit: StoryRawUnit,
      parseUnitResult: StoryUnit[],
      currentIndex: number
    ) {
      const characterIndex = utils.getCharacterIndex(
        unit,
        Number(match[1]),
        parseUnitResult,
        currentIndex
      );
      if (characterIndex === -1) {
        return unit;
      }
      if (match[5] && utils.compareCaseInsensive(match[4], "em")) {
        const emotionName = utils.getEmotionName(match[5]);
        if (!emotionName) {
          console.error(
            `查询不到${match[3]}的emotionName中, 当前rawStoryUnit: `,
            rawUnit
          );
        } else {
          unit.characters[characterIndex].effects.push({
            type: "emotion",
            effect: emotionName,
            async: false,
          });
        }
      } else if (match[5] && utils.compareCaseInsensive(match[4], "fx")) {
        unit.characters[characterIndex].effects.push({
          type: "fx",
          effect: match[5].replace("{", "").replace("}", ""),
          async: false,
        });
      } else if (!match[3]) {
        const effect = match[2];
        unit.characters[characterIndex].effects.push({
          type: "action",
          effect: effect,
          async: false,
        });
        // 处理写在ScriptKr里的全息特效
        // 兔女郎时100675:27
        if (effect === "sig") {
          unit.characters[characterIndex].signal = true;
        }
      }
      // 过滤a和h同时出现的情况
      const ch = unit.characters[characterIndex];
      if (
        !ch ||
        ch.effects.length < 2 ||
        ch.effects.filter(ef => ef.type === "action").length < 2
      ) {
        return unit;
      }
      const appearIndex = ch.effects.findIndex(
        ef => ef.type === "action" && ef.effect === "a"
      );
      const hideIndex = ch.effects.findIndex(
        ef => ef.type === "action" && ef.effect === "h"
      );
      if (appearIndex !== -1 && hideIndex !== -1) {
        ch.effects[Math.min(appearIndex, hideIndex)].async = true;
      }
      return unit;
    },
  },
  option: {
    reg: /\[n?s(\d{0,2})?]([^;\n]+)/,
    fn(match: RegExpExecArray, unit: StoryUnit, rawUnit: StoryRawUnit) {
      unit.type = "option";
      unit.textAbout.options = String(
        getText(rawUnit, usePlayerStore().language)
      )
        .split("\n")
        .filter(it => it)
        .map(it => {
          const parseResult = /\[n?s(\d{0,2})?](.+)/.exec(it);
          if (!parseResult) {
            console.error(
              `在处理选项文本时遇到严重错误, 在尝试解析'${it}'时, 期望'/\\[n?s(\\d{0,2})?](.+)/'， 实际 undefined`
            );
            return undefined;
          }
          return {
            SelectionGroup: Number(parseResult[1] || "0"),
            text: utils.parseNxMagicTag(parseResult[2]),
          };
        })
        .filter(it => it) as ShowOption[];
      return unit;
    },
  },
};

/**
 * 将原始剧情结构翻译成标准剧情结构
 * @param rawStory: 原始剧情
 */
export function translate(rawStory: TranslatedStoryUnit): StoryUnit[] {
  const content = rawStory.content;
  const playerStore = usePlayerStore();
  const parseResult: StoryUnit[] = [];
  for (const [index, rawStoryUnit] of deepCopyObject(content).entries()) {
    const { GroupId, SelectionGroup, PopupFileName } = rawStoryUnit;
    const unit: StoryUnit = {
      GroupId,
      SelectionGroup,
      PopupFileName: PopupFileName
        ? getResourcesUrl("popupImage", PopupFileName)
        : "",
      type: "text",
      characters: [],
      textAbout: {
        showText: {
          text: [],
        },
        st: {},
      },
      effect: {
        otherEffect: [],
      },
    };
    unit.audio = {
      bgm: utils.getBgm(rawStoryUnit.BGMId),
      soundUrl: utils.getSoundUrl(rawStoryUnit.Sound),
      voiceJPUrl: utils.getVoiceJPUrl(rawStoryUnit.VoiceJp),
    };
    unit.transition = playerStore.TransitionExcelTable.get(
      rawStoryUnit.Transition
    );
    if (rawStoryUnit.BGName) {
      const BGItem = playerStore.BGNameExcelTable.get(rawStoryUnit.BGName);
      if (BGItem) {
        if (BGItem.BGType === "Image") {
          unit.bg = {
            url: getResourcesUrl("bg", BGItem.BGFileName),
            overlap: utils.checkBgOverlap(unit),
          };
        } else if (BGItem.BGType === "Spine") {
          // 取第一次出现的 l2d 作为配置
          const l2dInfo = utils.getL2DUrlAndName(BGItem.BGFileName);
          playerStore.setL2DConfig(
            playerStore.curL2dConfig || l2dConfig[l2dInfo.name]
          );
          unit.l2d = {
            spineUrl: l2dInfo.url,
            animationName: BGItem.AnimationName,
          };
        }
      }
    }
    unit.effect.BGEffect = playerStore.BGEffectExcelTable.get(
      rawStoryUnit.BGEffect
    );
    // 如果TextJp中有脚本, 也识别成effectOnly类型
    const scriptInTextJp = Object.keys(StoryRawUnitParserUnit).some(key => {
      const parseConfig = Reflect.get(
        StoryRawUnitParserUnit,
        key
      ) as IStoryRawUnitParserFn;
      return parseConfig && parseConfig.reg.exec(rawStoryUnit.TextJp);
    });
    if (scriptInTextJp) {
      unit.type = "effectOnly";
    }
    //当没有文字时初步判断为effectOnly类型
    if (
      !rawStoryUnit.TextJp ||
      !rawStoryUnit.TextJp ||
      /^ +$/.test(rawStoryUnit.TextJp)
    ) {
      unit.type = "effectOnly";
    }
    const ScriptKr = String(rawStoryUnit.ScriptKr);
    ScriptKr.split("\n").forEach(scriptUnit => {
      Object.keys(StoryRawUnitParserUnit).map(key => {
        const parseConfig = Reflect.get(
          StoryRawUnitParserUnit,
          key
        ) as IStoryRawUnitParserFn;
        if (!parseConfig) {
          return undefined;
        }
        const match = parseConfig.reg.exec(scriptUnit);
        if (!match) {
          return undefined;
        }
        parseConfig.fn(match, unit, rawStoryUnit, parseResult, index);
      });
    });
    if (!unit.characters.some(character => character.highlight)) {
      unit.characters = unit.characters.map(character => {
        character.highlight = true;
        return character;
      });
    }
    // 解决纯effect unit中 TextJp字段不为空导致的文字层误判?
    if (unit.type === "text") {
      // 判断显示的人物是否为空，以及如果为空的话是否为旁白类型
      const hasText =
        ScriptKr.split("\n").some(
          text => (StoryRawUnitParserUnit.character.reg.exec(text) ?? [])[4]
        ) ||
        ScriptKr.split("\n").some(text =>
          StoryRawUnitParserUnit.na.reg.exec(text)
        );
      if (!hasText) {
        unit.type = "effectOnly";
      }
    }
    parseResult.push(unit);
  }
  // 处理译者
  if (rawStory.translator) {
    const unit = parseResult[0];
    if (unit.type === "title" && unit.textAbout.titleInfo) {
      unit.textAbout.titleInfo.translator = rawStory.translator;
    } else {
      // 如果没有title 塞到place里
      // 查找开头至第一次出现TextJp之间里有没有place
      let index = 0;
      for (const _index in content) {
        if (content[_index].TextJp) {
          index = Number(_index);
          break;
        }
      }
      const possiblePlace = parseResult
        .slice(0, index)
        .find(it => it.type === "place");
      if (possiblePlace && possiblePlace.textAbout.titleInfo) {
        possiblePlace.textAbout.titleInfo.translator = rawStory.translator;
      } else {
        // 没有title 没有place 只能存privateStore里了
        usePlayerStore().setTranslator(rawStory.translator);
      }
    }
  }
  return parseResult;
}
