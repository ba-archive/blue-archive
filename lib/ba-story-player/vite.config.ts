import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    resolve: {
      alias: {
        "@": resolve(__dirname, "./lib"),
      },
    },
    plugins: [vue()],
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
      rollupOptions:{
        external: ['vue', 'axios']
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "./src/assets/scss/index.scss";',
        },
      },
    },
  };
});
