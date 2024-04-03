import { usePlayerStore } from "@/stores";
import { deepCopyObject, getResourcesUrl } from "@/utils";
import xxhash from "xxhashjs";
import {
  Character,
  Speaker,
  StoryRawUnit,
  StoryUnit,
  Text,
  TextEffect,
  TextEffectName,
} from "@/types/common";
import { PlayAudio, PlayEffect, ShowTitleOption } from "@/types/events";
import { CharacterNameExcelTableItem } from "@/types/excels";
import { Language } from "@/types/store";

const playerStore = usePlayerStore();

export function buildNxAST(rawText: string) {
  let text: string | undefined = undefined;
  const root: NxAST = {
    tag: "root",
    text: undefined,
    children: [],
    attr: [],
    parent: undefined,
  };
  let currentParent = root;
  const stack = [root];
  let tryCount = 0;
  while (rawText) {
    tryCount++;
    if (tryCount > 30) {
      console.error("翻译时出现严重错误, rowText=" + rawText);
      return root;
    }
    const regMatch = rawText.match(/\[[^wa:]/);
    const textEnd = regMatch?.index ?? -1;
    if (textEnd === 0) {
      const startMatch = parseStart();
      if (startMatch) {
        start(startMatch);
        continue;
      }
      const endMatch = parseEnd();
      if (endMatch) {
        next(endMatch[0].length);
        end();
      }
    } else if (textEnd > 0) {
      text = rawText.substring(0, textEnd);
      if (text) {
        next(text.length);
        chars(text);
      }
    } else {
      // 说明是个纯text节点
      chars(rawText);
      next(rawText.length);
    }
  }

  function parseStart(): NxTagParseResult | undefined {
    const start = NxTagsObj.find(it => it && rawText.match(it.start));
    if (!start) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const parse = start.start.exec(rawText)!;
    const res = {
      name: start.name,
      attr: parse.filter((_, index) => index > 0),
    };
    next(parse[0].length);
    return res;
  }
  function parseEnd() {
    const end = NxTagsObj.find(it => it && rawText.match(it.end));
    if (!end) {
      return;
    }
    return end.end.exec(rawText);
  }
  function start(parsedStart: NxTagParseResult) {
    const element = createAST(parsedStart);

    currentParent = element;
    stack.push(element);
  }
  function createAST(parsedStart: NxTagParseResult): NxAST {
    return {
      tag: parsedStart.name,
      children: [],
      attr: parsedStart.attr,
    };
  }
  function end() {
    const element = stack.pop();
    currentParent = stack[stack.length - 1];
    if (element && currentParent) {
      element.parent = currentParent;
      currentParent.children.push(element);
    }
  }
  function chars(text: string) {
    if (text.length > 0) {
      currentParent.children.push({
        tag: "text",
        children: [],
        text,
      });
    }
  }

  function next(len: number) {
    rawText = rawText.substring(len);
  }
  return root;
}

export function buildStoryIndexStackRecord(source: StoryUnit[]): StoryUnit[] {
  if (!source || source.length === 0) {
    return [];
  }
  let current = source[0];
  return source
    .filter((_, index) => index > 0)
    .map(it => {
      current = iterateStoryUnit(current, it);
      return current;
    });
}

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
  const rawText = getText(rawStoryUnit, playerStore.language).replaceAll(
    "#n",
    "\n"
  );
  return parseNxMagicTag(rawText)
    .map(it => {
      let text = it.content;
      if (text.includes("[wa")) {
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
  const spiltText = text.split(/(?<!\\)[;；]/g).reverse();
  const rawTitle = spiltText[0];
  const title = parseNxMagicTag(rawTitle);
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
      console.error(`未找到包含该人物的story unit,当前rawIndex:${rawIndex}`);
      return -1;
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
  const language = playerStore.language.toUpperCase() as
    | "CN"
    | "JP"
    | "EN"
    | "TW"
    | "TH"
    | "KR";
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

function walkNxAST(root: NxAST, effects: TextEffect[]): Text[] {
  if (root.tag === "text") {
    return [
      {
        content: root.text ?? "",
        effects: [...effects],
      },
    ];
  }
  return (root.children ?? [])
    .map(it => {
      if (it.tag === "text") {
        return walkNxAST(it, [...effects]);
      }
      return walkNxAST(it, [
        ...effects,
        {
          name: it.tag as TextEffectName,
          value: it.attr ?? [],
        },
      ]);
    })
    .flat();
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

type NxTagMap = {
  [key in TextEffectName]: {
    name: key;
    start: RegExp;
    end: RegExp;
  } | null;
};

const NxTags: NxTagMap = {
  color: {
    name: "color",
    start: /^\[([a-fA-F0-9]{6})]/,
    end: /^\[-]/,
  },
  ruby: {
    name: "ruby",
    start: /^\[ruby=(.*?)]/i,
    end: /^\[\/ruby]/,
  },
  b: {
    name: "b",
    start: /^\[b]/i,
    end: /^\[\/b]/,
  },
  tooltip: {
    name: "tooltip",
    start: /^\[tooltip=(.*?)]/i,
    end: /^\[\/tooltip]/,
  },
  log: {
    name: "log",
    start: /^\[log=(.*?)]/i,
    end: /^\[\/log]/,
  },
  fontsize: null,
};
const NxTagsObj = Object.values(NxTags);

type NxTag = TextEffectName | "root" | "text";

type NxAST = {
  tag: NxTag;
  text?: string;
  children: NxAST[];
  attr?: TextEffect["value"];
  parent?: NxAST;
};

type NxTagParseResult = {
  name: NxTag;
  attr?: string[];
};

export function getVoiceJPUrl(VoiceJp: string) {
  if (VoiceJp) {
    return getResourcesUrl("voiceJp", VoiceJp);
  }
}

type IterateStoryUnit = {
  [key in keyof StoryUnit]-?:
    | ((prv: StoryUnit[key], cur: StoryUnit[key]) => StoryUnit[key] | undefined)
    | null;
};

const IterateStoryUnitFun: IterateStoryUnit = {
  GroupId: null,
  PopupFileName: null,
  SelectionGroup: null,
  audio(prv?: PlayAudio, cur?: PlayAudio) {
    return {
      bgm: cur?.bgm ?? prv?.bgm,
      soundUrl: cur?.soundUrl ?? "",
      voiceJPUrl: cur?.voiceJPUrl ?? "",
    };
  },
  characters(prv: Character[], cur: Character[]) {
    if (!prv || prv.length === 0) {
      return deepCopyObject(cur);
    }
    if (!cur || cur.length === 0) {
      return prv;
    }

    // 判断特效并处理
    // 是否有移位 m1/m2/m3/m4/m5
    // 是否有倒下 falldownR/falldownL
    // 是否移出画面 dl/dr/d
    // 是否移入画面 al/ar/a
    // 是否隐藏 hide

    const filterPrv = prv
      .filter(it => {
        const actionEffect = it.effects.filter(
          effect => effect.type === "action"
        );
        // 调整特效造成的走人
        const hideEffect = actionEffect.map(
          effect =>
            /^falldown[RL]$/i.exec(effect.effect) ||
            /^d[rl]?$/i.exec(effect.effect) ||
            effect.effect === "hide"
        );
        if (hideEffect.length > 0) {
          return null;
        }
        // 调整mx造成的移位
        const moveEffect = actionEffect
          .map(effect => /^m(\d)$/i.exec(effect.effect))
          .filter(effect => effect) as RegExpExecArray[];
        if (moveEffect.length > 0) {
          it.position = Number(moveEffect[0][1]);
        }
        // 调整消失再出现的复制人
        if (
          cur.some(
            ch =>
              ch.CharacterName === it.CharacterName &&
              ch.position === it.position
          )
        ) {
          return null;
        }
        // 删除所有特效防止重复播放
        it.effects = [];
        return it;
      })
      .filter(it => it) as Character[];
    return [...filterPrv, ...deepCopyObject(cur)];
  },
  effect(prv: PlayEffect, cur: PlayEffect) {
    return {
      BGEffect: prv.BGEffect ?? cur.BGEffect,
      otherEffect: prv.otherEffect ?? cur.otherEffect,
    };
  },
  fight: null,
  hide: null,
  l2d: null,
  show: null,
  textAbout: null,
  transition: null,
  type: null,
  video: null,
  bg: null,
};

function iterateStoryUnit(prv: StoryUnit, cur: StoryUnit): StoryUnit {
  const copy = deepCopyObject(prv);
  Object.keys(IterateStoryUnitFun).forEach(key => {
    const fn = Reflect.get(IterateStoryUnitFun, key);
    const prvUnit = Reflect.get(prv, key);
    const curUnit = Reflect.get(cur, key);
    if (fn) {
      const res = fn(prvUnit, curUnit);
      Reflect.set(copy, key, res);
    } else {
      Reflect.set(copy, key, deepCopyObject(curUnit ?? prvUnit));
    }
  });
  return copy;
}

/**
 * 将嵌套tag结构分割
 *
 * [FF6666]……我々は望む、七つの[-][ruby=なげ][FF6666]嘆[-][/ruby][FF6666]きを。[-]
 *
 * [FF6666]……我々は望む、七つの[-],[ruby=なげ][FF6666]嘆[-][/ruby],[FF6666]きを。[-]
 *
 * [b]……我々は望む、七つの嘆[FF6666]きを。[-][/b]
 *
 * [b]……我々は望む、七つの嘆[/b], [b][FF6666]きを。[-][/b]
 * @param rawText 原始结构
 */
export function parseNxMagicTag(rawText: string): Text[] {
  const ast = buildNxAST(
    rawText.replaceAll("[USERNAME]", playerStore.userName)
  );
  return walkNxAST(ast, []);
}
