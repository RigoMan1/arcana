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
        surface: {
          DEFAULT: '#1F2027',
          50: '#CBCCD6',
          100: '#C0C1CD',
          200: '#A9ABBB',
          300: '#9295A9',
          400: '#7C7F96',
          500: '#676B82',
          600: '#55586B',
          700: '#434554',
          800: '#31333E',
          900: '#1F2027',
          950: '#131317',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
} satisfies ModuleOptions['config'];
