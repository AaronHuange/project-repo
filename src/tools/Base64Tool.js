class Base64Tool {
  /** 64编码 * */
  static to64(str) {
    return btoa(encodeURIComponent(str));
  }

  /** 64解码 * */
  static toString(str) {
    return decodeURIComponent(atob(str));
  }
}

export default Base64Tool;
