const { RoomManager } = require('../../../entities/beans/Room');

function playerHandler(userId, msgObj, ws, req) {
  // 获取房间号
  const roomId = msgObj.roomId;
  const room = RoomManager.getRoomByRoomid(roomId);
  if (!room) {
    console.log('房间号不能为空', roomId);
    return;
  };
  room.play(userId, msgObj, ws, req);
}

module.exports = playerHandler;