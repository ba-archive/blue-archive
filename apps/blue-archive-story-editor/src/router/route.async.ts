// 需要鉴权的业务路由
import { RouteRecordRaw } from "vue-router";

const asyncRoutes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "home",
    meta: {
      title: "",
      icon: "",
    },
    component: () => import("@/views/home/HomeIndex.vue"),
  },
];

export default asyncRoutes;
