import { defineConfig } from "vitepress";
import UnoCSS from "unocss/vite";
import AutoImport from "unplugin-auto-import/vite";
import vueDevTools from "vite-plugin-vue-devtools";
import vueJsx from "@vitejs/plugin-vue-jsx";
import * as path from "path";

const SPACE_OR_PUNCTUATION = new RegExp(
  // ts-ignore
  /[\n\r -#%-*,-/:;?@[-\]_{}\u00A0\u00A1\u00A7\u00AB\u00B6\u00B7\u00BB\u00BF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u1680\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2000-\u200A\u2010-\u2029\u202F-\u2043\u2045-\u2051\u2053-\u205F\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u3000-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]+/
);

export function tokenize(text: string): Array<string> {
  // Firefox doesn't support Intl.Segmenter currently
  if (!("Segmenter" in Intl)) {
    // https://github.com/lucaong/minisearch/blob/c3101a31e57d609ef8c55352655235ba25376011/src/MiniSearch.ts#L2018
    return text.split(SPACE_OR_PUNCTUATION);
  }

  // @ts-ignore: seems like Intl.Segmenter is not supported by the lang server
  const segmenter = new Intl.Segmenter("cn", { granularity: "word" });
  // @ts-ignore
  const segs = Array.from(segmenter.segment(text)).map(item => item.segment);
  const uniqueSegs = Array.from(new Set(segs));
  return uniqueSegs.filter(w => !/^\s+$/.test(w));
}

const currentDir = path.resolve(__dirname, "..");
const edenLibDir = path.resolve(currentDir, "../../../");

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Eden Design",
  description: "Pragmatic, aesthetic, friendly",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "首页", link: "/" },
      {
        text: "碧蓝档案剧情站",
        items: [
          { text: "首页", link: "https://blue-archive.io" },
          { text: "Bilibili", link: "https://space.bilibili.com/1413213021" },
        ],
      },
    ],
    editLink: {
      pattern: "https://github.com/ba-archive/blue-archive/tree/dev/apps/viewer-next/packages/eden-design/docs/:path",
      text: "在 GitHub 上编辑此页面",
    },
    sidebar: [
      {
        text: "开始使用",
        items: [
          {
            text: "组件 / Components",
            link: "/components/",
            items: [
              {
                text: "通用 / General",
                // link: "/components/#通用-general",
                collapsed: true,
                items: [
                  {
                    text: "按钮 / Button",
                    link: "/components/general/button",
                  },
                  {
                    text: "图标 / Icon",
                    link: "/components/general/icon",
                  },
                  {
                    text: "排版 / Typography",
                    link: "/components/general/typography",
                  },
                ],
              },
              {
                text: "布局 / Layout",
                // link: "/components/#布局-layout",
                collapsed: true,
                items: [
                  {
                    text: "分割线 / Divider",
                    link: "/components/layout/divider",
                  },
                  {
                    text: "间距 / Space",
                    link: "/components/layout/space",
                  },
                ],
              },
              {
                text: "数据展示 / Data Display",
                // link: "/components/#数据展示-data-display",
                collapsed: true,
                items: [
                  {
                    text: "头像 / Avatar",
                    link: "/components/data-display/avatar",
                  },
                  {
                    text: "卡片 / Card",
                    link: "/components/data-display/card",
                  },
                  {
                    text: "图片 / Image",
                    link: "/components/data-display/image",
                  },
                  {
                    text: "图片预览 / ImagePreview",
                    link: "/components/data-display/image-preview",
                  },
                  {
                    text: "标签页 / Tabs",
                    link: "/components/data-display/tabs",
                  },
                  {
                    text: "标签 / Tag",
                    link: "/components/data-display/tag",
                  },
                ],
              },
              {
                text: "数据录入 / Data Entry",
                // link: "/components/#数据录入-data-entry",
                collapsed: true,
                items: [
                  {
                    text: "下拉菜单 / Dropdown",
                    link: "/components/data-entry/dropdown",
                  },
                  {
                    text: "输入框 / Input",
                    link: "/components/data-entry/input",
                  },
                  {
                    text: "数字输入框 / InputNumber",
                    link: "/components/data-entry/input-number",
                  },
                  {
                    text: "滑动输入条 / Slider",
                    link: "/components/data-entry/slider",
                  },
                  {
                    text: "开关 / Switch",
                    link: "/components/data-entry/switch",
                  },
                ],
              },
              {
                text: "反馈 / Feedback",
                // link: "/components/#反馈-feedback",
                collapsed: true,
                items: [
                  {
                    text: "加载中 / Spinner",
                    link: "/components/feedback/spinner",
                  },
                ],
              },
              {
                text: "导航 / Navigation",
                // link: "/components/#导航-navigation",
                collapsed: true,
                items: [
                  {
                    text: "菜单 / Menu",
                    link: "/components/navigation/menu",
                  },
                  {
                    text: "分页 / Pagination",
                    link: "/components/navigation/pagination",
                  },
                ],
              },
            ],
          },
        ],
        collapsed: false,
      },
      {
        text: "设计规范",
        link: "/guidelines/design",
        collapsed: false,
        items: [
          {
            text: "间距 / Spacing",
            link: "/guidelines/design#间距-spacing",
          },
          {
            text: "栅格 / Grid",
            link: "/guidelines/design#栅格-grid",
          },
          {
            text: "颜色 / Color",
            link: "/guidelines/design#颜色-color",
          },
          {
            text: "字体 / Typography",
            link: "/guidelines/design#字体-typography",
          },
          {
            text: "阴影 / Shadow",
            link: "/guidelines/design#阴影-shadow",
          },
          {
            text: "动画 / Animation",
            link: "/guidelines/design#动画-animation",
          },
          {
            text: "交互 / Interaction",
            link: "/guidelines/design#交互-interaction",
          },
        ],
      },
      {
        text: "设计语言",
        link: "/guidelines/design-language",
      },
    ],
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/ba-archive/blue-archive/tree/dev/apps/viewer-next/packages/eden-design",
      },
    ],
    lastUpdated: {
      text: "最后更新于",
      formatOptions: {
        dateStyle: "medium",
        timeStyle: "short",
        forceLocale: true,
      },
    },
    search: {
      provider: "local",

      options: {
        miniSearch: {
          options: {
            tokenize,
          },
        },
      },
    },
  },
  head: [
    [
      "link",
      {
        rel: "prefetch",
        href: "https://fonts.blue-archive.io/harmonyos-sans-webfont/harmonyos-sans-sc-400.css",
        as: "style",
        onload: "this.rel='stylesheet';this.onload=null;",
      },
    ],
    [
      "link",
      {
        rel: "prefetch",
        href: "https://fonts.blue-archive.io/harmonyos-sans-webfont/harmonyos-sans-sc-700.css",
        as: "style",
        onload: "this.rel='stylesheet';this.onload=null;",
      },
    ],
    [
      "link",
      {
        rel: "prefetch",
        href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,1,0",
        as: "style",
        onload: "this.rel='stylesheet';this.onload=null;",
      },
    ],
  ],
  markdown: {
    headers: {
      level: [2, 6],
    },
    lineNumbers: true,
  },
  vite: {
    resolve: {
      alias: {
        "~": edenLibDir,
        "@eden-design/components":
          edenLibDir + "/packages/eden-design/components",
      },
    },
    ssr: { noExternal: ["element-plus"] },
    plugins: [
      UnoCSS(),
      AutoImport({
        imports: ["vue", "vue-router"],
        dirs: [edenLibDir + "/packages/eden-design/components"],
      }),
      vueDevTools(),
      vueJsx(),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData:
            '@import "../packages/eden-design/_styles/variables.scss";',
        },
      },
    },
  },
});
