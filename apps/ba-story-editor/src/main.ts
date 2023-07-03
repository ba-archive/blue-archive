import "uno.css";
import { setupLayouts } from "virtual:generated-layouts";
import generatedRoutes from "~pages";
import { ViteSSG } from "vite-ssg";
import "./styles/main.css";
import "@unocss/reset/tailwind.css";
// import Previewer from 'virtual:vue-component-preview'
import App from "./App.vue";
import type { UserModule } from "./types";

const routes = setupLayouts(generatedRoutes);

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(
  App,
  { routes, base: import.meta.env.BASE_URL },
  ctx => {
    // install all modules under `modules/`
    Object.values(
      import.meta.glob<{ install: UserModule }>("./modules/*.ts", {
        eager: true,
      })
    ).forEach(i => i.install?.(ctx));
    // ctx.app.use(Previewer)
  }
);
