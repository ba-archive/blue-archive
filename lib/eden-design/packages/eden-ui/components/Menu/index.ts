import Menu from "./src/EdenMenu.vue";
import MenuItem from "./src/EdenMenuItem.vue";
import MenuItemGroup from "./src/EdenMenuItemGroup.vue";
import SubMenu from "./src/EdenSubMenu.vue";
import type { App } from "vue";
Menu.name = "menu";
MenuItem.name = "menu-item";
MenuItemGroup.name = "menu-item-group";
SubMenu.name = "sub-menu";

Menu.install = (app: App) => {
  app.component(Menu.name, Menu);
};

MenuItem.install = (app: App) => {
  app.component(MenuItem.name, MenuItem);
};

MenuItemGroup.install = (app: App) => {
  app.component(MenuItemGroup.name, MenuItemGroup);
};

SubMenu.install = (app: App) => {
  app.component(SubMenu.name, SubMenu);
};

export { Menu, MenuItem, MenuItemGroup, SubMenu };
