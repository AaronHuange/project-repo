// const colors = require('tailwindcss/colors');
function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  };
}
const themeColors = {
  primary: {
    50: withOpacity('--lxy-primary-50'),
    100: withOpacity('--lxy-primary-100'),
    200: withOpacity('--lxy-primary-200'),
    300: withOpacity('--lxy-primary-300'),
    400: withOpacity('--lxy-primary-400'),
    500: withOpacity('--lxy-primary-500'),
    550: withOpacity('--lxy-primary-550'),
    600: withOpacity('--lxy-primary-600'),
    700: withOpacity('--lxy-primary-700'),
    800: withOpacity('--lxy-primary-800'),
    900: withOpacity('--lxy-primary-900'),
  },
  orange: {
    50: '#FFF9F6',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fc9745',
    500: '#FC8352',
    550: '#FAAC17',
    600: '#ef661e',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },
  blue: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#41A5EE',
    550: '#38bdf8',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  amber: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#FAAC17',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  gray: {
    50: '#F5F7FF',
    100: '#F5F8FF',
    200: '#E8EBF6',
    300: '#D5DBED',
    350: '#F7F8FC',
    400: '#babfc7',
    500: '#9A9EBA',
    600: '#767B9E',
    700: '#374151',
    800: '#1f2937',
    900: '#130928',
  },
};

module.exports = themeColors;
