// https://vitepress.dev/guide/custom-theme
import { h } from "vue";
import "../../color-variable.scss";
import { Message } from "@arco-design/web-vue";
import "@arco-design/web-vue/es/message/style/css.js";
import Theme from "vitepress/theme-without-fonts";
// import Theme from "vitepress/theme";
import "./style.scss";

export default {
  extends: Theme,
  Layout: () => {
    return h(Theme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    });
  },
  enhanceApp({ app, router, siteData }) {
    // ...
    Message._context = app._context;
  },
};
