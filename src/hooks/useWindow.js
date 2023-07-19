function useWindow() {
  const perName = 'PKYYW';
  const windowSave = (key, value) => {
    if (!window[perName]) {
      window[perName] = {};
    }
    window[perName][key] = value;
  };
  const windowGet = (key) => {
    if (!window[perName]) {
      window[perName] = {};
    }
    return window[perName][key];
  };
  const removeByKey = (key) => {
    if (!window[perName]) {
      window[perName] = {};
    }
    window[perName][key] = undefined;
  };
  const cleanAll = () => {
    window[perName] = {};
  };
  return {
    windowSave, windowGet, removeByKey, cleanAll,
  };
}

export default useWindow;
