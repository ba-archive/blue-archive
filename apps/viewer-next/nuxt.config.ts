// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    '@formkit/auto-animate',
    '@unocss/nuxt',
    '@nuxtjs/i18n',
    '@vueuse/nuxt',
    '@nuxtjs/color-mode',
    'radix-vue',
    '@nuxtjs/device',
    '@nuxtjs/robots',
    '@pinia-plugin-persistedstate/nuxt',
    'nuxt-swiper',
    'nuxt-typed-router',
    'nuxt-radash'
  ]
})