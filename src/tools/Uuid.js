// 随机生成36进制唯一ID
function genUid() {
  return Math.random().toString(36).slice(2);
}

export default genUid;
