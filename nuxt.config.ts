// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/eslint-module',
    '@nuxt/content',
    'nuxt-icon',
    '@vite-pwa/nuxt',
    '@vee-validate/nuxt',
    './modules/sui/',
    '@nuxtjs/supabase',
    '@nuxt/image',
  ],
  app: {
    pageTransition: {
      name: 'fade-transition',
      mode: 'out-in',
    },
  },
  supabase: {
    redirect: false,
  },
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
  pwa: {
    manifest: {
      name: 'Arcana',
      short_name: 'Arcana',
      start_url: '/',
      id: 'net.arcana-tarot.app',
      display: 'standalone',
      display_override: ['standalone'],
      background_color: '#202132',
      categories: [
        'entertainment',
        'lifestyle',
        'spirituality',
        'tarot',
        'divination',
      ],
      description:
        'Explore the mysteries of the tarot with Arcana, your personal tarot reading app. Draw cards, learn about their meanings, and uncover insights about your life and future.',
      icons: [
        {
          src: 'icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
      theme_color: '#202132',
      orientation: 'portrait',
      dir: 'ltr',
      scope: '/',
      launch_handler: {
        client_mode: 'navigate-existing',
      },
      iarc_rating_id: 'your-iarc-rating-id', // Replace with your actual IARC rating ID if available
    },
    devOptions: {
      enabled: false,
      type: 'module',
    },
    workbox: {
      navigateFallback: '/',
    },
  },
});
