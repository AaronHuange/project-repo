const JwtManager = require('../../../lib/jwt/JwtManager');
const WsMessageHandler = require('../WsMessageHandler');
const { RoomManager } = require('../../../entities/beans/Room');

const matchPool = {}; // <房间号#房间密码, 房间>

// {token,roomNum,roomPassword,isFirst,userName,userId}
function createFriendRoomHandler(_userId, msgObj, ws, req) {
  // jwt校验
  const jwt = msgObj.token;
  if (!jwt || !JwtManager.validateJwt(jwt)) {
    WsMessageHandler.sendByErrorMsg(ws, 'createFriendRoom', '登录失效');
    return;
  }
  const jwtData = JwtManager.getData(jwt);
  const userId = jwtData.id || _userId;
  const {
    roomNum, roomPassword = '', isFirst = false, userName = '',
  } = msgObj;

  if (!roomNum) {
    WsMessageHandler.sendByErrorMsg(ws, 'createFriendRoom', '房间号不能为空');
    return;
  }

  if (RoomManager.getRoomByRoomid(`${roomNum}#${roomPassword}`) || matchPool[`${roomNum}#${roomPassword}`]) {
    console.log('房间已存在');
    WsMessageHandler.sendByErrorMsg(ws, 'createFriendRoom', '房间已存在');
    return;
  }

  console.log('创建房间模式');

  matchPool[`${roomNum}#${roomPassword}`] = {
    ws, isFirst, userName, userId,
  };
}

// {token,roomNum,roomPassword,userName,userId}
function enterFriendRoomHandler(_userId, msgObj, ws, req) {
  // jwt校验
  const jwt = msgObj.token;
  if (!jwt || !JwtManager.validateJwt(jwt)) {
    WsMessageHandler.sendByErrorMsg(ws, 'enterFriendRoom', '登录失效');
    return;
  }

  const jwtData = JwtManager.getData(jwt);
  const userId = jwtData.id || _userId;

  const {
    roomNum,
    roomPassword = '',
    userName = ''
  } = msgObj;

  if (!matchPool[`${roomNum}#${roomPassword}`]) {
    WsMessageHandler.sendByErrorMsg(ws, 'enterFriendRoom', '房间不存在或密码错误');
    return;
  }

  let roomUserInfo = matchPool[`${roomNum}#${roomPassword}`];
  delete (matchPool[`${roomNum}#${roomPassword}`]);
  let otherUserInfo;
  roomUserInfo = {
    userId: roomUserInfo.userId,
    isFirst: roomUserInfo.isFirst,
    name: roomUserInfo.name,
    ws: roomUserInfo.ws
  };
  otherUserInfo = {
    userId, isFirst: !roomUserInfo.isFirst, name: userName, ws: ws
  };
  const newRoom = RoomManager.genNewRoom(
    roomUserInfo,
    otherUserInfo,
    '2', // 类型2: 好友房
    `${roomNum}#${roomPassword}`
  );
  WsMessageHandler.sendData(
    roomUserInfo.ws,
    'match',
    {
      name: userName,
      userId,
      isFirst: !roomUserInfo.isFirst,
      roomId: newRoom.roomId
    }
  );
  WsMessageHandler.sendData(
    ws,
    'match', {
      name: roomUserInfo.name,
      userId: roomUserInfo.userId,
      isFirst: roomUserInfo.isFirst,
      roomId: newRoom.roomId,
    });
}

module.exports = {
  createFriendRoomHandler,
  enterFriendRoomHandler
};
