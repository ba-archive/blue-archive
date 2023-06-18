import { usePlayerStore } from "@/stores";
import { deepCopyObject, getResourcesUrl } from "@/utils";
import xxhash from "xxhashjs";
import {
  Speaker,
  StoryRawUnit,
  StoryUnit,
  Text,
  TextEffect,
  TextEffectName,
} from "@/types/common";
import { PlayAudio, ShowTitleOption } from "@/types/events";
import { CharacterNameExcelTableItem } from "@/types/excels";
import { Language } from "@/types/store";

const playerStore = usePlayerStore();

/**
 * 检查当前单元是否有背景覆盖变换, 有则删除该变换并返回变换的参数
 * @param unit
 */
export function checkBgOverlap(unit: StoryUnit) {
  if (unit.transition) {
    if (unit.transition.TransitionOut === "bgoverlap") {
      const duration = unit.transition.TransitionOutDuration;
      unit.transition = undefined;
      return duration;
    }
  }
}

/**
 * 在大小写不敏感的情况下比较字符串
 */
export function compareCaseInsensive(s1: string, s2: string) {
  return s1.localeCompare(s2, undefined, { sensitivity: "accent" }) === 0;
}

/**
 * 从原始文字生成Text[], 即带特效参数字符串
 * @param rawStoryUnit
 * @param stm 是否为stm类型文字
 * @returns
 */
export function generateText(rawStoryUnit: StoryRawUnit) {
  const rawText = getText(rawStoryUnit, playerStore.language)
    .replaceAll("[USERNAME]", playerStore.userName)
    .replaceAll("#n", "\n");
  return splitStScriptAndParseTag(rawText)
    .map(it => {
      let text = it.content;
      if (text.includes("[wa")) {
        // debugger;
        if (!text.startsWith("[wa:")) {
          text = "[wa:000]" + text;
        }
        //原始文字示例: "― （いや[wa:200]いや、[wa:900]いくら[wa:300]そういう[wa:300]状況だからって"
        // いや, 200, いや, 900, いくら, 300, そういう, 300, 状況だからって
        const textWithWait = text.split(/\[wa:(\d+)]/g);
        // [wa:200]いや[wa:200]いや、[wa:900]いくら[wa:300]そういう[wa:300]状況だからって
        // '', 200, いや, 200, いや, 900, いくら, 300, そういう, 300, 状況だからって
        if (textWithWait[0] === "") {
          textWithWait.splice(0, 1);
        }
        const result: Text[] = [];
        for (let index = 0; index < textWithWait.length; index += 2) {
          const waitTime = Number(textWithWait[index]);
          result.push({
            content: textWithWait[index + 1],
            waitTime: waitTime,
            effects: deepCopyObject(it.effects),
          });
        }
        return result;
      }
      return it;
    })
    .flat();
}

export function generateTitleInfo(
  rawStoryUnit: StoryRawUnit,
  language: Language
): ShowTitleOption {
  const text = getText(rawStoryUnit, language);
  // 第114话;这是514个主标题
  // [这是514个主标题, 第114话]
  const spiltText = text.split(";").reverse();
  const rawTitle = spiltText[0];
  const title = parseRubyText(rawTitle);
  return {
    title: title,
    subtitle: spiltText[1],
  };
}

export function getBgm(BGMId: number): PlayAudio["bgm"] | undefined {
  const item = playerStore.BGMExcelTable.get(BGMId);
  if (item) {
    return { url: getResourcesUrl("bgm", item.Path), bgmArgs: item };
  }
}

/**
 * 获取角色在unit的characters里的index, 当不存在时会自动往unit的character里加入该角色
 */
export function getCharacterIndex(
  unit: StoryUnit,
  initPosition: number,
  result: StoryUnit[],
  rawIndex: number
) {
  let characterIndex = unit.characters.findIndex(
    value => value.position === initPosition
  );
  let tempIndex = rawIndex;
  while (characterIndex === -1) {
    tempIndex--;
    if (tempIndex < 0) {
      throw new Error(`未找到包含该人物的story unit,当前rawIndex:${rawIndex}`);
    }
    characterIndex = result[tempIndex].characters.findIndex(
      value => value.position === initPosition
    );
    if (characterIndex !== -1) {
      const preCharacter = { ...result[tempIndex].characters[characterIndex] };
      preCharacter.effects = [];
      unit.characters.push(preCharacter);
      characterIndex = unit.characters.length - 1;
    }
  }
  return characterIndex;
}
/**
 * 根据韩文名获取名字和头像
 * @param krName
 * @returns 包含speaker,avatar的对象
 */
