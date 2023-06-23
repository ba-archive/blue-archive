/* eslint-disable sort-exports/sort-exports */

export interface FileContent {
  CharacterId: number;
  translate?: string;
  translator?: string;
  title: Title[];
  content: Content[];
}

export interface Title {
  GroupId: number;
  FavorScheduleId: number;
  CharacterId: number;
  TextJp: string;
  TextCn: string;
  TextKr: string;
  TextEn: string;
  TextTh: string;
  TextTw: string;
  unsure?: boolean;
}

export interface TitleTranslation {
  TextJp: string;
  TextCn: string;
  TextKr: string;
  TextEn: string;
  TextTh: string;
  TextTw: string;
  unsure?: boolean;
}

export interface Content {
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
  unsure?: boolean;
}

export interface ContentTranslation {
  MessageKR: string | undefined;
  MessageJP: string | undefined;
  MessageCN: string | undefined;
  MessageEN: string | undefined;
  MessageTH: string | undefined;
  MessageTW: string | undefined;
  unsure?: boolean;
}
