export default {
  ...baseConfig,
  '*.{js,jsx,ts,tsx,vue,json,md,yml,yaml}': 'eslint --cache --fix',
}