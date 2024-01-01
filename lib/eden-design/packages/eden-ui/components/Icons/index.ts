import Chevron from "./src/Chevron.vue";
import type { App } from "vue";
import { componentPrefix } from "../../index";

const icons = [Chevron];

const installIcons = (app: App) => {
  icons.forEach(item => {
    app.component(componentPrefix + "-icon-" + item.__name.toLowerCase(), item);
  });
};

export default installIcons;
