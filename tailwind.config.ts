// import type { Config } from 'tailwind';
import type { ModuleOptions } from '@nuxtjs/tailwindcss';
import colors from 'tailwindcss/colors';

export default {
  content: [],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: colors.zinc,
        secondary: colors.indigo,
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
} satisfies ModuleOptions['config'];
