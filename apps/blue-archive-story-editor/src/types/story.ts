import type { I18NTextAST, Lang } from './common'

export interface NexonJSONStory {
  GroupId: number
  translator: string
  content: {
    GroupId: number
    SelectionGroup: number
    BGMId: number
    Sound: string
    Transition: number
    BGName: number
    BGEffect: number
    PopupFileName: string
    ScriptKr: string
    TextJp: string
    TextCn?: string
    TextTw?: string
    TextEn?: string
    VoiceJp: string
  }[]
}

// 新剧情格式，暂且兼容老格式
export enum JSONStoryCommandType {
  Title = 'Title',
  Place = 'Place', // 播放器左上角显示对话场景
  Talk = 'Talk', // 角色对话，包括未知角色，旁白
  Wait = 'Wait',
  Character = 'Character', // 改变角色状态，不涉及角色对话，包括角色表情、位置
}

/** 标题与副标题 */
export interface JSONStoryTitleCommand {
  type: JSONStoryCommandType.Title
  title: I18NTextAST
  subtitle?: I18NTextAST
}

/** 展示对话位置 */
export interface JSONStoryPlaceCommand {
  type: JSONStoryCommandType.Place
  place: I18NTextAST
}

/** 控制角色 */
export interface JSONStoryCharacterCommand {
  type: JSONStoryCommandType.Character
  position: 1 | 2 | 3 | 4 | 5
  /** 人物 CharacterName, 请通过它获取人物 spine data */
  name?: string // 暂且兼容 nexon 旧命令，为空则操作 position 的人物
  /** 任务差分表情 */
  emotion?: string
  /** 人物表情 */
  face?: string
  /** 人物高亮？ */
  effects?: string
}

/** Talk 命令控制对话框，speaker 为空则是 na，否则为人物对话 */
export interface JSONStoryTalkCommand {
  type: JSONStoryCommandType.Talk
  speaker?: string
  content?: I18NTextAST
}

export interface JSONStoryWaitCommand {
  type: JSONStoryCommandType.Wait
  millionSecond: number
}

export type JSONStoryCommand = JSONStoryTitleCommand | JSONStoryPlaceCommand | JSONStoryTalkCommand | JSONStoryWaitCommand | JSONStoryCharacterCommand
export type JSONStoryCommandT<T extends JSONStoryCommandType> = { type: T } & JSONStoryCommand

/** 以 JSON 格式保存的剧情 */
export interface JSONStory {
  // 官方剧情格式的元信息
  nexonMeta?: {
    GroupID: number
  }
  translator: { [lang in Lang]?: string } // url?
  availableLang: Lang[]
  content: JSONStoryCommand[]
}
