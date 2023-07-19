import Hashids from 'hashids';

class SecureRandom {
  static base58(digits = 8) {
    const base58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'.split('');

    let result = '';
    let char;

    while (result.length < digits) {
      char = base58[Math.random() * 57 >> 0];

      if (result.indexOf(char) === -1) result += char;
      if (result.indexOf('Qm') > -1) result = '';
    }

    return result;
  }

  // 将 id 加密成数字串
  static hashId(value) {
    const hashIds = new Hashids(`J6PR65qU-${new Date().getDay()}/${new Date().getHours()}`);
    return hashIds.encode(value);
  }
}

export default SecureRandom;
