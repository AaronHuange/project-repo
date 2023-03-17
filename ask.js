module.exports = {
  initParams: {
    type: 'type',
    module: 'module',
  },
  question: [],
  methods: {
    onParseTemplateFinished: async ({execute, clearConsole, npm, yarn}) => {
      await yarn(['install']);
    },
  }
};
