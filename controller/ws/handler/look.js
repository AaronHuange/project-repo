const WsMessageHandler = require('../WsMessageHandler');

function lookHandler(userId, msgObj, ws, req) {
  // 获取房间类型
  const roomType = msgObj.roomType;
  // 获取要观战的房间id
  const roomId = msgObj.roomId;
  // 获取从头观看还是实时观看
  const byStart = msgObj.byStart || false;

  let room;
  if (roomType === 'friend') { // 如果是房间赛

  } else { // 排名赛

  }
  if (!room) {
    WsMessageHandler.sendByErrorMsg(ws, 'look', '房间不存在')
    return;
  }
}

module.exports = lookHandler;
