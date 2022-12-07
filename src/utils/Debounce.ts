// 防抖
const timeMap = new Map<string, number>();
export const debounce = (tag: string = '_default', func: null | Function = null): boolean => {
  const currentTime = new Date().getTime();
  if (currentTime - (timeMap.get(tag) || 0) < 1000) {
    return false;
  }
  func?.();
  timeMap.set(tag, currentTime);
  return true;
};