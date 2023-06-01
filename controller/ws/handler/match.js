const JwtManager = require('../../../lib/jwt/JwtManager');
const WsMessageHandler = require('../WsMessageHandler');
const Robot = require('../../../entities/beans/Robot');
const { RoomManager } = require('../../../entities/beans/Room');

// 匹配池
const matchPool = {}

// 处理匹配消息 {"type": "match","userId": 1, "token":"becyJfX3RpbWUiOjE2NjUzODQ3MjIwNTl9.cedyJpZCI6MX0=.kxRI_"}
function matchHandler(_userId, msgObj, ws, req) {    // jwt校验
  /*** token鉴权 ***/
  const jwt = msgObj.token;
  if (!jwt || !JwtManager.validateJwt(jwt)) {
    WsMessageHandler.sendByErrorMsg(ws, 'match', '登录失效');
    return;
  }

  const data = JwtManager.getData(jwt);
  const userId = data.id || _userId;

  /*** 从匹配等待池取一个玩家：(存在则匹配成功) ***/
  let haveMatched = false;
  (Object.keys(matchPool || {}) || []).find((otherUserId) => { // TODO 添加能力分段匹配池
    const userInfo = matchPool[otherUserId];
    if (!userInfo) {
      return false;
    }
    const { ws: otherWs, name: otherName } = userInfo;
    if (!otherWs) {
      return false;
    }
    haveMatched = true;
    // 随机设置某个玩家先手
    const isFirst = (Math.floor(Math.random() * 10) % 2 === 0);

    let firstUserInfo;
    let otherUserInfo;
    if (isFirst) {
      firstUserInfo = { userId, isFirst: true, name: msgObj.name, ws };
      otherUserInfo = { userId: otherUserId, isFirst: false, name: otherName, ws: otherWs };
    } else {
      firstUserInfo = { userId: otherUserId, isFirst: true, name: otherName, ws: otherWs };
      otherUserInfo = { userId, isFirst: false, name: msgObj.name, ws };
    }
    const newRoom = RoomManager.genNewRoom(firstUserInfo, otherUserInfo);

    WsMessageHandler.sendData(otherWs,
      'match',
      { name: msgObj.name, userId: userId, isFirst, roomId: newRoom.roomId });
    WsMessageHandler.sendData(ws,
      'match',
      { name: otherName, userId: otherUserId, isFirst: !isFirst, roomId: newRoom.roomId });
    /*** 匹配池删除对应玩家 ***/
    delete (matchPool[otherUserId]);
    return true;
  });

  /*** 从匹配等待池取一个玩家：没有匹配成功 ***/
  if (haveMatched) {
    return;
  }

  /*** 未匹配到：丢入匹配池 ***/
  matchPool[userId] = { ws, name: msgObj.name };
  /*** 开启倒计时等待玩家。超时10秒匹配人机。//TODO 根据隐藏分设置人机思考深度 ***/
  setTimeout(() => {
    if (!matchPool[userId]) {
      /*** 已经被真人匹配了 ***/
      return;
    }
    console.log('匹配机器人');
    // 随机设置某个玩家先手
    const isFirst = (Math.floor(Math.random() * 10) % 2 === 0);
    const robot = new Robot();

    let firstUserInfoWithRobot;
    let otherUserInfoWithRobot;
    if (isFirst) {
      firstUserInfoWithRobot = { userId: -1, isFirst: true, name: robot.name, ws: null };
      otherUserInfoWithRobot = { userId, isFirst: false, name: msgObj.name, ws };
    } else {
      firstUserInfoWithRobot = { userId, isFirst: true, name: msgObj.name, ws };
      otherUserInfoWithRobot = { userId: -1, isFirst: false, name: robot.name, ws: null };
    }
    const newRoomWithRobot = RoomManager.genNewRoom(firstUserInfoWithRobot, otherUserInfoWithRobot);

    WsMessageHandler.sendData(ws,
      'match',
      { name: robot.name, userId: -1, isFirst, roomId: newRoomWithRobot.roomId });
    /*** 匹配池删除对应玩家 ***/
    delete (matchPool[userId]);
  }, 10 * 1000);
}

module.exports = matchHandler;