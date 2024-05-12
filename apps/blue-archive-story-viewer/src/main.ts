// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { createApp } from "vue";
import { useSettingsStore } from "./store/settings";
import { routerConvert } from "@route/routes";
import App from "./App.vue";
import "./style.scss";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
createApp(App).use(pinia).use(routerConvert).mount("#app");

const appElement = document.getElementById("app");

const resizeObserver = new ResizeObserver(() => {
  const width = appElement?.clientWidth;
  const height = appElement?.clientHeight;
  if (width && height) {
    useSettingsStore().setAppSize(width, height);
  }
});

if (appElement) {
  resizeObserver.observe(appElement);
}
