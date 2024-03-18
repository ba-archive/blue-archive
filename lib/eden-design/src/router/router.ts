import { createRouter, createWebHistory } from "vue-router";
import DevPanel from "@/views/DevPanel.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      redirect: "/button",
      component: DevPanel,
      children: [
        {
          path: "button",
          name: "button",
          component: () => import("@/views/Button.vue"),
        },
      ],
    },
  ],
});

export { router };
