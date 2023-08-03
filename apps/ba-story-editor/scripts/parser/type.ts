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
