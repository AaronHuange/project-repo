# mini-program
小程序（基于Taro）

# 依赖
- 基础库: [taro](https://docs.taro.zone/docs/apis/about/desc)
- 工具库: [taro-hooks](https://next-version-taro-hooks.vercel.app/site/hooks/category/wechat)
- 组件库: [nutui](https://nutui.jd.com/taro/react/2x/#/zh-CN/component/grid)
- 样式库: [tailwindcss](https://tailwindcss.com/docs/installation)

# 调试
1. 编译
```shell
  yarn dev:weapp
```
2. 使用微信开发者工具打开项目中的dist文件， 选择不使用云开发

# 打包
1. 编译
```shell
  yarn build:weapp
```
2. 使用微信开发者工具打开项目中的dist文件， 选择不使用云开发
3. 点击右上角上传按钮，进行发布
4. 登录微信小程序后台，将刚刚上传的包设置为提交审核
