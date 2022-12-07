// 模拟浏览器点击事件的冒泡机制,来判断点击事件是否是有效点击
export default function bubbleDispatch(e: any): Object | null {
  if (e === document.body) return null;
  if ([undefined, null].includes(e)) return null;

  if (isClickEnableElement(e)) {
    return e;
  }
  return bubbleDispatch(e.parentNode);
}

const isClickEnableElement = (e: any) => {
  if (e.onclick) {
    return e;
  }
  if (e.tagName === 'A') {
    return e;
  }
  if (e.tagName === 'INPUT' && e.type === 'radio') {
    return e;
  }

  if (e.tagName === 'INPUT' && e.type === 'check') {
    return e;
  }

  return null;
}
