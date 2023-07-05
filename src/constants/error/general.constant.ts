export const DEFAULT_ERROR = {
  code: 100001,
  msg: '请求失败',
};

export const NOT_FOUND_ERROR = {
  code: 100002,
  msg: '找不到页面',
};

export const BAD_REQUEST_ERROR = {
  code: 100003,
  msg: '错误的请求',
};

export const FORBIDDEN_ERROR = {
  code: 100004,
  msg: '无权限访问',
};

export const UNAUTHORIZED_ERROR = {
  code: 100005,
  msg: '无授权访问',
};

export const ANONYMOUSE_ERROR = {
  code: 100006,
  msg: '非法访问',
};

export const VALIDATION_ERROR = {
  code: 100007,
  msg: '参数校验失败',
};

export const DATA_MISS = {
  code: 100008,
  msg: '数据不存在',
};

export const BAD_USER_INPUT = (message: string) => ({
  code: 100009,
  msg: message || '操作错误',
});

export const DATA_NO_AFFECTED = {
  code: 100010,
  msg: '数据库操作无更新',
};

export const PARAMS_MISS = {
  code: 100011,
  msg: '参数缺失',
};
