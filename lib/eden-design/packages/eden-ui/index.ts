import type { App } from "vue";
import "./styles.scss";
import { Menu, MenuItem, MenuItemGroup, SubMenu } from "./components/Menu";
import { Button } from "./components/Button";

const components = [Button, Menu, MenuItem, MenuItemGroup, SubMenu];
const componentPrefix = "e";

const install = (app: App) => {
  components.forEach(item => {
    app.component(`${componentPrefix}-${item.name}`, item);
  });
};

export { install, componentPrefix };
