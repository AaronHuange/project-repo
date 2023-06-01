const MBase64 = require('../base64/MBase64');
const MHash = require('../hash/MHash');

const myscreat = 'wuziqi_de_miyao';
const jwtManager = {
  getJwt(data = {}, expiredTime = -1) { // expiredTime: -1 有效期100年
    const payHead = { __time: expiredTime === -1 ? new Date().getTime() + (100 * 3153600000000)  : new Date().getTime() + expiredTime };
    const payHeadBase64 = MBase64.encode(payHead);

    const dataBase64 = MBase64.encode(data);

    const tempStr = payHeadBase64 + dataBase64 + myscreat;
    const validate = MHash(tempStr);

    return `${payHeadBase64}.${dataBase64}.${validate}`;
  },
  validateJwt(jwt) {
    if (!jwt) {
      return false;
    }

    const jwtArray = jwt.split('.');
    if (jwtArray.length < 3) {
      return false;
    }

    const payHeadBase64 = jwtArray[0];
    const dataBase64 = jwtArray[1];
    const validate = jwtArray[2];

    // 过期？
    const headData = MBase64.decode(payHeadBase64);
    if (!headData?.__time || headData?.__time < new Date().getTime()) { // 不设置__time代表不过期
      return false;
    }

    return validate === MHash(payHeadBase64 + dataBase64 + myscreat);
  },
  getData(jwt) {
    const jwtArray = jwt.split('.');
    return MBase64.decode(jwtArray[1])
  },
  getTime(jwt) {
    const jwtArray = jwt.split('.');
    return MBase64.decode(jwtArray[0])
  }
};

module.exports = jwtManager;
