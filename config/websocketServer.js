const expressWs = require('express-ws')
const WsMessageDispatch = require('../controller/ws/WsMessageDispatch.js')

// 开启websocket,处理监听到的消息
module.exports = (router) => {
  expressWs(router)
  router.ws('/websocket', (ws, req) => {
    ws.send(JSON.stringify({ msg: '连接成功', type: 'connection' }));
    ws.on('message', function (msg) {
      let msgJson = msg;
      if (typeof msg === 'string') {
        try {
          msgJson = JSON.parse(msg);
        } catch (e) {
          console.log('异常格式消息,不转JSON', msg);
        }
      }
      WsMessageDispatch.dispatch(msgJson, ws, req);
      // ws.send(JSON.stringify({ msg: `服务器回复： ${msg}`, type: 'replay' }));
    });
    ws.on('close', function (e) {
      ws.send(JSON.stringify({ msg: `关闭：${e}`, type: 'close' }));
    });
  }).get('/websocket', function (req, resp) {
    console.log('不支持get方式连接,请使用 ws:// 方式连接');
  }).post('/websocket', function (req, resp) {
    console.log('不支持post方式连接,请使用 ws:// 方式连接');
  });
};