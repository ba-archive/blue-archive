import { defineConfig, loadEnv, normalizePath } from "vite";
import { resolve } from "path";
import OptimizationPersist from "vite-plugin-optimize-persist";
import PkgConfig from "vite-plugin-package-config";
import VueTypeImports from "vite-plugin-vue-type-imports";
// @ts-ignore
import path from "node:path";
import { viteStaticCopy } from "vite-plugin-static-copy";
import presets from "./presets/presets";
// https://vitejs.dev/config/
export default defineConfig((env) => {
  // env 环境变量
  const viteEnv = loadEnv(env.mode, process.cwd());

  return {
    base: viteEnv.VITE_BASE,
    // 插件
    plugins: [
      presets(env),
      VueTypeImports(),
      PkgConfig(),
      OptimizationPersist(),
      // viteStaticCopy({
      //   targets: [
      //     {
      //       // eslint-disable-next-line no-undef
      //       src: normalizePath(path.resolve(__dirname, "./node_modules/blockly/media/*")),
      //       dest: "media",
      //     },
      //   ],
      // }),
    ],
    // 别名设置
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"), // 把 @ 指向到 src 目录去
      },
    },
    // 服务设置
    server: {
      host: true, // host设置为true才可以使用network的形式，以ip访问项目
      port: 12590, // 端口号
      open: true, // 自动打开浏览器
      cors: true, // 跨域设置允许
      strictPort: false, // 如果端口已占用直接退出
      // 接口代理
      // proxy: {
      //   "/api": {
      //     // 本地 8000 前端代码的接口 代理到 8888 的服务端口
      //     target: "http://localhost:8888/",
      //     changeOrigin: true, // 允许跨域
      //     rewrite: (path) => path.replace("/api/", "/"),
      //   },
      // },
    },
    build: {
      reportCompressedSize: false,
      // 消除打包大小超过500kb警告
      chunkSizeWarningLimit: 2000,
      minify: "esbuild",
      assetsDir: "static/assets",
      target: "esnext",
      // 静态资源打包到dist下的不同目录
      rollupOptions: {
        output: {
          chunkFileNames: "static/js/[name]-[hash].js",
          entryFileNames: "static/js/[name]-[hash].js",
          assetFileNames: "static/[ext]/[name]-[hash].[ext]",
        },
      },
    },
    css: {
      preprocessorOptions: {
        // 全局引入了 scss 的文件
        scss: {
          additionalData: `
          @import "@/assets/styles/variables.scss";
        `,
          javascriptEnabled: true,
        },
      },
    },
  };
});
