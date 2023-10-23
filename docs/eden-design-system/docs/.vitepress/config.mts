import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Eden Design System",
  description: "(Not yet) A Stylized Vue 3 Design System for Blue Archive",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    search: {
      provider: "local",
    },
    nav: [{ text: "Home", link: "/" }],

    sidebar: [
      {
        text: "开始使用",
        items: [
          { text: "组件总览", link: "/components/" },
          { text: "设计规范", link: "/guideline/design/" },
          { text: "设计语言", link: "/guideline/design/design-language" },
        ],
        collapsed: false,
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/ba-archive/blue-archive" },
    ],
  },

  transformHead({ assets }) {
    // adjust the regex accordingly to match your font
    const myFontFile = assets.find(file => /.*\.\w+\.woff2/);
    if (myFontFile) {
      return [
        [
          "link",
          {
            rel: "preload",
            href: myFontFile,
            as: "font",
            type: "font/woff2",
            crossorigin: "",
          },
        ],
      ];
    }
  },
});
