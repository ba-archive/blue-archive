enum AssetType {
  Spine, Video, Image,
}

interface SpineAsset {
  type: AssetType.Spine
}

interface VideoAsset {
  type: AssetType.Video
}

interface ImageAsset {
  type: AssetType.Image
}

export type Asset = SpineAsset | VideoAsset | ImageAsset
export type AssetT<T extends Asset> = Asset & { type: T }
