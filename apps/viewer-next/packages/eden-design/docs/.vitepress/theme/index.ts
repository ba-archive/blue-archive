// https://vitepress.dev/guide/custom-theme
import { h } from "vue";
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import "./style.scss";
import "uno.css";
import VitepressCustomView from "./VitepressCustomView.vue";
import "element-plus/es/components/message/style/css";
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'

export default {
  extends: DefaultTheme,
  Layout: VitepressCustomView,
  enhanceApp({ app, router, siteData }) {
    // @ts-ignore
    app.use(autoAnimatePlugin)
  },
} satisfies Theme;
