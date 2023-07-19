const forms = require('@tailwindcss/forms');
const typography = require('@tailwindcss/typography');
const scrollbar = require('tailwind-scrollbar');
//
const tailwindcssVariables = require('@mertasan/tailwindcss-variables');
const colors = require('./config/colors');

const defaultConfig = {
  content: ['./src/**/*.{js,jsx,ts,tsx,mdx}', './public/index.html'], // 5.6M 到 50k 的强大提升
  important: '.pk-ui',
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors,
      fontSize: {
        tiny: '0.8125rem',
      },
      fontFamily: {
        ping: ['PingFangSC-Regular', 'PingFangSC-Regular'],
      },
      gridTemplateColumns: {
        // Simple 24 column grid
        24: 'repeat(24, minmax(0, 1fr))',
      },
      animation: {
        scale: 'scale 0.5s ease-in-out',
        rotate: 'rotate 1s ease-in-out',
      },
      keyframes: {
        scale: {
          '0%, 100%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(0.95)' },
          '50%': { transform: 'scale(0.9)' },
          '75%': { transform: 'scale(0.85)' },
        },
        rotate: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-30deg)' },
          '75%': { transform: 'rotate(30deg)' },
        },
      },
    },
  },
  plugins: [
    forms({
      // strategy: 'base', // only generate global styles
      strategy: 'class', // only generate classes
    }),
    typography,
    scrollbar,
    tailwindcssVariables,
  ],
};
module.exports = defaultConfig;
