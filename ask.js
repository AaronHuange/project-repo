module.exports = {
  initParams: {},
  question: [
    {
      type: 'radio',
      field: 'TYPE',
      question: '项目类型',
      params: ['HTTP接口项目', 'Websocket项目', '两者混合项目'],
    },
    {
      type: 'YN',
      field: 'CORS',
      question: '添加允许跨域配置'
    },
    {
      type: 'YN',
      field: 'HTTP_TOOL',
      question: '自带请求接口工具类'
    },
    {
      type: 'YN',
      field: 'SQL',
      question: '需要连接数据库'
    },
    {
      where: 'SQL',
      type: 'input',
      field: 'SQL_HOST',
      question: '数据库地址'
    },
    {
      type: 'YN',
      field: 'REDIS',
      question: '需要连接Redis'
    },
    {
      type: 'YN',
      field: 'CONSOLE_LOG',
      question: '是否打印日志到控制台'
    },
    {
      type: 'input',
      field: 'PORT',
      question: '使用端口号(8080)'
    },
    {
      type: 'YN',
      field: 'useVant',
      question: '导入vant/weapp组件库'
    },
    {
      type: 'check',
      field: 'templates',
      question: '添加需要的模板页面(空格键添加)',
      params: ['货架列表', '我的订单', '下单页', '商品详情', '我的'],
    },
  ],
  methods: {
    onParseTemplateFinished: async ({execute, clearConsole, npm, yarn}) => {
      await yarn(['install']);
    },
  }
};