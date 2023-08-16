export enum Lang {
  zhCN = 'zh-CN',
  zhTW = 'zh-TW',
  en = 'en',
  jp = 'jp',
  kr = 'kr',
}

export type I18N<T> = {
  [key in Lang]?: T
}

export type I18NString = I18N<string>

export interface TextStyle {
  name: | 'color' | 'fontsize' | 'ruby' | 'log' | 'tooltip' | 'b'
  value: string[]
}

export interface Text {
  content: (string | Text)[]
  style: TextStyle[]
}

export type I18NText = I18N<Text>

export enum NexonTags {
  Color = 'Color',
  Ruby = 'Ruby',
  Tooltip = 'Tooltip',
  B = 'B',
  I = 'i',
  Log = 'Log',
  Root = 'Root',
}

export interface TextAST {
  tag: NexonTags
  children: (TextAST | string)[]
  value?: string // argument (unlike xml, nexon tag has only one argument)
}

export type I18NTextAST = I18N<TextAST>
