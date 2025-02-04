import px2rem from "postcss-plugin-px2rem";
import postcssPresetEnv from "postcss-preset-env";
import { defineConfig } from "vite";
import legacy from "@vitejs/plugin-legacy";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import {
  ElementPlusResolver,
  NaiveUiResolver,
  ArcoResolver,
} from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import UnoCSS from "unocss/vite";
import {
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
} from "unocss";
import vueDevTools from "vite-plugin-vue-devtools";

const isDevelopment = process.env.NODE_ENV === "development";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    cors: true,
    proxy: {
      "/api": {
        target: "https://openapi.youdao.com",
        changeOrigin: true,
      },
    },
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
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },
  plugins: [
    vueDevTools(),
    AutoImport({
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
      imports: ["vue", "vue-router"],
      resolvers: [ElementPlusResolver(), NaiveUiResolver(), ArcoResolver()],
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
        NaiveUiResolver(),
        ArcoResolver({
          sideEffect: true,
        }),
      ],
    }),
    vue(),
    UnoCSS({
      presets: [
        presetUno(),
        presetIcons({
          extraProperties: {
            display: "inline-block",
            "vertical-align": "middle",
          },
        }),
        presetAttributify(),
      ],
      transformers: [transformerDirectives()],
    }),
    legacy({
      targets: [
        "Android >= 39",
        "Chrome >= 50",
        "Safari >= 10.1",
        "iOS >= 10.3",
        "> 1%",
      ],
    }),
  ],
  build: {
    emptyOutDir: true,
    chunkSizeWarningLimit: 2000,
    minify: "terser",
    terserOptions: {
      toplevel: true,
      safari10: false,
    },
  },
});
