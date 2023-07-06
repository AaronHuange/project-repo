module.exports = {
  initParams: {
  },
  question: [
    {
      type: 'radio', // 非check
      field: 'packageTool',
      question: '使用什么工具安装依赖包',
      params: ['npm', 'yarn', 'pnpm', 'cnpm'],
    },
    {
      type: 'radio',
      field: 'TYPE',
      question: '项目类型',
      params: ['GraphQL', 'RESTful'],
    },
    {
      type: 'YN',
      field: 'CORS',
      question: '添加允许跨域配置'
    },
    {
      type: 'input',
      field: 'PORT',
      question: '启动端口号',
      defaultValue: '3300'
    },
    {
      type: 'YN',
      field: 'monitor',
      question: '是否添加性能监控'
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
      defaultValue: '127.0.0.1'
    },
    {
      where: 'return params.SQL',
      type: 'input',
      field: 'SQL_DATABASE',
      question: '请输入数据库名',
      defaultValue: 'lxcloud_form',
    },
    {
      where: 'return params.SQL',
      type: 'input',
      field: 'SQL_USER',
      question: '请输入数据库用户名',
      defaultValue: 'root'
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
  ],
  exInclude: {
    'params.projectName': [ // 判断必定为true
      'pnpm-lock.yaml',
      '/graphql/'
    ],
    'params.TYPE!=="GraphQL"': [
      '/graphql/filter/',
      '/graphql/types/',
      'BaseModel.ts',
      'pagination.ts',
    ],
    '!params.monitor': [
      'pc-status-monitor.ts',
    ],
  },
  methods: {
    onParseTemplateFinished: async ({execute, clearConsole, npm, yarn}) => {
      await yarn(['install']);
    },
  }
};
