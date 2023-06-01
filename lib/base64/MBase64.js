/*** 插入连个字符到base64结果的1,3位置,防止可以直接解析base64字符串 ***/
const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
let position = 0;
const charLength = chars.length;

// 插入字符
function addChar(str) {
  position += 1;
  return chars[position % charLength] +
    str.substring(0, 1) +
    chars[(position + 1) % charLength] +
    str.substring(1);
}

// 移除插入的字符
function removeChar(str) {
  return str.substring(1, 2) + str.substring(3);
}

const Base64 = { // TODO 在生成与解析时加n个开头随机字符,防止Base64容易编解码造成的负载泄露
  encode(mStr) {
    // first we use encodeURIComponent to get percent-encoded UTF-8,
    // then we convert the percent encodings into raw bytes which
    // can be fed into btoa.
    const str = JSON.stringify(mStr);
    let base64Result = '';
    try {
      base64Result = btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
          return String.fromCharCode('0x' + p1);
        }));
    } catch (e){
      console.log('encode base64数据不正确:', mStr);
    }
    return addChar(base64Result);
  },
  decode(haveCharStr) {
    const str = removeChar(haveCharStr);
    // Going backwards: from bytestream, to percent-encoding, to original string.
    let mStr = "{}";
    try {
      mStr = decodeURIComponent(atob(str).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
    } catch (e) {
      console.log('decode base64数据不正确:', mStr);
    }
    return JSON.parse(mStr);
  }
};

// let encoded = Base64.encode("哈ha"); // "5ZOIaGE="
// let decoded = Base64.decode(encoded); // "哈ha"

module.exports = Base64;