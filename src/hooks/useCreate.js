import React from 'react';

// 立即运行(比useLayoutEffect还快),且只运行一次
function useCreate(exeOnCreate, delay = 0) {
  const innerExecutedRef = React.useRef(false);
  if (innerExecutedRef.current) {
    return;
  }
  if (delay && delay > 0) {
    setTimeout(() => {
      exeOnCreate?.();
    }, delay);
  } else {
    exeOnCreate?.();
  }
  innerExecutedRef.current = true;
}

export default useCreate;
