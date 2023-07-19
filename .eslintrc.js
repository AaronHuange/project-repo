module.exports = {
  env: {
    browser: true,
    es2021: true,
    // 'jest/globals': true,
  },
  extends: ['plugin:react/recommended', 'airbnb'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }], // 关闭airbnb对于jsx必须写在jsx文件中的设置
    'react/prop-types': 'off', // 关闭airbnb对于必须添加prop-types的校验
    'react/destructuring-assignment': [2, 'always', { ignoreClassFields: false }],
    'react/jsx-one-expression-per-line': 'off', // 关闭要求一个表达式必须换行的要求
    'react/jsx-wrap-multilines': 0, // 关闭要求jsx属性中写jsx必须要加括号
    'react/jsx-curly-spacing': 0, // return {} 出错问题
    'max-len': ['error', { code: 300 }],
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'only-multiline', // 关闭airbnb对函数调用参数，非一行，最后也要加逗号的限制
      },
    ],
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: [
          'nodes', // 只对参数名为nodes的参数：关闭不能修改的要求(为了在展开子部门的时候,将网络请求获取的子部门数据添加到node上避免遍历树查找)
        ],
      }],
    'jsx-a11y/no-static-element-interactions': 'off', // 关闭非交互元素加事件必须加 role
    'jsx-a11y/click-events-have-key-events': 'off', // 关闭click事件要求有对应键盘事件
    'jsx-a11y/label-has-associated-control': 'off',
    'react/jsx-props-no-spreading': 'off',
    'linebreak-style': ['off', 'windows'],
    camelcase: 'off',
    'no-bitwise': 'off',
    'import/no-extraneous-dependencies': 0,
    'import/no-unresolved': 0, // Turn off "Unable to resolve path to module ..." error
    'import/extensions': 0, // Turn off "Missing file extension for ..." error
    // 'import/extensions': [2, 'never', { 'web.js': 'never', json: 'never' }],
    // 'import/no-extraneous-dependencies': [2, { devDependencies: true }],
    // 'import/no-unresolved': [2, { ignore: ['@/utils/utils'] }],
  },
};
