import { createPinia } from 'pinia'
import type { App } from 'vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// Setup Pinia
// https://pinia.vuejs.org/
export function install({ app }: { app: App<Element> }) {
  const pinia = createPinia()

  pinia.use(piniaPluginPersistedstate)
  app.use(pinia)
}
