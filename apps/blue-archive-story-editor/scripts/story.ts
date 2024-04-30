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

// Story (JSONScript, NexonScript, LegacyScript, KotlinScript, JSScript)

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
  value?: string
}

export type I18NTextAST = I18N<TextAST>

// 新剧情格式，暂且兼容老格式
export enum JSONStoryCommandType {
  Title = 'Title',
  Place = 'Place', // 播放器左上角显示对话场景
  Talk = 'Talk', // 角色对话，包括未知角色，旁白
  Wait = 'Wait',
  Character = 'Character', // 改变角色状态，不涉及角色对话，包括角色表情、位置
}

/** 标题与副标题 */
export interface JSONStoryTitleCommand {
  type: JSONStoryCommandType.Title
  title: I18NTextAST
  subtitle?: I18NTextAST
}

/** 展示对话位置 */
export interface JSONStoryPlaceCommand {
  type: JSONStoryCommandType.Place
  place: I18NTextAST
}

/** 控制角色 */
export interface JSONStoryCharacterCommand {
  type: JSONStoryCommandType.Character
  position: 1 | 2 | 3 | 4 | 5
  /** 人物CharacterName, 请通过它获取人物 spine data */
  name?: string // 暂且兼容 nexon 旧命令，为空则操作 position 的人物
  /** 任务差分表情 */
  emotion?: string
  /** 人物表情 */
  face?: string
  /** 人物高亮？ */
  effects?: string
}

export interface JSONStoryTalkCommand {
  type: JSONStoryCommandType.Talk
  speaker?: string
  content?: I18NTextAST
}

export interface JSONStoryWaitCommand {
  type: JSONStoryCommandType.Wait
  millionSecond: number
}

export type JSONStoryCommand = JSONStoryTitleCommand | JSONStoryPlaceCommand | JSONStoryTalkCommand | JSONStoryWaitCommand | JSONStoryCharacterCommand
export type JSONStoryCommandT<T extends JSONStoryCommandType> = { type: T } & JSONStoryCommand

export interface JSONStory {
  // 官方剧情格式的元信息
  nexonMeta?: {
    GroupID: number
  }
  translator: { [lang in Lang]?: string } // url?
  availableLang: Lang[]
  content: JSONStoryCommand[]
}
