const { writeFileSync, getCommandPath, existFile, getCurrentPath } = require(
  '../../lib/file/fileutil');
const WsMessageHandler = require('../../controller/ws/WsMessageHandler');
const { byAi } = require('pk-wzq-ai');
const fs = require('fs');

function generateUUID() {
  let d = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}

class Room {
  roomId = generateUUID(); // 房间的唯一id号
  firstUser = {
    userId: -2, isFirst: false, name: 'null', ws: null,
  };
  otherUser = {
    userId: -2, isFirst: false, name: 'null', ws: null,
  };
  status = '0'; // 房间状态: 0:初始状态,1: 等待先手操作,2: 等待后手操作,3: 结束
  messageList = [];
  type = ''; // 1: 匹配房，2：好友房间号房，3：比赛房
  board = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],];

  reset() {

  }

  // 下子 { "position": [5,3], "isFirst": true, "roomId": "63c643ef-4f37-47b5-af00-a418bf428c88","step": 1,"userId": 1, "type": "player" }
  play(userId, msgObj, ws, req) {
    // 获取角色信息
    const isFirst = msgObj.isFirst;
    const step = msgObj.step; // 第几步
    // 获取下的位置
    const [x, y] = msgObj.position;
    if (this.board[x][y] !== 0) {
      WsMessageHandler.sendByErrorMsg(ws, 'player', '该位置已经下过了');
      return;
    }
    this.board[x][y] = isFirst ? 1 : 2;
    this.status = isFirst ? '2' : '1';
    this.messageList.push(msgObj);
    if (isFirst) {
      /*** 如果另一个是机器人：不发生操作,等待1秒后发送ai的操作 ***/
      if (this.otherUser.userId === -1) {
        if (this.isWin(x, y)) return; // 玩家赢了,后面通知机器人的操作直接忽略。
        // 通过ai获取下一步走哪里
        const result = byAi(this.board);
        const [aiX, aiY] = [result[0], result[1]];
        this.board[aiX][aiY] = !isFirst ? 1 : 2;
        this.status = '1';
        this.messageList.push({
          position: [aiX, aiY], isFirst: !isFirst, roomId: this.roomId,
        });
        setTimeout(() => {
          // 延迟1.5秒后通知ai下的位置
          WsMessageHandler.sendData(this.firstUser.ws,
            'player',
            { position: [aiX, aiY], status: this.status, step: step + 1, roomId: this.roomId });
          if (this.isWin(aiX, aiY)) return;  // AI赢了,后面的操作直接忽略。
        }, 1500);
      } else {
        /*** 另一个不是机器人: 将该操作发出去 ***/
        WsMessageHandler.sendData(this.otherUser.ws,
          'player',
          { position: msgObj.position, status: this.status, step: step, roomId: this.roomId });
        if (this.isWin(x, y)) return;
      }
    } else {
      /*** 如果另一个是机器人 ***/
      if (this.firstUser.userId === -1) {
        if (this.isWin(x, y)) return;
        // 通过ai获取下一步走哪里
        const result = byAi(this.board);
        const [aiX, aiY] = [result[0], result[1]];
        this.board[aiX][aiY] = !isFirst ? 1 : 2;
        this.status = '2';
        this.messageList.push({
          position: [aiX, aiY], isFirst: !isFirst, roomId: this.roomId,
        });
        setTimeout(() => {
          // 延迟1.5秒后通知ai下的位置
          WsMessageHandler.sendData(this.otherUser.ws,
            'player',
            { position: [aiX, aiY], status: this.status, step: step + 1, roomId: this.roomId });
          if (this.isWin(aiX, aiY)) return;
        }, 1500);
      } else {
        /*** 另一个不是机器人 ***/
        WsMessageHandler.sendData(this.firstUser.ws,
          'player',
          { position: msgObj.position, status: this.status, step: step, roomId: this.roomId });
        if (this.isWin(x, y)) return;
      }
    }
  }

  // 是否能够赢可以由AI获取,这里判断真正的5个连在一起后的最后赢的那5个棋子
  isWin(x, y) {
    const isWin = this.onDirection(x, y, [[-1, 0], [1, 0]]) ||
      this.onDirection(x, y, [[0, -1], [0, 1]]) ||
      this.onDirection(x, y, [[-1, -1], [1, 1]]) ||
      this.onDirection(x, y, [[-1, 1], [1, -1]]) ||
      false;
    if (isWin) {
      RoomManager.endRoom(this.roomId);
    }
    return isWin;
  }

  /*** @param dir [[1, 1], [1,1]] */
  onDirection(x, y, dir) {
    const current = this.board[x][y];
    let fenshu = 0;
    const positions = [];
    positions.push([x, y]);
    fenshu += 1;
    const maxlength = this.board[0].length;

    // 1方向
    let oneOffset = dir[0];
    let oneOffsetXIndex = x;
    let oneOffsetYIndex = y;
    let oneEnd = false;
    // 2方向
    let towOffset = dir[1];
    let towOffsetXIndex = x;
    let towOffsetYIndex = y;
    let towEnd = false;
    while (fenshu < 5 && (!oneEnd || !towEnd)) { // 分数小于5则继续向两侧移动判断
      // 1方向移动判断
      oneOffsetXIndex += oneOffset[0];
      oneOffsetYIndex += oneOffset[1];
      console.log('oneOffsetYIndex', oneOffsetYIndex);
      console.log('oneOffset', oneOffset[0], oneOffset[1]);
      if ([-1, maxlength].includes(oneOffsetXIndex) || [-1, maxlength].includes(oneOffsetYIndex)) {
        oneEnd = true;
      }
      console.log('xxx', oneOffsetXIndex, oneOffsetYIndex);
      if (!oneEnd && this.board[oneOffsetXIndex][oneOffsetYIndex] === current) {
        positions.push([oneOffsetXIndex, oneOffsetYIndex]);
        fenshu += 1;
      } else {
        oneEnd = true;
      }

      // 2方向移动判断
      towOffsetXIndex += towOffset[0];
      towOffsetYIndex += towOffset[1];
      if ([-1, maxlength].includes(towOffsetXIndex) || [-1, maxlength].includes(towOffsetYIndex)) {
        towEnd = true;
      }
      if (!towEnd && this.board[towOffsetXIndex][towOffsetYIndex] === current) {
        positions.push([towOffsetXIndex, towOffsetYIndex]);
        fenshu += 1;
      } else {
        towEnd = true;
      }

      // 判断分数是否达标到5了
      if (fenshu >= 5) {
        WsMessageHandler.sendData(this.firstUser.ws,
          'haveWin',
          { positions: positions, isFirst: current === 1, roomId: this.roomId });
        WsMessageHandler.sendData(this.otherUser.ws,
          'haveWin',
          { positions: positions, isFirst: current === 1, roomId: this.roomId });
        return true;
      }
    }
    return false;
  }

  saveToFile() {
    try {
      const commandPath = getCommandPath();
      const dir = `${commandPath}/save`;
      console.log('dir', dir);
      if (!existFile(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const saveDir = `${dir}/${this.roomId}.json`;
      writeFileSync(saveDir, JSON.stringify({
        roomId: this.roomId,
        type: this.type,
        board: this.board,
        firstUserId: this.firstUser.userId,
        otherUserId: this.otherUser.userId,
        messageList: this.messageList,
      }));
    } catch (e) {
    }
  }
}

class RoomManager {
  static roomPool = {};

  // 获取一个全新的房间。
  static genNewRoom(firstUserInfo, otherUserInfo, type, roomId) {
    const room = new Room();
    if (roomId) {
      console.log('传入的房间Id不为空,替换自动生成的id');
      room.roomId = roomId;
    }
    room.firstUser = firstUserInfo;
    room.otherUser = otherUserInfo;
    room.status = '1';
    room.type = type;
    console.log('保存的房间Id为:', room.roomId);
    RoomManager.roomPool[room.roomId] = room; // 没存下来？？
    // TODO 保存对应用户状态在某个房间中：为了重连需求

    // 如果是ai先手，则通知第一个下的位置
    if (room.firstUser.userId === -1) { // ai先手
      room.board[7][7] = 1;
      // 通过ai获取下一步走哪里
      room.status = '2';
      room.messageList.push({
        position: [7, 7], isFirst: true, roomId: room.roomId,
      });
      setTimeout(() => { // 不延迟会导致先发送这个消息,后发送匹配成功消息
        WsMessageHandler.sendData(room.otherUser.ws,
          'player',
          { position: [7, 7], status: room.status, step: 1, roomId: room.roomId });
      }, 3000);
    }
    return room;
  }

  static getRoomByRoomid(roomId) {
    return RoomManager.roomPool[roomId];
  }

  // 结束房间
  static endRoom(roomId) {
    const room = RoomManager.getRoomByRoomid(roomId);
    delete (RoomManager.roomPool[roomId]);
    if (!room) return;
    room.saveToFile();
  }

  // 重连房间
  static reConnRoom(roomId) {
    // TODO 暂未实现
  }
}

module.exports = {
  Room, RoomManager,
};