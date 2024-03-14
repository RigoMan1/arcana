// import type { Config } from 'tailwind';
import type { ModuleOptions } from '@nuxtjs/tailwindcss';

export default {
  content: [],
  theme: {
    container: {
      center: true,
    },
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
} satisfies ModuleOptions['config'];
