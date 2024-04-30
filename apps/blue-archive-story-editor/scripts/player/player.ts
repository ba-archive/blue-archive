export enum PlayerCommandType {
  // high level api
  Title = 'Title',
  Place = 'Place',
  Voice = 'Voice',
  Episode = 'Episode', /** continued, nextEpisode */
  BGM = 'BGM',
  ClearBGM = 'ClearBGM',
  Dialog = 'Dialog',
  HideDialog = 'HideDialog',
  Select = 'Select',
  Character = 'Character',
  HideCharacter = 'HideCharacter',
  ST = 'ST',
  ClearST = 'ClearST', /** Clear */
  Background = 'Background',
  Config = 'Config',
  Video = 'Video',
  ClearVideo = 'ClearVideo',
  Effect = 'Effect', /** apply prefab effect to object */
  // legacy api
  FontSize = 'FontSize', /** Dialog */
  HideMenu = 'HideMenu', /** Set */
  ShowMenu = 'ShowMenu', /** Set */
  ZMC = 'ZMC', /** Set */
  BGShake = 'BGShake', /** Effect */
  // low level api
  Load = 'Load', /** load object */
  Call = 'Call', /** call object method */
  Get = 'Get', /** get object */
  Set = 'Set', /** operate object */
  Clear = 'Clear', /** clear st, delete object */
}

const RED = '\x1B[31m'
const BLUE = '\x1B[34m'
const GREEN = '\x1B[32m'
const RESET = '\x1B[0m'

export function jloads(text: string): any {
  return JSON.parse(text)
}

export function jdumps(obj: any): string {
  return JSON.stringify(obj, null, 2) || ''
}

interface Effect {
  color: string
  scale: number
  skew: [number, number]
}

interface AnimationState {
  position?: [number, number] // absolute position
  effect?: Effect
}

interface Animatable {
  position: [number, number]
  effect: Effect
  animationState: AnimationState
}

interface Animation {
  readonly name: string
  delay: number
  duration: number
  iterationCount: number
  animate: (obj: Animatable, timeline: number) => void
  final: (obj: Animatable) => void
}

// example implements of Animation, consider ScreenX === 1600
class MoveLeft implements Animation {
  readonly name = 'move-left'
  delay: number
  duration: number
  iterationCount: number

  constructor(delay = 0, duration = 1000, iterationCount = 1) {
    this.delay = delay
    this.duration = duration
    this.iterationCount = iterationCount
  }

  animate(obj: Animatable, timeline: number) {
    // position[0] is x, move left 320 px, duration 1000ms, fps is 60, animate() calls 60 times, every time move left 320 / 60px
    obj.animationState.position = [obj.position[0] - 320 * timeline / 1000, obj.position[1]]
  }

  final(obj: Animatable) {
    obj.position[0] = obj.position[0] - 320
    obj.animationState = {}
  }

  toString() {
    return `[Animation name="${this.name}"]`
  }
}

class CharacterInstance {
  private _name: string
  private _group: string
  private _position: 1 | 2 | 3 | 4 | 5
  private _face: number
  private _emotion: string
  private _effect?: string /** 对元素图层操作 */
  private _animation?: Animation /** 控制元素坐标（transform），不会改变 position */
  private _animationState: AnimationState = {}

  constructor(args: { name: string; position: 1 | 2 | 3 | 4 | 5; effect?: string; animation?: Animation }) {
    this._name = args.name
    this._group = 'group'
    this._position = args.position
    this._face = 1
    this._emotion = 'emotion'
    this._effect = args.effect
    this._animation = args.animation
  }

  get name() { return this._name }
  get group() { return this._group }
  get position() { return this._position }
  get emotion() { return this._emotion }
  get face() { return this._face }
  get effect() { return this._effect }
  get animation() { return this._animation }
  get animationState() { return this._animationState }
}

class DialogInstance {
  private _content?: string
  private _speaker?: string
  private _group?: string

  constructor(content?: string, speaker?: string, group?: string) {
    this._content = content
    this._speaker = speaker
    this._group = group
  }

  get content() { return this._content }
  get speaker() { return this._speaker }
  get group() { return this._group }

  setValue(content?: string, speaker?: string, group?: string) {
    this._content = content
    this._speaker = speaker
    this._group = group
  }
}

class MenuInstance {
  private _hidden: boolean
  constructor(hidden = false) { this._hidden = hidden }

  get hidden() { return this._hidden }
  set hidden(value: boolean) { this._hidden = value }
}

interface PlayerState {
  characters: (CharacterInstance | null)[]
  dialogInstance: DialogInstance
  menuInstance: MenuInstance
}

class Player {
  private _characters: (CharacterInstance | null)[] = [null, null, null, null, null]
  private _dialogInstance: DialogInstance = new DialogInstance()
  private _menuInstance: MenuInstance = new MenuInstance()
  public states: PlayerState[] = []

  get characters() { return this._characters }
  get dialogInstance() { return this._dialogInstance }
  get menuInstance() { return this._menuInstance }
  get state() {
    return {
      characters: this._characters,
      dialogInstance: this._dialogInstance,
      menuInstance: this._menuInstance,
    }
  }

  /** 快照当前状态（保存当前状态为一个分镜） */
  keepStoryBoard() {
    this.states.push(this.state)
  }

  /** 设置当前状态 */
  applyStoryBoard(state: PlayerState) {
    this._characters = state.characters
    this._dialogInstance = state.dialogInstance
    this._menuInstance = state.menuInstance
  }

