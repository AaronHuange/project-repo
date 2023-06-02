const ErrorCode = {
  PARAMS_MISS: {
    code: '1000',
    msg: '参数缺失'
  },
  USERINFO_ERROR: {
    code: '1001',
    msg: '用户名或密码错误'
  },
  USER_EXIST: {
    code: '1002',
    msg: '用户已存在'
  },
  SQL_ERROR: {
    code: '1003',
    msg: '数据库异常'
  },
  NEED_LOGIN: '登录失效'
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
