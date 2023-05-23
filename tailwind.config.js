/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        // Определение primary и secondary цветов в конфигурации
        primary: {
          DEFAULT: 'var(--color-primary)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
        },
        blue: {
          500: '#2196F3',
        },
        white: '#FFFFFF',
        gray: {
          500: '#9E9E9E',
        },
        orange: {
          500: '#FF9800',
        },
        green: {
          500: '#4CAF50',
        },
        red: {
          500: '#F44336',
        },
        yellow: {
          500: '#FFEB3B',
        },
        darkBlue: {
          500: '#303F9F',
        },
        silver: {
          500: '#BDBDBD',
        },
        darkGreen: {
          500: '#388E3C',
        },
        purple: {
          500: '#9C27B0',
        },
      },
    },
  },
  plugins: [],
};
