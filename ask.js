module.exports = {
  initParams: {},
  question: [
    {
      type: 'check',
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
      where: 'return params.SQL',
      type: 'input',
      field: 'PORT',
      question: '请输入数据库端口号',
      defaultValue: '3300'
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
      'cache.interceptor.ts',
      'recover.subscriber.ts',
      'soft_remove.subscriber.ts',
      'interfaces.ts',
      'app.model.ts',
      'component.model.ts',
      'form.model.ts',
      'form_permission.model.ts',
      'form_store.model.ts',
      'form_template.model.ts',
      'theme.model.ts',
      'user.model.ts',
    ],
    'params.TYPE!=="GraphQL"': [
      '/graphql/filter/',
      '/graphql/types/',
      'BaseModel.ts',
      'pagination.ts',
    ],
  },
  methods: {
    onParseTemplateFinished: async ({execute, clearConsole, npm, yarn}) => {
      await yarn(['install']);
    },
  }
};