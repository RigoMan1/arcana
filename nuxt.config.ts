// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/eslint-module',
    '@nuxt/content',
  ],
  tailwindcss: {
    exposeConfig: true,
    configPath: './tailwind.config.ts',
  },
  runtimeConfig: {
    chatgpt: {
      apiKey: process.env.OPENAI_API_KEY,
    },
  },
  css: ['./assets/main.css'],
});
