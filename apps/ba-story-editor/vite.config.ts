/// <reference types="vitest" />

import path from 'node:path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import UnoCSS from 'unocss/vite'
import { TDesignResolver } from 'unplugin-vue-components/resolvers'

// import VueMacros from 'unplugin-vue-macros/vite'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    // Can't compile
    // VueMacros({
    //   defineOptions: false,
    //   defineModels: false,
    //   plugins: {
    //     vue: Vue({
    //       script: {
    //         propsDestructure: true,
    //         defineModel: true,
    //       },
    //     }),
    //   },
    // }),

    Vue(),

    // https://github.com/hannoeru/vite-plugin-pages
    Pages(),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        '@vueuse/head',
        '@vueuse/core',
      ],
      resolvers: [TDesignResolver({ library: 'vue-next' })],
      dts: true,
      dirs: ['src/composables', 'src/stores'],
      vueTemplate: true,
    }),

    // // https://github.com/antfu/vite-plugin-components
    Components({
      resolvers: [TDesignResolver({ library: 'vue-next' })],
      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      dts: true,
    }),

    // https://github.com/antfu/unocss
    // see uno.config.ts for config
    UnoCSS(),
  ],

  // https://github.com/vitest-dev/vitest
  test: {
    environment: 'jsdom',
  },
})
