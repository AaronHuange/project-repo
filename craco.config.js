const path = require('path');

module.exports = {
  style: {},
  webpack: {
    alias: {
      '@': path.resolve(__dirname, './src/'),
    },
    rules: [
      {
        test: /\.js$/i,
        use: 'raw-loader',
      },
    ],
  },
};
