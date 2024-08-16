// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  components: [
    "~/components",
    "~/packages/eden-design/components",
    "~/packages/eden-design/components/typography",
  ],
  css: ["@unocss/reset/normalize.css"],
  devtools: { enabled: true },
  modules: [
    "@pinia/nuxt",
    "@formkit/auto-animate",
    "@unocss/nuxt",
    "@nuxtjs/i18n",
    "@vueuse/nuxt",
    "@nuxtjs/color-mode",
    "radix-vue",
    "@nuxtjs/device",
    "@nuxtjs/robots",
    "@pinia-plugin-persistedstate/nuxt",
    "nuxt-swiper",
    "nuxt-typed-router",
    "nuxt-radash",
  ],
});
