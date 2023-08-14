import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import routes from 'virtual:generated-pages'
import App from './App.vue'
import type { UserModule } from './types'

import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'

const app = createApp(App)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
app.use(router)

// install module
Object.values(
  import.meta.glob<{ install: UserModule }>('./modules/*.ts', {
    eager: true,
  }),
).forEach(i => i.install?.({ isClient: true, app }))

app.mount('#app')
