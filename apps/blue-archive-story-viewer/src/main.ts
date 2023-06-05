// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { registerSW } from 'virtual:pwa-register';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import Toastify from 'toastify-js';
import { createApp } from 'vue';
import { routerConvert } from './route/routes';
import App from './App.vue';
import './style.scss';

console.log('build ' + import.meta.env?.__BUILD_TIME__);

const updateSW = registerSW({
  onNeedRefresh() {
    Toastify({
      text: `<div class='sw-update-card'><h4>后台资源已更新，请点击按钮更新以使用新版本</h4>
<div class='sw-update-button'>刷新</div></div>`,
      duration: -1,
      className: 'sw-update-toast',
      escapeMarkup: false,
      gravity: 'bottom',
      style: {
        transform: 'none !important',
        bottom: 'unset !important',
      },
      onClick() {
        // noinspection JSIgnoredPromiseFromCall
        updateSW(true);
      },
    }).showToast();
  },
});

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
createApp(App).use(pinia).use(routerConvert).mount('#app');
