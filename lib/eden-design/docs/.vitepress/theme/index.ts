// https://vitepress.dev/guide/custom-theme
import { h } from "vue";
import "../../color-variable.scss";
import { Message } from "@arco-design/web-vue";
import "@arco-design/web-vue/es/message/style/css.js";
import Theme from "vitepress/theme-without-fonts";
import ApperanceTransitionLayout from "./ApperanceTransitionLayout.vue";
// import Theme from "vitepress/theme";
import "./style.scss";

export default {
  ...Theme,
  extends: Theme,
  Layout: ApperanceTransitionLayout,
  enhanceApp({ app, router, siteData }) {
    // ...
    Message._context = app._context;
  },
};
