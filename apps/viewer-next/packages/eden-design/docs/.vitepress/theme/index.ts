// https://vitepress.dev/guide/custom-theme
import { h } from "vue";
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import "./style.scss";
import "uno.css";
import VitepressCustomView from "./VitepressCustomView.vue";
export default {
  extends: DefaultTheme,
  Layout: VitepressCustomView,
  enhanceApp({ app, router, siteData }) {
    // ...
  },
} satisfies Theme;
