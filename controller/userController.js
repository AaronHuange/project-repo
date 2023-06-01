const mysqlQuery = require('../config/mysqlQuery.js');
const sqlBean = require('../entities/sqlbean/SqlBean.js');
const jwtManager = require('../lib/jwt/JwtManager.js');
const { BaseResponse } = require('./base/BaseResponse.js');
const { ErrorCode } = require('./base/BaseResponse');
// const jwt = jwtManager.getJwt({'中文key': '测试各种~212；、。#￥$符号\n'}, 8000);
// console.log('jwt', jwt);
// console.log('校验jwt:', jwtManager.validateJwt(jwt));
// console.log('获取数据', jwtManager.getData(jwt));

module.exports = {
  login(req, resp) {
    // 获取参数
    let name = req.body.name;
    let password = req.body.password;
    if (!name || !password) {
      BaseResponse.fail(resp, ErrorCode['1000']);
      return;
    }
    mysqlQuery('SELECT * FROM `user` WHERE `name` = ? AND `password` = ?',
      [name, password],
      (err, result) => {
        if (result?.length > 0) {
          const user = result[0];
          // 生成token
          user.token = jwtManager.getJwt({ id: user.id }, 60 * 1000 * 30);
          BaseResponse.success(resp, sqlBean.filter(user, 'password'));
        } else {
          BaseResponse.fail(resp, ErrorCode['1001']);
        }
      });
  },
  register(req, resp) {
    // 获取参数
    let name = req.query.name;
    let password = req.query.password;
    let area = req.query.area;
    if (!name || !password || !area) {
      BaseResponse.fail(resp, ErrorCode['1000']);
      return;
    }

    // 判断用户是否已存在
    mysqlQuery('SELECT `name` FROM `user` WHERE `name` = ?;',
      [name],
      (err, result) => {
        if (result) {
          BaseResponse.fail(resp, ErrorCode['1002'])
          return;
        }

        // 注册
        mysqlQuery('INSERT INTO `user` (`name`, `password`, `area`) VALUES (?, ?, ?); ',
          [name, password, area],
          (err, result) => {
            if (!result) {
              resp.send({ code: '1000', msg: '数据库异常,请稍后再试' });
              return;
            }
            BaseResponse.success(resp);
          });
      });
  },
  userInfo(req, resp) {
    const jwt = req.query.token;
    // const userId = jwt; // 防止可以获取任意用户的用户信息,用户id从jwt中获取
    // 判断jwt
    console.log('TODO 判断jwt:', jwtManager.validateJwt(jwt));
    console.log('data:', jwtManager.getData(jwt));
    // 获取用户信息
    mysqlQuery('SELECT * FROM `user` WHERE `id` = ?', [userId], (err, result) => {
      if (result?.length <= 0) {
        resp.send({ code: '1000', msg: '用户不存在' });
        return;
      }
      resp.send({ code: '0000', msg: 'success', data: sqlBean.filter(result[0], 'password') })
    });
  },
}
