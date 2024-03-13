export default {
  pages: [
    'pages/tabs/tab1',
    'pages/tabs/tab2',
    'pages/tabs/tab3',
    'pages/tabs/tab4',
    'pages/test',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#00000000',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },
  tabBar: {
    color: '#666',
    selectedColor: '#f5862b',
    backgroundColor: '#fafafa',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/tabs/tab1',
        text: 'tab1'
      },
      {
        pagePath: 'pages/tabs/tab2',
        text: 'tab2'
      },
      {
        pagePath: 'pages/tabs/tab3',
        text: 'tab3'
      },
      {
        pagePath: 'pages/tabs/tab4',
        text: 'tab4'
      },
    ]
  }
};
