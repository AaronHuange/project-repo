// 计算DOM元素的XPATH
export const getXPath = (element: any): string => {
  if (element.id !== '') {
    return `//*[@id="${element.id}"]`;
  }
  if (element === document.documentElement) {
    return `/${element.tagName}`;
  }
  let ix = 0;
  let {childNodes} = element.parentNode;
  for (let i = 0; i < childNodes.length; i++) {
    let sibling = childNodes[i];
    if (sibling === element) {
      let findCount = 0;
      for (let j = 0; j < childNodes.length; j++) {
        let findCountSibling = childNodes[j];
        if (findCountSibling.tagName === element.tagName) {
          findCount += 1;
        }
        if (findCount > 1) {
          return `${getXPath(element.parentNode)}/${element.tagName}[${ix + 1}]`;
        }
      }
      return `${getXPath(element.parentNode)}/${element.tagName}`;
    }
    if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
      ix++;
    }
  }
  return '';
};
