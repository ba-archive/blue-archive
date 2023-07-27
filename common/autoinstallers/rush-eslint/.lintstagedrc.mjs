import micromatch from 'micromatch'

export default {
  '{apps,lib}/**/*.{js,jsx,ts,tsx,vue,mjs,cjs,mts,cts}': (files) => {
    // from `files` filter those _NOT_ matching `*test.js`
    const match = micromatch.not(files, '**/lib/ba-story-player/**/*')
    return `eslint ${match.join(' ')} --fix --cache`
  },
  "*.{json,md}": "prettier --write"
}