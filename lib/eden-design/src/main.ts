import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router/router";
import { install } from "../packages/eden-ui";
import installIcons from "../packages/eden-ui/components/Icons";
import "./styles.scss";

const app = createApp(App);

install(app);
installIcons(app);

app.use(router).mount("#app");
