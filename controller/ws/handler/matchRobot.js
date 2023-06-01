const JwtManager = require('../../../lib/jwt/JwtManager');
const WsMessageHandler = require('../WsMessageHandler');
const Robot = require('../../../entities/beans/Robot');
const { RoomManager } = require('../../../entities/beans/Room');

//  {"type": "matchRobot","userId": 1, "token":"becyJfX3RpbWUiOjE2NjUzODQ3MjIwNTl9.cedyJpZCI6MX0=.kxRI_"}
function matchRobotHandler(_userId, msgObj, ws, req) {
  /*** token鉴权 ***/
  const jwt = msgObj.token;
  if (!jwt || !JwtManager.validateJwt(jwt)) {
    WsMessageHandler.sendByErrorMsg(ws, 'match', '登录失效');
    return;
  }
  const data = JwtManager.getData(jwt);
  const userId = data.id || _userId;
  console.log('添加机器人');
  // 随机设置某个玩家先手
  const isFirst = (Math.floor(Math.random() * 10) % 2 === 0);
  const robot = new Robot();
  robot.name = '电脑';
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
}

module.exports = matchRobotHandler;
