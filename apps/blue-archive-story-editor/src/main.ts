// i18n
import { createI18n } from "vue-i18n";
import messages from "@intlify/vite-plugin-vue-i18n/messages";
// vue router
import router from "@/router/index";
// pinia
import store from "@/store";
import App from "./App.vue";

import "virtual:windi.css";
// Devtools: https://windicss.org/integrations/vite.html#design-in-devtools
import "virtual:windi-devtools";
import "@/assets/styles/index.scss";
import "element-plus/dist/index.css";
import "unfonts.css";
import { setApp } from "@/utils/vueTools";

const i18n = createI18n({
  locale: "zh-cn",
  fallbackLocale: "zh",
  messages,
});

const app = createApp(App);

app.use(router).use(store);

app.use(i18n);

app.mount("#app");

setApp(app);
