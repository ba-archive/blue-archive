import Menu from "./src/EdenMenu.vue";
import MenuItem from "./src/EdenMenuItem.vue";
import MenuItemGroup from "./src/EdenMenuItemGroup.vue";
import SubMenu from "./src/EdenSubMenu.vue";
import type { App } from "vue";
Menu.__name = "menu";
MenuItem.__name = "menu-item";
MenuItemGroup.__name = "menu-item-group";
SubMenu.__name = "sub-menu";

export { Menu, MenuItem, MenuItemGroup, SubMenu };
