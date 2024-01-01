import Button from "./src/EdenButton.vue";
import type { App } from "vue";
Button.name = "button";

Button.install = (app: App) => {
  app.component(Button.name, Button);
};

export { Button };
