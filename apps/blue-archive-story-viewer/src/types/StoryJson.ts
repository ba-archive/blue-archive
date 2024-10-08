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
  title: CommonStoryTextObject;
  story_id: number;
  summary: CommonStoryTextObject;
  next?: number;
  previous?: number;
  is_before_battle?: boolean;
  is_after_battle?: boolean;
}

export interface StoryAbstract {
  groupId: number;
  title: CommonStoryTextObject;
  abstract: CommonStoryTextObject;
}

export interface StoryBriefing {
  released?: boolean;
  title: CommonStoryTextObject;
  summary?: CommonStoryTextObject;
  avatar: string;
  sections: Section[];
}

export type Place = "shanhaijing" | "millennium" | "trinity";

export type DistrictEventStoryList = Array<StoryBriefing & { place: Place }>;

export interface StoryContent {
  GroupId: number;
  translator: string;
  proofreader?: string;
  content: RawStoryUnit[];
}

export interface StoryIndex {
  groupId: number;
  abstracts: StoryAbstract[];
}
