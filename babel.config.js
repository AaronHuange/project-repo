module.exports = {
  presets: [
    [
      'taro',
      {
        framework: 'react',
        ts: false
      },
    ],
  ],
plugins: [
  [
    'import',
    {
      libraryName: 'taro-hooks',
      camel2DashComponentName: false
    },
    'taro-hooks',
  ], [
    "import",
    {
      "libraryName": "@nutui/nutui-react-taro",
      "libraryDirectory": "dist/esm",
      "style": 'css',
      "camel2DashComponentName": false
    },
    'nutui-react-taro'
  ]
],
};
