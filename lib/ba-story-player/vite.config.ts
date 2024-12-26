import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import ElementPlus from "unplugin-element-plus/vite";
import vueDevTools from "vite-plugin-vue-devtools";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    resolve: {
      alias: {
        "@": resolve(__dirname, "./lib"),
        "@assets": resolve(__dirname, "./src/assets"),
      },
    },
    plugins: [
      vue(),
      dts(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      ElementPlus({
        // options
      }),
      vueDevTools(),
    ],
    esbuild: {
      drop: mode === "production" ? ["debugger"] : [],
      pure: mode === "production" ? ["console.log"] : [],
    },
    build: {
      lib: {
        entry: resolve(__dirname, "lib/main.ts"),
        name: "BaStoryPlayer",
        fileName: "ba-story-player",
      },
      rollupOptions: {
        external: ["vue", "axios"],
        output: {
          globals: {
            vue: "vue",
            axios: "axios",
          },
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@assets/scss/index.scss" as *;',
          api: "modern-compiler",
        },
      },
    },
  };
});