export function getCharacterInfo(krName: string) {
  const CharacterName = getCharacterName(krName);
  const characterInfo = playerStore.CharacterNameExcelTable.get(CharacterName);
  if (characterInfo) {
    const avatarUrl = getResourcesUrl("avatar", characterInfo.SmallPortrait);
    const speaker = getSpeaker(characterInfo);
    return {
      speaker,
      avatarUrl,
    };
  }
}

type TypedTextEffect<effect extends TextEffectName> = {
  name: effect;
} & TextEffect;

type CustomTagParserFnConfig<effect extends TextEffectName> = {
  reg: RegExp;
  fn: (
    rawText: string,
    match: RegExpExecArray
  ) => { effect?: TypedTextEffect<effect>; remain: string } | undefined;
} | null;

type ICustomTagParserMap = {
  [key in TextEffectName]: CustomTagParserFnConfig<key>;
};

const CustomTagParserMap: ICustomTagParserMap = {
  ruby: {
    reg: /\[ruby=(.+?)](.+)\[\/ruby]/,
    fn(rawText: string, match: RegExpExecArray) {
      return {
        effect: {
          name: "ruby",
          value: [match[1]],
        },
        remain: rawText
          .replace(`[ruby=${match[1]}]`, "")
          .replace("[/ruby]", ""),
      };
    },
  },
  color: {
    reg: /\[([A-Fa-f0-9]{6})](.+?)\[-]/,
    fn(rawText: string, match: RegExpExecArray) {
      return {
        effect: {
          name: "color",
          value: [`#${match[1]}`],
        },
        remain: rawText.replace(`[${match[1]}]`, "").replace("[-]", ""),
      };
    },
  },
  log: {
    reg: /\[log=(.+?)](.+)\[\/log]/,
    fn(rawText: string, match: RegExpExecArray) {
      return {
        effect: {
          name: "log",
          value: [match[1]],
        },
        remain: rawText.replace(`[log=${match[1]}]`, "").replace("[/log]", ""),
      };
    },
  },
  tooltip: {
    reg: /\[tooltip=(.+?)](.+)\[\/tooltip]/,
    fn(rawText: string, match: RegExpExecArray) {
      return {
        effect: {
          name: "tooltip",
          value: [match[1]],
        },
        remain: rawText
          .replace(`[tooltip=${match[1]}]`, "")
          .replace("[/tooltip]", ""),
      };
    },
  },
  fontsize: null,
};
/**
 * 根据角色韩文名获取CharacterName
 * @param krName
 */
export function getCharacterName(krName: string) {
  return xxhash.h32(krName, 0).toNumber();
}
export function getEmotionName(rawName: string): string | undefined {
  const name = xxhash.h32(rawName, 0).toNumber();
  return usePlayerStore().EmotionExcelTable.get(name);
}

export function getL2DUrlAndName(BGFileName: string) {
  let filename = String(BGFileName)
    .split("/")
    .pop()
    ?.replace("SpineBG_Lobby", "");
  filename = `${filename}_home`;
  return { url: getResourcesUrl("l2dSpine", filename), name: filename };
}

export function getSoundUrl(Sound: string) {
  if (Sound) {
    return getResourcesUrl("sound", Sound);
  }
}

/**
 * 在CharacterNameExcelTableItem中获取到speaker信息
 */
export function getSpeaker(
  characterInfo: CharacterNameExcelTableItem
): Speaker {
  const language = playerStore.language.toUpperCase() as "CN" | "JP";
  if (characterInfo[`Name${language}`]) {
    return {
      name: characterInfo[`Name${language}`]!,
      nickName: characterInfo[`Nickname${language}`]!,
    };
  } else {
    return {
      name: characterInfo.NameJP,
      nickName: characterInfo.NicknameJP,
    };
  }
}

/**
 * 选择文字, 当没有当前语言文字时返回日文
 */
export function getText(
  rawStoryUnit: StoryRawUnit,
  language: Language
): string {
  const textProperty = `Text${language}` as const;
  return (
    String(Reflect.get(rawStoryUnit, textProperty)) ||
    String(rawStoryUnit.TextJp)
  );
}

export function getVoiceJPUrl(VoiceJp: string) {
  if (VoiceJp) {
    return getResourcesUrl("voiceJp", VoiceJp);
  }
}

