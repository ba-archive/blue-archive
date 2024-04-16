import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  presetWebFonts,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    ['btn', 'px-4 py-1 rounded inline-block bg-white shadow-md cursor-pointer hover:bg-gray-2 active:bg-gray-3 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50 transition select-none'],
    ['icon-btn', 'text-[0.9em] inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-gray-9 !outline-none'],
    ['card', 'min-w-xs b-rd bg-white p3 py2 shadow-md'],
    ['flex-center', 'flex-justify-center flex-items-center'],
    ['img', 'object-contain w24 h18'],
    [/^xxl:(.*)$/, ([, c]) => `important:2xl:${c}`],  // hack: 这里生成的 css 文件媒体查询在前面，需要加 important 强制生效
  ],
  rules: [
    ['pos-center', { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }],
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
    }),
  ],
})