  /** 创建分镜 */
  withStoryBoard(cb: (player: Player) => void) {
    console.log(`${GREEN}====== enter new story board ======${RESET}`)
    cb(this)
    this.keepStoryBoard()
    this.playStoryBoard()
    this.execInspect()
  }

  /** 回退分镜 */
  backward() {
    const state = this.states.pop()
    state && this.applyStoryBoard(state)
  }

  /** 播放当前分镜，发送信息给 Player（通过 PlayerCommandType），展示分镜 */
  playStoryBoard() {
    console.log(`${BLUE}[Dialog] ${this._dialogInstance.speaker}: ${this._dialogInstance.content}${RESET}`)
    // show character
    for (const character of this._characters) {
      if (character)
        console.log(`${BLUE}[Character] "${character.name}" 在位置 "${character.position}", 差分为 "${character.face}", 表情图标为 "${character.emotion}", 特效为 "${character.effect}", 动画为 "${character.animation}"${RESET}`)
    }
  }

  execInspect() {
    console.log(`[Inspect] state = ${jdumps(this.state)}`)
  }

  execDialogCommand(content: string, speaker: string) {
    this._dialogInstance.setValue(content, speaker, 'speaker\'group')
  }

  execCharacterCommand(name: string, position: 1 | 2 | 3 | 4 | 5, face: number, emotion: string, effect?: string, animation?: Animation) {
    this._characters[position - 1] = new CharacterInstance({ name, position, effect, animation })
  }

  execHideCharacterCommand(position: 1 | 2 | 3 | 4 | 5) {
    // console.log(`${BLUE}[HideCharacter] "隐藏在位置 "${position}" 的角色, 角色名为 "${this._characters[position - 1]?.name}"${RESET}`)
    this._characters[position - 1] = null
  }

  exec(cb: (state: PlayerState) => void) {
    cb(this.state)
  }
}

/** 剧情格式都是 Playable。翻译层独立
 *
 * NexonJSONStory：nx 原始格式
 * NexonScript：可以和 `NexonJSONStory` 无缝转换，主要提取 `ScriptKr` 字段
 * JSONStory: 新的 JSON 剧情格式，命令式脚本。命令见 `PlayerCommandType`
 * PScript: 新的一种剧情脚本，可以做 NexonScript 的上位替代。具有基本的逻辑，需要解释器转换成 Playable
 * VisualScript: 可视化编辑器产生的脚本格式。可以转换成 PScript，也可以直接转换成 Playable
 * KotlinScript: 使用 Kotlin 的 DSL 功能来制作剧情。等同 PScript，直接转换成 Playable
 * Playable: 所有剧情格式都需要转换成 Playable 才能播放，这里提供操作播放器最直接的 API。
 *
 * NexonJSONStory -> NexonScript -> JSONStory -> Playable -> NexonJSONStory
 * VisualScript -> Playable -> NexonJSONStory
 * PScript -> Playable -> NexonJSONStory
 * KotlinScript -> Playable -> NexonJSONStory
 */
interface Playable {
  play: (player: Player) => void
}

/** Playable 的 demo 实现。与 Player 代码不在一个宿主运行。与 player 通过协议通讯，实现一个 Player 的 代理。
 */
class PlayableImpl implements Playable {
  /** 此处 player */
  play(player: Player) {
    player.withStoryBoard((player) => {
      player.execCharacterCommand('白子', 3, 1, '正常', '无特效')
      player.execDialogCommand('老师，稍微占用一点时间', '白子')
    })

    // 人物移动动画
    player.withStoryBoard((player) => {
      player.execCharacterCommand('白子', 3, 1, '正常', '无特效', new MoveLeft())
    })

    // 移动完毕, 切换位置
    player.withStoryBoard((player) => {
      player.execHideCharacterCommand(3)
      player.execCharacterCommand('白子', 2, 1, '正常', '无特效')
      player.execDialogCommand('老师，我从位置 3 移动到了位置 2 了', '白子')
    })

    // 人物切换表情符号
    player.withStoryBoard((player) => {
      player.execCharacterCommand('白子', 2, 1, '高兴', '无特效')
      player.execDialogCommand('切换表情至高兴', '白子')
    })

    // 添加第二个人物
    player.withStoryBoard((player) => {
      player.execCharacterCommand('爱丽丝', 3, 1, '高兴', '无特效')
      player.execDialogCommand('砰砰哐当！爱丽丝登场', '爱丽丝')
    })

    // 动画延迟, widthStoryBoard 可以设计成 async，等待动画播放完毕
    player.withStoryBoard((player) => {
      player.execCharacterCommand('白子', 2, 1, '高兴', '无特效', new MoveLeft())
      player.execCharacterCommand('爱丽丝', 3, 1, '高兴', '无特效', new MoveLeft(1))
      player.execDialogCommand('白子移动到位置 1，一秒后，爱丽丝移动到位置 2', '爱丽丝')
    })

    // 设置动画结果
    player.withStoryBoard((player) => {
      player.execCharacterCommand('白子', 1, 1, '高兴', '无特效')
      player.execCharacterCommand('爱丽丝', 2, 1, '高兴', '无特效')
      player.execHideCharacterCommand(3)
      player.execDialogCommand('移动好了', '爱丽丝')
    })

    // 直接操作 player 对象
    player.withStoryBoard((player) => {
      player.exec((state) => {
        state.dialogInstance.setValue('直接操作 dialogInstance', '新角色')
        state.characters[4] = new CharacterInstance({ name: '新角色', position: 5 })
      })
    })
  }
}

const player = new Player()
const playableImpl = new PlayableImpl()
playableImpl.play(player)

// console.log(`\nhistory states: ${jdumps(player.states)}`)
