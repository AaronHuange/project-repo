const WsMessageHandler = {
  sendByErrorMsg(ws, type, error) {
    const msg = { type, error };
    ws.send(JSON.stringify(msg));
  },
  sendData(ws, type, data) {
    const msg = { type, data };
    ws?.send(JSON.stringify(msg));
  }
};

module.exports = WsMessageHandler;