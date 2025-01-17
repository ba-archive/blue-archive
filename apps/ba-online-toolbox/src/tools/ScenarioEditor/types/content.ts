export interface ContentLine {
  TextJp: string;
  TextCn: string;
  TextKr: string;
  TextEn: string;
  TextTh: string;
  TextTw: string;
  GroupId: number;
  SelectionGroup: number;
  BGMId: number;
  Sound: string;
  Transition: number;
  BGName: number;
  BGEffect: number;
  PopupFileName: string;
  ScriptKr: string;
  VoiceJp: string;
  Unsure?: boolean;
  comment?: string;
}

export type Language =
  | 'TextCn'
  | 'TextTw'
  | 'TextJp'
  | 'TextEn'
  | 'ScriptKr'
  | 'TextTh';

export interface Scenario {
  GroupId: number;
  translator: string;
  proofreader?: string;
  content: ContentLine[];
}
