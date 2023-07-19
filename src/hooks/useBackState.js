import React from 'react';

const useBackStoreKey = 'useBackStore_Key_3131';
const useBackStoreTypeKey = 'useBackStore_TYPE_Key_3131';
function useBackState() {
  // 由于值会及时清掉，使用Ref换成取到的值。
  const backValueRef = React.useRef('');

  // 防止值混淆，每次Create的时候将值取出来并清掉。
  if (backValueRef.current === '') {
    backValueRef.current = localStorage.getItem(useBackStoreKey) || null;
    const type = localStorage.getItem(useBackStoreTypeKey) || 'string';
    console.log('useBackStore type::', type);
    if (backValueRef.current && type === 'number') {
      backValueRef.current = Number.parseFloat(backValueRef.current);
    }
    localStorage.setItem(useBackStoreKey, '');
    localStorage.setItem(useBackStoreTypeKey, '');
  }

  // 设置需要路由从其他页面返回时，backValueRef的值。
  const setBackValue = (backValue) => {
    localStorage.setItem(useBackStoreKey, backValue);
    localStorage.setItem(useBackStoreTypeKey, typeof backValue);
  };
  // 一般情况下两个都需要使用，单独使用一个没有意义。所以使用数组返回。
  return [backValueRef.current, setBackValue];
}
export default useBackState;
