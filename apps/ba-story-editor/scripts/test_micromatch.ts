import mm from '../../../common/autoinstallers/rush-eslint/node_modules/micromatch'

const files = [
  'C:/Users/notypejiang/Documents/CodeRepository/GithubRepository/blue-archive/lib/ba-story-player/lib/index.ts',
  'C:/Users/notypejiang/Documents/CodeRepository/GithubRepository/blue-archive/lib/ba-story-player2/lib/index.ts',
]

console.log(mm.not(files, '**/lib/ba-story-player/**/*'))
