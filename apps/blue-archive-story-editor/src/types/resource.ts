// export class I18nString {

// }

// export interface Character {
//   i18nName: I18nString
//   name: string // english name code
//   id: number // todo
// }

// /**
//  * 资产类型
//  */
// export type AssetType = 'spine' | 'image' | 'video' | 'audio' | 'text' | 'other'

// /**
//  * 扁平化展示资产
//  */
// export interface BaseAsset<T extends AssetType> {
//   urlPath?: string
//   name: string
//   crc: string
//   path: string
//   type: T
// }

// export type SpineAsset = BaseAsset<'spine'>

// export type ImageAsset = BaseAsset<'image'>

// export type VideoAsset = BaseAsset<'video'>

// export type AudioAsset = BaseAsset<'audio'>

// export type TextAsset = BaseAsset<'text'>

// export type OtherAsset = BaseAsset<'other'>

// export type Asset = SpineAsset | ImageAsset | VideoAsset | AudioAsset | TextAsset | OtherAsset

// /**
//  * todo 以树形结构来展示资源，例如：按照解包目录展示、按照资产种类分类。
//  */
// export interface ResourceTree {
//   name: string // basically 文件夹名字
//   children: (ResourceTree | Asset)[]
// }
