import { Lang } from '../../types/common'
import type { I18NTextAST } from '../../types/common'

// todo debug
export const LangKeyMap = {
  TextJp: Lang.jp,
  TextCn: Lang.zhCN,
  TextEn: Lang.en,
  TextTw: Lang.zhTW,
}

export enum NexonScriptCommandTypes {
  Title = 'Title',
  Place = 'Place',
  Wait = 'Wait',
  Character = 'Character',
  CharacterTalk = 'CharacterTalk',
  NA = 'NA',
}

export const NexonScriptCommandRegex = [
  {
    re: /#title;([^;\n]+);?([^;\n]+)?;?/i,
    type: NexonScriptCommandTypes.Title,
  },
  {
    re: /#place;([^;\n]+);?/i,
    type: NexonScriptCommandTypes.Place,
  },
  {
    re: /#na;([^;\n]+);?([^;\n]+)?;?/i,
    type: NexonScriptCommandTypes.NA,
  },
  {
    re: /#wait;(\d+);?/i,
    type: NexonScriptCommandTypes.Wait,
  },
  {
    re: /^(?!#)([1-5]);([^;\n]+);([^;\n]+);?([^;\n]+)?/,
    type: NexonScriptCommandTypes.CharacterTalk,
  },
  {
    re: /#([1-5]);(((em|fx);([^;\n]+))|\w+);?/,
    type: NexonScriptCommandTypes.Character,
  },
]

export type NexonCommandUnit = {
  args: string[]
  raw: string // raw line
  script: string // ScriptKr
  tag?: number // equals meta.SelectionGroup
  meta: {
    SelectionGroup?: number
    BGMId?: number
    Sound?: string
    Transition?: number
    BGName?: number
    BGEffect?: number
    PopupFileName?: string
    TextJp?: string
    TextCn?: string
    TextTw?: string
    TextEn?: string
    VoiceJp?: string
  }
} & (
  {
    type: NexonScriptCommandTypes.Title
    title: I18NTextAST
    subtitle?: I18NTextAST
  } | {
    type: NexonScriptCommandTypes.Place
    value: I18NTextAST
  } | {
    type: NexonScriptCommandTypes.Wait
    millionSecond: number
  } | {
    type: NexonScriptCommandTypes.Character // CharacterEffect
    position: 1 | 2 | 3 | 4 | 5
    emotion?: string // popup 表情
    fx?: string
    effect?: string
  } | {
    type: NexonScriptCommandTypes.CharacterTalk
    position: 1 | 2 | 3 | 4 | 5
    speaker: string
    content?: I18NTextAST
    face: string // 任务面部表情
  } | {
    type: NexonScriptCommandTypes.NA
    speaker?: string
    content: I18NTextAST
  }
)
export type NexonCommandUnitT<T extends NexonScriptCommandTypes> = NexonCommandUnit & { type: T }
