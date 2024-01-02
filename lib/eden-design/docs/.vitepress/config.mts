import { HeadConfig, defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Eden Design System",
  description: "(Not yet) A Stylized Vue 3 Design System for Blue Archive",
  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
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
    },
    nav: [{ text: "Home", link: "/" }],

    sidebar: [
      {
        text: "开始使用",
        items: [
          {
            text: "组件总览 / Components",
            link: "/components/",
            items: [
              {
                text: "通用 / General",
                link: "/components/#通用-general",
              },
              {
                text: "布局 / Layout",
                link: "/components/#布局-layout",
              },
              {
                text: "导航 / Navigation",
                link: "/components/#导航-navigation",
              },
              {
                text: "数据展示 / Data Display",
                link: "/components/#数据展示-data-display",
              },
              {
                text: "数据录入 / Data Entry",
                link: "/components/#数据录入-data-entry",
              },
              {
                text: "反馈 / Feedback",
                link: "/components/#反馈-feedback",
              },
              {
                text: "其他 / Others",
                link: "/components/#其他-others",
              },
            ],
          },
        ],
        collapsed: false,
      },
      {
        text: "设计规范",
        link: "/guideline/design/",
        collapsed: true,
        items: [
          {
            text: "间距 / Spacing",
            link: "/guideline/design/#间距-spacing",
          },
          {
            text: "栅格 / Grid",
            link: "/guideline/design/#栅格-grid",
          },
          {
            text: "颜色 / Color",
            link: "/guideline/design/#颜色-color",
          },
          {
            text: "字体 / Typography",
            link: "/guideline/design/#字体-typography",
          },
          {
            text: "图标 / Iconography",
            link: "/guideline/design/#图标-iconography",
          },
          {
            text: "阴影 / Shadow",
            link: "/guideline/design/#阴影-shadow",
          },
          {
            text: "布局 / Layout",
            link: "/guideline/design/#布局-layout",
          },
          {
            text: "交互 / Interaction",
            link: "/guideline/design/#交互-interaction",
          },
        ],
      },
      {
        text: "设计语言",
        link: "/guideline/design/design-language",
        items: [],
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
        href: "https://fonts.blue-archive.io/harmonyos-sans-webfont/harmonyos-sans-sc-400.css",
        as: "style",
        onload: "this.rel='stylesheet';this.onload=null;",
      },
    ]);
    head.push([
      "link",
      {
        rel: "prefetch",
        href: "https://fonts.blue-archive.io/harmonyos-sans-webfont/harmonyos-sans-sc-700.css",
        as: "style",
        onload: "this.rel='stylesheet';this.onload=null;",
      },
    ]);

    return head;
  },
});
