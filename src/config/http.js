const http = {
  prod: {
    httpProvider: 'http://175.178.210.102/pkyingyu',
    bookHttp: 'http://175.178.210.102/pkyingyu',
    smartMemoryHttp: 'http://175.178.210.102/pkyingyu',
  },
  dev: {
    httpProvider: 'http://127.0.0.1:10089/pkyingyu',
    bookHttp: 'http://127.0.0.1:8093/pkyingyu',
    smartMemoryHttp: 'http://127.0.0.1:8033/pkyingyu',
  },
  test: {},
};

export default http;
