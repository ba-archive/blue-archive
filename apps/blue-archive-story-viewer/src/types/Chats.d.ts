/* eslint-disable sort-exports/sort-exports */

export interface Momotalks {
  CharacterId: number;
  translator?: string;
  title: Title[];
  content: Momotalk[];
  splitMomotalk: SplitMomotalk[];
}

export interface Momotalk {
  MessageGroupId: number;
  Id: number;
  CharacterId: number;
  MessageCondition: 'None' | 'FavorRankUp' | 'Answer' | 'Feedback';
  ConditionValue: number;
  PreConditionGroupId: number;
  FavorScheduleId: number;
  NextGroupId: number;
  FeedbackTimeMillisec: number;
  MessageType: 'Text' | 'Image' | 'None';
  ImagePath: string | undefined;
  MessageKR?: string | undefined;
  MessageJP: string | undefined;
  MessageCN?: string | undefined;
  MessageEN?: string | undefined;
  MessageTH?: string | undefined;
  MessageTW?: string | undefined;
}

export interface Title {
  CharacterId: number;
  GroupId: number;
  FavorScheduleId: number;
  TextJp: string;
  TextCn?: string;
  TextKr?: string;
  TextEn?: string;
  TextTh?: string;
  TextTw?: string;
}

export interface SplitMomotalk {
  FavorScheduleId: number;
  splitMomotalkContent: Momotalk[];
}

export interface CurrentMessageItem {
  avatar: boolean;
  MessageGroupId: number;
  Id: number;
  CharacterId: number;
  ConditionValue: number;
  PreConditionGroupId: number;
  FavorScheduleId: number;
  NextGroupId: number;
  FeedbackTimeMillisec: number;
  MessageCondition: 'None' | 'FavorRankUp' | 'Answer' | 'Feedback';
  options?: {
    current: number;
    content: SelectionOption[];
  };
  MessageType: 'Text' | 'Image' | 'None';
  ImagePath: string | undefined;
  MessageJP?: string | undefined;
  MessageCN?: string | undefined;
  MessageKR?: string | undefined;
  MessageEN?: string | undefined;
  MessageTH?: string | undefined;
  MessageTW?: string | undefined;
}

export interface SelectionOption {
  MessageKR?: string | undefined;
  MessageJP: string | undefined;
  MessageCN?: string | undefined;
  MessageEN?: string | undefined;
  MessageTH?: string | undefined;
  MessageTW?: string | undefined;
  NextGroupId: number;
}

export interface MessageText {
  MessageKR?: string | undefined;
  MessageJP: string | undefined;
  MessageCN?: string | undefined;
  MessageEN?: string | undefined;
  MessageTH?: string | undefined;
  MessageTW?: string | undefined;
}
