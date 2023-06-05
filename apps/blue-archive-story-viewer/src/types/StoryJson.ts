export interface CommonStoryTextObject {
  TextCn?: string;
  TextJp: string;
  TextKr?: string;
  TextTh?: string;
  TextEn?: string;
  TextTw?: string;
}

export interface RawStoryUnit {
  GroupId: number;
  SelectionGroup: number;
  BGMId: number;
  Sound: string;
  Transition: number;
  BGName: number;
  BGEffect: number;
  PopupFileName: string;
  ScriptKr: string;
  TextJp: string;
  TextCn?: string;
  TextTw?: string;
  TextEn?: string;
  VoiceJp: string;
}

export interface Section {
  title: {
    TextCn?: string;
    TextJp: string;
    TextKr?: string;
    TextTh?: string;
    TextEn?: string;
    TextTw?: string;
  };
  story_id: number;
  summary: {
    TextKr?: string;
    TextJp: string;
    TextTh?: string;
    TextCn?: string;
    TextTw?: string;
    TextEn?: string;
  };
  next?: number;
  previous?: number;
}

export interface StoryAbstract {
  groupId: number;
  title: CommonStoryTextObject;
  abstract: CommonStoryTextObject;
}

export interface StoryBriefing {
  title: {
    TextCn?: string;
    TextJp: string;
    TextKr?: string;
    TextTh?: string;
    TextEn?: string;
    TextTw?: string;
  };
  avatar: string;
  sections: Section[];
}

export interface StoryContent {
  GroupId: number;
  translator: string;
  content: RawStoryUnit[];
}

export interface StoryIndex {
  groupId: number;
  abstracts: StoryAbstract[];
}
