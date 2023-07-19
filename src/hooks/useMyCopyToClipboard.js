import { useState, useEffect } from 'react';
import { useCopyToClipboard } from 'react-use';

function useMyCopyToClipboard({ timeout = 1000 } = {}) {
  const [copied, setCopied] = useState(false);
  const [clipboard, copyToClipboardFn] = useCopyToClipboard();
  //
  let timer = null;
  const copyToClipboard = (text) => {
    copyToClipboardFn(text);
    setCopied(true);
    timer = setTimeout(() => {
      setCopied(false);
      clearTimeout(timer);
    }, timeout);
  };
  // willUnMount
  useEffect(() => () => {
    clearTimeout(timer);
  }, []);
  //
  return [{
    ...clipboard,
    copied,
  }, copyToClipboard];
}

export default useMyCopyToClipboard;
