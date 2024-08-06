import type { App } from "vue";
import "./styles.scss";
import { Menu, MenuItem, MenuItemGroup, SubMenu } from "./components/Menu";
import { Button } from "./components/Button";
import { Text } from "./components/Text";

const components = [Button, Menu, MenuItem, MenuItemGroup, SubMenu, Text];
const componentPrefix = "e";

const install = (app: App) => {
  components.forEach(item => {
    app.component(`${componentPrefix}-${item.__name}`, item);
  });
};

export { install, componentPrefix };
