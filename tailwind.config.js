//eslint-disable-next-line import/no-commonjs
const tailwindColors = require('tailwindcss/colors');
/** @type {import('tailwindcss').Config} */


const themeColors = {
  orange: {
    50: '#FFF9F6',
    100: '#FEEFE9',
    200: '#FEc1A9',
    300: '#fdba74',
    400: '#fc9745',
    500: '#FC8352',
    510: '#facc15',
    550: '#FAAC17',
    600: '#ef661e',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
    950: '#431407'
  },
  gray: {
    50: '#F7F7FA',
    100: '#F2F2F6',
    200: '#EAEBED',
    300: '#D5DBED',
    400: '#BABFC7',
    500: '#A2A3A5',
    600: '#7E868E',
    700: '#374151',
    800: '#1f2937',
    900: '#171A1D',
  },
  'gray-alpha': {
    100: 'rgba(23, 26, 29, 1)',
    60: 'rgba(23, 26, 29, 0.6)',
    40: 'rgba(23, 26, 29, 0.4)',
    24: 'rgba(23, 26, 29, 0.24)',
    10: 'rgba(23, 26, 29, 0.1)',
    4: 'rgba(23, 26, 29, 0.04)',
  }
}
//eslint-disable-next-line import/no-commonjs
module.exports = {
  // 这里给出了一份 taro 通用示例，具体要根据你自己项目的目录结构进行配置
  // 比如你使用 vue3 项目，你就需要把 vue 这个格式也包括进来
  // 不在 content glob表达式中包括的文件，在里面编写tailwindcss class，是不会生成对应的css工具类的
  content: ['./public/home.html', './src/**/*.{html,js,ts,jsx,tsx}'],
  // 其他配置项 ...
  corePlugins: {
    // 小程序不需要 preflight，因为这主要是给 h5 的，如果你要同时开发多端，你应该使用 process.env.TARO_ENV 环境变量来控制它
    preflight: false,
  },
  important: '.zhan-ui',
  darkMode: 'class',
  theme: {
    colors: {
      ...tailwindColors,
      ...themeColors,
      primary: themeColors.orange,
    },
    extend: {
      border: {
        color: '#EAEBED',
      },
      borderWidth: {
        DEFAULT: '0.5px',
      },
      fontSize: {
        tiny: '0.8125rem',
        'xxs': ['10px', '14px'],
        'xs': ['12px', '17px'],
        'sm': ['14px', '20px'],
        'base': ['16px', '22px'],
        'md': ['17px', '22px'],
        'lg': ['18px', '24px'],
        'xl': ['20px', '28px'],
        '2xl': ['24px', '34px'],
        '3xl': ['32px', '38px'],
      },
      fontFamily: {
        ping: ['PingFangSC-Regular', 'PingFang SC'],
        'ping-medium': ['PingFangSC-Medium', 'PingFang SC']
      },
    },
  },
  plugins: [
  ],
}
