import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createApp } from 'vue';
import { routerConvert } from './routes/routes';
import App from './App.vue';
import './style.scss';
import "uno.css";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

createApp(App).use(pinia).use(routerConvert).mount('#app');
