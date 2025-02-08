export type Language = "Kr" | "Jp" | "Cn" | "En" | "Th" | "Tw";

export type FileContent = {
  CharacterId: number;
  translator?: string;
  proofreader?: string;
  title: Title[];
  content: Content[];
};

export type Title = {
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
};

export type GeneralTranslation = Omit<
  Title,
  "GroupId" | "FavorScheduleId" | "CharacterId"
>;

export type Content = {
  MessageGroupId: number;
  Id: number;
  CharacterId: number;
  MessageCondition: "None" | "FavorRankUp" | "Answer" | "Feedback";
  ConditionValue: number;
  PreConditionGroupId: number;
  FavorScheduleId: number;
  NextGroupId: number;
  FeedbackTimeMillisec: number;
  MessageType: "Text" | "Image" | "None";
  ImagePath?: string;
  MessageKR?: string;
  MessageJP: string;
  MessageCN?: string;
  MessageEN?: string;
  MessageTH?: string;
  MessageTW?: string;
  unsure?: boolean;
};

export type ContentTranslation = Omit<
  Content,
  "MessageGroupId" | "Id" | "CharacterId" | "MessageCondition"
>;

export type Student = {
  id: number;
  familyName: StudentName;
  name: StudentName;
  nickname: string[] | number[];
  club: string;
  affiliation: string;
  rarity: number;
  type: string;
  armorType: string;
  weapon: string;
};

export type StudentName = {
  cn: string;
  jp: string;
  en: string;
};
