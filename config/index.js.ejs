import { UnifiedWebpackPluginV5 } from 'weapp-tailwindcss/webpack';
import path from 'path';

const config = {
  projectName: '<%= projectName %>',
  date: '2023-9-24',
  designWidth: 375,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
    375: 2 / 1
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [
    '@taro-hooks/plugin-react',
    '@tarojs/plugin-html' // 没有这个插件引入的 nutui 库不会进行渲染
  ],
  defineConstants: {},
  copy: {
    patterns: [],
    options: {},
  },
  framework: 'react',
  compiler: {
    type: 'webpack5',
    // prebundle: { enable: false }
    prebundle: {
      exclude: ['@nutui/nutui-react-taro', '@nutui/icons-react-taro']
    }
  },
  alias:{
    '@': path.resolve(__dirname, '../src'),
  },
  cache: {
    enable: false // Webpack 持久化缓存配置，建议开启。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
  },
  mini: {
    miniCssExtractPluginOption: {
      ignoreOrder: true,
    },
    postcss: {
      pxtransform: {
        enable: true,
        config: {
          selectorBlackList: ['nut-'] // TODO 根据问题判断是否需要添加
        }
      },
      url: {
        enable: true,
        config: {
          limit: 1024, // 设定转换尺寸上限
        },
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
      htmltransform: {
        enable: true,
        // 设置成 false 表示 不去除 * 相关的选择器区块
        // 假如开启这个配置，它会把 tailwindcss 整个 css var 的区域块直接去除掉
        config: {
          removeCursorStyle: false,
        },
      },
    },
    webpackChain(chain) {
      chain.merge({
        resolve: {
          extensions: ['.tsx', '.ts', '.js'],
          alias: {
            '@': path.resolve(__dirname, '../src'),
          },
        },
        performance : {
          maxEntrypointSize: 10000000,
          maxAssetSize: 30000000
        },
        plugin: {
          install: {
            plugin: UnifiedWebpackPluginV5,
            args: [{
              appType: 'taro',
              rem2rpx: true
            }]
          }
        }
      })
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {},
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
  },
};

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev').default);
  }
  return merge({}, config, require('./prod').default);
};
