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
      question: '是否需要连接数据库'
    },
    {
      where: 'return params.SQL',
      type: 'input',
      field: 'SQL_HOST',
      question: '请输入数据库地址',
      defaultValue: 'localhost'
    },
    {
      where: 'return params.SQL',
      type: 'input',
      field: 'SQL_DATABASE',
      question: '请输入数据库名'
    },
    {
      where: 'return params.SQL',
      type: 'password',
      field: 'SQL_PASSWORD',
      question: '请输入数据库密码',
      defaultValue: ''
    },
    {
      where: 'return params.SQL',
      type: 'input',
      field: 'SQL_PORT',
      question: '请输入数据库端口号',
      defaultValue: '3306'
    },
    {
      type: 'YN',
      field: 'REDIS',
      question: '是否需要连接Redis'
    },
    {
      where: 'return params.REDIS',
      type: 'input',
      field: 'REDIS_HOST',
      question: 'REDIS host',
      defaultValue: 'localhost'
    },
    {
      where: 'return params.REDIS',
      type: 'input',
      field: 'REDIS_PORT',
      question: 'REDIS端口号',
      defaultValue: '6379'
    },
    {
      where: 'return params.REDIS',
      type: 'password',
      field: 'REDIS_PASSWORD',
      question: 'REDIS密码',
      defaultValue: ''
    },
    {
      type: 'YN',
      field: 'CONSOLE_LOG',
      question: '是否打印日志到控制台'
    },
    {
      type: 'input',
      field: 'PORT',
      question: '服务端口号(8080)',
      defaultValue: '8080'
    },
    {
      type: 'check',
      field: 'templates',
      question: '添加需要的模板页面(空格键添加)',
      params: ['货架列表', '我的订单', '下单页', '商品详情', '我的'],
    },
  ],
  exInclude: {
    '!params.SLQ': [
      'mysqlQuery.js.ejs',
    ],
    'params.TYPE==="HTTP接口项目"': [
      'websocketServer.js',
      '/controller/ws/'
    ],
    'params.TYPE==="Websocket项目"': [
      'rankController.js',
      'userController.js',
      '/controller/base/'
    ],
  },
  methods: {
    onParseTemplateFinished: async ({execute, clearConsole, npm, yarn}) => {
      await yarn(['install']);
    },
  }
};