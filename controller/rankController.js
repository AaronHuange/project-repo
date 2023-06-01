const mysqlQuery = require('../config/mysqlQuery')
const { BaseResponse, ErrorCode } = require('./base/BaseResponse');
const sqlBean = require('../entities/sqlbean/SqlBean');
const RedisManager = require('../lib/redis/RedisManager');

sqlSearch = (req, resp) => {
  mysqlQuery('SELECT * FROM `rank` ORDER BY DESC', [], (err, result) => {
    if (result?.length > 0) {
      RedisManager.setValue('wzq-rank', result);
      BaseResponse.success(resp, result.map((bean) => sqlBean.filter(bean, 'id')));
    } else {
      BaseResponse.fail(resp, ErrorCode['1001']);
    }
  });
};

module.exports = {
  // 获取排名
  getRank(req, resp) {
    // 尝试从redis获取
    RedisManager.getValue('wzq-rank').then((data) => {
      if (!data) {
        sqlSearch(req, resp);
        return;
      }
      // 更新缓存

      // 使用缓存的

    }).catch(() => {
      sqlSearch(req, resp);
    });
  }
}