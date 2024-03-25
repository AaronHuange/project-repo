function px2vw(pixel) {
  if (pixel) {
    // 下面的 375 是 config/index中，config.designWidth 的值
    return parseFloat(`${((pixel / 375) * 100).toFixed(3)}`);
  }
  return pixel;
}

export function px2vwString(pixel) {
  if (pixel) {
    return `${px2vw(pixel)}vw`;
  }
  return pixel;
}
