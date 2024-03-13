module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-rem-to-responsive-pixel': {
      transformUnit: 'rpx',
      rootValue: 32,
      propList: ['*']
    },
  },
}
