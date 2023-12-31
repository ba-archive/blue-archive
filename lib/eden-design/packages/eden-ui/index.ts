import type { App } from "vue";
import "./styles.scss";
import { Menu } from "./components/Menu/index";

const components = [Menu];
const componentPrefix = "e";

const install = (app: App) => {
  components.forEach(item => {
    app.component(
      `${componentPrefix}-${item.name}`,
      item
    );
  });
};

export default install;
