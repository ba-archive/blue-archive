import micromatch from 'micromatch'

export default {
  '{apps,lib}/**/*.{js,jsx,ts,tsx,vue}': (files) => {
    // from `files` filter those _NOT_ matching `*test.js`
    const match = micromatch.not(files, './lib/ba-story-player/**/*')
    return `eslint ${match.join(' ')} --fix --cached`
  },
  "*.{json,md}": "prettier --write"
}