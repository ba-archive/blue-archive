import micromatch from 'micromatch'

export default {
  '{apps,lib}/**/*.{js,jsx,ts,tsx,vue,mjs,cjs,mts,cts}': (files) => {
    // from `files` filter those _NOT_ matching `*test.js`
    const match = micromatch.not(files, '**/lib/ba-story-player/**/*')
    if (match.length)
      return `eslint ${match.join(' ')} --fix --cache --debug`
    return ""
  },
  // "*.{json,md}": "prettier --write"
}