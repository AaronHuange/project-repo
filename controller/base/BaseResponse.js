const ErrorCode = {
  1000: {
    code: '1000',
    msg: '参数缺失'
  },
  1001: {
    code: '1001',
    msg: '用户名或密码错误'
  },
  1002: {
    code: '1002',
    msg: '用户已存在'
  },
  996: '登录失效'
}

const BaseResponse = {
  success(resp, data) {
    resp.send({ code: '0000', data, msg: 'success' });
  },
  fail(resp, errorCode) {
    resp.send({ code: ErrorCode[errorCode].code, data: {}, msg: ErrorCode[errorCode].msg });
  }
};

module.exports = { BaseResponse, ErrorCode }
