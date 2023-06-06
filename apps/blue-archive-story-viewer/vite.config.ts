/* eslint-disable no-unused-vars,@typescript-eslint/no-unused-vars,@typescript-eslint/ban-ts-comment */
import px2rem from 'postcss-plugin-px2rem';
import postcssPresetEnv from 'postcss-preset-env';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import clearConsole from 'vite-plugin-clear-console';
import viteCompression from 'vite-plugin-compression';
import { VitePWA } from 'vite-plugin-pwa';
import legacy from '@vitejs/plugin-legacy';
import vue from '@vitejs/plugin-vue';

const currentTime = new Date().toISOString();

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'import.meta.env.__BUILD_TIME__': JSON.stringify(currentTime),
  },
  server: {
    cors: true,
  },
  css: {
    postcss: {
      plugins: [
        postcssPresetEnv(),
        px2rem({
          rootValue: 16,
          propBlackList: ['font-size', 'border', 'border-width'],
          exclude: /(node_module)/,
        }),
      ],
    },
  },
  plugins: [
    vue(),
    legacy({
      targets: [
        'Android >= 39',
        'Chrome >= 50',
        'Safari >= 10.1',
        'iOS >= 10.3',
        '> 1%',
      ],
    }),
    VitePWA({
      injectRegister: 'auto',
      includeManifestIcons: true,
      registerType: 'prompt',
      includeAssets: ['favicon/*.png'],
      manifest: {
        name: '碧蓝档案剧情站',
        short_name: 'BA剧情站',
        description: 'Yet another Blue Archive story viewer',
        lang: 'zh-CN',
        theme_color: '#3f88f2',
        icons: [
          {
            src: '/favicon/apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png',
          },
          {
            src: '/favicon/maskable-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: '/favicon/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/favicon/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /(.*?)\.(mp4|mp3|wav|ogg)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'multimedia-cache',
            },
          },
          {
            urlPattern: /(.*?)\.(woff2?)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'font-cache',
            },
          },
        ],
      },
      // uncomment to unregister service worker
      selfDestroying: true,
    }),
    {
      ...clearConsole(),
      apply: 'build',
    },
    // viteCompression(),
    //@ts-ignore
    visualizer(),
  ],
  build: {
    emptyOutDir: true,
    minify: 'terser',
    terserOptions: {
      toplevel: true,
      safari10: true,
    },
  },
});
