const path = require('path');
// 解决idea @ @rc 别名跳转定位文件路劲问题
module.exports = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/'),
    },
  },
};
