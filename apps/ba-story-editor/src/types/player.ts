interface Player {
  characterTalk: () => Promise<void>
  waitClick: () => Promise<void>
}

interface Playable {
  play: Awaited<(player: Player) => void>
}
