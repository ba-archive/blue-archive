import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';

declare module 'vue-router' {
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
    path: '/',
    name: 'Home',
    meta: {
      shouldShowInHomepageNav: false,
      shouldShowInNavbar: true,
      title: 'Home',
      icon: '/image/home.svg',
      description: '传送回主页',
      navOrder: 0,
    },
    children: [
      {
        path: 'aronaTalk',
        name: 'AronaTalk',
        meta: {
          shouldShowInHomepageNav: false,
          shouldShowInNavbar: false,
          icon: '/image/arona_icon.webp',
          title: 'AronaTalk',
          description: 'BA 前端标准靶场',
          navOrder: 1,
        },
        component: () => import('../tools/AronaTalk/AronaTalkHome.vue'),
      },
      {
        path: '/momotalk',
        name: 'TranslateMomotalk',
        meta: {
          shouldShowInHomepageNav: true,
          shouldShowInNavbar: false,
          icon: '/image/translation.svg',
          title: 'Momotalk 翻译',
          description: '开发人员用的 Momotalk 翻译工具',
          navOrder: 2,
        },
        component: () =>
          import('../tools/MomotalkTranslator/MomotalkTranslatorHome.vue'),
      },
      {
        path: '/editor',
        name: 'ScenarioEditor',
        meta: {
          shouldShowInHomepageNav: true,
          shouldShowInNavbar: false,
          icon: '/image/translation.svg',
          title: '剧情翻译（新）',
          description: '剧情翻译器（新）',
          navOrder: 3,
        },
        component: () =>
          import('../tools/ScenarioEditor/ScenarioEditorHome.vue'),
      },
    ],
  },
];

const routerConvert = createRouter({
  history: createWebHistory(),
  routes: routes,
});

export { routerConvert, routes };
