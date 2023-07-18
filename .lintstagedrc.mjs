export default {
  '{apps,lib}/**/*.{js,jsx,ts,tsx,vue}': (files) => {
    // from `files` filter those _NOT_ matching `*test.js`
    // const match = micromatch.not(files, 'apps/ba-story-editor/src/components.d.ts')
    return `eslint ${files.join(' ')} --cached`
  } 
}