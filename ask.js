module.exports = {
  initParams: {},
  question: [
    {
      type: 'YN',
      field: 'useVuex',
      question: '添加通过wepyx管理数据'
    }
    // {
    //   type: 'YN',
    //   field: 'useHttp',
    //   question: '添加get|post方法请求服务器接口工具类'
    // },
    // {
    //   type: 'YN',
    //   field: 'useTrack',
    //   question: '接入页面和事件自动埋点'
    // },
    // {
    //   type: 'YN',
    //   field: 'useVant',
    //   question: '导入vant/weapp组件库'
    // },
    // {
    //   type: 'YN',
    //   field: 'usePageTemplate',
    //   question: '添加单个页面或组件的模板代码'
    // },
    // {
    //   type: 'radio',
    //   field: 'radio',
    //   question: '测试单选询问功能',
    //   params: ['单选询问111', '单选询问222'],
    // },
    // {
    //   type: 'check',
    //   field: 'templates',
    //   question: '添加需要的模板页面(空格键添加)',
    //   params: ['货架列表', '我的订单', '下单页', '商品详情', '我的'],
    // },
  ],
  methods: {
    onParseTemplateFinished: async ({execute, clearConsole, npm, yarn}) => {
      await yarn(['install']);
    },
  }
};