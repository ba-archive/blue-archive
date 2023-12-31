import Menu from "./src/Menu.vue";
import type { App } from "vue";
Menu.name = "menu";

Menu.install = (app: App) => {
  app.component(Menu.name, Menu);
};

export { Menu };
