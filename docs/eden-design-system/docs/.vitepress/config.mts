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
          { text: "开始使用", link: "get-started" },
          { text: "设计语言", link: "/design-language" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/ba-archive/blue-archive" },
    ],
  },
});
