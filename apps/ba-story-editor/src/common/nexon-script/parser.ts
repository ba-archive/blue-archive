import { JSONStoryCommandType } from '../../types/story'
import { Lang, NexonTags } from '../../types/common'
import type { JSONStory, JSONStoryCharacterCommand, JSONStoryPlaceCommand, JSONStoryTalkCommand, JSONStoryTitleCommand, JSONStoryWaitCommand, NexonJSONStory } from '../../types/story'
import type { I18NString, I18NTextAST, TextAST } from '../../types/common'
import { NexonScriptCommandRegex, NexonScriptCommandTypes, langKeyMap } from './type'
import type { NexonCommandUnit, NexonCommandUnitT } from './type'

function buildNexonCommandMetaInfo(text: string): NexonCommandUnit['meta'] {
  const result: NexonCommandUnit['meta'] = {}
  text.split(/\s@/).forEach((each) => {
    const matched = /@?([^=\n\"\']+)=(:?\"|\')(.*?)\2/.exec(each)
    if (!matched)
      throw new Error(`Nexon meta info format error: ${each}`)
    Reflect.set(result, matched[1], matched[3])
  })
  return result
}

function buildI18NAST(i18NString: I18NString): I18NTextAST {
  const result: I18NTextAST = {}
  for (const langKey of Object.keys(Lang)) {
    if (Reflect.has(i18NString, langKey)) {
      const langText = String(Reflect.get(i18NString, langKey))
      Reflect.set(result, langKey, buildAST(langText))
    }
  }
  return result
}

function buildI18NStringUtil(metaInfo: NexonCommandUnit['meta'], textKr: string): I18NString {
  const i18NString: I18NString = { [Lang.kr]: textKr }
  for (const [k, v] of Object.entries(langKeyMap)) {
    if (Reflect.has(metaInfo, k)) {
      const langText = String(Reflect.get(metaInfo, k))
      Reflect.set(i18NString, v, langText)
    }
  }
  return i18NString
}

// build NexonScript(string) from json
function buildNexonCommandUnit(raw: string): NexonCommandUnit {
  let metaInfo: NexonCommandUnit['meta'] = {}
  let script: string = raw
  const matched = raw.match(/(?!\\)@/)

  // 处理 `@` 后面的字符串
  if (matched && matched.index) {
    // build meta info
    metaInfo = buildNexonCommandMetaInfo(raw.substring(matched.index))
    script = raw.substring(0, matched.index - 1)
  }
  // 处理 `:` 前面的字符串
  const colonIndex = raw.indexOf(':')
  if (colonIndex !== -1)
    metaInfo.SelectionGroup = Number(raw.substring(0, colonIndex))

  // 处理 `ScriptKr`
  for (const { re, type } of NexonScriptCommandRegex) {
    const matched = re.exec(script)
    if (!matched)
      continue

    const temp = {
      meta: metaInfo, raw, script, args: Array.from(matched), tag: metaInfo.SelectionGroup ?? undefined,
    }
    switch (type) {
      case NexonScriptCommandTypes.Title: {
        const i18NTitle: I18NString = {}
        const i18NSubtitle: I18NString = {}
        for (const [k, v] of Object.entries(langKeyMap)) {
          if (Reflect.has(metaInfo, k)) {
            const langText = String(Reflect.get(metaInfo, k))
            const [titleText, subtitleText] = langText.split(';')
            Reflect.set(i18NTitle, v, titleText)
            subtitleText ?? Reflect.set(i18NSubtitle, v, subtitleText)
          }
        }
        i18NTitle[Lang.kr] = matched[1]
        i18NSubtitle[Lang.kr] = matched[2]
        return { type, ...temp, title: buildI18NAST(i18NTitle), subtitle: i18NSubtitle[Lang.kr] ? buildI18NAST(i18NSubtitle) : undefined }
      }
      case NexonScriptCommandTypes.Place: {
        return { type, ...temp, value: buildI18NAST(buildI18NStringUtil(metaInfo, matched[1])) }
      }
      case NexonScriptCommandTypes.Wait: {
        return { type, ...temp, millionSecond: Number(matched[1]) }
      }
      case NexonScriptCommandTypes.Character: {
        return {
          type,
          ...temp,
          position: Number(matched[1]) as 1 | 2 | 3 | 4 | 5,
          emotion: matched[4] === 'em' ? matched[5] : undefined,
          fx: matched[4] === 'fx' ? matched[5] : undefined,
          effect: matched.reduce((prev, cur) => cur ? prev : prev + 1, 0) === 3 ? matched[2] : undefined,
        }
      }
      case NexonScriptCommandTypes.CharacterTalk: {
        return {
          type,
          ...temp,
          position: Number(matched[1]) as 1 | 2 | 3 | 4 | 5,
          speaker: matched[2],
          face: matched[3],
          content: (matched[4] ? buildI18NAST(buildI18NStringUtil(metaInfo, matched[4])) : undefined),
        }
      }
      case NexonScriptCommandTypes.NA: {
        const content = matched[2] ? matched[2] : matched[1]
        return {
          type,
          ...temp,
          speaker: matched[2] ? matched[1] : undefined,
          content: buildI18NAST(buildI18NStringUtil(metaInfo, content)),
        }
      }
    }
  }
  throw new Error(`Can't parse Command Unit: "${raw}"`)
}

interface ParserHandler {
  (unit: NexonCommandUnit): void
}

const NexonTextTagRe: { [key in NexonTags]?: { tag: NexonTags; start: RegExp; end: RegExp } } = {
  [NexonTags.Ruby]: {
    tag: NexonTags.Ruby,
    start: /^\[ruby=(.*?)]/i,
    end: /^\[\/ruby]/,
  },
  [NexonTags.B]: {
    tag: NexonTags.B,
    start: /^\[b]/i,
    end: /^\[\/b]/,
  },
  [NexonTags.I]: {
    tag: NexonTags.I,
    start: /^\[i]/i,
    end: /^\[\/i]/,
  },
  [NexonTags.Tooltip]: {
    tag: NexonTags.B,
    start: /^\[tooltip=(.*?)]/i,
    end: /^\[\/tooltip]/,
  },
  [NexonTags.Log]: {
    tag: NexonTags.Log,
    start: /^\[log=(.*?)]/i,
    end: /^\[\/log]/,
  },
  [NexonTags.Color]: {
    tag: NexonTags.Color,
    start: /^\[([a-fA-F0-9]{6})]/,
    end: /^\[-]/,
  },
  // fontsize: null,
}

function buildAST(raw: string): TextAST {
  const stack: TextAST[] = [{ tag: NexonTags.Root, children: [] }]
  let index = 0
  const tagRe = /(?<tag>\[[^\[\]]*?\])|(?<text>[^\[\]]*)/g

  while (index < raw.length) {
    const matched = tagRe.exec(raw)
    if (matched && matched.groups) {
      index = tagRe.lastIndex
      if (matched.groups.text) {
        stack[stack.length - 1].children.push(matched.groups.text)
      }
      else if (matched.groups.tag) {
        for (const [_, { tag, start, end }] of Object.entries(NexonTextTagRe)) {
          const tagStartMatched = start.exec(matched.groups.tag)
          const tagEndMatched = end.exec(matched.groups.tag)
          if (tagStartMatched) {
            stack.push({ tag, children: [], value: tagStartMatched[1] })
          }
          else if (tagEndMatched) {
            if (stack[stack.length - 1].tag === tag)
              stack[stack.length - 2].children.push(stack.pop()!)
            else
              throw new Error(`Parse error (raw syntax error / unrecognized tag [${tag}]): ${raw}`)
          }
          else { continue }
          break
        }
      }
      else {
        throw new Error(`Regex match group error: ${matched}`)
      }
    }
    else {
      throw new Error(`Regex match error: ${raw}`)
    }
  }
  return stack[0]
}

/** parse NexonScript(string) / NexonJSONStory(json) to JSONStory */
export class NexonScriptParser {
  public nexonScript?: string
  public units: NexonCommandUnit[]
  public groupId: number
  public index = 0

  public result: JSONStory['content'] = []

  constructor(groupId: number, obj: string)
  constructor(groupId: number, obj: NexonCommandUnit[])
  constructor(groupId: number, obj: string | NexonCommandUnit[]) {
    this.groupId = groupId

    if (typeof obj === 'string') {
      this.nexonScript = obj
      this.units = []
      obj.split('\n').forEach((line) => {
        try {
          this.units.push(buildNexonCommandUnit(line.trim()))
        }
        catch (err) {
          console.warn((err as Error).message)
        }
      })
    }
    else {
      this.units = obj
    }
  }

  parse() {
    for (this.index = 0; this.index < this.units.length; this.index++)
      this.parseCommandUnit(this.units[this.index])
    return this.result
  }

  parseCommandUnit(unit: NexonCommandUnit) {
    const parseHandlerName = `parse${unit.type}CommandUnit`
    if (Reflect.has(this, parseHandlerName))
      void (Reflect.get(this, parseHandlerName) as ParserHandler).call(this, unit)
    else
      throw new Error(`Can't find parse handler: ${parseHandlerName}`)
  }

  parseTitleCommandUnit(unit: NexonCommandUnitT<NexonScriptCommandTypes.Title>) {
    const result: JSONStoryTitleCommand = {
      type: JSONStoryCommandType.Title,
      title: unit.title,
      subtitle: unit.subtitle ? unit.subtitle : undefined,
    }
    this.result.push(result)
  }

  parsePlaceCommandUnit(unit: NexonCommandUnitT<NexonScriptCommandTypes.Place>) {
    const result: JSONStoryPlaceCommand = {
      type: JSONStoryCommandType.Place,
      place: unit.value,
    }
    this.result.push(result)
  }

  parseWaitCommandUnit(unit: NexonCommandUnitT<NexonScriptCommandTypes.Wait>) {
    const result: JSONStoryWaitCommand = {
      type: JSONStoryCommandType.Wait,
      millionSecond: unit.millionSecond,
    }
    return result
  }

  parseCharacterCommandUnit(unit: NexonCommandUnitT<NexonScriptCommandTypes.Character>) {
    const result: JSONStoryCharacterCommand = {
      type: JSONStoryCommandType.Character,
      position: unit.position,
      emotion: unit.emotion,
      effects: unit.effect,
    }
    this.result.push(result)
  }

  parseCharacterTalkCommandUnit(unit: NexonCommandUnitT<NexonScriptCommandTypes.CharacterTalk>) {
    const result1: JSONStoryCharacterCommand = {
      type: JSONStoryCommandType.Character,
      position: unit.position,
      face: unit.face,
      name: unit.speaker,
    }
    this.result.push(result1)
    if (unit.content) {
      const result2: JSONStoryTalkCommand = {
        type: JSONStoryCommandType.Talk,
        content: unit.content,
        speaker: unit.speaker,
      }
      this.result.push(result2)
    }
  }

  parseNACommandUnit(unit: NexonCommandUnitT<NexonScriptCommandTypes.NA>) {
    const result: JSONStoryTalkCommand = {
      type: JSONStoryCommandType.Talk,
      content: unit.content,
      speaker: unit.speaker,
    }
    this.result.push(result)
  }
}

// build NexonScript
const STARTUP_INDENT = '   '
const langKeys = ['TextJp', 'TextCn']
const scriptKeys = ['BGMId', 'Sound', 'Transition', 'BGName', 'BGEffect', 'PopupFileName', 'VoiceJp']

export function buildNexonScript(json: NexonJSONStory) {
  let result = ''
  json.content.forEach((each) => {
    let attrText = ''
    for (const scriptKey of scriptKeys) {
      const temp = Reflect.get(each, scriptKey)
      if (temp)
        attrText += ` @${scriptKey}="${encodeEscape(String(temp))}"`
    }

    const splitKr = each.ScriptKr.split('\n')
    const splitLangs: Record<string, string[]> = {}

    for (const langKey of langKeys) {
      const temp = String(Reflect.get(each, langKey))
      splitLangs[langKey] = temp.split('\n')
    }
    for (let i = 0; i < splitKr.length; i++) {
      let temp = i === 0 && each.SelectionGroup ? `${each.SelectionGroup}: ` : STARTUP_INDENT
      temp += splitKr[i]
      if (i === 0)
        temp += attrText
      Object.keys(splitLangs).forEach((langKey) => {
        if (splitLangs[langKey][i])
          temp += ` @${langKey}="${encodeEscape(splitLangs[langKey][i])}"`
      })
      result += `${temp}\n`
    }
  })
  return result
}