/**
 * 判断是否是角色
 * @param s
 */
export function isCharacter(s: string) {
  //类似#3
  return /^\d+$/.test(s);
}

/**
 * 判断是否角色特效
 * @param s
 */
export function isCharacterEffect(s: string) {
  return /#\d/.test(s);
}

/**
 * 判断当前字符串是否是选项
 * @param s 判断的字符串
 */
export function isOption(s: string) {
  // 选项字符串示例: '[s1] \"我正想着稍微散散步来着。\"\n[s2] \"优香在做什么？\"'
  //除此之外还有[ns], [s], [ns1]等情况
  return /\[n?s(\d{0,2})?](.+)/.test(s);
}

/**
 * 解析tag
 *
 * [ruby=なげ][FF6666]嘆[-][/ruby]
 *
 * [{ name: "ruby", values: ["なげ"] }, { name: "color", values: ["#FF6666"] }]
 * @param rawText 原初文本
 */
export function parseCustomTag(rawText: string): Text {
  let raw = rawText;
  const effects = Object.keys(CustomTagParserMap)
    .map(key => {
      const parseConfig = Reflect.get(
        CustomTagParserMap,
        key
      ) as CustomTagParserFnConfig<never>;
      if (!parseConfig) {
        return undefined;
      }
      const match = parseConfig.reg.exec(raw);
      if (!match) {
        return undefined;
      }
      const res = parseConfig.fn(raw, match);
      if (res) {
        raw = res.remain;
      }
      return res?.effect;
    })
    .filter(it => it) as TextEffect[];
  return {
    content: raw,
    effects: effects,
  };
}

/**
 * 将嵌套tag结构分割
 *
 * [FF6666]……我々は望む、七つの[-][ruby=なげ][FF6666]嘆[-][/ruby][FF6666]きを。[-]
 *
 * [FF6666]……我々は望む、七つの[-],[ruby=なげ][FF6666]嘆[-][/ruby],[FF6666]きを。[-]
 * @param rawText 原始结构
 */
export function splitStScript(rawText: string): string[] {
  const res: string[] = [];
  let leftCount = 0;
  let closeTag = false;
  let tagCount = 0;
  let startIndex = 0;
  let tagActive = rawText[0] === "[";
  rawText.split("").forEach((ch, index) => {
    if (ch === "[") {
      leftCount++;
      if (!tagActive) {
        res.push(rawText.substring(startIndex, index));
        startIndex = index;
      }
    } else if (ch === "]") {
      leftCount--;
    } else if (ch === "/" || ch === "-") {
      closeTag = true;
    } else {
      return;
    }
    if (leftCount === 0) {
      tagCount += closeTag ? -1 : 1;
      closeTag = false;
      tagActive = true;
      if (tagCount === 0) {
        res.push(rawText.substring(startIndex, index + 1));
        startIndex = index + 1;
        tagActive = false;
      }
    }
  });
  // 处理尾巴情况
  if (startIndex !== rawText.length) {
    res.push(rawText.substring(startIndex, rawText.length + 1));
  }
  return res;
}

function parseRubyText(raw: string): Text[] {
  // etc.
  // [ruby=Hod]ホド[/ruby]……その[ruby=Path]パス[/ruby]は名誉を通じた完成。
  // [ruby=Hod]ホド ……その[ruby=Path]パス は名誉を通じた完成。
  const a = raw.split("[/ruby]").filter(s => s);
  return a
    .map(it => {
      const rubyIndex = it.indexOf("[ruby=");
      // は名誉を通じた完成。
      if (rubyIndex === -1) {
        return {
          content: it,
          effects: [],
        };
      }
      // Hod]ホド
      // ……その Path]パス
      const b = it.split("[ruby=").filter(s => s);
      return b.map(item => {
        // ……その
        // パス Path
        const split = item.split("]").reverse();
        const content = split[0];
        const ruby = split[1];
        const effects: TextEffect[] = [];
        if (ruby) {
          effects.push({
            name: "ruby",
            value: [ruby],
          });
        }
        return {
          content: content,
          effects: effects,
        };
      });
    })
    .flat(1);
}

/**
 * 将ScriptKr文本结构解析成Text[]
 * @param rawText
 */
export function splitStScriptAndParseTag(rawText: string): Text[] {
  return splitStScript(rawText).map(it => parseCustomTag(it));
}
