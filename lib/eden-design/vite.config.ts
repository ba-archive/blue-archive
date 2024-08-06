// https://vitejs.dev/config/
import path from "path";
import px2rem from "postcss-plugin-px2rem";
import postcssPresetEnv from "postcss-preset-env";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import tailwindConfig from "./tailwind.config.js";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ArcoResolver } from "unplugin-vue-components/resolvers";
import legacy from "@vitejs/plugin-legacy";
import vueJsx from "@vitejs/plugin-vue-jsx";

export default defineConfig({
  base: "/eden-demo/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    vue(),
    vueJsx(),
    AutoImport({
      resolvers: [ArcoResolver()],
    }),
    Components({
      dirs: ["components"],
      include: [/\.vue$/, /\.md$/, /\.tsx?$/],
      resolvers: [
        ArcoResolver({
          sideEffect: true,
        }),
      ],
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
  css: {
    postcss: {
      plugins: [
        postcssPresetEnv(),
        px2rem({
          rootValue: 16,
          propBlackList: ["font-size", "border", "border-width"],
          exclude: /(node_module)/,
        }),
        tailwindcss(tailwindConfig),
      ],
    },
  },
});
