const WsMessageHandler = require('./WsMessageHandler');
const matchHandler = require('./handler/match');
const playerHandler = require('./handler/player');
const lookHandler = require('./handler/look');
const reConnectHandler = require('./handler/reConnect');
const { createFriendRoomHandler, enterFriendRoomHandler } = require('./handler/friendRoom');
const matchRobotHandler = require('./handler/matchRobot');

class WsMessageDispatch {
  static map = {
    match: matchHandler,
    matchRobot: matchRobotHandler,
    createFriendRoom: createFriendRoomHandler,
    enterFriendRoom: enterFriendRoomHandler,
    player: playerHandler,
    reConnect: reConnectHandler,
    look: lookHandler,
  }

  static dispatch(msgObj, ws, req) {
    if (!msgObj?.type || (!msgObj.userId && !msgObj.token)) { //客户端消息必须带type和userId
      WsMessageHandler.sendByErrorMsg(ws, msgObj?.type, 'userId或token不能为空');
      return;
    }
    const func = this.map[msgObj.type];
    if (!func) {
      WsMessageHandler.sendByErrorMsg(ws, msgObj?.type, '无法处理');
      return;
    }
    func(msgObj.userId, 1, ws, req);
  }
}

module.exports = WsMessageDispatch;