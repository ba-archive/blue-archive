import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router/auto'
import VueLazyload from 'vue-lazyload'
import App from './App.vue'

import '@unocss/reset/tailwind.css'
import './styles/main.css'
import './styles/font.scss'
import 'uno.css'

const app = createApp(App)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
})
app.use(VueLazyload as any, {
  preLoad: 1.3,
  error: 'https://sdfsdf.dev/50x50.jpg',
  loading: 'https://sdfsdf.dev/450x300.jpg',
  attempt: 1,
})
app.use(router)

// install module
Object.values(
  import.meta.glob<{ install: any }>('./modules/*.ts', {
    eager: true,
  }),
).forEach(i => i.install?.({ isClient: true, app }))

app.mount('#app')

// white theme
isDark.value = false
