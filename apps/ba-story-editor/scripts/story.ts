// playable
// player -> Playable.play() -> JSONStory / JSStory / KotlinStory -> PlayerAsset
// PlayerAsset implements Loadable (JSONAsset, LocalAsset, ...)

// PlayerObject character, loaded spine, loaded png

// PlayerCommand -> Load PlayerAsset
// spine text title voice, high level api
enum PlayerCommandType {
  Spine = 'Spine',
  Text = 'Text',
  Title = 'Title',
  Voice = 'Voice',
  CharacterTalk = 'CharacterTalk',
}

interface SpineCommand {
  type: PlayerCommandType.Spine
  asset: SpineAsset
}

interface TextCommand {
  type: PlayerCommandType.Text
}

interface CharacterTalkCommand {
  type: PlayerCommandType.CharacterTalk
  characters: unknown // 人物摆放状态
  playerDialog: {
    speaker: string
    speakerGroup: string
    text: string
  }
}

// Player

interface Player {
  characterTalk: () => Promise<void>
  waitClick: () => Promise<void>
}

// Playable

interface Playable {
  play: Awaited<(player: Player) => void>
}

// JSONStory

class JSONPlayable implements Playable {
  constructor(readonly json: JSONScript) {

  }

  async play(player: Player) {
    for (const each of this.json.content) {
      await player.characterTalk()
      await player.waitClick()
    }
  }
}

// PlayerAsset Loadable
class NotImplement implements Error {
  name = 'NotImplement Error'
  stack?: string | undefined
  cause?: unknown

  constructor(public message: string = '') {}
}

interface Loadable<T> {
  load: () => Promise<T>
}

enum PlayerAssetType {
  Spine, Video, Image,
}

class SpineAsset implements Loadable<unknown> {
  readonly type = PlayerAssetType.Spine

  async load() {
    throw new NotImplement()
  }
}
class VideoAsset implements Loadable<unknown> {
  readonly type = PlayerAssetType.Video

  async load() {
    throw new NotImplement()
  }
}
class ImageAsset implements Loadable<unknown> {
  readonly type = PlayerAssetType.Image

  async load() {
    throw new NotImplement()
  }
}

export const PlayerAsset = {
  SpineAsset, VideoAsset, ImageAsset,
}

// Script (JSONScript, NexonScript, KotlinScript, JSScript)

enum Lang {
  zhCN = 'zh-CN',
  zhTW = 'zh-TW',
  en = 'en',
  jp = 'jp',
  kr = 'kr',
}

// 新剧情格式，暂且兼容老格式
enum JSONScriptCommandType {
  CharacterTalk = 'CharacterTalk',
}

interface BaseJSONScriptCommand<T extends JSONScriptCommandType> {
  type: T
}

type JSONScriptCharacterTalkCommand = BaseJSONScriptCommand<JSONScriptCommandType.CharacterTalk> & {
  // 人物摆放状态
  characters: {
    position: 1 | 2 | 3 | 4 | 5
    // 人物CharacterName, 请通过它获取人物 spine data
    id: number
    // 人物 spine data 的url
    spineUrl: string
    face: string
    highlight: boolean
    // 人物是否是全息投影状态
    signal: boolean
    effects: {
      type: 'emotion' | 'action' | 'fx'
      effect: string
      async: boolean
      arg?: string
    }[]
  }[]
  playerDialog: {
    speaker: string
    speakerGroup: string
    text: string
  }
}

type JSONScriptCommand = JSONScriptCharacterTalkCommand

interface JSONScript {
  // 官方剧情格式的元信息
  nexonMeta?: {
    GroupID: number
  }
  translator: { [lang in Lang]?: string } // url?
  availableLang: Lang[]
  content: JSONScriptCommand[]
}
