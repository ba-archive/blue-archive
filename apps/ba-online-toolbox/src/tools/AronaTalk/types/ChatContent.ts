/* eslint-disable sort-exports/sort-exports */

export interface ContentToken {
  type:
    | 'EscapeCharacter'
    | 'CommandDeclarator'
    | 'StickerDeclaratorOpen'
    | 'StickerDeclaratorClose'
    | 'WhiteSpace'
    | 'LineBreak'
    | 'Symbol'
    | 'Text'
    | 'Image'
    | 'Sticker';
  value: string;
}

export interface ImageAst {
  type: 'Image';
  value: string;
}

export interface CommandAst {
  type: 'Command';
  value: string;
}

export interface TextAst {
  type: 'Text';
  value: string;
}

export interface MessageContentAst {
  type: 'Image' | 'Command' | 'Text' | 'WhiteSpace' | 'LineBreak' | 'Sticker';
  value: string;
}

export interface ChatContentAst {
  type: 'ChatContent';
  characterId: string;
  characterName: string;
  characterType: 'User' | 'System' | 'Npc' | 'Custom';
  messageType: 'Text' | 'Sticker' | 'Image' | 'Relationship' | 'Choice';
  messageContentAst: MessageContentAst[];
}

export interface ChatContent {
  characterId: string;
  characterName: string;
  characterType: 'User' | 'System' | 'Npc' | 'Custom';
  messageType:
    | 'Text'
    | 'Stamp'
    | 'Image'
    | 'Relationship'
    | 'Choice'
    | 'Narration';
  messageContent: string;
}

export interface Character {
  id: string;
  name: string;
  avatarType: 'Npc' | 'Custom';
  avatar: string;
}
