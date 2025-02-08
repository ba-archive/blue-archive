import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { createApp } from "vue";
import { routerConvert } from "./routes/routes";
import App from "./App.vue";
import { Message } from "@arco-design/web-vue";

import "./style.scss";
import "uno.css";
import "@arco-design/web-vue/es/message/style/css.js";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);
Message._context = app._context;

app.use(pinia).use(routerConvert).mount("#app");
