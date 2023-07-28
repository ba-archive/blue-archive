/* eslint-disable no-unused-vars,@typescript-eslint/no-unused-vars,@typescript-eslint/ban-ts-comment */
import path from "path";
import px2rem from "postcss-plugin-px2rem";
import postcssPresetEnv from "postcss-preset-env";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import viteCompression from "vite-plugin-compression";
import { VitePWA } from "vite-plugin-pwa";
import legacy from "@vitejs/plugin-legacy";
import vue from "@vitejs/plugin-vue";

const currentTime = new Date().toISOString();

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@components": path.resolve(__dirname, "src/components"),
      "@i18n": path.resolve(__dirname, "src/i18n"),
      "@index": path.resolve(__dirname, "src/index"),
      "@route": path.resolve(__dirname, "src/route"),
      "@store": path.resolve(__dirname, "src/store"),
      "@types": path.resolve(__dirname, "src/types"),
      "@util": path.resolve(__dirname, "src/util"),
      "@widgets": path.resolve(__dirname, "src/components/widgets"),
      "@NeuUI": path.resolve(__dirname, "src/components/NeuUI"),
    },
  },
  define: {
    "import.meta.env.__BUILD_TIME__": JSON.stringify(currentTime),
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
          propBlackList: ["font-size", "border", "border-width"],
          exclude: /(node_module)/,
        }),
      ],
    },
  },
  plugins: [
    vue(),
    legacy({
      targets: [
        "Android >= 39",
        "Chrome >= 50",
        "Safari >= 10.1",
        "iOS >= 10.3",
        "> 1%",
      ],
    }),
    VitePWA({
      injectRegister: "auto",
      includeManifestIcons: true,
      registerType: "prompt",
      includeAssets: ["favicon/*.png"],
      manifest: {
        name: "碧蓝档案剧情站",
        short_name: "BA剧情站",
        description: "Yet another Blue Archive story viewer",
        lang: "zh-CN",
        theme_color: "#3f88f2",
        icons: [
          {
            src: "/favicon/apple-touch-icon.png",
            sizes: "180x180",
            type: "image/png",
          },
          {
            src: "/favicon/maskable-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/favicon/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/favicon/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /(.*?)\.(mp4|mp3|wav|ogg)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "multimedia-cache",
            },
          },
          {
            urlPattern: /(.*?)\.(woff2?)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "font-cache",
            },
          },
        ],
      },
      // uncomment to unregister service worker
      selfDestroying: true,
    }),
    // viteCompression(),
    //@ts-ignore
    visualizer(),
  ],
  build: {
    emptyOutDir: true,
    chunkSizeWarningLimit: 1500,
    minify: "terser",
    terserOptions: {
      toplevel: true,
      safari10: true,
    },
    rollupOptions: {
      // https://rollupjs.org/guide/en/#outputmanualchunks
      output: {
        manualChunks: {
          // archive: ["./src/components/archive/StudentSelector.vue"],
          // 对首屏加载性能影响过大，应该单独 async import
          // player: [
          //   "./src/components/archive/StudentStoryPlayer.vue",
          //   "./src/components/StoryViewer.vue",
          // ],
        },
      },
    },
  },
});
