const JwtManager = require('../../../lib/jwt/JwtManager');
const WsMessageHandler = require('../WsMessageHandler');

function Example(_userId, msgObj, ws, req) {
  const jwt = msgObj.token;
  JwtManager.validateJwt(jwt)
  const data = JwtManager.getData(jwt);
  console.log('data', data);
  WsMessageHandler.sendByErrorMsg(ws, 'test', '登录失效');
  WsMessageHandler.sendData(ws, 'test', {});
}

module.exports = Example;
