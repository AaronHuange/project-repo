module.exports = {
  initParams: {},
  question: [
    {
      type: 'input',
      field: 'description',
      question: '请输入项目描述',
      defaultValue: ''
    },
  ],
  methods: {
    onParseTemplateFinished: async ({execute, clearConsole, npm, yarn}) => {
      await yarn(['install']);
    },
  }
};
