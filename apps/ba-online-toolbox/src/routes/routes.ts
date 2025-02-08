import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";

declare module "vue-router" {
  interface RouteMeta {
    title: string;
    icon: string;
    shouldShowInHomepageNav: boolean;
    shouldShowInNavbar: boolean;
    description: string;
    navOrder: number;
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    meta: {
      shouldShowInHomepageNav: false,
      shouldShowInNavbar: true,
      title: "Home",
      icon: "/image/home.svg",
      description: "传送回主页",
      navOrder: 0,
    },
    children: [
      {
        path: "/editor-momotalk",
        name: "MomotalkEditor",
        meta: {
          shouldShowInHomepageNav: true,
          shouldShowInNavbar: false,
          icon: "/image/momotalk.svg",
          title: "Momotalk V2",
          description: "新版 MomoTalk 翻译工具",
          navOrder: 3,
        },
        component: () =>
          import("../tools/v2-MomotalkEditor/MomotalkEditorHome.vue"),
      },
      {
        path: "/editor",
        name: "ScenarioEditor",
        meta: {
          shouldShowInHomepageNav: true,
          shouldShowInNavbar: false,
          icon: "/image/translation.svg",
          title: "剧情翻译",
          description: "剧情翻译工具",
          navOrder: 3,
        },
        component: () =>
          import("../tools/ScenarioEditor/ScenarioEditorHome.vue"),
      },
      {
        path: "/diff",
        name: "DiffComparator",
        meta: {
          shouldShowInHomepageNav: true,
          shouldShowInNavbar: false,
          icon: "/image/diff.svg",
          title: "Diff 比较",
          description: "比较两个剧情文本的差异",
          navOrder: 4,
        },
        component: () => import("../tools/DiffComparator/DiffCompareHome.vue"),
      },

      {
        path: "/momotalk",
        name: "TranslateMomotalk",
        meta: {
          shouldShowInHomepageNav: true,
          shouldShowInNavbar: false,
          icon: "/image/translation.svg",
          title: "Momotalk 翻译",
          description: "开发人员用的 Momotalk 翻译工具",
          navOrder: 999,
        },
        component: () =>
          import("../tools/MomotalkTranslator/MomotalkTranslatorHome.vue"),
      },
      {
        path: "/diff-comparator",
        redirect: "/diff",
      },
    ],
  },
];

const routerConvert = createRouter({
  history: createWebHistory(),
  routes: routes,
});

export { routerConvert, routes };
