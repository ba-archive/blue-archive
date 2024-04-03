import { createInterface } from 'node:readline/promises'

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
})

// 主线程运行在播放器
interface Playable {
  index: number
  totalIndex?: number | null

  /** 播放下一条语句 */
  next: Awaited<() => void>
  /** 选择分支，播放下一条语句 */
  select: Awaited<(index: number) => void>
  /** 输入文本 */
  input: Awaited<(text: string) => void>
}

interface Player {
  text: (name: string, group: string, text: string) => Promise<void>
  title: (title: string, subtitle: string) => Promise<void>
  live2d: (id: number) => Promise<void>
  select: (selectGroup: string[]) => Promise<number>
  input: (prompt: string) => Promise<string>
}

const player: Player = {
  text: async (name, group, text) => {
    console.log(`${name}【${group}】：${text}`)
  },
  title: async (title, subtitle) => {
    console.log(`标题：${title}`)
    console.log(`副标题：${subtitle}`)
  },
  live2d: async (id) => {
    console.log(`播放 live2d: ${id}`)
  },
  select: async (selectGroup) => {
    console.log('选择分支: ')
    for (let i = 0; i < selectGroup.length; i++)
      console.log(`${i} ：${selectGroup[i]}`)
    const input = await rl.question('请输入：')
    return Number.parseInt(input)
  },
  input: async (prompt) => {
    console.log(`prompt: ${prompt}`)
    return await rl.question('请输入：')
  },
}

// 主线程运行在剧情解析器
interface Story {
  waitClick: Awaited<() => void>
  play: Awaited<() => void>
}

const story: Story = {
  waitClick: async () => {
    await rl.question('')
  },
  play: async () => {
    await player.text('优香', '对策委员会', '我正在考虑如何解决这个麻烦。')
    await story.waitClick()
    await player.text('优香', '对策委员会', '点击了')
    await story.waitClick()
    await player.title('title', 'subtitle')
    await story.waitClick()
    const selected = await player.select(['player live2d 1', 'play live2d 2'])
    await player.live2d(selected)
    const name = await player.input('请输入你的名字')
    await player.text('优香', '对策委员会', `${name}老师，你好，`)
    await story.waitClick()
    process.exit(0)
  },
}

await story.play()
