// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  future: {
    compatibilityVersion: 4,
  },
  components: [
    "~/components",
    "~/packages/eden-design/components",
    "~/packages/eden-design/components/typography",
    "~/packages/eden-design/components/input",
    "~/packages/eden-design/components/icon",
  ],
  css: [
    "@unocss/reset/normalize.css",
    "~/packages/eden-design/_styles/index.scss",
  ],
  devtools: { enabled: true },
  modules: [
    "@pinia/nuxt",
    "@formkit/auto-animate",
    "@unocss/nuxt",
    "@nuxtjs/i18n",
    "@vueuse/nuxt",
    "@nuxtjs/color-mode",
    "@nuxtjs/device",
    "@nuxtjs/robots",
    "@pinia-plugin-persistedstate/nuxt",
    // "nuxt-swiper",
    "nuxt-typed-router",
    "nuxt-radash",
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData:
            '@use "~/packages/eden-design/_styles/variables.scss" as *;',
          api: "modern-compiler",
        },
      },
    },
  },
  ignore: ["packages/eden-design/docs/**"],
});
