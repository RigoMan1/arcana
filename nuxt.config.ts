// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', '@vueuse/nuxt', '@pinia/nuxt'],
  tailwindcss: {
    exposeConfig: true,
    configPath: './tailwind.config.ts',
  },
  css: ['./assets/main.css'],
});
