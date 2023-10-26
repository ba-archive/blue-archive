import { HeadConfig, defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Eden Design System",
  description: "(Not yet) A Stylized Vue 3 Design System for Blue Archive",
  lastUpdated: true,
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

  transformHead: () => {
    const head: HeadConfig[] = [];
    head.push([
      "link",
      {
        rel: "prefetch",
        href: "https://fonts.blue-archive.io/misans-webfont/misans-400-regular.min.css",
        as: "style",
        onload: "this.rel='stylesheet';this.onload=null;",
      },
    ]);
    head.push([
      "link",
      {
        rel: "prefetch",
        href: "https://fonts.blue-archive.io/misans-webfont/misans-600-semibold.min.css",
        as: "style",
        onload: "this.rel='stylesheet';this.onload=null;",
      },
    ]);

    return head;
  },
});
