import { Router, createRouter, createWebHistory } from "vue-router";
import DevPanel from "@/views/DevPanel.vue";

const router: Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      redirect: "/texts",
      component: DevPanel,
      children: [
        {
          path: "buttons",
          name: "buttons",
          component: () => import("@/views/DevButtons.vue"),
        },
        {
          path: "texts",
          name: "texts",
          component: () => import("@/views/DevTexts.vue"),
        },
      ],
    },
  ],
});

export { router };
