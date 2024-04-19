import { createPinia } from 'pinia'
import type { App } from 'vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// Setup Pinia
// https://pinia.vuejs.org/
export function install({ app }: { app: App<Element> }) {
  const pinia = createPinia()
  // @ts-expect-error 依赖问题，提供 vue 3.3.11 的插件，但是项目安装的 vue 不是该版本
  pinia.use(piniaPluginPersistedstate)
  app.use(pinia)
}
