import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router/router";
import install from "../packages/eden-ui";
import "./styles.scss";

const app = createApp(App);

install(app);

app.use(router).mount("#app");
