const path = require('path');
const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

const webpackConfig = require('./webpack.config.js');

const isDevelopment = process.env.NODE_ENV === 'development';
const webpackPlugins = [];
if (isDevelopment) {
  webpackPlugins.push(new BundleAnalyzerPlugin({
    analyzerMode: 'server',
    analyzerHost: '127.0.0.1',
    analyzerPort: 3302,
    openAnalyzer: true, // Open browser after construction
    reportFilename: path.resolve(__dirname, 'analyzer/index.html'),
  }));
  webpackPlugins.push(new HardSourceWebpackPlugin());
}

module.exports = {
  style: {},
  webpack: {
    alias: webpackConfig.resolve.alias,
    configure: (config, { paths }) => {
      console.log('paths->', paths);
      // eslint-disable-next-line no-param-reassign
      paths.appBuild = 'build';
      // eslint-disable-next-line no-param-reassign
      paths.appPublic = 'public';
      // eslint-disable-next-line no-param-reassign
      paths.appHtml = path.resolve(__dirname, `./${paths.appPublic}/index.html`);
      const newConfig = { ...config };
      newConfig.entry = path.resolve(__dirname, './src/index.js');
      newConfig.output.path = path.resolve(__dirname, paths.appBuild);
      newConfig.output.filename = 'static/js/react.[contenthash:8].js';

      // 更改html模板
      const defaultEntryHTMLPlugin = newConfig.plugins.filter((plugin) => plugin.constructor.name === 'HtmlWebpackPlugin')[0];
      if (defaultEntryHTMLPlugin) {
        defaultEntryHTMLPlugin.userOptions.template = path.resolve(
          __dirname,
          `./${paths.appPublic}/index.html`
        );
      }

      const defaultCssPlugin = newConfig.plugins.filter((plugin) => plugin.constructor.name === 'MiniCssExtractPlugin')[0];
      if (defaultCssPlugin) {
        defaultCssPlugin.options.filename = 'static/css/react.[contenthash:8].css';
      }

      // 合并chunk
      newConfig.plugins.push(new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }));
      // eslint-disable-next-line no-param-reassign
      newConfig.output.publicPath = '/';
      return newConfig;
    },
    plugins: {
      add: [...webpackPlugins],
    },
  },
};
